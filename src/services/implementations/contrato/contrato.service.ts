
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Contrato } from 'src/entities/Contrato';
import { Trabajador } from 'src/entities/Trabajador';
import { HistorialContrato } from 'src/entities/HistorialContrato';
import { BaseResponseDto } from 'src/dtos/baseResponse/baseResponse.dto';
import { EstadoContrato } from '../../../Enums/EstadoContrato';
import { TipoAccionHistorial } from '../../../Enums/TipoAccionHistorial';


@Injectable()
export class ContratoService {
    constructor(
        @InjectRepository(Contrato)
        private contratoRepository: Repository<Contrato>,
        @InjectRepository(Trabajador)
        private trabajadorRepository: Repository<Trabajador>,
        @InjectRepository(HistorialContrato)
        private historialContratoRepository: Repository<HistorialContrato>,
        private dataSource: DataSource,
    ) { }

    async obtenerContratoActivo(idTrabajador: string): Promise<Contrato | null> {
        // CORREGIDO: Buscar contrato con estado ACTIVO (más confiable que fechas)
        const contrato = await this.contratoRepository
            .createQueryBuilder('contrato')
            .leftJoinAndSelect('contrato.idTipoContrato', 'tipoContrato')
            .leftJoinAndSelect('contrato.idTrabajador', 'trabajador')
            .where('trabajador.idTrabajador = :idTrabajador', { idTrabajador })
            .andWhere('contrato.estado = :estado', { estado: EstadoContrato.ACTIVO })
            .orderBy('contrato.fechaInicio', 'DESC') // El más reciente primero
            .getOne();

        return contrato;
    }

    /**
     * 2. DETERMINAR ESTADO LÓGICO DE UN CONTRATO
     */
    determinarEstadoContrato(contrato: Contrato): EstadoContrato {
        const fechaActual = new Date();
        const fechaInicio = new Date(contrato.fechaInicio);
        const fechaFin = new Date(contrato.fechaFin);

        if (fechaActual >= fechaInicio && fechaActual <= fechaFin) {
            return EstadoContrato.ACTIVO;
        } else if (fechaActual > fechaFin) {
            return contrato.estadoRenovacion
                ? EstadoContrato.RENOVADO
                : EstadoContrato.VENCIDO;
        } else {
            return EstadoContrato.VENCIDO;
        }
    }

    /**
     * 3. SINCRONIZAR SALARIO ACTUAL DEL TRABAJADOR
     * Basado en su contrato activo
     */
    async sincronizarSalarioTrabajador(idTrabajador: string): Promise<BaseResponseDto<any>> {
        try {
            const contratoActivo = await this.obtenerContratoActivo(idTrabajador);

            const nuevoSalario = contratoActivo ? contratoActivo.remuneracion.toString() : null;

            await this.trabajadorRepository.update(idTrabajador, {
                salarioActual: nuevoSalario
            });

            return {
                success: true,
                message: 'Salario sincronizado correctamente',
                data: {
                    idTrabajador,
                    salarioAnterior: null, // Podríamos obtenerlo si es necesario
                    salarioNuevo: nuevoSalario,
                    contratoActivo: contratoActivo?.idContrato || null
                }
            };
        } catch (error) {
            return {
                success: false,
                message: `Error al sincronizar salario: ${error.message}`,
                data: null
            };
        }
    }

    /**
     * 4. CREAR NUEVO CONTRATO CON LÓGICA MEJORADA
     */
    async crearNuevoContrato(datosContrato: {
        idTrabajador: string;
        idTipoContrato: string;
        fechaInicio: string;
        fechaFin: string;
        documentourl: string;
    }): Promise<BaseResponseDto<Contrato>> {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // 1. Buscar trabajador usando query builder para evitar problemas de mapeo
            const trabajadorRaw = await queryRunner.manager
                .createQueryBuilder(Trabajador, 'trabajador')
                .where('trabajador.idTrabajador = :idTrabajador', { idTrabajador: datosContrato.idTrabajador })
                .getOne();

            if (!trabajadorRaw) {
                await queryRunner.rollbackTransaction();
                return {
                    success: false,
                    message: 'Trabajador no encontrado',
                    data: null
                };
            }

            // También hacer consulta raw para comparar
            const trabajadorRawSQL = await queryRunner.manager.query(
                'SELECT id_trabajador, nombre, apellido, salario_actual FROM trabajador WHERE id_trabajador = $1',
                [datosContrato.idTrabajador]
            );

            // DEBUG: Log para comparar ambas consultas
            console.log('DEBUG - Comparación de consultas:', {
                queryBuilder: {
                    id: trabajadorRaw.idTrabajador,
                    nombre: trabajadorRaw.nombre,
                    salarioActual: trabajadorRaw.salarioActual,
                    tipoSalario: typeof trabajadorRaw.salarioActual,
                },
                rawSQL: trabajadorRawSQL[0] || 'No encontrado',
                salarioDesdeSQL: trabajadorRawSQL[0]?.salario_actual,
                tipoSalarioSQL: typeof trabajadorRawSQL[0]?.salario_actual
            });

            // Usar el trabajador obtenido
            const trabajador = trabajadorRaw;

            // 2. Obtener salario desde ambas fuentes (TypeORM y SQL raw)
            let salarioParaContrato = trabajador.salarioActual;

            // Si TypeORM devuelve null, usar el resultado de SQL raw
            if (!salarioParaContrato && trabajadorRawSQL[0]?.salario_actual) {
                salarioParaContrato = trabajadorRawSQL[0].salario_actual;
                console.log('DEBUG - Usando salario de SQL raw porque TypeORM devolvió null');
            }

            // 3. Validar que el trabajador tiene salario actual definido
            if (!salarioParaContrato || salarioParaContrato === '0' || salarioParaContrato === '') {
                await queryRunner.rollbackTransaction();
                return {
                    success: false,
                    message: `El trabajador debe tener un salario actual definido para crear un contrato. Valor actual: ${salarioParaContrato}`,
                    data: null
                };
            }

            // 4. Convertir salario a número y validar que sea válido
            const remuneracionContrato = parseFloat(salarioParaContrato);
            if (isNaN(remuneracionContrato) || remuneracionContrato <= 0) {
                await queryRunner.rollbackTransaction();
                return {
                    success: false,
                    message: 'El salario actual del trabajador debe ser un número válido mayor a 0',
                    data: null
                };
            }

            // 4. Verificar si existe contrato activo
            const contratoActivo = await this.obtenerContratoActivo(datosContrato.idTrabajador);

            // 5. Si existe contrato activo, terminarlo y registrarlo en historial
            if (contratoActivo) {
                // Registrar el contrato actual en el historial como TERMINACION
                const historialAnterior = queryRunner.manager.create(HistorialContrato, {
                    idContrato: contratoActivo,
                    tipoAccion: TipoAccionHistorial.TERMINACION,
                    descripcionAccion: 'Contrato terminado por creación de nuevo contrato',
                    estadoAnterior: {
                        remuneracion: contratoActivo.remuneracion,
                        fechaInicio: contratoActivo.fechaInicio,
                        fechaFin: contratoActivo.fechaFin,
                        estado: 'ACTIVO'
                    },
                    estadoNuevo: {
                        estado: 'RENOVADO',
                        motivoTerminacion: 'NUEVO_CONTRATO',
                        fechaTerminacion: new Date().toISOString().split('T')[0]
                    },
                    fechaRegistro: new Date(),
                    observaciones: `Contrato terminado automáticamente por nuevo contrato. Nueva remuneración: ${remuneracionContrato}`
                });

                await queryRunner.manager.save(HistorialContrato, historialAnterior);

                // CORREGIDO: Cambiar el estado del contrato anterior
                await queryRunner.manager.update(Contrato, contratoActivo.idContrato, {
                    estado: EstadoContrato.RENOVADO, // Usar el enum correctamente
                    estadoRenovacion: true,
                    fechaRenovacion: new Date().toISOString().split('T')[0],
                    motivoTerminacion: 'Reemplazado por nuevo contrato',
                    fechaActualizacion: new Date().toISOString().split('T')[0]
                });

                console.log(`DEBUG - Contrato anterior ${contratoActivo.idContrato} cambiado a estado RENOVADO`);
            }

            // 6. Crear nuevo contrato usando el salario actual del trabajador
            const nuevoContrato = queryRunner.manager.create(Contrato, {
                documentourl: datosContrato.documentourl,
                remuneracion: remuneracionContrato, // Usar salario del trabajador
                fechaInicio: datosContrato.fechaInicio,
                fechaFin: datosContrato.fechaFin,
                fechaRenovacion: null, // Nuevo contrato no está renovado aún
                estadoRenovacion: false,
                estado: EstadoContrato.ACTIVO, // EXPLÍCITAMENTE activo
                fechaCreacion: new Date().toISOString().split('T')[0],
                fechaActualizacion: new Date().toISOString().split('T')[0],
                idTrabajador: trabajador,
                idTipoContrato: { idTipoContrato: datosContrato.idTipoContrato } as any
            });

            const contratoCreado = await queryRunner.manager.save(Contrato, nuevoContrato);
            console.log(`DEBUG - Nuevo contrato ${contratoCreado.idContrato} creado con estado ACTIVO`);

            // 7. Registrar la creación en el historial
            const historialCreacion = queryRunner.manager.create(HistorialContrato, {
                idContrato: contratoCreado,
                tipoAccion: TipoAccionHistorial.CREACION,
                descripcionAccion: 'Nuevo contrato creado basado en salario actual del trabajador',
                estadoAnterior: contratoActivo ? {
                    contratoAnterior: contratoActivo.idContrato,
                    remuneracionAnterior: contratoActivo.remuneracion
                } : { mensaje: 'Primer contrato del trabajador' },
                estadoNuevo: {
                    remuneracion: remuneracionContrato,
                    fechaInicio: datosContrato.fechaInicio,
                    fechaFin: datosContrato.fechaFin,
                    estado: 'ACTIVO',
                    origenSalario: 'TRABAJADOR_SALARY'
                },
                fechaRegistro: new Date(),
                observaciones: `Contrato creado usando salario actual del trabajador: ${remuneracionContrato}. ${contratoActivo ? 'Reemplaza contrato anterior' : 'Primer contrato'}`
            });

            await queryRunner.manager.save(HistorialContrato, historialCreacion);

            // 8. El salario ya está sincronizado porque se toma del trabajador
            // Solo registrar en historial si hay diferencia (por ejemplo, si había un contrato anterior con diferente remuneración)
            if (contratoActivo && contratoActivo.remuneracion !== remuneracionContrato) {
                const historialSalario = queryRunner.manager.create(HistorialContrato, {
                    idContrato: contratoCreado,
                    tipoAccion: TipoAccionHistorial.CAMBIO_SALARIO,
                    descripcionAccion: 'Cambio de remuneración respecto al contrato anterior',
                    estadoAnterior: {
                        salarioAnterior: contratoActivo.remuneracion.toString()
                    },
                    estadoNuevo: {
                        salarioNuevo: remuneracionContrato.toString()
                    },
                    fechaRegistro: new Date(),
                    observaciones: `Cambio de remuneración: ${contratoActivo.remuneracion} → ${remuneracionContrato}`
                });

                await queryRunner.manager.save(HistorialContrato, historialSalario);
            }

            // Confirmar transacción
            await queryRunner.commitTransaction();

            // 9. Obtener el contrato completo con relaciones para la respuesta
            const contratoCompleto = await this.contratoRepository.findOne({
                where: { idContrato: contratoCreado.idContrato },
                relations: ['idTrabajador', 'idTipoContrato']
            });

            return {
                success: true,
                message: contratoActivo
                    ? `Nuevo contrato creado exitosamente con remuneración ${remuneracionContrato}. Contrato anterior movido al historial.`
                    : `Primer contrato del trabajador creado exitosamente con remuneración ${remuneracionContrato}.`,
                data: contratoCompleto
            };

        } catch (error) {
            // Revertir transacción en caso de error
            await queryRunner.rollbackTransaction();
            return {
                success: false,
                message: `Error al crear contrato: ${error.message}`,
                data: null
            };
        } finally {
            // Liberar conexión
            await queryRunner.release();
        }
    }

    /**
     * 5. RENOVAR CONTRATO EXISTENTE
     */
    async renovarContrato(
        idContrato: string,
        nuevaFechaFin: string,
        nuevaRemuneracion?: number
    ): Promise<BaseResponseDto<Contrato>> {
        try {
            const datosActualizacion: any = {
                fechaFin: nuevaFechaFin,
                fechaRenovacion: new Date().toISOString().split('T')[0],
                estadoRenovacion: true
            };

            if (nuevaRemuneracion) {
                datosActualizacion.remuneracion = nuevaRemuneracion;
            }

            await this.contratoRepository.update(idContrato, datosActualizacion);

            const contratoActualizado = await this.contratoRepository.findOne({
                where: { idContrato },
                relations: ['idTrabajador', 'idTipoContrato']
            });

            if (!contratoActualizado) {
                return {
                    success: false,
                    message: 'Contrato no encontrado',
                    data: null
                };
            }

            // Sincronizar salario si cambió la remuneración
            if (nuevaRemuneracion) {
                await this.sincronizarSalarioTrabajador(
                    contratoActualizado.idTrabajador.idTrabajador
                );
            }

            return {
                success: true,
                message: 'Contrato renovado exitosamente',
                data: contratoActualizado
            };
        } catch (error) {
            return {
                success: false,
                message: `Error al renovar contrato: ${error.message}`,
                data: null
            };
        }
    }

    /**
     * 6. OBTENER TODOS LOS CONTRATOS DE UN TRABAJADOR CON SU ESTADO
     */
    async obtenerHistorialContratos(idTrabajador: string) {
        const contratos = await this.contratoRepository
            .createQueryBuilder('contrato')
            .leftJoinAndSelect('contrato.idTipoContrato', 'tipoContrato')
            .leftJoinAndSelect('contrato.idTrabajador', 'trabajador')
            .where('trabajador.idTrabajador = :idTrabajador', { idTrabajador })
            .orderBy('contrato.fechaInicio', 'DESC')
            .getMany();

        return contratos.map(contrato => ({
            ...contrato,
            estadoLogico: this.determinarEstadoContrato(contrato),
            esActivo: this.determinarEstadoContrato(contrato) === EstadoContrato.ACTIVO
        }));
    }

    /**
     * 7. VALIDAR CONSISTENCIA ENTRE CONTRATO Y SALARIO
     */
    async validarConsistenciaSalarial(idTrabajador: string): Promise<{
        esConsistente: boolean;
        detalles: any;
    }> {
        const trabajador = await this.trabajadorRepository.findOne({
            where: { idTrabajador }
        });

        const contratoActivo = await this.obtenerContratoActivo(idTrabajador);

        if (!trabajador) {
            return {
                esConsistente: false,
                detalles: { error: 'Trabajador no encontrado' }
            };
        }

        const detalles = {
            trabajadorId: idTrabajador,
            salarioEnTrabajador: trabajador.salarioActual,
            contratoActivo: contratoActivo ? {
                id: contratoActivo.idContrato,
                remuneracion: contratoActivo.remuneracion,
                fechaInicio: contratoActivo.fechaInicio,
                fechaFin: contratoActivo.fechaFin
            } : null
        };

        // Si no hay contrato activo, salario debe ser null
        if (!contratoActivo) {
            return {
                esConsistente: trabajador.salarioActual === null,
                detalles: {
                    ...detalles,
                    razon: 'Sin contrato activo, salario debe ser null'
                }
            };
        }

        // Comparar salarios
        const salarioTrabajador = parseFloat(trabajador.salarioActual || '0');
        const salarioContrato = contratoActivo.remuneracion;

        return {
            esConsistente: Math.abs(salarioTrabajador - salarioContrato) < 0.01, // Tolerancia para decimales
            detalles: {
                ...detalles,
                diferencia: Math.abs(salarioTrabajador - salarioContrato),
                razon: salarioTrabajador === salarioContrato ? 'Salarios coinciden' : 'Diferencia encontrada'
            }
        };
    }

    /**
     * 8. SINCRONIZAR TODOS LOS SALARIOS (PROCESO MASIVO)
     */
    async sincronizarTodosLosSalarios(): Promise<BaseResponseDto<any>> {
        try {
            const trabajadores = await this.trabajadorRepository.find();
            let actualizados = 0;
            let errores = 0;
            const detalles: any[] = [];

            for (const trabajador of trabajadores) {
                try {
                    const resultado = await this.sincronizarSalarioTrabajador(trabajador.idTrabajador);
                    if (resultado.success) {
                        actualizados++;
                        detalles.push({
                            trabajador: `${trabajador.nombre} ${trabajador.apellido}`,
                            id: trabajador.idTrabajador,
                            estado: 'actualizado',
                            nuevoSalario: resultado.data?.salarioNuevo
                        });
                    } else {
                        errores++;
                        detalles.push({
                            trabajador: `${trabajador.nombre} ${trabajador.apellido}`,
                            id: trabajador.idTrabajador,
                            estado: 'error',
                            razon: resultado.message
                        });
                    }
                } catch (error) {
                    errores++;
                    detalles.push({
                        trabajador: `${trabajador.nombre} ${trabajador.apellido}`,
                        id: trabajador.idTrabajador,
                        estado: 'error',
                        razon: error.message
                    });
                }
            }

            return {
                success: true,
                message: `Proceso completado: ${actualizados} actualizados, ${errores} errores`,
                data: {
                    totalProcesados: trabajadores.length,
                    actualizados,
                    errores,
                    detalles
                }
            };
        } catch (error) {
            return {
                success: false,
                message: `Error en proceso masivo: ${error.message}`,
                data: null
            };
        }
    }

    /**
     * DEBUG: MÉTODO TEMPORAL PARA VERIFICAR CONSULTA DE TRABAJADOR
     */
    async debugTrabajador(idTrabajador: string): Promise<any> {
        try {
            console.log('DEBUG - Buscando trabajador con ID:', idTrabajador);

            // Consulta directa con el repositorio normal
            const trabajadorRepo = await this.trabajadorRepository.findOne({
                where: { idTrabajador }
            });

            // Consulta con query builder para ver datos brutos
            const trabajadorRaw = await this.trabajadorRepository
                .createQueryBuilder('trabajador')
                .select('trabajador.id_trabajador', 'idTrabajador')
                .addSelect('trabajador.nombre', 'nombre')
                .addSelect('trabajador.apellido', 'apellido')
                .addSelect('trabajador.salario_actual', 'salarioActual')
                .where('trabajador.id_trabajador = :idTrabajador', { idTrabajador })
                .getRawOne();

            return {
                success: true,
                data: {
                    consultaRepository: trabajadorRepo,
                    consultaRaw: trabajadorRaw,
                    salarioRepo: trabajadorRepo?.salarioActual,
                    salarioRaw: trabajadorRaw?.salarioActual,
                    tipoDatoRepo: typeof trabajadorRepo?.salarioActual,
                    tipoDatoRaw: typeof trabajadorRaw?.salarioActual
                }
            };
        } catch (error) {
            return {
                success: false,
                message: error.message,
                data: null
            };
        }
    }

    /**
     * 9. OBTENER ESTADÍSTICAS DE CONTRATOS Y SALARIOS
     */
    async obtenerEstadisticas() {
        const totalContratos = await this.contratoRepository.count();
        const contratos = await this.contratoRepository.find();

        const estadisticas = {
            totalContratos,
            porEstado: {
                activos: 0,
                vencidos: 0,
                renovados: 0
            },
            rangosRemuneracion: {
                minima: 0,
                maxima: 0,
                promedio: 0
            }
        };

        // Calcular estadísticas por estado
        contratos.forEach(contrato => {
            const estado = this.determinarEstadoContrato(contrato);
            switch (estado) {
                case EstadoContrato.ACTIVO:
                    estadisticas.porEstado.activos++;
                    break;
                case EstadoContrato.VENCIDO:
                    estadisticas.porEstado.vencidos++;
                    break;
                case EstadoContrato.RENOVADO:
                    estadisticas.porEstado.renovados++;
                    break;
            }
        });

        // Calcular rangos de remuneración
        if (contratos.length > 0) {
            const remuneraciones = contratos.map(c => c.remuneracion);
            estadisticas.rangosRemuneracion.minima = Math.min(...remuneraciones);
            estadisticas.rangosRemuneracion.maxima = Math.max(...remuneraciones);
            estadisticas.rangosRemuneracion.promedio =
                remuneraciones.reduce((a, b) => a + b, 0) / remuneraciones.length;
        }

        return estadisticas;
    }

    /**
     * DEBUG: Verificar estados de contratos de un trabajador
     */
    async verificarEstadosContratos(idTrabajador: string) {
        try {
            // Obtener todos los contratos del trabajador
            const contratos = await this.contratoRepository
                .createQueryBuilder('contrato')
                .leftJoinAndSelect('contrato.idTipoContrato', 'tipoContrato')
                .where('contrato.id_trabajador = :idTrabajador', { idTrabajador })
                .orderBy('contrato.fechaCreacion', 'DESC')
                .getMany();

            // Contar por estado
            const porEstado = contratos.reduce((acc, contrato) => {
                const estado = contrato.estado || 'SIN_ESTADO';
                acc[estado] = (acc[estado] || 0) + 1;
                return acc;
            }, {});

            // Verificar si hay múltiples ACTIVOS
            const contratosActivos = contratos.filter(c => c.estado === EstadoContrato.ACTIVO);

            return {
                totalContratos: contratos.length,
                porEstado,
                contratosActivos: contratosActivos.length,
                problemasDetectados: {
                    multipleActivos: contratosActivos.length > 1,
                    contratosSinEstado: contratos.filter(c => !c.estado).length
                },
                detalleContratos: contratos.map(c => ({
                    id: c.idContrato,
                    estado: c.estado,
                    fechaInicio: c.fechaInicio,
                    fechaFin: c.fechaFin,
                    remuneracion: c.remuneracion,
                    estadoRenovacion: c.estadoRenovacion
                }))
            };
        } catch (error) {
            throw new Error(`Error verificando estados: ${error.message}`);
        }
    }
}

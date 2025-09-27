
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contrato } from 'src/entities/Contrato';
import { Trabajador } from 'src/entities/Trabajador';
import { BaseResponseDto } from 'src/dtos/baseResponse/baseResponse.dto';
import { EstadoContrato } from '../../../Enums/EstadoContrato';


@Injectable()
export class ContratoService {
    constructor(
        @InjectRepository(Contrato)
        private contratoRepository: Repository<Contrato>,
        @InjectRepository(Trabajador)
        private trabajadorRepository: Repository<Trabajador>,
    ) { }

    async obtenerContratoActivo(idTrabajador: string): Promise<Contrato | null> {
        const fechaActual = new Date().toISOString().split('T')[0];

        // Buscar contrato donde la fecha actual esté dentro del rango
        const contrato = await this.contratoRepository
            .createQueryBuilder('contrato')
            .leftJoinAndSelect('contrato.idTipoContrato', 'tipoContrato')
            .leftJoinAndSelect('contrato.idTrabajador', 'trabajador')
            .where('trabajador.idTrabajador = :idTrabajador', { idTrabajador })
            .andWhere('contrato.fechaInicio <= :fechaActual', { fechaActual })
            .andWhere('contrato.fechaFin >= :fechaActual', { fechaActual })
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
        remuneracion: number;
        fechaInicio: string;
        fechaFin: string;
        documentourl: string;
    }): Promise<BaseResponseDto<Contrato>> {
        try {
            // 1. Verificar si existe contrato activo y finalizarlo lógicamente
            const contratoActivo = await this.obtenerContratoActivo(datosContrato.idTrabajador);

            if (contratoActivo) {
                // Marcar como renovado si se solapa con fechas
                await this.contratoRepository.update(contratoActivo.idContrato, {
                    estadoRenovacion: true,
                    fechaRenovacion: new Date().toISOString().split('T')[0]
                });
            }

            // 2. Buscar trabajador y tipo de contrato
            const trabajador = await this.trabajadorRepository.findOne({
                where: { idTrabajador: datosContrato.idTrabajador }
            });

            if (!trabajador) {
                return {
                    success: false,
                    message: 'Trabajador no encontrado',
                    data: null
                };
            }

            // 3. Crear nuevo contrato
            const nuevoContrato = this.contratoRepository.create({
                documentourl: datosContrato.documentourl,
                remuneracion: datosContrato.remuneracion,
                fechaInicio: datosContrato.fechaInicio,
                fechaFin: datosContrato.fechaFin,
                fechaRenovacion: new Date().toISOString().split('T')[0],
                estadoRenovacion: false,
                idTrabajador: trabajador,
                idTipoContrato: { idTipoContrato: datosContrato.idTipoContrato } as any
            });

            const contratoCreado = await this.contratoRepository.save(nuevoContrato);

            // 4. Sincronizar salario del trabajador
            await this.sincronizarSalarioTrabajador(datosContrato.idTrabajador);

            return {
                success: true,
                message: 'Contrato creado exitosamente',
                data: contratoCreado
            };
        } catch (error) {
            return {
                success: false,
                message: `Error al crear contrato: ${error.message}`,
                data: null
            };
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
}

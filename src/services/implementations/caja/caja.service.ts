import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Caja } from 'src/entities/Caja';
import { MovimientoCaja } from 'src/entities/MovimientoCaja';
import { Trabajador } from 'src/entities/Trabajador';
import { CreateCajaDto, UpdateCajaDto, CajaResponseDto, AperturaCajaDto, CierreCajaDto } from 'src/dtos/caja';
import { BaseResponseDto } from 'src/dtos/baseResponse/baseResponse.dto';
import { ICajaService } from 'src/services/interfaces';

const LIMITE_DIFERENCIA_CAJA = 10.00; // Límite de diferencia aceptable en soles

@Injectable()
export class CajaService implements ICajaService {
    constructor(
        @InjectRepository(Caja)
        private readonly cajaRepository: Repository<Caja>,
        @InjectRepository(MovimientoCaja)
        private readonly movimientoCajaRepository: Repository<MovimientoCaja>,
        @InjectRepository(Trabajador)
        private readonly trabajadorRepository: Repository<Trabajador>,
    ) { }

    async create(createCajaDto: CreateCajaDto): Promise<BaseResponseDto<CajaResponseDto>> {
        if (!createCajaDto) {
            return BaseResponseDto.error('Ingrese datos válidos, Intente de Nuevo.', HttpStatus.BAD_REQUEST);
        }

        try {
            // Validar que el trabajador existe
            const trabajador = await this.trabajadorRepository.findOne({
                where: { idTrabajador: createCajaDto.idTrabajador },
            });

            if (!trabajador) {
                return BaseResponseDto.error('Trabajador no encontrado.', HttpStatus.NOT_FOUND);
            }

            if (!trabajador.estaActivo) {
                return BaseResponseDto.error('El trabajador no está activo.', HttpStatus.BAD_REQUEST);
            }

            // Verificar que el trabajador no tenga una caja abierta
            const cajaAbierta = await this.cajaRepository.findOne({
                where: {
                    idTrabajador: { idTrabajador: createCajaDto.idTrabajador },
                    estado: true
                },
            });

            if (cajaAbierta) {
                return BaseResponseDto.error('El trabajador ya tiene una caja abierta.', HttpStatus.CONFLICT);
            }

            // Generar número de caja si no se proporciona
            const numeroCaja = createCajaDto.numeroCaja || await this.generarNumeroCaja();

            // Verificar que el número de caja no esté duplicado
            const cajaExistente = await this.cajaRepository.findOne({
                where: { numeroCaja },
            });

            if (cajaExistente) {
                return BaseResponseDto.error('Ya existe una caja con ese número.', HttpStatus.CONFLICT);
            }

            // Crear la caja
            const cajaData = {
                numeroCaja,
                montoInicial: createCajaDto.montoInicial,
                montoFinal: createCajaDto.montoInicial,
                fechaInicio: new Date().toISOString().split('T')[0],
                estado: true,
                descripcion: createCajaDto.descripcion,
                idTrabajador: trabajador,
            };

            const caja = this.cajaRepository.create(cajaData);
            const cajaGuardada = await this.cajaRepository.save(caja);

            // Obtener la caja completa con relaciones
            const cajaCompleta = await this.cajaRepository.findOne({
                where: { idCaja: cajaGuardada.idCaja },
                relations: ['idTrabajador'],
            });

            if (!cajaCompleta) {
                return BaseResponseDto.error('Error al obtener la caja creada.', HttpStatus.INTERNAL_SERVER_ERROR);
            }

            const responseDto = await this.mapToResponseDto(cajaCompleta);

            return BaseResponseDto.success(responseDto, 'Caja creada exitosamente.', HttpStatus.CREATED);
        } catch (error) {
            return BaseResponseDto.error('Error al crear la caja: ' + error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async findAll(): Promise<BaseResponseDto<CajaResponseDto[]>> {
        try {
            const cajas = await this.cajaRepository.find({
                relations: ['idTrabajador'],
                order: { fechaInicio: 'DESC' },
            });

            const responseData = await Promise.all(
                cajas.map(caja => this.mapToResponseDto(caja))
            );

            const message = cajas.length > 0
                ? 'Cajas obtenidas exitosamente.'
                : 'No se encontraron cajas.';

            return BaseResponseDto.success(responseData, message, HttpStatus.OK);
        } catch (error) {
            return BaseResponseDto.error('Error al obtener cajas: ' + error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async findOne(id: string): Promise<BaseResponseDto<CajaResponseDto>> {
        if (!id) {
            return BaseResponseDto.error('Ingrese un ID válido, Intente de Nuevo.', HttpStatus.BAD_REQUEST);
        }

        try {
            const caja = await this.cajaRepository.findOne({
                where: { idCaja: id },
                relations: ['idTrabajador', 'movimientoCajas'],
            });

            if (!caja) {
                return BaseResponseDto.error('Caja no encontrada.', HttpStatus.NOT_FOUND);
            }

            const responseDto = await this.mapToResponseDto(caja);

            return BaseResponseDto.success(responseDto, 'Caja obtenida exitosamente.', HttpStatus.OK);
        } catch (error) {
            return BaseResponseDto.error('Error al obtener la caja: ' + error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async update(id: string, updateCajaDto: UpdateCajaDto): Promise<BaseResponseDto<CajaResponseDto>> {
        if (!id || !updateCajaDto) {
            return BaseResponseDto.error('Ingrese datos válidos, Intente de Nuevo.', HttpStatus.BAD_REQUEST);
        }

        try {
            const caja = await this.cajaRepository.findOne({
                where: { idCaja: id },
                relations: ['idTrabajador'],
            });

            if (!caja) {
                return BaseResponseDto.error('Caja no encontrada.', HttpStatus.NOT_FOUND);
            }

            // Si se está cerrando la caja, agregar la fecha de fin
            if (updateCajaDto.estado === false && caja.estado === true) {
                updateCajaDto = {
                    ...updateCajaDto,
                    fechaFin: new Date().toISOString().split('T')[0],
                };
            }

            this.cajaRepository.merge(caja, updateCajaDto);
            const cajaActualizada = await this.cajaRepository.save(caja);

            const responseDto = await this.mapToResponseDto(cajaActualizada);

            return BaseResponseDto.success(responseDto, 'Caja actualizada exitosamente.', HttpStatus.OK);
        } catch (error) {
            return BaseResponseDto.error('Error al actualizar la caja: ' + error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async remove(id: string): Promise<BaseResponseDto<void>> {
        if (!id) {
            return BaseResponseDto.error('Ingrese un ID válido, Intente de Nuevo.', HttpStatus.BAD_REQUEST);
        }

        try {
            const caja = await this.cajaRepository.findOne({
                where: { idCaja: id },
                relations: ['movimientoCajas'],
            });

            if (!caja) {
                return BaseResponseDto.error('Caja no encontrada.', HttpStatus.NOT_FOUND);
            }

            // Verificar si tiene movimientos asociados
            if (caja.movimientoCajas && caja.movimientoCajas.length > 0) {
                return BaseResponseDto.error('No se puede eliminar la caja porque tiene movimientos asociados.', HttpStatus.CONFLICT);
            }

            // Si la caja está abierta, no se puede eliminar
            if (caja.estado) {
                return BaseResponseDto.error('No se puede eliminar una caja abierta. Cierre la caja primero.', HttpStatus.CONFLICT);
            }

            await this.cajaRepository.remove(caja);

            return BaseResponseDto.success(undefined, 'Caja eliminada exitosamente.', HttpStatus.OK);
        } catch (error) {
            return BaseResponseDto.error('Error al eliminar la caja: ' + error.message, HttpStatus.BAD_REQUEST);
        }
    }

    // Operaciones específicas de caja

    async abrirCaja(idTrabajador: string, aperturaCajaDto: AperturaCajaDto): Promise<BaseResponseDto<CajaResponseDto>> {
        const createCajaDto: CreateCajaDto = {
            montoInicial: aperturaCajaDto.montoInicial,
            idTrabajador,
            descripcion: aperturaCajaDto.descripcion,
        };

        return this.create(createCajaDto);
    }

    async cerrarCaja(idCaja: string, cierreCajaDto: CierreCajaDto): Promise<BaseResponseDto<CajaResponseDto>> {
        if (!idCaja || !cierreCajaDto) {
            return BaseResponseDto.error('Ingrese datos válidos, Intente de Nuevo.', HttpStatus.BAD_REQUEST);
        }

        try {
            const caja = await this.cajaRepository.findOne({
                where: { idCaja },
                relations: ['idTrabajador'],
            });

            if (!caja) {
                return BaseResponseDto.error('Caja no encontrada.', HttpStatus.NOT_FOUND);
            }

            if (!caja.estado) {
                return BaseResponseDto.error('La caja ya está cerrada.', HttpStatus.BAD_REQUEST);
            }

            // Calcular totales de movimientos
            const totalesResult = await this.calcularTotalMovimientos(idCaja);
            if (!totalesResult.success) {
                return BaseResponseDto.error('Error al calcular totales de movimientos.', HttpStatus.INTERNAL_SERVER_ERROR);
            }

            const { totalIngresos, totalEgresos } = totalesResult.data;
            const montoFinalCalculado = caja.montoInicial + totalIngresos - totalEgresos;
            const diferencia = cierreCajaDto.montoFinalReal - montoFinalCalculado;

            // Validar diferencia
            if (Math.abs(diferencia) > LIMITE_DIFERENCIA_CAJA) {
                return BaseResponseDto.error(
                    `La diferencia de ${diferencia.toFixed(2)} excede el límite permitido de ${LIMITE_DIFERENCIA_CAJA}. Se requiere supervisión.`,
                    HttpStatus.BAD_REQUEST
                );
            }

            // Actualizar caja
            const updateData: UpdateCajaDto = {
                montoFinal: cierreCajaDto.montoFinalReal,
                estado: false,
                descripcion: cierreCajaDto.observaciones || `Cierre - Diferencia: ${diferencia.toFixed(2)}`,
            };

            return this.update(idCaja, updateData);
        } catch (error) {
            return BaseResponseDto.error('Error al cerrar la caja: ' + error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async obtenerCajaActiva(idTrabajador: string): Promise<BaseResponseDto<CajaResponseDto>> {
        if (!idTrabajador) {
            return BaseResponseDto.error('Ingrese un ID de trabajador válido.', HttpStatus.BAD_REQUEST);
        }

        try {
            const caja = await this.cajaRepository.findOne({
                where: {
                    idTrabajador: { idTrabajador },
                    estado: true
                },
                relations: ['idTrabajador'],
            });

            if (!caja) {
                return BaseResponseDto.error('No se encontró una caja activa para este trabajador.', HttpStatus.NOT_FOUND);
            }

            const responseDto = await this.mapToResponseDto(caja);

            return BaseResponseDto.success(responseDto, 'Caja activa obtenida exitosamente.', HttpStatus.OK);
        } catch (error) {
            return BaseResponseDto.error('Error al obtener la caja activa: ' + error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async validarCierre(idCaja: string, montoFinalReal: number): Promise<BaseResponseDto<any>> {
        try {
            const totalesResult = await this.calcularTotalMovimientos(idCaja);
            if (!totalesResult.success) {
                return BaseResponseDto.error('Error al calcular totales.', HttpStatus.INTERNAL_SERVER_ERROR);
            }

            const caja = await this.cajaRepository.findOne({ where: { idCaja } });
            if (!caja) {
                return BaseResponseDto.error('Caja no encontrada.', HttpStatus.NOT_FOUND);
            }

            const { totalIngresos, totalEgresos } = totalesResult.data;
            const montoFinalCalculado = caja.montoInicial + totalIngresos - totalEgresos;
            const diferencia = montoFinalReal - montoFinalCalculado;

            const validacion = {
                montoInicial: caja.montoInicial,
                totalIngresos,
                totalEgresos,
                montoFinalCalculado,
                montoFinalReal,
                diferencia,
                esValido: Math.abs(diferencia) <= LIMITE_DIFERENCIA_CAJA,
                limiteDiferencia: LIMITE_DIFERENCIA_CAJA,
            };

            return BaseResponseDto.success(validacion, 'Validación de cierre realizada.', HttpStatus.OK);
        } catch (error) {
            return BaseResponseDto.error('Error en la validación: ' + error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async calcularTotalMovimientos(idCaja: string): Promise<BaseResponseDto<any>> {
        try {
            const movimientos = await this.movimientoCajaRepository.find({
                where: { idCaja: { idCaja } },
            });

            const totalIngresos = movimientos
                .filter(m => m.tipo === 'INGRESO')
                .reduce((sum, m) => sum + parseFloat(m.monto.toString()), 0);

            const totalEgresos = movimientos
                .filter(m => m.tipo === 'EGRESO')
                .reduce((sum, m) => sum + parseFloat(m.monto.toString()), 0);

            const totalAjustes = movimientos
                .filter(m => m.tipo === 'AJUSTE')
                .reduce((sum, m) => sum + parseFloat(m.monto.toString()), 0);

            const totales = {
                totalIngresos,
                totalEgresos,
                totalAjustes,
                cantidadMovimientos: movimientos.length,
                movimientos: movimientos.map(m => ({
                    tipo: m.tipo,
                    concepto: m.concepto,
                    monto: parseFloat(m.monto.toString()),
                    fechaMovimiento: m.fechaMovimiento,
                })),
            };

            return BaseResponseDto.success(totales, 'Totales calculados exitosamente.', HttpStatus.OK);
        } catch (error) {
            return BaseResponseDto.error('Error al calcular totales: ' + error.message, HttpStatus.BAD_REQUEST);
        }
    }

    // Consultas específicas

    async findByTrabajador(idTrabajador: string): Promise<BaseResponseDto<CajaResponseDto[]>> {
        try {
            const cajas = await this.cajaRepository.find({
                where: { idTrabajador: { idTrabajador } },
                relations: ['idTrabajador'],
                order: { fechaInicio: 'DESC' },
            });

            const responseData = await Promise.all(
                cajas.map(caja => this.mapToResponseDto(caja))
            );

            const message = cajas.length > 0
                ? 'Cajas del trabajador obtenidas exitosamente.'
                : 'No se encontraron cajas para este trabajador.';

            return BaseResponseDto.success(responseData, message, HttpStatus.OK);
        } catch (error) {
            return BaseResponseDto.error('Error al obtener cajas por trabajador: ' + error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async findByFecha(fecha: string): Promise<BaseResponseDto<CajaResponseDto[]>> {
        try {
            const cajas = await this.cajaRepository.find({
                where: { fechaInicio: fecha },
                relations: ['idTrabajador'],
                order: { fechaInicio: 'DESC' },
            });

            const responseData = await Promise.all(
                cajas.map(caja => this.mapToResponseDto(caja))
            );

            const message = cajas.length > 0
                ? 'Cajas de la fecha obtenidas exitosamente.'
                : 'No se encontraron cajas para esta fecha.';

            return BaseResponseDto.success(responseData, message, HttpStatus.OK);
        } catch (error) {
            return BaseResponseDto.error('Error al obtener cajas por fecha: ' + error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async findCajasAbiertas(): Promise<BaseResponseDto<CajaResponseDto[]>> {
        try {
            const cajas = await this.cajaRepository.find({
                where: { estado: true },
                relations: ['idTrabajador'],
                order: { fechaInicio: 'DESC' },
            });

            const responseData = await Promise.all(
                cajas.map(caja => this.mapToResponseDto(caja))
            );

            const message = cajas.length > 0
                ? 'Cajas abiertas obtenidas exitosamente.'
                : 'No hay cajas abiertas actualmente.';

            return BaseResponseDto.success(responseData, message, HttpStatus.OK);
        } catch (error) {
            return BaseResponseDto.error('Error al obtener cajas abiertas: ' + error.message, HttpStatus.BAD_REQUEST);
        }
    }

    // Métodos auxiliares

    private async generarNumeroCaja(): Promise<string> {
        const fecha = new Date().toISOString().split('T')[0].replace(/-/g, '');
        const ultimaCaja = await this.cajaRepository.findOne({
            where: { numeroCaja: { startsWith: `CAJA-` } as any },
            order: { numeroCaja: 'DESC' },
        });

        let numero = 1;
        if (ultimaCaja && ultimaCaja.numeroCaja) {
            const match = ultimaCaja.numeroCaja.match(/CAJA-(\d+)-/);
            if (match) {
                numero = parseInt(match[1]) + 1;
            }
        }

        return `CAJA-${numero.toString().padStart(3, '0')}-${fecha}`;
    }

    private async mapToResponseDto(caja: Caja): Promise<CajaResponseDto> {
        const responseDto = new CajaResponseDto();
        responseDto.idCaja = caja.idCaja;
        responseDto.montoInicial = parseFloat(caja.montoInicial.toString());
        responseDto.montoFinal = parseFloat(caja.montoFinal.toString());
        responseDto.fechaInicio = caja.fechaInicio;
        responseDto.fechaFin = caja.fechaFin;
        responseDto.estado = caja.estado;
        responseDto.descripcion = caja.descripcion;
        responseDto.numeroCaja = caja.numeroCaja;

        // Mapear información del trabajador
        if (caja.idTrabajador) {
            responseDto.idTrabajador = {
                idTrabajador: caja.idTrabajador.idTrabajador,
                nombre: caja.idTrabajador.nombre,
                apellido: caja.idTrabajador.apellido,
                correo: caja.idTrabajador.correo,
            };
        }

        // Calcular totales si es necesario
        if (caja.movimientoCajas) {
            const totalIngresos = caja.movimientoCajas
                .filter(m => m.tipo === 'INGRESO')
                .reduce((sum, m) => sum + parseFloat(m.monto.toString()), 0);

            const totalEgresos = caja.movimientoCajas
                .filter(m => m.tipo === 'EGRESO')
                .reduce((sum, m) => sum + parseFloat(m.monto.toString()), 0);

            responseDto.totalIngresos = totalIngresos;
            responseDto.totalEgresos = totalEgresos;
            responseDto.diferencia = responseDto.montoFinal - (responseDto.montoInicial + totalIngresos - totalEgresos);
            responseDto.cantidadMovimientos = caja.movimientoCajas.length;
        }

        return responseDto;
    }
}

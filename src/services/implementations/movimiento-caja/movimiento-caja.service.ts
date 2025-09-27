import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { MovimientoCaja } from 'src/entities/MovimientoCaja';
import { Caja } from 'src/entities/Caja';
import { Pago } from 'src/entities/Pago';
import { CreateMovimientoCajaDto, UpdateMovimientoCajaDto, MovimientoCajaResponseDto, TipoMovimiento } from 'src/dtos/movimiento-caja';
import { BaseResponseDto } from 'src/dtos/baseResponse/baseResponse.dto';
import { IMovimientoCajaService } from 'src/services/interfaces';

@Injectable()
export class MovimientoCajaService implements IMovimientoCajaService {
    constructor(
        @InjectRepository(MovimientoCaja)
        private readonly movimientoCajaRepository: Repository<MovimientoCaja>,
        @InjectRepository(Caja)
        private readonly cajaRepository: Repository<Caja>,
        @InjectRepository(Pago)
        private readonly pagoRepository: Repository<Pago>,
    ) { }

    async create(createMovimientoCajaDto: CreateMovimientoCajaDto): Promise<BaseResponseDto<MovimientoCajaResponseDto>> {
        if (!createMovimientoCajaDto) {
            return BaseResponseDto.error('Ingrese datos válidos, Intente de Nuevo.', HttpStatus.BAD_REQUEST);
        }

        try {
            // Validar que la caja existe y está abierta
            const caja = await this.cajaRepository.findOne({
                where: { idCaja: createMovimientoCajaDto.idCaja },
                relations: ['idTrabajador'],
            });

            if (!caja) {
                return BaseResponseDto.error('Caja no encontrada.', HttpStatus.NOT_FOUND);
            }

            if (!caja.estado) {
                return BaseResponseDto.error('No se pueden registrar movimientos en una caja cerrada.', HttpStatus.BAD_REQUEST);
            }

            // Validar pago si se proporciona
            let pago: Pago | undefined = undefined;
            if (createMovimientoCajaDto.idPago) {
                const pagoFound = await this.pagoRepository.findOne({
                    where: { idPago: createMovimientoCajaDto.idPago },
                });

                if (!pagoFound) {
                    return BaseResponseDto.error('Pago no encontrado.', HttpStatus.NOT_FOUND);
                }
                pago = pagoFound;
            }

            // Crear el movimiento
            const movimientoData: any = {
                tipo: createMovimientoCajaDto.tipo,
                concepto: createMovimientoCajaDto.concepto,
                monto: createMovimientoCajaDto.monto,
                descripcion: createMovimientoCajaDto.descripcion,
                comprobanteUrl: createMovimientoCajaDto.comprobanteUrl,
                fechaMovimiento: new Date(),
                idCaja: caja,
            };

            if (pago) {
                movimientoData.idPago = pago;
            }

            await this.movimientoCajaRepository.save(movimientoData);

            // Actualizar el monto final de la caja
            await this.actualizarMontoCaja(caja, createMovimientoCajaDto.tipo, createMovimientoCajaDto.monto);

            // Crear response DTO directamente
            const responseDto = new MovimientoCajaResponseDto();
            responseDto.idMovimiento = 'temp-id'; // Se asignará después de guardar
            responseDto.tipo = createMovimientoCajaDto.tipo;
            responseDto.concepto = createMovimientoCajaDto.concepto;
            responseDto.monto = createMovimientoCajaDto.monto;
            responseDto.fechaMovimiento = new Date();
            responseDto.comprobanteUrl = createMovimientoCajaDto.comprobanteUrl || null;
            responseDto.descripcion = createMovimientoCajaDto.descripcion || null;

            responseDto.idCaja = {
                idCaja: caja.idCaja,
                numeroCaja: caja.numeroCaja,
                estado: caja.estado,
            };

            if (pago) {
                responseDto.idPago = {
                    idPago: pago.idPago,
                    monto: parseFloat(pago.monto.toString()),
                    estado: pago.estado,
                    fechaPago: pago.fechaPago,
                };
            }

            return BaseResponseDto.success(responseDto, 'Movimiento registrado exitosamente.', HttpStatus.CREATED);
        } catch (error) {
            return BaseResponseDto.error('Error al crear el movimiento: ' + error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async findAll(): Promise<BaseResponseDto<MovimientoCajaResponseDto[]>> {
        try {
            const movimientos = await this.movimientoCajaRepository.find({
                relations: ['idCaja', 'idPago'],
                order: { fechaMovimiento: 'DESC' },
            });

            const responseData = movimientos.map(movimiento => this.mapToResponseDto(movimiento));

            const message = movimientos.length > 0
                ? 'Movimientos obtenidos exitosamente.'
                : 'No se encontraron movimientos.';

            return BaseResponseDto.success(responseData, message, HttpStatus.OK);
        } catch (error) {
            return BaseResponseDto.error('Error al obtener movimientos: ' + error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async findOne(id: string): Promise<BaseResponseDto<MovimientoCajaResponseDto>> {
        if (!id) {
            return BaseResponseDto.error('Ingrese un ID válido, Intente de Nuevo.', HttpStatus.BAD_REQUEST);
        }

        try {
            const movimiento = await this.movimientoCajaRepository.findOne({
                where: { idMovimiento: id },
                relations: ['idCaja', 'idPago'],
            });

            if (!movimiento) {
                return BaseResponseDto.error('Movimiento no encontrado.', HttpStatus.NOT_FOUND);
            }

            const responseDto = this.mapToResponseDto(movimiento);

            return BaseResponseDto.success(responseDto, 'Movimiento obtenido exitosamente.', HttpStatus.OK);
        } catch (error) {
            return BaseResponseDto.error('Error al obtener el movimiento: ' + error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async update(id: string, updateMovimientoCajaDto: UpdateMovimientoCajaDto): Promise<BaseResponseDto<MovimientoCajaResponseDto>> {
        if (!id || !updateMovimientoCajaDto) {
            return BaseResponseDto.error('Ingrese datos válidos, Intente de Nuevo.', HttpStatus.BAD_REQUEST);
        }

        try {
            const movimiento = await this.movimientoCajaRepository.findOne({
                where: { idMovimiento: id },
                relations: ['idCaja', 'idPago'],
            });

            if (!movimiento) {
                return BaseResponseDto.error('Movimiento no encontrado.', HttpStatus.NOT_FOUND);
            }

            // Verificar que la caja esté abierta
            if (!movimiento.idCaja.estado) {
                return BaseResponseDto.error('No se pueden modificar movimientos de una caja cerrada.', HttpStatus.BAD_REQUEST);
            }

            // Si se cambia el monto o tipo, actualizar la caja
            if (updateMovimientoCajaDto.monto !== undefined || updateMovimientoCajaDto.tipo !== undefined) {
                // Revertir el movimiento anterior
                await this.revertirMovimientoCaja(movimiento.idCaja, movimiento.tipo, parseFloat(movimiento.monto.toString()));

                // Aplicar el nuevo movimiento
                const nuevoTipo = updateMovimientoCajaDto.tipo || movimiento.tipo;
                const nuevoMonto = updateMovimientoCajaDto.monto || parseFloat(movimiento.monto.toString());
                await this.actualizarMontoCaja(movimiento.idCaja, nuevoTipo as TipoMovimiento, nuevoMonto);
            }

            this.movimientoCajaRepository.merge(movimiento, updateMovimientoCajaDto);
            const movimientoActualizado = await this.movimientoCajaRepository.save(movimiento);

            const responseDto = this.mapToResponseDto(movimientoActualizado);

            return BaseResponseDto.success(responseDto, 'Movimiento actualizado exitosamente.', HttpStatus.OK);
        } catch (error) {
            return BaseResponseDto.error('Error al actualizar el movimiento: ' + error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async remove(id: string): Promise<BaseResponseDto<void>> {
        if (!id) {
            return BaseResponseDto.error('Ingrese un ID válido, Intente de Nuevo.', HttpStatus.BAD_REQUEST);
        }

        try {
            const movimiento = await this.movimientoCajaRepository.findOne({
                where: { idMovimiento: id },
                relations: ['idCaja'],
            });

            if (!movimiento) {
                return BaseResponseDto.error('Movimiento no encontrado.', HttpStatus.NOT_FOUND);
            }

            // Verificar que la caja esté abierta
            if (!movimiento.idCaja.estado) {
                return BaseResponseDto.error('No se pueden eliminar movimientos de una caja cerrada.', HttpStatus.BAD_REQUEST);
            }

            // Revertir el movimiento en la caja
            await this.revertirMovimientoCaja(movimiento.idCaja, movimiento.tipo, parseFloat(movimiento.monto.toString()));

            await this.movimientoCajaRepository.remove(movimiento);

            return BaseResponseDto.success(undefined, 'Movimiento eliminado exitosamente.', HttpStatus.OK);
        } catch (error) {
            return BaseResponseDto.error('Error al eliminar el movimiento: ' + error.message, HttpStatus.BAD_REQUEST);
        }
    }

    // Operaciones específicas

    async registrarIngreso(createMovimientoCajaDto: CreateMovimientoCajaDto): Promise<BaseResponseDto<MovimientoCajaResponseDto>> {
        createMovimientoCajaDto.tipo = TipoMovimiento.INGRESO;
        return this.create(createMovimientoCajaDto);
    }

    async registrarEgreso(createMovimientoCajaDto: CreateMovimientoCajaDto): Promise<BaseResponseDto<MovimientoCajaResponseDto>> {
        createMovimientoCajaDto.tipo = TipoMovimiento.EGRESO;
        return this.create(createMovimientoCajaDto);
    }

    async anularMovimiento(id: string, motivo: string): Promise<BaseResponseDto<MovimientoCajaResponseDto>> {
        try {
            const movimiento = await this.movimientoCajaRepository.findOne({
                where: { idMovimiento: id },
                relations: ['idCaja'],
            });

            if (!movimiento) {
                return BaseResponseDto.error('Movimiento no encontrado.', HttpStatus.NOT_FOUND);
            }

            if (!movimiento.idCaja.estado) {
                return BaseResponseDto.error('No se pueden anular movimientos de una caja cerrada.', HttpStatus.BAD_REQUEST);
            }

            // Crear movimiento de ajuste para anular
            const ajusteDto: CreateMovimientoCajaDto = {
                tipo: TipoMovimiento.AJUSTE,
                concepto: `ANULACIÓN: ${movimiento.concepto}`,
                monto: parseFloat(movimiento.monto.toString()),
                idCaja: movimiento.idCaja.idCaja,
                descripcion: `Anulación de movimiento ${id}. Motivo: ${motivo}`,
            };

            // Invertir el monto según el tipo original
            if (movimiento.tipo === 'INGRESO') {
                ajusteDto.monto = -ajusteDto.monto;
            }

            return this.create(ajusteDto);
        } catch (error) {
            return BaseResponseDto.error('Error al anular el movimiento: ' + error.message, HttpStatus.BAD_REQUEST);
        }
    }

    // Consultas específicas

    async findByCaja(cajaId: string): Promise<BaseResponseDto<MovimientoCajaResponseDto[]>> {
        try {
            const movimientos = await this.movimientoCajaRepository.find({
                where: { idCaja: { idCaja: cajaId } },
                relations: ['idCaja', 'idPago'],
                order: { fechaMovimiento: 'DESC' },
            });

            const responseData = movimientos.map(movimiento => this.mapToResponseDto(movimiento));

            const message = movimientos.length > 0
                ? 'Movimientos de la caja obtenidos exitosamente.'
                : 'No se encontraron movimientos para esta caja.';

            return BaseResponseDto.success(responseData, message, HttpStatus.OK);
        } catch (error) {
            return BaseResponseDto.error('Error al obtener movimientos por caja: ' + error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async findByTipo(tipo: TipoMovimiento): Promise<BaseResponseDto<MovimientoCajaResponseDto[]>> {
        try {
            const movimientos = await this.movimientoCajaRepository.find({
                where: { tipo },
                relations: ['idCaja', 'idPago'],
                order: { fechaMovimiento: 'DESC' },
            });

            const responseData = movimientos.map(movimiento => this.mapToResponseDto(movimiento));

            const message = movimientos.length > 0
                ? `Movimientos de tipo ${tipo} obtenidos exitosamente.`
                : `No se encontraron movimientos de tipo ${tipo}.`;

            return BaseResponseDto.success(responseData, message, HttpStatus.OK);
        } catch (error) {
            return BaseResponseDto.error('Error al obtener movimientos por tipo: ' + error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async findByFechaRange(fechaInicio: string, fechaFin: string): Promise<BaseResponseDto<MovimientoCajaResponseDto[]>> {
        try {
            const inicio = new Date(fechaInicio);
            const fin = new Date(fechaFin);
            fin.setHours(23, 59, 59, 999); // Incluir todo el día final

            const movimientos = await this.movimientoCajaRepository.find({
                where: {
                    fechaMovimiento: Between(inicio, fin)
                },
                relations: ['idCaja', 'idPago'],
                order: { fechaMovimiento: 'DESC' },
            });

            const responseData = movimientos.map(movimiento => this.mapToResponseDto(movimiento));

            const message = movimientos.length > 0
                ? 'Movimientos del rango de fechas obtenidos exitosamente.'
                : 'No se encontraron movimientos en el rango de fechas especificado.';

            return BaseResponseDto.success(responseData, message, HttpStatus.OK);
        } catch (error) {
            return BaseResponseDto.error('Error al obtener movimientos por fecha: ' + error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async findByPago(pagoId: string): Promise<BaseResponseDto<MovimientoCajaResponseDto>> {
        try {
            const movimiento = await this.movimientoCajaRepository.findOne({
                where: { idPago: { idPago: pagoId } },
                relations: ['idCaja', 'idPago'],
            });

            if (!movimiento) {
                return BaseResponseDto.error('No se encontró movimiento asociado a este pago.', HttpStatus.NOT_FOUND);
            }

            const responseDto = this.mapToResponseDto(movimiento);

            return BaseResponseDto.success(responseDto, 'Movimiento del pago obtenido exitosamente.', HttpStatus.OK);
        } catch (error) {
            return BaseResponseDto.error('Error al obtener movimiento por pago: ' + error.message, HttpStatus.BAD_REQUEST);
        }
    }

    // Métodos auxiliares

    private async actualizarMontoCaja(caja: Caja, tipo: TipoMovimiento, monto: number): Promise<void> {
        let nuevoMontoFinal = parseFloat(caja.montoFinal.toString());

        switch (tipo) {
            case TipoMovimiento.INGRESO:
                nuevoMontoFinal += monto;
                break;
            case TipoMovimiento.EGRESO:
                nuevoMontoFinal -= monto;
                break;
            case TipoMovimiento.AJUSTE:
                nuevoMontoFinal += monto; // Los ajustes pueden ser positivos o negativos
                break;
        }

        caja.montoFinal = nuevoMontoFinal;
        await this.cajaRepository.save(caja);
    }

    private async revertirMovimientoCaja(caja: Caja, tipo: string, monto: number): Promise<void> {
        let nuevoMontoFinal = parseFloat(caja.montoFinal.toString());

        switch (tipo) {
            case 'INGRESO':
                nuevoMontoFinal -= monto;
                break;
            case 'EGRESO':
                nuevoMontoFinal += monto;
                break;
            case 'AJUSTE':
                nuevoMontoFinal -= monto;
                break;
        }

        caja.montoFinal = nuevoMontoFinal;
        await this.cajaRepository.save(caja);
    }

    private mapToResponseDto(movimiento: MovimientoCaja): MovimientoCajaResponseDto {
        const responseDto = new MovimientoCajaResponseDto();
        responseDto.idMovimiento = movimiento.idMovimiento;
        responseDto.tipo = movimiento.tipo;
        responseDto.concepto = movimiento.concepto;
        responseDto.monto = parseFloat(movimiento.monto.toString());
        responseDto.fechaMovimiento = movimiento.fechaMovimiento;
        responseDto.comprobanteUrl = movimiento.comprobanteUrl;
        responseDto.descripcion = movimiento.descripcion;

        // Mapear información de la caja
        if (movimiento.idCaja) {
            responseDto.idCaja = {
                idCaja: movimiento.idCaja.idCaja,
                numeroCaja: movimiento.idCaja.numeroCaja,
                estado: movimiento.idCaja.estado,
            };
        }

        // Mapear información del pago si existe
        if (movimiento.idPago) {
            responseDto.idPago = {
                idPago: movimiento.idPago.idPago,
                monto: parseFloat(movimiento.idPago.monto.toString()),
                estado: movimiento.idPago.estado,
                fechaPago: movimiento.idPago.fechaPago,
            };
        }

        return responseDto;
    }
}

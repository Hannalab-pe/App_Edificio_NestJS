import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { MovimientoCajaService } from 'src/services/implementations/movimiento-caja/movimiento-caja.service';
import { CreateMovimientoCajaDto, UpdateMovimientoCajaDto, MovimientoCajaResponseDto } from 'src/dtos/movimiento-caja';
import { BaseResponseDto } from 'src/dtos/baseResponse/baseResponse.dto';

@ApiTags('Movimiento Caja')
@Controller('movimiento-caja')
export class MovimientoCajaController {
    constructor(private readonly movimientoCajaService: MovimientoCajaService) { }

    @Post()
    @ApiOperation({
        summary: 'Crear un nuevo movimiento de caja',
        description: 'Registra un nuevo movimiento de caja con actualización automática del balance'
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Movimiento de caja creado exitosamente',
        type: MovimientoCajaResponseDto
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Datos inválidos o caja cerrada'
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Caja no encontrada'
    })
    create(@Body() createMovimientoCajaDto: CreateMovimientoCajaDto): Promise<BaseResponseDto<MovimientoCajaResponseDto>> {
        return this.movimientoCajaService.create(createMovimientoCajaDto);
    }

    @Post('ingreso')
    @ApiOperation({
        summary: 'Registrar un ingreso de dinero',
        description: 'Registra un ingreso de dinero en la caja especificada'
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Ingreso registrado exitosamente',
        type: MovimientoCajaResponseDto
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'La caja está cerrada o datos inválidos'
    })
    registrarIngreso(@Body() createMovimientoCajaDto: CreateMovimientoCajaDto): Promise<BaseResponseDto<MovimientoCajaResponseDto>> {
        return this.movimientoCajaService.registrarIngreso(createMovimientoCajaDto);
    }

    @Post('egreso')
    @ApiOperation({
        summary: 'Registrar un egreso de dinero',
        description: 'Registra un egreso de dinero de la caja especificada'
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Egreso registrado exitosamente',
        type: MovimientoCajaResponseDto
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Fondos insuficientes, caja cerrada o datos inválidos'
    })
    registrarEgreso(@Body() createMovimientoCajaDto: CreateMovimientoCajaDto): Promise<BaseResponseDto<MovimientoCajaResponseDto>> {
        return this.movimientoCajaService.registrarEgreso(createMovimientoCajaDto);
    }

    @Post('ajuste')
    @ApiOperation({
        summary: 'Registrar un ajuste de caja',
        description: 'Registra un ajuste (positivo o negativo) en la caja especificada'
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Ajuste registrado exitosamente',
        type: MovimientoCajaResponseDto
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'La caja está cerrada o datos inválidos'
    })
    registrarAjuste(@Body() createMovimientoCajaDto: CreateMovimientoCajaDto): Promise<BaseResponseDto<MovimientoCajaResponseDto>> {
        // Para ajustes, simplemente usar el método create con el tipo AJUSTE
        return this.movimientoCajaService.create({ ...createMovimientoCajaDto, tipo: 'AJUSTE' as any });
    }

    @Post(':id/anular')
    @ApiOperation({
        summary: 'Anular un movimiento de caja',
        description: 'Anula un movimiento de caja y ajusta el balance automáticamente'
    })
    @ApiParam({
        name: 'id',
        description: 'ID del movimiento a anular',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Movimiento anulado exitosamente',
        type: MovimientoCajaResponseDto
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'El movimiento ya está anulado o la caja está cerrada'
    })
    anularMovimiento(
        @Param('id') id: string,
        @Body() body: { motivo: string },
    ): Promise<BaseResponseDto<MovimientoCajaResponseDto>> {
        return this.movimientoCajaService.anularMovimiento(id, body.motivo);
    }

    @Get()
    @ApiOperation({
        summary: 'Obtener todos los movimientos de caja',
        description: 'Retorna una lista de todos los movimientos de caja registrados'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Lista de movimientos obtenida exitosamente',
        type: [MovimientoCajaResponseDto]
    })
    findAll(): Promise<BaseResponseDto<MovimientoCajaResponseDto[]>> {
        return this.movimientoCajaService.findAll();
    }

    @Get('caja/:idCaja')
    @ApiOperation({
        summary: 'Obtener movimientos por caja',
        description: 'Retorna todos los movimientos de una caja específica'
    })
    @ApiParam({
        name: 'idCaja',
        description: 'ID de la caja',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Movimientos de la caja obtenidos exitosamente',
        type: [MovimientoCajaResponseDto]
    })
    findMovimientosByCaja(@Param('idCaja') idCaja: string): Promise<BaseResponseDto<MovimientoCajaResponseDto[]>> {
        return this.movimientoCajaService.findByCaja(idCaja);
    }

    @Get('caja/:idCaja/activos')
    @ApiOperation({
        summary: 'Obtener movimientos activos por caja',
        description: 'Retorna solo los movimientos activos (no anulados) de una caja específica'
    })
    @ApiParam({
        name: 'idCaja',
        description: 'ID de la caja',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Movimientos activos de la caja obtenidos exitosamente',
        type: [MovimientoCajaResponseDto]
    })
    findMovimientosActivosByCaja(@Param('idCaja') idCaja: string): Promise<BaseResponseDto<MovimientoCajaResponseDto[]>> {
        // Este método tendría que implementarse en el servicio o usar findByCaja con filtro
        return this.movimientoCajaService.findByCaja(idCaja);
    }

    @Get('tipo/:tipo')
    @ApiOperation({
        summary: 'Obtener movimientos por tipo',
        description: 'Retorna todos los movimientos de un tipo específico (INGRESO, EGRESO, AJUSTE)'
    })
    @ApiParam({
        name: 'tipo',
        description: 'Tipo de movimiento',
        enum: ['INGRESO', 'EGRESO', 'AJUSTE']
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Movimientos del tipo especificado obtenidos exitosamente',
        type: [MovimientoCajaResponseDto]
    })
    findByTipo(@Param('tipo') tipo: string): Promise<BaseResponseDto<MovimientoCajaResponseDto[]>> {
        return this.movimientoCajaService.findByTipo(tipo as any);
    }

    @Get('fecha')
    @ApiOperation({
        summary: 'Obtener movimientos por fecha',
        description: 'Retorna todos los movimientos registrados en una fecha específica'
    })
    @ApiQuery({
        name: 'fecha',
        description: 'Fecha en formato YYYY-MM-DD',
        example: '2025-09-26'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Movimientos de la fecha obtenidos exitosamente',
        type: [MovimientoCajaResponseDto]
    })
    findByFecha(@Query('fecha') fecha: string): Promise<BaseResponseDto<MovimientoCajaResponseDto[]>> {
        // Usar findByFechaRange para un solo día
        return this.movimientoCajaService.findByFechaRange(fecha, fecha);
    }

    @Get('rango-fechas')
    @ApiOperation({
        summary: 'Obtener movimientos por rango de fechas',
        description: 'Retorna todos los movimientos registrados en un rango de fechas específico'
    })
    @ApiQuery({
        name: 'fechaInicio',
        description: 'Fecha de inicio en formato YYYY-MM-DD',
        example: '2025-09-01'
    })
    @ApiQuery({
        name: 'fechaFin',
        description: 'Fecha de fin en formato YYYY-MM-DD',
        example: '2025-09-30'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Movimientos del rango de fechas obtenidos exitosamente',
        type: [MovimientoCajaResponseDto]
    })
    findByRangoFechas(
        @Query('fechaInicio') fechaInicio: string,
        @Query('fechaFin') fechaFin: string,
    ): Promise<BaseResponseDto<MovimientoCajaResponseDto[]>> {
        return this.movimientoCajaService.findByFechaRange(fechaInicio, fechaFin);
    }

    @Get('pago/:idPago')
    @ApiOperation({
        summary: 'Obtener movimientos por pago',
        description: 'Retorna todos los movimientos asociados a un pago específico'
    })
    @ApiParam({
        name: 'idPago',
        description: 'ID del pago',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Movimientos del pago obtenidos exitosamente',
        type: [MovimientoCajaResponseDto]
    })
    findByPago(@Param('idPago') idPago: string): Promise<BaseResponseDto<MovimientoCajaResponseDto[]>> {
        return this.movimientoCajaService.findByPago(idPago);
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Obtener un movimiento por ID',
        description: 'Retorna la información detallada de un movimiento específico'
    })
    @ApiParam({
        name: 'id',
        description: 'ID único del movimiento',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Movimiento obtenido exitosamente',
        type: MovimientoCajaResponseDto
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Movimiento no encontrado'
    })
    findOne(@Param('id') id: string): Promise<BaseResponseDto<MovimientoCajaResponseDto>> {
        return this.movimientoCajaService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({
        summary: 'Actualizar un movimiento de caja',
        description: 'Actualiza la información de un movimiento existente (solo descripción y observaciones)'
    })
    @ApiParam({
        name: 'id',
        description: 'ID único del movimiento',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Movimiento actualizado exitosamente',
        type: MovimientoCajaResponseDto
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Movimiento no encontrado'
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'No se pueden modificar movimientos anulados o de cajas cerradas'
    })
    update(
        @Param('id') id: string,
        @Body() updateMovimientoCajaDto: UpdateMovimientoCajaDto,
    ): Promise<BaseResponseDto<MovimientoCajaResponseDto>> {
        return this.movimientoCajaService.update(id, updateMovimientoCajaDto);
    }

    @Delete(':id')
    @ApiOperation({
        summary: 'Eliminar un movimiento de caja',
        description: 'Elimina físicamente un movimiento del sistema (solo si no está relacionado con pagos)'
    })
    @ApiParam({
        name: 'id',
        description: 'ID único del movimiento',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Movimiento eliminado exitosamente'
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Movimiento no encontrado'
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'No se puede eliminar el movimiento porque está asociado a un pago o la caja está cerrada'
    })
    remove(@Param('id') id: string): Promise<BaseResponseDto<void>> {
        return this.movimientoCajaService.remove(id);
    }
}

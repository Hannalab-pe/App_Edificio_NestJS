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
import { CajaService } from 'src/services/implementations/caja/caja.service';
import { CreateCajaDto, UpdateCajaDto, CajaResponseDto, AperturaCajaDto, CierreCajaDto } from 'src/dtos/caja';
import { BaseResponseDto } from 'src/dtos/baseResponse/baseResponse.dto';

@ApiTags('Caja')
@Controller('caja')
export class CajaController {
    constructor(private readonly cajaService: CajaService) { }

    @Post()
    @ApiOperation({
        summary: 'Crear una nueva caja',
        description: 'Crea una nueva caja con la información proporcionada'
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Caja creada exitosamente',
        type: CajaResponseDto
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Datos inválidos'
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'El trabajador ya tiene una caja abierta o número de caja duplicado'
    })
    create(@Body() createCajaDto: CreateCajaDto): Promise<BaseResponseDto<CajaResponseDto>> {
        return this.cajaService.create(createCajaDto);
    }

    @Post('abrir/:idTrabajador')
    @ApiOperation({
        summary: 'Abrir una nueva caja para un trabajador',
        description: 'Abre una nueva caja de trabajo para el trabajador especificado'
    })
    @ApiParam({
        name: 'idTrabajador',
        description: 'ID del trabajador que manejará la caja',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Caja abierta exitosamente',
        type: CajaResponseDto
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'El trabajador ya tiene una caja abierta'
    })
    abrirCaja(
        @Param('idTrabajador') idTrabajador: string,
        @Body() aperturaCajaDto: AperturaCajaDto,
    ): Promise<BaseResponseDto<CajaResponseDto>> {
        return this.cajaService.abrirCaja(idTrabajador, aperturaCajaDto);
    }

    @Post(':id/cerrar')
    @ApiOperation({
        summary: 'Cerrar una caja específica',
        description: 'Cierra la caja especificada realizando las validaciones correspondientes'
    })
    @ApiParam({
        name: 'id',
        description: 'ID de la caja a cerrar',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Caja cerrada exitosamente',
        type: CajaResponseDto
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'La caja ya está cerrada o diferencia excede el límite'
    })
    cerrarCaja(
        @Param('id') id: string,
        @Body() cierreCajaDto: CierreCajaDto,
    ): Promise<BaseResponseDto<CajaResponseDto>> {
        return this.cajaService.cerrarCaja(id, cierreCajaDto);
    }

    @Get()
    @ApiOperation({
        summary: 'Obtener todas las cajas',
        description: 'Retorna una lista de todas las cajas registradas'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Lista de cajas obtenida exitosamente',
        type: [CajaResponseDto]
    })
    findAll(): Promise<BaseResponseDto<CajaResponseDto[]>> {
        return this.cajaService.findAll();
    }

    @Get('abiertas')
    @ApiOperation({
        summary: 'Obtener cajas abiertas',
        description: 'Retorna una lista de todas las cajas que están actualmente abiertas'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Lista de cajas abiertas obtenida exitosamente',
        type: [CajaResponseDto]
    })
    findCajasAbiertas(): Promise<BaseResponseDto<CajaResponseDto[]>> {
        return this.cajaService.findCajasAbiertas();
    }

    @Get('activa/:idTrabajador')
    @ApiOperation({
        summary: 'Obtener caja activa de un trabajador',
        description: 'Retorna la caja actualmente abierta del trabajador especificado'
    })
    @ApiParam({
        name: 'idTrabajador',
        description: 'ID del trabajador',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Caja activa del trabajador obtenida exitosamente',
        type: CajaResponseDto
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'No se encontró una caja activa para este trabajador'
    })
    obtenerCajaActiva(@Param('idTrabajador') idTrabajador: string): Promise<BaseResponseDto<CajaResponseDto>> {
        return this.cajaService.obtenerCajaActiva(idTrabajador);
    }

    @Get('trabajador/:idTrabajador')
    @ApiOperation({
        summary: 'Obtener cajas de un trabajador',
        description: 'Retorna todas las cajas asociadas a un trabajador específico'
    })
    @ApiParam({
        name: 'idTrabajador',
        description: 'ID del trabajador',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Cajas del trabajador obtenidas exitosamente',
        type: [CajaResponseDto]
    })
    findByTrabajador(@Param('idTrabajador') idTrabajador: string): Promise<BaseResponseDto<CajaResponseDto[]>> {
        return this.cajaService.findByTrabajador(idTrabajador);
    }

    @Get('fecha')
    @ApiOperation({
        summary: 'Obtener cajas por fecha',
        description: 'Retorna todas las cajas abiertas en una fecha específica'
    })
    @ApiQuery({
        name: 'fecha',
        description: 'Fecha en formato YYYY-MM-DD',
        example: '2025-09-26'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Cajas de la fecha obtenidas exitosamente',
        type: [CajaResponseDto]
    })
    findByFecha(@Query('fecha') fecha: string): Promise<BaseResponseDto<CajaResponseDto[]>> {
        return this.cajaService.findByFecha(fecha);
    }

    @Get(':id/validar-cierre')
    @ApiOperation({
        summary: 'Validar cierre de caja',
        description: 'Valida si el cierre de caja es correcto comparando el monto real con el calculado'
    })
    @ApiParam({
        name: 'id',
        description: 'ID de la caja',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiQuery({
        name: 'montoReal',
        description: 'Monto real contado',
        example: '750.50'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Validación realizada exitosamente'
    })
    validarCierre(
        @Param('id') id: string,
        @Query('montoReal') montoReal: number,
    ): Promise<BaseResponseDto<any>> {
        return this.cajaService.validarCierre(id, montoReal);
    }

    @Get(':id/totales')
    @ApiOperation({
        summary: 'Calcular totales de movimientos',
        description: 'Calcula los totales de ingresos, egresos y ajustes de una caja'
    })
    @ApiParam({
        name: 'id',
        description: 'ID de la caja',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Totales calculados exitosamente'
    })
    calcularTotalMovimientos(@Param('id') id: string): Promise<BaseResponseDto<any>> {
        return this.cajaService.calcularTotalMovimientos(id);
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Obtener una caja por ID',
        description: 'Retorna la información detallada de una caja específica'
    })
    @ApiParam({
        name: 'id',
        description: 'ID único de la caja',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Caja obtenida exitosamente',
        type: CajaResponseDto
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Caja no encontrada'
    })
    findOne(@Param('id') id: string): Promise<BaseResponseDto<CajaResponseDto>> {
        return this.cajaService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({
        summary: 'Actualizar una caja',
        description: 'Actualiza la información de una caja existente'
    })
    @ApiParam({
        name: 'id',
        description: 'ID único de la caja',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Caja actualizada exitosamente',
        type: CajaResponseDto
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Caja no encontrada'
    })
    update(
        @Param('id') id: string,
        @Body() updateCajaDto: UpdateCajaDto,
    ): Promise<BaseResponseDto<CajaResponseDto>> {
        return this.cajaService.update(id, updateCajaDto);
    }

    @Delete(':id')
    @ApiOperation({
        summary: 'Eliminar una caja',
        description: 'Elimina una caja del sistema (solo si no tiene movimientos y está cerrada)'
    })
    @ApiParam({
        name: 'id',
        description: 'ID único de la caja',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Caja eliminada exitosamente'
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Caja no encontrada'
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'No se puede eliminar la caja porque tiene movimientos asociados o está abierta'
    })
    remove(@Param('id') id: string): Promise<BaseResponseDto<void>> {
        return this.cajaService.remove(id);
    }
}

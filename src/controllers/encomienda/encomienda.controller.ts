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
import { EncomiendaService } from 'src/services/implementations/encomienda/encomienda.service';
import { CreateEncomiendaDto, UpdateEncomiendaDto, EncomiendaResponseDto } from 'src/dtos/encomienda';
import { BaseResponseDto } from 'src/dtos/baseResponse/baseResponse.dto';
import { EstadoEncomienda } from 'src/Enums/encomienda.enum';

@ApiTags('Encomiendas')
@Controller('encomienda')
export class EncomiendaController {
    constructor(private readonly encomiendaService: EncomiendaService) { }

    @Post()
    @ApiOperation({
        summary: 'Crear una nueva encomienda',
        description: 'Registra una nueva encomienda con validación de propiedad y trabajador activo'
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Encomienda creada exitosamente',
        type: EncomiendaResponseDto
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Datos inválidos, propiedad no encontrada o trabajador inactivo'
    })
    create(@Body() createEncomiendaDto: CreateEncomiendaDto): Promise<BaseResponseDto<EncomiendaResponseDto>> {
        return this.encomiendaService.create(createEncomiendaDto);
    }

    @Get()
    @ApiOperation({
        summary: 'Obtener todas las encomiendas',
        description: 'Retorna lista completa de encomiendas ordenadas por fecha de llegada'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Encomiendas obtenidas exitosamente',
        type: [EncomiendaResponseDto]
    })
    findAll(): Promise<BaseResponseDto<EncomiendaResponseDto[]>> {
        return this.encomiendaService.findAll();
    }

    @Get('pendientes')
    @ApiOperation({
        summary: 'Obtener encomiendas pendientes',
        description: 'Retorna solo las encomiendas con estado PENDIENTE'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Encomiendas pendientes obtenidas exitosamente',
        type: [EncomiendaResponseDto]
    })
    obtenerPendientes(): Promise<BaseResponseDto<EncomiendaResponseDto[]>> {
        return this.encomiendaService.obtenerEncomiendasPendientes();
    }

    @Get('estado/:estado')
    @ApiOperation({
        summary: 'Obtener encomiendas por estado',
        description: 'Filtra encomiendas por su estado actual'
    })
    @ApiParam({
        name: 'estado',
        description: 'Estado de la encomienda',
        enum: EstadoEncomienda,
        example: 'PENDIENTE'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Encomiendas por estado obtenidas exitosamente',
        type: [EncomiendaResponseDto]
    })
    findByEstado(@Param('estado') estado: EstadoEncomienda): Promise<BaseResponseDto<EncomiendaResponseDto[]>> {
        return this.encomiendaService.findByEstado(estado);
    }

    @Get('propiedad/:idPropiedad')
    @ApiOperation({
        summary: 'Obtener encomiendas por propiedad',
        description: 'Retorna todas las encomiendas dirigidas a una propiedad específica'
    })
    @ApiParam({
        name: 'idPropiedad',
        description: 'ID de la propiedad destinataria',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Encomiendas por propiedad obtenidas exitosamente',
        type: [EncomiendaResponseDto]
    })
    findByPropiedad(@Param('idPropiedad') idPropiedad: string): Promise<BaseResponseDto<EncomiendaResponseDto[]>> {
        return this.encomiendaService.findByPropiedad(idPropiedad);
    }

    @Get('trabajador/:idTrabajador')
    @ApiOperation({
        summary: 'Obtener encomiendas por trabajador',
        description: 'Retorna todas las encomiendas recibidas por un trabajador específico'
    })
    @ApiParam({
        name: 'idTrabajador',
        description: 'ID del trabajador que recibe',
        example: '123e4567-e89b-12d3-a456-426614174001'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Encomiendas por trabajador obtenidas exitosamente',
        type: [EncomiendaResponseDto]
    })
    findByTrabajador(@Param('idTrabajador') idTrabajador: string): Promise<BaseResponseDto<EncomiendaResponseDto[]>> {
        return this.encomiendaService.findByTrabajador(idTrabajador);
    }

    @Get('codigo/:codigoSeguimiento')
    @ApiOperation({
        summary: 'Buscar encomienda por código de seguimiento',
        description: 'Encuentra una encomienda específica usando su código de seguimiento'
    })
    @ApiParam({
        name: 'codigoSeguimiento',
        description: 'Código de seguimiento de la encomienda',
        example: 'ENC-2024-001'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Encomienda encontrada por código',
        type: EncomiendaResponseDto
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Encomienda no encontrada'
    })
    findByCodigo(@Param('codigoSeguimiento') codigoSeguimiento: string): Promise<BaseResponseDto<EncomiendaResponseDto>> {
        return this.encomiendaService.findByCodigo(codigoSeguimiento);
    }

    @Get('buscar-remitente')
    @ApiOperation({
        summary: 'Buscar encomiendas por remitente',
        description: 'Busca encomiendas que contengan el texto especificado en el nombre del remitente'
    })
    @ApiQuery({
        name: 'remitente',
        description: 'Nombre del remitente a buscar',
        example: 'Juan'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Encomiendas encontradas por remitente',
        type: [EncomiendaResponseDto]
    })
    findByRemitente(@Query('remitente') remitente: string): Promise<BaseResponseDto<EncomiendaResponseDto[]>> {
        return this.encomiendaService.findByRemitente(remitente);
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Obtener una encomienda por ID',
        description: 'Retorna información detallada de una encomienda específica'
    })
    @ApiParam({
        name: 'id',
        description: 'ID único de la encomienda',
        example: '123e4567-e89b-12d3-a456-426614174002'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Encomienda obtenida exitosamente',
        type: EncomiendaResponseDto
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Encomienda no encontrada'
    })
    findOne(@Param('id') id: string): Promise<BaseResponseDto<EncomiendaResponseDto>> {
        return this.encomiendaService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({
        summary: 'Actualizar una encomienda',
        description: 'Actualiza la información de una encomienda existente'
    })
    @ApiParam({
        name: 'id',
        description: 'ID único de la encomienda',
        example: '123e4567-e89b-12d3-a456-426614174002'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Encomienda actualizada exitosamente',
        type: EncomiendaResponseDto
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Encomienda no encontrada'
    })
    update(
        @Param('id') id: string,
        @Body() updateEncomiendaDto: UpdateEncomiendaDto,
    ): Promise<BaseResponseDto<EncomiendaResponseDto>> {
        return this.encomiendaService.update(id, updateEncomiendaDto);
    }

    @Patch(':id/entregar')
    @ApiOperation({
        summary: 'Marcar encomienda como entregada',
        description: 'Cambia el estado a ENTREGADA y establece la fecha de entrega automáticamente'
    })
    @ApiParam({
        name: 'id',
        description: 'ID único de la encomienda',
        example: '123e4567-e89b-12d3-a456-426614174002'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Encomienda marcada como entregada exitosamente',
        type: EncomiendaResponseDto
    })
    marcarComoEntregada(@Param('id') id: string): Promise<BaseResponseDto<EncomiendaResponseDto>> {
        return this.encomiendaService.marcarComoEntregada(id);
    }

    @Delete(':id')
    @ApiOperation({
        summary: 'Eliminar una encomienda',
        description: 'Elimina una encomienda del sistema'
    })
    @ApiParam({
        name: 'id',
        description: 'ID único de la encomienda',
        example: '123e4567-e89b-12d3-a456-426614174002'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Encomienda eliminada exitosamente'
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Encomienda no encontrada'
    })
    remove(@Param('id') id: string): Promise<BaseResponseDto<void>> {
        return this.encomiendaService.remove(id);
    }
}

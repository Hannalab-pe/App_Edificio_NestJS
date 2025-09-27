import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    HttpStatus,
    Patch,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiQuery,
    ApiBody,
} from '@nestjs/swagger';
import { MantenimientoService } from '../../services/implementations/mantenimiento/mantenimiento.service';
import { CreateMantenimientoDto } from '../../dtos/mantenimiento/create-mantenimiento.dto';
import { UpdateMantenimientoDto } from '../../dtos/mantenimiento/update-mantenimiento.dto';
import { MantenimientoResponseDto } from '../../dtos/mantenimiento/mantenimiento-response.dto';
import { BaseResponseDto } from '../../dtos/baseResponse/baseResponse.dto';

@ApiTags('Mantenimiento')
@Controller('mantenimiento')
export class MantenimientoController {
    constructor(
        private readonly mantenimientoService: MantenimientoService,
    ) { }

    @Post()
    @ApiOperation({
        summary: 'Programar un nuevo mantenimiento',
        description:
            'Programa un mantenimiento para un área común específica asignándolo a un contacto/proveedor',
    })
    @ApiBody({
        type: CreateMantenimientoDto,
        description: 'Datos del mantenimiento a programar',
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Mantenimiento programado exitosamente',
        type: MantenimientoResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Datos inválidos o conflicto de horarios',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Área común o contacto no encontrado',
    })
    async create(
        @Body() createMantenimientoDto: CreateMantenimientoDto,
    ): Promise<BaseResponseDto<MantenimientoResponseDto>> {
        return this.mantenimientoService.create(createMantenimientoDto);
    }

    @Get()
    @ApiOperation({
        summary: 'Obtener todos los mantenimientos',
        description:
            'Retorna lista completa de mantenimientos ordenados por fecha de inicio',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Mantenimientos obtenidos exitosamente',
        type: [MantenimientoResponseDto],
    })
    async findAll(): Promise<BaseResponseDto<MantenimientoResponseDto[]>> {
        return this.mantenimientoService.findAll();
    }

    @Get('activos')
    @ApiOperation({
        summary: 'Obtener mantenimientos activos',
        description: 'Retorna mantenimientos que están actualmente en progreso',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Mantenimientos activos obtenidos exitosamente',
        type: [MantenimientoResponseDto],
    })
    async findMantenimientosActivos(): Promise<BaseResponseDto<MantenimientoResponseDto[]>> {
        return this.mantenimientoService.findMantenimientosActivos();
    }

    @Get('programados')
    @ApiOperation({
        summary: 'Obtener mantenimientos programados',
        description: 'Retorna mantenimientos que están programados para ejecutarse',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Mantenimientos programados obtenidos exitosamente',
        type: [MantenimientoResponseDto],
    })
    async findMantenimientosProgramados(): Promise<BaseResponseDto<MantenimientoResponseDto[]>> {
        return this.mantenimientoService.findMantenimientosProgramados();
    }

    @Get('estado/:estado')
    @ApiOperation({
        summary: 'Obtener mantenimientos por estado',
        description: 'Filtra mantenimientos por su estado actual',
    })
    @ApiParam({
        name: 'estado',
        description: 'Estado del mantenimiento',
        example: 'En Progreso',
        enum: ['Programado', 'En Progreso', 'Completado', 'Cancelado', 'Pendiente'],
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Mantenimientos filtrados por estado',
        type: [MantenimientoResponseDto],
    })
    async findByEstado(
        @Param('estado') estado: string,
    ): Promise<BaseResponseDto<MantenimientoResponseDto[]>> {
        return this.mantenimientoService.findByEstado(estado);
    }

    @Get('area-comun/:areaComunId')
    @ApiOperation({
        summary: 'Obtener mantenimientos por área común',
        description: 'Filtra mantenimientos por área común específica (ej: Gimnasio)',
    })
    @ApiParam({
        name: 'areaComunId',
        description: 'ID del área común',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Mantenimientos del área común obtenidos exitosamente',
        type: [MantenimientoResponseDto],
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Área común no encontrada',
    })
    async findByAreaComun(
        @Param('areaComunId') areaComunId: string,
    ): Promise<BaseResponseDto<MantenimientoResponseDto[]>> {
        return this.mantenimientoService.findByAreaComun(areaComunId);
    }

    @Get('contacto/:contactoId')
    @ApiOperation({
        summary: 'Obtener mantenimientos por contacto/proveedor',
        description: 'Filtra mantenimientos asignados a un contacto específico',
    })
    @ApiParam({
        name: 'contactoId',
        description: 'ID del contacto/proveedor',
        example: '123e4567-e89b-12d3-a456-426614174001',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Mantenimientos del contacto obtenidos exitosamente',
        type: [MantenimientoResponseDto],
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Contacto no encontrado',
    })
    async findByContacto(
        @Param('contactoId') contactoId: string,
    ): Promise<BaseResponseDto<MantenimientoResponseDto[]>> {
        return this.mantenimientoService.findByContacto(contactoId);
    }

    @Get('fecha-rango')
    @ApiOperation({
        summary: 'Obtener mantenimientos por rango de fechas',
        description: 'Filtra mantenimientos dentro de un rango de fechas específico',
    })
    @ApiQuery({
        name: 'fechaInicio',
        description: 'Fecha de inicio del rango (ISO string)',
        example: '2024-09-01T00:00:00.000Z',
    })
    @ApiQuery({
        name: 'fechaFin',
        description: 'Fecha de fin del rango (ISO string)',
        example: '2024-09-30T23:59:59.000Z',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Mantenimientos en el rango de fechas',
        type: [MantenimientoResponseDto],
    })
    async findByFechaRange(
        @Query('fechaInicio') fechaInicio: string,
        @Query('fechaFin') fechaFin: string,
    ): Promise<BaseResponseDto<MantenimientoResponseDto[]>> {
        return this.mantenimientoService.findByFechaRange(fechaInicio, fechaFin);
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Obtener un mantenimiento por ID',
        description: 'Retorna información detallada de un mantenimiento específico',
    })
    @ApiParam({
        name: 'id',
        description: 'ID único del mantenimiento',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Mantenimiento obtenido exitosamente',
        type: MantenimientoResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Mantenimiento no encontrado',
    })
    async findOne(
        @Param('id') id: string,
    ): Promise<BaseResponseDto<MantenimientoResponseDto>> {
        return this.mantenimientoService.findOne(id);
    }

    @Put(':id')
    @ApiOperation({
        summary: 'Actualizar un mantenimiento',
        description:
            'Actualiza los datos de un mantenimiento incluyendo fechas, área común o contacto asignado',
    })
    @ApiParam({
        name: 'id',
        description: 'ID único del mantenimiento',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @ApiBody({
        type: UpdateMantenimientoDto,
        description: 'Datos del mantenimiento a actualizar',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Mantenimiento actualizado exitosamente',
        type: MantenimientoResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Mantenimiento no encontrado',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Datos inválidos',
    })
    async update(
        @Param('id') id: string,
        @Body() updateMantenimientoDto: UpdateMantenimientoDto,
    ): Promise<BaseResponseDto<MantenimientoResponseDto>> {
        return this.mantenimientoService.update(id, updateMantenimientoDto);
    }

    @Patch(':id/estado')
    @ApiOperation({
        summary: 'Cambiar estado de un mantenimiento',
        description:
            'Permite cambiar rápidamente el estado de un mantenimiento (ej: de Programado a En Progreso)',
    })
    @ApiParam({
        name: 'id',
        description: 'ID único del mantenimiento',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                estado: {
                    type: 'string',
                    description: 'Nuevo estado del mantenimiento',
                    example: 'En Progreso',
                    enum: ['Programado', 'En Progreso', 'Completado', 'Cancelado', 'Pendiente'],
                },
            },
            required: ['estado'],
        },
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Estado del mantenimiento cambiado exitosamente',
        type: MantenimientoResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Mantenimiento no encontrado',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Estado no válido',
    })
    async cambiarEstado(
        @Param('id') id: string,
        @Body() cambiarEstadoDto: { estado: string },
    ): Promise<BaseResponseDto<MantenimientoResponseDto>> {
        return this.mantenimientoService.cambiarEstado(id, cambiarEstadoDto.estado);
    }

    @Delete(':id')
    @ApiOperation({
        summary: 'Eliminar un mantenimiento',
        description:
            'Elimina un mantenimiento del sistema. No se pueden eliminar mantenimientos en progreso.',
    })
    @ApiParam({
        name: 'id',
        description: 'ID único del mantenimiento',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Mantenimiento eliminado exitosamente',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Mantenimiento no encontrado',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'No se puede eliminar un mantenimiento en progreso',
    })
    async remove(@Param('id') id: string): Promise<BaseResponseDto<void>> {
        return this.mantenimientoService.remove(id);
    }
}

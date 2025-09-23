import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import { CreateIncidenciaDto, UpdateIncidenciaDto } from '../../dtos';

@ApiTags('Incidencias')
@Controller('incidencia')
export class IncidenciaController {

    @Get()
    @ApiOperation({
        summary: 'Obtener todas las incidencias',
        description: 'Retorna una lista de todas las incidencias reportadas en el edificio'
    })
    @ApiQuery({
        name: 'estado',
        required: false,
        description: 'Filtrar por estado de la incidencia',
        example: 'pendiente'
    })
    @ApiQuery({
        name: 'prioridad',
        required: false,
        description: 'Filtrar por prioridad',
        example: 'alta'
    })
    @ApiResponse({
        status: 200,
        description: 'Lista de incidencias obtenida exitosamente'
    })
    findAll(@Query('estado') estado?: string, @Query('prioridad') prioridad?: string) {
        return `Este endpoint retorna todas las incidencias${estado ? ` con estado: ${estado}` : ''}${prioridad ? ` y prioridad: ${prioridad}` : ''}`;
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Obtener una incidencia por ID',
        description: 'Retorna una incidencia específica basada en su ID'
    })
    @ApiParam({
        name: 'id',
        description: 'ID único de la incidencia',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiResponse({
        status: 200,
        description: 'Incidencia encontrada exitosamente'
    })
    @ApiResponse({
        status: 404,
        description: 'Incidencia no encontrada'
    })
    findOne(@Param('id') id: string) {
        return `Este endpoint retorna la incidencia con ID: ${id}`;
    }

    @Get('usuario/:usuarioId')
    @ApiOperation({
        summary: 'Obtener incidencias por usuario',
        description: 'Retorna todas las incidencias reportadas por un usuario específico'
    })
    @ApiParam({
        name: 'usuarioId',
        description: 'ID del usuario que reportó la incidencia',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiResponse({
        status: 200,
        description: 'Incidencias del usuario obtenidas exitosamente'
    })
    findByUsuario(@Param('usuarioId') usuarioId: string) {
        return `Este endpoint retorna las incidencias del usuario con ID: ${usuarioId}`;
    }

    @Post()
    @ApiOperation({
        summary: 'Crear una nueva incidencia',
        description: 'Reporta una nueva incidencia en el sistema'
    })
    @ApiBody({
        type: CreateIncidenciaDto,
        description: 'Datos de la incidencia a reportar'
    })
    @ApiResponse({
        status: 201,
        description: 'Incidencia creada exitosamente'
    })
    @ApiResponse({
        status: 400,
        description: 'Datos de entrada inválidos'
    })
    create(@Body() createIncidenciaDto: CreateIncidenciaDto) {
        return 'Este endpoint crea una nueva incidencia';
    }

    @Put(':id')
    @ApiOperation({
        summary: 'Actualizar una incidencia',
        description: 'Actualiza el estado o datos de una incidencia existente'
    })
    @ApiParam({
        name: 'id',
        description: 'ID único de la incidencia a actualizar',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiBody({
        type: UpdateIncidenciaDto,
        description: 'Datos de la incidencia a actualizar'
    })
    @ApiResponse({
        status: 200,
        description: 'Incidencia actualizada exitosamente'
    })
    @ApiResponse({
        status: 404,
        description: 'Incidencia no encontrada'
    })
    update(@Param('id') id: string, @Body() updateIncidenciaDto: UpdateIncidenciaDto) {
        return `Este endpoint actualiza la incidencia con ID: ${id}`;
    }

    @Put(':id/resolver')
    @ApiOperation({
        summary: 'Resolver una incidencia',
        description: 'Marca una incidencia como resuelta'
    })
    @ApiParam({
        name: 'id',
        description: 'ID único de la incidencia a resolver',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiResponse({
        status: 200,
        description: 'Incidencia resuelta exitosamente'
    })
    @ApiResponse({
        status: 404,
        description: 'Incidencia no encontrada'
    })
    resolve(@Param('id') id: string) {
        return `Este endpoint resuelve la incidencia con ID: ${id}`;
    }

    @Delete(':id')
    @ApiOperation({
        summary: 'Eliminar una incidencia',
        description: 'Elimina una incidencia del sistema'
    })
    @ApiParam({
        name: 'id',
        description: 'ID único de la incidencia a eliminar',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiResponse({
        status: 200,
        description: 'Incidencia eliminada exitosamente'
    })
    @ApiResponse({
        status: 404,
        description: 'Incidencia no encontrada'
    })
    remove(@Param('id') id: string) {
        return `Este endpoint elimina la incidencia con ID: ${id}`;
    }
}

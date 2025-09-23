import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import { CreatePropiedadDto, UpdatePropiedadDto } from '../../dtos';

@ApiTags('Propiedades')
@Controller('propiedad')
export class PropiedadController {

    @Get()
    @ApiOperation({
        summary: 'Obtener todas las propiedades',
        description: 'Retorna una lista de todas las propiedades del edificio'
    })
    @ApiQuery({
        name: 'tipo',
        required: false,
        description: 'Filtrar por tipo de propiedad',
        example: 'apartamento'
    })
    @ApiResponse({
        status: 200,
        description: 'Lista de propiedades obtenida exitosamente'
    })
    findAll(@Query('tipo') tipo?: string) {
        return `Este endpoint retorna todas las propiedades${tipo ? ` de tipo: ${tipo}` : ''}`;
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Obtener una propiedad por ID',
        description: 'Retorna una propiedad específica basada en su ID'
    })
    @ApiParam({
        name: 'id',
        description: 'ID único de la propiedad',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiResponse({
        status: 200,
        description: 'Propiedad encontrada exitosamente'
    })
    @ApiResponse({
        status: 404,
        description: 'Propiedad no encontrada'
    })
    findOne(@Param('id') id: string) {
        return `Este endpoint retorna la propiedad con ID: ${id}`;
    }

    @Get('propietario/:propietarioId')
    @ApiOperation({
        summary: 'Obtener propiedades por propietario',
        description: 'Retorna todas las propiedades de un propietario específico'
    })
    @ApiParam({
        name: 'propietarioId',
        description: 'ID del propietario',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiResponse({
        status: 200,
        description: 'Propiedades del propietario obtenidas exitosamente'
    })
    findByPropietario(@Param('propietarioId') propietarioId: string) {
        return `Este endpoint retorna las propiedades del propietario con ID: ${propietarioId}`;
    }

    @Post()
    @ApiOperation({
        summary: 'Crear una nueva propiedad',
        description: 'Registra una nueva propiedad en el sistema'
    })
    @ApiBody({
        type: CreatePropiedadDto,
        description: 'Datos de la propiedad a crear'
    })
    @ApiResponse({
        status: 201,
        description: 'Propiedad creada exitosamente'
    })
    @ApiResponse({
        status: 400,
        description: 'Datos de entrada inválidos'
    })
    create(@Body() createPropiedadDto: CreatePropiedadDto) {
        return 'Este endpoint crea una nueva propiedad';
    }

    @Put(':id')
    @ApiOperation({
        summary: 'Actualizar una propiedad',
        description: 'Actualiza los datos de una propiedad existente'
    })
    @ApiParam({
        name: 'id',
        description: 'ID único de la propiedad a actualizar',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiBody({
        type: UpdatePropiedadDto,
        description: 'Datos de la propiedad a actualizar'
    })
    @ApiResponse({
        status: 200,
        description: 'Propiedad actualizada exitosamente'
    })
    @ApiResponse({
        status: 404,
        description: 'Propiedad no encontrada'
    })
    update(@Param('id') id: string, @Body() updatePropiedadDto: UpdatePropiedadDto) {
        return `Este endpoint actualiza la propiedad con ID: ${id}`;
    }

    @Delete(':id')
    @ApiOperation({
        summary: 'Eliminar una propiedad',
        description: 'Elimina una propiedad del sistema'
    })
    @ApiParam({
        name: 'id',
        description: 'ID único de la propiedad a eliminar',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiResponse({
        status: 200,
        description: 'Propiedad eliminada exitosamente'
    })
    @ApiResponse({
        status: 404,
        description: 'Propiedad no encontrada'
    })
    remove(@Param('id') id: string) {
        return `Este endpoint elimina la propiedad con ID: ${id}`;
    }
}

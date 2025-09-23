import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateUsuarioDto, UpdateUsuarioDto } from '../../dtos';

@ApiTags('Usuarios')
@Controller('usuario')
export class UsuarioController {

    @Get()
    @ApiOperation({
        summary: 'Obtener todos los usuarios',
        description: 'Retorna una lista de todos los usuarios del sistema'
    })
    @ApiResponse({
        status: 200,
        description: 'Lista de usuarios obtenida exitosamente'
    })
    findAll() {
        return 'Este endpoint retorna todos los usuarios';
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Obtener un usuario por ID',
        description: 'Retorna un usuario específico basado en su ID'
    })
    @ApiParam({
        name: 'id',
        description: 'ID único del usuario',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiResponse({
        status: 200,
        description: 'Usuario encontrado exitosamente'
    })
    @ApiResponse({
        status: 404,
        description: 'Usuario no encontrado'
    })
    findOne(@Param('id') id: string) {
        return `Este endpoint retorna el usuario con ID: ${id}`;
    }

    @Post()
    @ApiOperation({
        summary: 'Crear un nuevo usuario',
        description: 'Crea un nuevo usuario en el sistema'
    })
    @ApiBody({
        type: CreateUsuarioDto,
        description: 'Datos del usuario a crear'
    })
    @ApiResponse({
        status: 201,
        description: 'Usuario creado exitosamente'
    })
    @ApiResponse({
        status: 400,
        description: 'Datos de entrada inválidos'
    })
    create(@Body() createUsuarioDto: CreateUsuarioDto) {
        return 'Este endpoint crea un nuevo usuario';
    }

    @Put(':id')
    @ApiOperation({
        summary: 'Actualizar un usuario',
        description: 'Actualiza un usuario existente'
    })
    @ApiParam({
        name: 'id',
        description: 'ID único del usuario a actualizar',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiBody({
        type: UpdateUsuarioDto,
        description: 'Datos del usuario a actualizar'
    })
    @ApiResponse({
        status: 200,
        description: 'Usuario actualizado exitosamente'
    })
    @ApiResponse({
        status: 404,
        description: 'Usuario no encontrado'
    })
    update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
        return `Este endpoint actualiza el usuario con ID: ${id}`;
    }

    @Delete(':id')
    @ApiOperation({
        summary: 'Eliminar un usuario',
        description: 'Elimina un usuario del sistema'
    })
    @ApiParam({
        name: 'id',
        description: 'ID único del usuario a eliminar',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiResponse({
        status: 200,
        description: 'Usuario eliminado exitosamente'
    })
    @ApiResponse({
        status: 404,
        description: 'Usuario no encontrado'
    })
    remove(@Param('id') id: string) {
        return `Este endpoint elimina el usuario con ID: ${id}`;
    }
}

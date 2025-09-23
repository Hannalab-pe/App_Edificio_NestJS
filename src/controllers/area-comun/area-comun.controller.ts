import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Res } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CreateAreaComunDto, UpdateAreaComunDto } from 'src/dtos';
import { AreaComunService } from 'src/services/implementations';

@ApiTags('Áreas Comunes')
@Controller('area-comun')
export class AreaComunController {

    constructor(private readonly areaComunService: AreaComunService) { }

    @Post()
    @ApiOperation({
        summary: 'Crear una nueva área común',
        description: 'Crea una nueva área común en el edificio'
    })
    @ApiResponse({
        status: 201,
        description: 'Área común creada exitosamente'
    })
    @ApiResponse({
        status: 400,
        description: 'Datos inválidos'
    })
    async create(@Body() createAreaComunDto: CreateAreaComunDto, @Res() res: Response) {
        try {
            const result = await this.areaComunService.createAreaComun(createAreaComunDto);

            if (result.success) {
                return res.status(HttpStatus.CREATED).json(result);
            } else {
                return res.status(HttpStatus.BAD_REQUEST).json(result);
            }
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error interno del servidor',
                data: null,
                error: error.message
            });
        }
    }

    @Get()
    @ApiOperation({
        summary: 'Obtener todas las áreas comunes',
        description: 'Retorna una lista de todas las áreas comunes del edificio'
    })
    @ApiResponse({
        status: 200,
        description: 'Lista de áreas comunes obtenida exitosamente'
    })
    async findAll(@Res() res: Response) {
        try {
            const result = await this.areaComunService.findAll();

            if (result.success) {
                return res.status(HttpStatus.OK).json(result);
            } else {
                return res.status(HttpStatus.BAD_REQUEST).json(result);
            }
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error interno del servidor',
                data: [],
                error: error.message
            });
        }
    }

    @Get('disponibles')
    @ApiOperation({
        summary: 'Obtener áreas comunes disponibles',
        description: 'Retorna una lista de todas las áreas comunes activas/disponibles'
    })
    @ApiResponse({
        status: 200,
        description: 'Lista de áreas comunes disponibles obtenida exitosamente'
    })
    async findAvailable(@Res() res: Response) {
        try {
            const result = await this.areaComunService.findAvailable();

            if (result.success) {
                return res.status(HttpStatus.OK).json(result);
            } else {
                return res.status(HttpStatus.BAD_REQUEST).json(result);
            }
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error interno del servidor',
                data: [],
                error: error.message
            });
        }
    }

    @Get('estado')
    @ApiOperation({
        summary: 'Obtener áreas comunes por estado',
        description: 'Retorna una lista de áreas comunes filtradas por su estado (activo/inactivo)'
    })
    @ApiQuery({
        name: 'estado',
        type: 'boolean',
        description: 'Estado del área común (true = activo, false = inactivo)',
        example: true
    })
    @ApiResponse({
        status: 200,
        description: 'Lista de áreas comunes por estado obtenida exitosamente'
    })
    async findByEstado(@Query('estado') estado: string, @Res() res: Response) {
        try {
            const estadoBoolean = estado === 'true';
            const result = await this.areaComunService.findByEstado(estadoBoolean);

            if (result.success) {
                return res.status(HttpStatus.OK).json(result);
            } else {
                return res.status(HttpStatus.BAD_REQUEST).json(result);
            }
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error interno del servidor',
                data: [],
                error: error.message
            });
        }
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Obtener un área común por ID',
        description: 'Retorna un área común específica por su ID'
    })
    @ApiParam({
        name: 'id',
        type: 'string',
        description: 'ID único del área común',
        example: 'uuid-example'
    })
    @ApiResponse({
        status: 200,
        description: 'Área común encontrada exitosamente'
    })
    @ApiResponse({
        status: 404,
        description: 'Área común no encontrada'
    })
    async findOne(@Param('id') id: string, @Res() res: Response) {
        try {
            const result = await this.areaComunService.findOne(id);

            if (result.success) {
                return res.status(HttpStatus.OK).json(result);
            } else {
                return res.status(HttpStatus.BAD_REQUEST).json(result);
            }
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error interno del servidor',
                data: null,
                error: error.message
            });
        }
    }

    @Put(':id')
    @ApiOperation({
        summary: 'Actualizar un área común',
        description: 'Actualiza los datos de un área común existente'
    })
    @ApiParam({
        name: 'id',
        type: 'string',
        description: 'ID único del área común',
        example: 'uuid-example'
    })
    @ApiResponse({
        status: 200,
        description: 'Área común actualizada exitosamente'
    })
    @ApiResponse({
        status: 404,
        description: 'Área común no encontrada'
    })
    async update(@Param('id') id: string, @Body() updateAreaComunDto: UpdateAreaComunDto, @Res() res: Response) {
        try {
            const result = await this.areaComunService.updateAreaComun(id, updateAreaComunDto);

            if (result.success) {
                return res.status(HttpStatus.OK).json(result);
            } else {
                return res.status(HttpStatus.BAD_REQUEST).json(result);
            }
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error interno del servidor',
                data: null,
                error: error.message
            });
        }
    }

    @Delete(':id')
    @ApiOperation({
        summary: 'Eliminar un área común (eliminación lógica)',
        description: 'Elimina lógicamente un área común marcándola como inactiva'
    })
    @ApiParam({
        name: 'id',
        type: 'string',
        description: 'ID único del área común',
        example: 'uuid-example'
    })
    @ApiResponse({
        status: 200,
        description: 'Área común eliminada exitosamente'
    })
    @ApiResponse({
        status: 404,
        description: 'Área común no encontrada'
    })
    async remove(@Param('id') id: string, @Res() res: Response) {
        try {
            const result = await this.areaComunService.eliminacionLogica(id);

            if (result.success) {
                return res.status(HttpStatus.OK).json(result);
            } else {
                return res.status(HttpStatus.BAD_REQUEST).json(result);
            }
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error interno del servidor',
                data: undefined,
                error: error.message
            });
        }
    }

}

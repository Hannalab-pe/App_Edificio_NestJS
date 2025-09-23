import { Controller, Get, Post, Put, Delete, Body, Param, Query, Res, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import { Response } from 'express';
import { CreatePropiedadDto, UpdatePropiedadDto } from '../../dtos';
import { PropiedadService } from '../../services/implementations/propiedad/propiedad.service';

@ApiTags('Propiedades')
@Controller('propiedad')
export class PropiedadController {
    constructor(private readonly propiedadService: PropiedadService) { }

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
        description: 'Error en los datos de entrada'
    })
    async create(@Body() createPropiedadDto: CreatePropiedadDto, @Res() res: Response) {
        try {
            const result = await this.propiedadService.create(createPropiedadDto);

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
        summary: 'Obtener todas las propiedades',
        description: 'Retorna una lista de todas las propiedades activas del edificio'
    })
    @ApiResponse({
        status: 200,
        description: 'Lista de propiedades obtenida exitosamente'
    })
    async findAll(@Res() res: Response) {
        try {
            const result = await this.propiedadService.findAll();

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
    async findOne(@Param('id') id: string, @Res() res: Response) {
        try {
            const result = await this.propiedadService.findOne(id);

            if (result.success) {
                return res.status(HttpStatus.OK).json(result);
            } else {
                return res.status(HttpStatus.NOT_FOUND).json(result);
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
    async update(@Param('id') id: string, @Body() updatePropiedadDto: UpdatePropiedadDto, @Res() res: Response) {
        try {
            const result = await this.propiedadService.update(id, updatePropiedadDto);

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
        summary: 'Eliminar una propiedad',
        description: 'Realiza una eliminación lógica de la propiedad'
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
    async remove(@Param('id') id: string, @Res() res: Response) {
        try {
            const result = await this.propiedadService.remove(id);

            if (result.success) {
                return res.status(HttpStatus.OK).json(result);
            } else {
                return res.status(HttpStatus.NOT_FOUND).json(result);
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

    @Get('tipo/:tipoPropiedad')
    @ApiOperation({
        summary: 'Obtener propiedades por tipo',
        description: 'Retorna todas las propiedades de un tipo específico'
    })
    @ApiParam({
        name: 'tipoPropiedad',
        description: 'Tipo de propiedad',
        example: 'Departamento'
    })
    @ApiResponse({
        status: 200,
        description: 'Lista de propiedades por tipo obtenida exitosamente'
    })
    async findByTipoPropiedad(@Param('tipoPropiedad') tipoPropiedad: string, @Res() res: Response) {
        try {
            const result = await this.propiedadService.findByTipoPropiedad(tipoPropiedad);

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

    @Get('piso/:piso')
    @ApiOperation({
        summary: 'Obtener propiedades por piso',
        description: 'Retorna todas las propiedades de un piso específico'
    })
    @ApiParam({
        name: 'piso',
        type: 'number',
        description: 'Número del piso',
        example: 5
    })
    @ApiResponse({
        status: 200,
        description: 'Lista de propiedades por piso obtenida exitosamente'
    })
    async findByPiso(@Param('piso') piso: number, @Res() res: Response) {
        try {
            const result = await this.propiedadService.findByPiso(Number(piso));

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

    @Get('estado-ocupacion/:estadoOcupacion')
    @ApiOperation({
        summary: 'Obtener propiedades por estado de ocupación',
        description: 'Retorna todas las propiedades con un estado de ocupación específico'
    })
    @ApiParam({
        name: 'estadoOcupacion',
        description: 'Estado de ocupación',
        example: 'Ocupado'
    })
    @ApiResponse({
        status: 200,
        description: 'Lista de propiedades por estado de ocupación obtenida exitosamente'
    })
    async findByEstadoOcupacion(@Param('estadoOcupacion') estadoOcupacion: string, @Res() res: Response) {
        try {
            const result = await this.propiedadService.findByEstadoOcupacion(estadoOcupacion);

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

    @Get('numero/:numeroDepartamento')
    @ApiOperation({
        summary: 'Obtener propiedad por número de departamento',
        description: 'Retorna una propiedad específica basada en su número de departamento'
    })
    @ApiParam({
        name: 'numeroDepartamento',
        description: 'Número del departamento',
        example: 'A-101'
    })
    @ApiResponse({
        status: 200,
        description: 'Propiedad encontrada exitosamente'
    })
    @ApiResponse({
        status: 404,
        description: 'Propiedad no encontrada'
    })
    async findByNumeroDepartamento(@Param('numeroDepartamento') numeroDepartamento: string, @Res() res: Response) {
        try {
            const result = await this.propiedadService.findByNumeroDepartamento(numeroDepartamento);

            if (result.success) {
                return res.status(HttpStatus.OK).json(result);
            } else {
                return res.status(HttpStatus.NOT_FOUND).json(result);
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
}

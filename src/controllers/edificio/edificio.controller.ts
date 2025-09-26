import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    Post,
    Put,
    Query,
    Res,
} from '@nestjs/common';
import {
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { CreateEdificioDto, UpdateEdificioDto } from 'src/dtos';
import { EdificioService } from 'src/services/implementations';

@ApiTags('Edificios')
@Controller('edificio')
export class EdificioController {
    constructor(private readonly edificioService: EdificioService) { }

    @Post()
    @ApiOperation({
        summary: 'Crear un nuevo edificio',
        description: 'Crea un nuevo edificio en el sistema',
    })
    @ApiResponse({
        status: 201,
        description: 'Edificio creado exitosamente',
    })
    @ApiResponse({
        status: 400,
        description: 'Datos inválidos',
    })
    async create(
        @Body() createEdificioDto: CreateEdificioDto,
        @Res() res: Response,
    ) {
        try {
            const result = await this.edificioService.create(createEdificioDto);

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
                error: error.message,
            });
        }
    }

    @Get()
    @ApiOperation({
        summary: 'Obtener todos los edificios',
        description: 'Retorna una lista de todos los edificios del sistema',
    })
    @ApiResponse({
        status: 200,
        description: 'Lista de edificios obtenida exitosamente',
    })
    async findAll(@Res() res: Response) {
        try {
            const result = await this.edificioService.findAll();

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
                error: error.message,
            });
        }
    }

    @Get('activos')
    @ApiOperation({
        summary: 'Obtener edificios activos',
        description: 'Retorna una lista de todos los edificios activos del sistema',
    })
    @ApiResponse({
        status: 200,
        description: 'Lista de edificios activos obtenida exitosamente',
    })
    async findActivos(@Res() res: Response) {
        try {
            const result = await this.edificioService.findActivos();

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
                error: error.message,
            });
        }
    }

    @Get('nombre/:nombre')
    @ApiOperation({
        summary: 'Obtener edificio por nombre',
        description: 'Retorna un edificio específico por su nombre',
    })
    @ApiParam({
        name: 'nombre',
        type: 'string',
        description: 'Nombre del edificio',
        example: 'Torre San Martín',
    })
    @ApiResponse({
        status: 200,
        description: 'Edificio encontrado exitosamente',
    })
    @ApiResponse({
        status: 404,
        description: 'Edificio no encontrado',
    })
    async findByNombre(@Param('nombre') nombre: string, @Res() res: Response) {
        try {
            const result = await this.edificioService.findByNombre(nombre);

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
                error: error.message,
            });
        }
    }

    @Get('distrito')
    @ApiOperation({
        summary: 'Obtener edificios por distrito',
        description: 'Retorna una lista de edificios filtrados por distrito',
    })
    @ApiQuery({
        name: 'distrito',
        type: 'string',
        description: 'Distrito donde se ubican los edificios',
        example: 'Miraflores',
    })
    @ApiResponse({
        status: 200,
        description: 'Lista de edificios por distrito obtenida exitosamente',
    })
    async findByDistrito(@Query('distrito') distrito: string, @Res() res: Response) {
        try {
            const result = await this.edificioService.findByDistrito(distrito);

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
                error: error.message,
            });
        }
    }

    @Get('inmobiliaria/:idInmobiliaria')
    @ApiOperation({
        summary: 'Obtener edificios por inmobiliaria',
        description: 'Retorna una lista de edificios de una inmobiliaria específica',
    })
    @ApiParam({
        name: 'idInmobiliaria',
        type: 'string',
        description: 'ID de la inmobiliaria',
        example: 'uuid-inmobiliaria',
    })
    @ApiResponse({
        status: 200,
        description: 'Lista de edificios de la inmobiliaria obtenida exitosamente',
    })
    async findByInmobiliaria(
        @Param('idInmobiliaria') idInmobiliaria: string,
        @Res() res: Response,
    ) {
        try {
            const result = await this.edificioService.findByInmobiliaria(idInmobiliaria);

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
                error: error.message,
            });
        }
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Obtener un edificio por ID',
        description: 'Retorna un edificio específico por su ID',
    })
    @ApiParam({
        name: 'id',
        type: 'string',
        description: 'ID único del edificio',
        example: 'uuid-example',
    })
    @ApiResponse({
        status: 200,
        description: 'Edificio encontrado exitosamente',
    })
    @ApiResponse({
        status: 404,
        description: 'Edificio no encontrado',
    })
    async findOne(@Param('id') id: string, @Res() res: Response) {
        try {
            const result = await this.edificioService.findOne(id);

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
                error: error.message,
            });
        }
    }

    @Put(':id')
    @ApiOperation({
        summary: 'Actualizar un edificio',
        description: 'Actualiza los datos de un edificio existente',
    })
    @ApiParam({
        name: 'id',
        type: 'string',
        description: 'ID único del edificio',
        example: 'uuid-example',
    })
    @ApiResponse({
        status: 200,
        description: 'Edificio actualizado exitosamente',
    })
    @ApiResponse({
        status: 404,
        description: 'Edificio no encontrado',
    })
    async update(
        @Param('id') id: string,
        @Body() updateEdificioDto: UpdateEdificioDto,
        @Res() res: Response,
    ) {
        try {
            const result = await this.edificioService.update(id, updateEdificioDto);

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
                error: error.message,
            });
        }
    }

    @Delete(':id')
    @ApiOperation({
        summary: 'Eliminar un edificio (eliminación lógica)',
        description: 'Elimina lógicamente un edificio marcándolo como inactivo',
    })
    @ApiParam({
        name: 'id',
        type: 'string',
        description: 'ID único del edificio',
        example: 'uuid-example',
    })
    @ApiResponse({
        status: 200,
        description: 'Edificio eliminado exitosamente',
    })
    @ApiResponse({
        status: 404,
        description: 'Edificio no encontrado',
    })
    async remove(@Param('id') id: string, @Res() res: Response) {
        try {
            const result = await this.edificioService.remove(id);

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
                error: error.message,
            });
        }
    }
}
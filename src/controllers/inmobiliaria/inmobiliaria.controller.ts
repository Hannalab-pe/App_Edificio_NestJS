import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    Post,
    Put,
    Res,
} from '@nestjs/common';
import {
    ApiOperation,
    ApiParam,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { CreateInmobiliariaDto, UpdateInmobiliariaDto } from 'src/dtos';
import { InmobiliariaService } from 'src/services/implementations';

@ApiTags('Inmobiliarias')
@Controller('inmobiliaria')
export class InmobiliariaController {
    constructor(private readonly inmobiliariaService: InmobiliariaService) { }

    @Post()
    @ApiOperation({
        summary: 'Crear una nueva inmobiliaria',
        description: 'Crea una nueva inmobiliaria en el sistema',
    })
    @ApiResponse({
        status: 201,
        description: 'Inmobiliaria creada exitosamente',
    })
    @ApiResponse({
        status: 400,
        description: 'Datos inválidos',
    })
    async create(
        @Body() createInmobiliariaDto: CreateInmobiliariaDto,
        @Res() res: Response,
    ) {
        try {
            const result = await this.inmobiliariaService.create(createInmobiliariaDto);

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
        summary: 'Obtener todas las inmobiliarias',
        description: 'Retorna una lista de todas las inmobiliarias del sistema',
    })
    @ApiResponse({
        status: 200,
        description: 'Lista de inmobiliarias obtenida exitosamente',
    })
    async findAll(@Res() res: Response) {
        try {
            const result = await this.inmobiliariaService.findAll();

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
        summary: 'Obtener inmobiliaria por nombre',
        description: 'Retorna una inmobiliaria específica por su nombre',
    })
    @ApiParam({
        name: 'nombre',
        type: 'string',
        description: 'Nombre de la inmobiliaria',
        example: 'Inmobiliaria San Martín S.A.C.',
    })
    @ApiResponse({
        status: 200,
        description: 'Inmobiliaria encontrada exitosamente',
    })
    @ApiResponse({
        status: 404,
        description: 'Inmobiliaria no encontrada',
    })
    async findByNombre(@Param('nombre') nombre: string, @Res() res: Response) {
        try {
            const result = await this.inmobiliariaService.findByNombre(nombre);

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

    @Get('correo/:correo')
    @ApiOperation({
        summary: 'Obtener inmobiliaria por correo',
        description: 'Retorna una inmobiliaria específica por su correo de contacto',
    })
    @ApiParam({
        name: 'correo',
        type: 'string',
        description: 'Correo de contacto de la inmobiliaria',
        example: 'contacto@inmobiliaria.com',
    })
    @ApiResponse({
        status: 200,
        description: 'Inmobiliaria encontrada exitosamente',
    })
    @ApiResponse({
        status: 404,
        description: 'Inmobiliaria no encontrada',
    })
    async findByCorreo(@Param('correo') correo: string, @Res() res: Response) {
        try {
            const result = await this.inmobiliariaService.findByCorreo(correo);

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

    @Get(':id')
    @ApiOperation({
        summary: 'Obtener una inmobiliaria por ID',
        description: 'Retorna una inmobiliaria específica por su ID',
    })
    @ApiParam({
        name: 'id',
        type: 'string',
        description: 'ID único de la inmobiliaria',
        example: 'uuid-example',
    })
    @ApiResponse({
        status: 200,
        description: 'Inmobiliaria encontrada exitosamente',
    })
    @ApiResponse({
        status: 404,
        description: 'Inmobiliaria no encontrada',
    })
    async findOne(@Param('id') id: string, @Res() res: Response) {
        try {
            const result = await this.inmobiliariaService.findOne(id);

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
        summary: 'Actualizar una inmobiliaria',
        description: 'Actualiza los datos de una inmobiliaria existente',
    })
    @ApiParam({
        name: 'id',
        type: 'string',
        description: 'ID único de la inmobiliaria',
        example: 'uuid-example',
    })
    @ApiResponse({
        status: 200,
        description: 'Inmobiliaria actualizada exitosamente',
    })
    @ApiResponse({
        status: 404,
        description: 'Inmobiliaria no encontrada',
    })
    async update(
        @Param('id') id: string,
        @Body() updateInmobiliariaDto: UpdateInmobiliariaDto,
        @Res() res: Response,
    ) {
        try {
            const result = await this.inmobiliariaService.update(id, updateInmobiliariaDto);

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
        summary: 'Eliminar una inmobiliaria',
        description: 'Elimina una inmobiliaria del sistema (solo si no tiene edificios asociados)',
    })
    @ApiParam({
        name: 'id',
        type: 'string',
        description: 'ID único de la inmobiliaria',
        example: 'uuid-example',
    })
    @ApiResponse({
        status: 200,
        description: 'Inmobiliaria eliminada exitosamente',
    })
    @ApiResponse({
        status: 400,
        description: 'No se puede eliminar la inmobiliaria porque tiene edificios asociados',
    })
    @ApiResponse({
        status: 404,
        description: 'Inmobiliaria no encontrada',
    })
    async remove(@Param('id') id: string, @Res() res: Response) {
        try {
            const result = await this.inmobiliariaService.remove(id);

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
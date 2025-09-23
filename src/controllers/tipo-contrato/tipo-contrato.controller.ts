import { Controller, Get, Post, Put, Delete, Body, Param, Res, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { Response } from 'express';
import { CreateTipoContratoDto, UpdateTipoContratoDto } from '../../dtos';
import { TipoContratoService } from '../../services/implementations/tipo-contrato/tipo-contrato.service';

@ApiTags('Tipos de Contrato')
@Controller('tipo-contrato')
export class TipoContratoController {
    constructor(private readonly tipoContratoService: TipoContratoService) { }

    @Post()
    @ApiOperation({
        summary: 'Crear un nuevo tipo de contrato',
        description: 'Registra un nuevo tipo de contrato en el sistema'
    })
    @ApiBody({
        type: CreateTipoContratoDto,
        description: 'Datos del tipo de contrato a crear'
    })
    @ApiResponse({
        status: 201,
        description: 'Tipo de contrato creado exitosamente'
    })
    @ApiResponse({
        status: 400,
        description: 'Error en los datos de entrada'
    })
    async create(@Body() createTipoContratoDto: CreateTipoContratoDto, @Res() res: Response) {
        try {
            const result = await this.tipoContratoService.create(createTipoContratoDto);

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
        summary: 'Obtener todos los tipos de contrato',
        description: 'Retorna una lista de todos los tipos de contrato'
    })
    @ApiResponse({
        status: 200,
        description: 'Lista de tipos de contrato obtenida exitosamente'
    })
    async findAll(@Res() res: Response) {
        try {
            const result = await this.tipoContratoService.findAll();

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
        summary: 'Obtener un tipo de contrato por ID',
        description: 'Retorna un tipo de contrato específico basado en su ID'
    })
    @ApiParam({
        name: 'id',
        description: 'ID único del tipo de contrato',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiResponse({
        status: 200,
        description: 'Tipo de contrato encontrado exitosamente'
    })
    @ApiResponse({
        status: 404,
        description: 'Tipo de contrato no encontrado'
    })
    async findOne(@Param('id') id: string, @Res() res: Response) {
        try {
            const result = await this.tipoContratoService.findOne(id);

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
        summary: 'Actualizar un tipo de contrato',
        description: 'Actualiza los datos de un tipo de contrato existente'
    })
    @ApiParam({
        name: 'id',
        description: 'ID único del tipo de contrato a actualizar',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiBody({
        type: UpdateTipoContratoDto,
        description: 'Datos del tipo de contrato a actualizar'
    })
    @ApiResponse({
        status: 200,
        description: 'Tipo de contrato actualizado exitosamente'
    })
    @ApiResponse({
        status: 404,
        description: 'Tipo de contrato no encontrado'
    })
    async update(@Param('id') id: string, @Body() updateTipoContratoDto: UpdateTipoContratoDto, @Res() res: Response) {
        try {
            const result = await this.tipoContratoService.update(id, updateTipoContratoDto);

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
        summary: 'Eliminar un tipo de contrato',
        description: 'Elimina un tipo de contrato del sistema (eliminación física)'
    })
    @ApiParam({
        name: 'id',
        description: 'ID único del tipo de contrato a eliminar',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiResponse({
        status: 200,
        description: 'Tipo de contrato eliminado exitosamente'
    })
    @ApiResponse({
        status: 404,
        description: 'Tipo de contrato no encontrado'
    })
    @ApiResponse({
        status: 400,
        description: 'No se puede eliminar el tipo de contrato porque tiene registros asociados'
    })
    async remove(@Param('id') id: string, @Res() res: Response) {
        try {
            const result = await this.tipoContratoService.remove(id);

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

    @Get('nombre/:nombre')
    @ApiOperation({
        summary: 'Obtener tipo de contrato por nombre',
        description: 'Retorna un tipo de contrato específico basado en su nombre'
    })
    @ApiParam({
        name: 'nombre',
        description: 'Nombre del tipo de contrato',
        example: 'Contrato de Arrendamiento'
    })
    @ApiResponse({
        status: 200,
        description: 'Tipo de contrato encontrado exitosamente'
    })
    @ApiResponse({
        status: 404,
        description: 'Tipo de contrato no encontrado'
    })
    async findByNombre(@Param('nombre') nombre: string, @Res() res: Response) {
        try {
            const result = await this.tipoContratoService.findByNombre(nombre);

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

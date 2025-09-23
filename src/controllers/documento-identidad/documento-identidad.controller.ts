import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Res } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CreateDocumentoIdentidadDto, UpdateDocumentoIdentidadDto } from 'src/dtos';
import { DocumentoIdentidadService } from 'src/services/implementations';

@ApiTags('Documentos de Identidad')
@Controller('documento-identidad')
export class DocumentoIdentidadController {

    constructor(private readonly documentoIdentidadService: DocumentoIdentidadService) { }

    @Post()
    @ApiOperation({
        summary: 'Crear un nuevo documento de identidad',
        description: 'Crea un nuevo documento de identidad en el sistema'
    })
    @ApiResponse({
        status: 201,
        description: 'Documento de identidad creado exitosamente'
    })
    @ApiResponse({
        status: 400,
        description: 'Datos inválidos'
    })
    @ApiResponse({
        status: 409,
        description: 'Documento con ese número ya existe'
    })
    async create(@Body() createDocumentoIdentidadDto: CreateDocumentoIdentidadDto, @Res() res: Response) {
        try {
            const result = await this.documentoIdentidadService.create(createDocumentoIdentidadDto);

            if (result.success) {
                return res.status(HttpStatus.CREATED).json(result);
            } else {
                const statusCode = result.error?.statusCode === 409 ? HttpStatus.CONFLICT : HttpStatus.BAD_REQUEST;
                return res.status(statusCode).json(result);
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
        summary: 'Obtener todos los documentos de identidad',
        description: 'Retorna una lista de todos los documentos de identidad del sistema'
    })
    @ApiResponse({
        status: 200,
        description: 'Lista de documentos de identidad obtenida exitosamente'
    })
    async findAll(@Res() res: Response) {
        try {
            const result = await this.documentoIdentidadService.findAll();

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

    @Get('numero/:numero')
    @ApiOperation({
        summary: 'Obtener documento de identidad por número',
        description: 'Retorna un documento de identidad específico por su número'
    })
    @ApiParam({
        name: 'numero',
        type: 'number',
        description: 'Número del documento de identidad',
        example: 12345678
    })
    @ApiResponse({
        status: 200,
        description: 'Documento de identidad encontrado exitosamente'
    })
    @ApiResponse({
        status: 404,
        description: 'Documento de identidad no encontrado'
    })
    async findByNumero(@Param('numero') numero: number, @Res() res: Response) {
        try {
            const result = await this.documentoIdentidadService.findByNumero(numero);

            if (result.success) {
                return res.status(HttpStatus.OK).json(result);
            } else {
                const statusCode = result.error?.statusCode === 404 ? HttpStatus.NOT_FOUND : HttpStatus.BAD_REQUEST;
                return res.status(statusCode).json(result);
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

    @Get('tipo')
    @ApiOperation({
        summary: 'Obtener documentos de identidad por tipo',
        description: 'Retorna una lista de documentos de identidad filtrados por tipo de documento'
    })
    @ApiQuery({
        name: 'tipo',
        type: 'string',
        description: 'Tipo de documento de identidad',
        example: 'DNI'
    })
    @ApiResponse({
        status: 200,
        description: 'Lista de documentos de identidad por tipo obtenida exitosamente'
    })
    async findByTipo(@Query('tipo') tipo: string, @Res() res: Response) {
        try {
            const result = await this.documentoIdentidadService.findByTipo(tipo);

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
        summary: 'Obtener un documento de identidad por ID',
        description: 'Retorna un documento de identidad específico por su ID'
    })
    @ApiParam({
        name: 'id',
        type: 'string',
        description: 'ID único del documento de identidad',
        example: 'uuid-example'
    })
    @ApiResponse({
        status: 200,
        description: 'Documento de identidad encontrado exitosamente'
    })
    @ApiResponse({
        status: 404,
        description: 'Documento de identidad no encontrado'
    })
    async findOne(@Param('id') id: string, @Res() res: Response) {
        try {
            const result = await this.documentoIdentidadService.findOne(id);

            if (result.success) {
                return res.status(HttpStatus.OK).json(result);
            } else {
                const statusCode = result.error?.statusCode === 404 ? HttpStatus.NOT_FOUND : HttpStatus.BAD_REQUEST;
                return res.status(statusCode).json(result);
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
        summary: 'Actualizar un documento de identidad',
        description: 'Actualiza los datos de un documento de identidad existente'
    })
    @ApiParam({
        name: 'id',
        type: 'string',
        description: 'ID único del documento de identidad',
        example: 'uuid-example'
    })
    @ApiResponse({
        status: 200,
        description: 'Documento de identidad actualizado exitosamente'
    })
    @ApiResponse({
        status: 404,
        description: 'Documento de identidad no encontrado'
    })
    @ApiResponse({
        status: 409,
        description: 'Documento con ese número ya existe'
    })
    async update(@Param('id') id: string, @Body() updateDocumentoIdentidadDto: UpdateDocumentoIdentidadDto, @Res() res: Response) {
        try {
            const result = await this.documentoIdentidadService.update(id, updateDocumentoIdentidadDto);

            if (result.success) {
                return res.status(HttpStatus.OK).json(result);
            } else {
                let statusCode = HttpStatus.BAD_REQUEST;
                if (result.error?.statusCode === 404) statusCode = HttpStatus.NOT_FOUND;
                if (result.error?.statusCode === 409) statusCode = HttpStatus.CONFLICT;
                return res.status(statusCode).json(result);
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
        summary: 'Eliminar un documento de identidad',
        description: 'Elimina físicamente un documento de identidad del sistema'
    })
    @ApiParam({
        name: 'id',
        type: 'string',
        description: 'ID único del documento de identidad',
        example: 'uuid-example'
    })
    @ApiResponse({
        status: 200,
        description: 'Documento de identidad eliminado exitosamente'
    })
    @ApiResponse({
        status: 404,
        description: 'Documento de identidad no encontrado'
    })
    async remove(@Param('id') id: string, @Res() res: Response) {
        try {
            const result = await this.documentoIdentidadService.remove(id);

            if (result.success) {
                return res.status(HttpStatus.OK).json(result);
            } else {
                const statusCode = result.error?.statusCode === 404 ? HttpStatus.NOT_FOUND : HttpStatus.BAD_REQUEST;
                return res.status(statusCode).json(result);
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

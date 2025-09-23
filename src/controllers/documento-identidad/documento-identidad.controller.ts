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
  HttpCode,
  Inject
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateDocumentoIdentidadDto, UpdateDocumentoIdentidadDto } from '../../dtos';
import { DocumentoIdentidad } from '../../entities/DocumentoIdentidad';
import { IDocumentoIdentidadService } from '../../services/interfaces/documento-identidad.interface';

@ApiTags('Documentos de Identidad')
@Controller('documento-identidad')
export class DocumentoIdentidadController {

    constructor(
        @Inject('IDocumentoIdentidadService')
        private readonly documentoIdentidadService: IDocumentoIdentidadService
    ) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: 'Crear un nuevo documento de identidad',
        description: 'Crea un nuevo documento de identidad en el sistema'
    })
    @ApiResponse({
        status: 201,
        description: 'Documento de identidad creado exitosamente',
        type: DocumentoIdentidad
    })
    @ApiResponse({
        status: 400,
        description: 'Datos inválidos'
    })
    @ApiResponse({
        status: 409,
        description: 'Documento con ese número ya existe'
    })
    async create(@Body() createDocumentoIdentidadDto: CreateDocumentoIdentidadDto): Promise<DocumentoIdentidad> {
        return await this.documentoIdentidadService.create(createDocumentoIdentidadDto);
    }

    @Get()
    @ApiOperation({
        summary: 'Obtener todos los documentos de identidad',
        description: 'Retorna una lista de todos los documentos de identidad del sistema'
    })
    @ApiResponse({
        status: 200,
        description: 'Lista de documentos de identidad obtenida exitosamente',
        type: [DocumentoIdentidad]
    })
    async findAll(): Promise<DocumentoIdentidad[]> {
        return await this.documentoIdentidadService.findAll();
    }

    @Get('numero/:numero')
    @ApiOperation({
        summary: 'Obtener documento de identidad por número',
        description: 'Retorna un documento de identidad específico por su número'
    })
    @ApiParam({
        name: 'numero',
        type: 'string',
        description: 'Número del documento de identidad',
        example: '12345678'
    })
    @ApiResponse({
        status: 200,
        description: 'Documento de identidad encontrado exitosamente',
        type: DocumentoIdentidad
    })
    @ApiResponse({
        status: 404,
        description: 'Documento de identidad no encontrado'
    })
    async findByNumero(@Param('numero') numero: string): Promise<DocumentoIdentidad> {
        return await this.documentoIdentidadService.findByNumero(numero);
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
        description: 'Lista de documentos de identidad por tipo obtenida exitosamente',
        type: [DocumentoIdentidad]
    })
    async findByTipo(@Query('tipo') tipo: string): Promise<DocumentoIdentidad[]> {
        return await this.documentoIdentidadService.findByTipo(tipo);
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
        description: 'Documento de identidad encontrado exitosamente',
        type: DocumentoIdentidad
    })
    @ApiResponse({
        status: 404,
        description: 'Documento de identidad no encontrado'
    })
    async findOne(@Param('id') id: string): Promise<DocumentoIdentidad> {
        return await this.documentoIdentidadService.findOne(id);
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
        description: 'Documento de identidad actualizado exitosamente',
        type: DocumentoIdentidad
    })
    @ApiResponse({
        status: 404,
        description: 'Documento de identidad no encontrado'
    })
    @ApiResponse({
        status: 409,
        description: 'Documento con ese número ya existe'
    })
    async update(@Param('id') id: string, @Body() updateDocumentoIdentidadDto: UpdateDocumentoIdentidadDto): Promise<DocumentoIdentidad> {
        return await this.documentoIdentidadService.update(id, updateDocumentoIdentidadDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
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
        status: 204,
        description: 'Documento de identidad eliminado exitosamente'
    })
    @ApiResponse({
        status: 404,
        description: 'Documento de identidad no encontrado'
    })
    async remove(@Param('id') id: string): Promise<void> {
        return await this.documentoIdentidadService.remove(id);
    }
}
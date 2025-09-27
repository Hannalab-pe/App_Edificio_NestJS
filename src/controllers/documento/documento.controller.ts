import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { DocumentoService } from 'src/services/implementations/documento/documento.service';
import { CreateDocumentoDto, UpdateDocumentoDto, DocumentoResponseDto } from 'src/dtos/index';
import { BaseResponseDto } from 'src/dtos/baseResponse/baseResponse.dto';

@ApiTags('Documentos')
@Controller('documento')
export class DocumentoController {
    constructor(private readonly documentoService: DocumentoService) { }

    @Post()
    @ApiOperation({
        summary: 'Crear un nuevo documento',
        description: 'Crea un nuevo documento con validación de tipo y trabajador'
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Documento creado exitosamente',
        type: DocumentoResponseDto
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Datos inválidos o referencias no encontradas'
    })
    create(@Body() createDocumentoDto: CreateDocumentoDto): Promise<BaseResponseDto<DocumentoResponseDto>> {
        return this.documentoService.create(createDocumentoDto);
    }

    @Get()
    @ApiOperation({
        summary: 'Obtener todos los documentos',
        description: 'Retorna lista completa de documentos con información de tipo y trabajador'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Documentos obtenidos exitosamente',
        type: [DocumentoResponseDto]
    })
    findAll(): Promise<BaseResponseDto<DocumentoResponseDto[]>> {
        return this.documentoService.findAll();
    }

    @Get('tipo-documento/:idTipoDocumento')
    @ApiOperation({
        summary: 'Obtener documentos por tipo',
        description: 'Retorna todos los documentos de un tipo específico'
    })
    @ApiParam({
        name: 'idTipoDocumento',
        description: 'ID del tipo de documento',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Documentos por tipo obtenidos exitosamente',
        type: [DocumentoResponseDto]
    })
    findByTipoDocumento(@Param('idTipoDocumento') idTipoDocumento: string): Promise<BaseResponseDto<DocumentoResponseDto[]>> {
        return this.documentoService.findByTipoDocumento(idTipoDocumento);
    }

    @Get('trabajador/:idTrabajador')
    @ApiOperation({
        summary: 'Obtener documentos por trabajador',
        description: 'Retorna todos los documentos asociados a un trabajador específico'
    })
    @ApiParam({
        name: 'idTrabajador',
        description: 'ID del trabajador',
        example: '123e4567-e89b-12d3-a456-426614174001'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Documentos por trabajador obtenidos exitosamente',
        type: [DocumentoResponseDto]
    })
    findByTrabajador(@Param('idTrabajador') idTrabajador: string): Promise<BaseResponseDto<DocumentoResponseDto[]>> {
        return this.documentoService.findByTrabajador(idTrabajador);
    }

    @Get('buscar')
    @ApiOperation({
        summary: 'Buscar documentos por descripción',
        description: 'Busca documentos que contengan el texto especificado en su descripción'
    })
    @ApiQuery({
        name: 'descripcion',
        description: 'Texto a buscar en la descripción',
        example: 'contrato'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Documentos encontrados por descripción',
        type: [DocumentoResponseDto]
    })
    findByDescripcion(@Query('descripcion') descripcion: string): Promise<BaseResponseDto<DocumentoResponseDto[]>> {
        return this.documentoService.findByDescripcion(descripcion);
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Obtener un documento por ID',
        description: 'Retorna información detallada de un documento específico'
    })
    @ApiParam({
        name: 'id',
        description: 'ID único del documento',
        example: '123e4567-e89b-12d3-a456-426614174002'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Documento obtenido exitosamente',
        type: DocumentoResponseDto
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Documento no encontrado'
    })
    findOne(@Param('id') id: string): Promise<BaseResponseDto<DocumentoResponseDto>> {
        return this.documentoService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({
        summary: 'Actualizar un documento',
        description: 'Actualiza la información de un documento existente'
    })
    @ApiParam({
        name: 'id',
        description: 'ID único del documento',
        example: '123e4567-e89b-12d3-a456-426614174002'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Documento actualizado exitosamente',
        type: DocumentoResponseDto
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Documento no encontrado'
    })
    update(
        @Param('id') id: string,
        @Body() updateDocumentoDto: UpdateDocumentoDto,
    ): Promise<BaseResponseDto<DocumentoResponseDto>> {
        return this.documentoService.update(id, updateDocumentoDto);
    }

    @Delete(':id')
    @ApiOperation({
        summary: 'Eliminar un documento',
        description: 'Elimina un documento del sistema'
    })
    @ApiParam({
        name: 'id',
        description: 'ID único del documento',
        example: '123e4567-e89b-12d3-a456-426614174002'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Documento eliminado exitosamente'
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Documento no encontrado'
    })
    remove(@Param('id') id: string): Promise<BaseResponseDto<void>> {
        return this.documentoService.remove(id);
    }
}

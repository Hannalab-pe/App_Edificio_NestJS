import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { TipoDocumentoService } from '../../services/implementations/tipo-documento/tipo-documento.service';
import { BaseResponseDto } from '../../dtos/baseResponse/baseResponse.dto';
import { CreateTipoDocumentoDto, UpdateTipoDocumentoDto } from 'src/dtos';

@ApiTags('Tipo Documento')
@Controller('tipo-documento')
export class TipoDocumentoController {
  constructor(private readonly tipoDocumentoService: TipoDocumentoService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo tipo de documento' })
  @ApiResponse({
    status: 201,
    description: 'Tipo de documento creado exitosamente.',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos.',
  })
  @ApiResponse({
    status: 409,
    description: 'Ya existe un tipo de documento con ese nombre.',
  })
  async create(
    @Body() createTipoDocumentoDto: CreateTipoDocumentoDto,
  ): Promise<BaseResponseDto<any>> {
    return await this.tipoDocumentoService.create(createTipoDocumentoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los tipos de documento' })
  @ApiResponse({
    status: 200,
    description: 'Lista de tipos de documento obtenida exitosamente.',
  })
  async findAll(): Promise<BaseResponseDto<any>> {
    return await this.tipoDocumentoService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un tipo de documento por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID único del tipo de documento',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de documento encontrado exitosamente.',
  })
  @ApiResponse({
    status: 404,
    description: 'Tipo de documento no encontrado.',
  })
  async findOne(@Param('id') id: string): Promise<BaseResponseDto<any>> {
    return await this.tipoDocumentoService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un tipo de documento' })
  @ApiParam({
    name: 'id',
    description: 'ID único del tipo de documento',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de documento actualizado exitosamente.',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos.',
  })
  @ApiResponse({
    status: 404,
    description: 'Tipo de documento no encontrado.',
  })
  @ApiResponse({
    status: 409,
    description: 'Ya existe otro tipo de documento con ese nombre.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateTipoDocumentoDto: UpdateTipoDocumentoDto,
  ): Promise<BaseResponseDto<any>> {
    return await this.tipoDocumentoService.update(id, updateTipoDocumentoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un tipo de documento' })
  @ApiParam({
    name: 'id',
    description: 'ID único del tipo de documento',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 204,
    description: 'Tipo de documento eliminado exitosamente.',
  })
  @ApiResponse({
    status: 404,
    description: 'Tipo de documento no encontrado.',
  })
  @ApiResponse({
    status: 409,
    description:
      'No se puede eliminar el tipo de documento porque tiene documentos asociados.',
  })
  async remove(@Param('id') id: string): Promise<BaseResponseDto<void>> {
    return await this.tipoDocumentoService.remove(id);
  }

  @Get('tipo/:tipoDocumento')
  @ApiOperation({ summary: 'Buscar tipo de documento por nombre específico' })
  @ApiParam({
    name: 'tipoDocumento',
    description: 'Nombre específico del tipo de documento',
    example: 'Contrato de Arrendamiento',
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de documento encontrado por nombre exitosamente.',
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontró un tipo de documento con ese nombre.',
  })
  async findByTipoDocumento(
    @Param('tipoDocumento') tipoDocumento: string,
  ): Promise<BaseResponseDto<any>> {
    return await this.tipoDocumentoService.findByTipoDocumento(tipoDocumento);
  }
}

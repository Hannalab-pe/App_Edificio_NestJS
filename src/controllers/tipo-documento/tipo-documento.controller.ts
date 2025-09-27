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
  ParseUUIDPipe,
  HttpException,
  Logger,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { TipoDocumentoService } from '../../services/implementations/tipo-documento/tipo-documento.service';
import { BaseResponseDto } from '../../dtos/baseResponse/baseResponse.dto';
import {
  CreateTipoDocumentoDto,
  UpdateTipoDocumentoDto,
  TipoDocumentoResponseDto,
  TipoDocumentoSingleResponseDto,
  TipoDocumentoArrayResponseDto,
} from 'src/dtos';

@ApiTags('📄 Tipo de Documento')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('tipos-documento')
export class TipoDocumentoController {
  private readonly logger = new Logger(TipoDocumentoController.name);

  constructor(private readonly tipoDocumentoService: TipoDocumentoService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear un nuevo tipo de documento',
    description: 'Crea un nuevo tipo de documento en el sistema con validación de duplicados'
  })
  @ApiBody({
    type: CreateTipoDocumentoDto,
    description: 'Datos para crear un tipo de documento',
    examples: {
      ejemplo1: {
        summary: 'Contrato de arrendamiento',
        description: 'Ejemplo de tipo de documento para contratos',
        value: {
          tipoDocumento: 'Contrato de Arrendamiento',
          descripcion: 'Documentos relacionados con contratos de arrendamiento de espacios'
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Tipo de documento creado exitosamente',
    type: TipoDocumentoSingleResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos o campos requeridos faltantes',
  })
  @ApiResponse({
    status: 409,
    description: 'Ya existe un tipo de documento con ese nombre',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async create(
    @Body() createTipoDocumentoDto: CreateTipoDocumentoDto,
  ): Promise<TipoDocumentoSingleResponseDto> {
    try {
      this.logger.log(`Creando tipo de documento: ${createTipoDocumentoDto.tipoDocumento}`);
      
      const result = await this.tipoDocumentoService.createWithBaseResponse(createTipoDocumentoDto);
      
      if (!result.success) {
        const statusCode = result.statusCode || 400;
        throw new HttpException(result.message, statusCode);
      }
      
      this.logger.log(`Tipo de documento creado exitosamente con ID: ${result.data?.idTipoDocumento}`);
      return result;
    } catch (error) {
      this.logger.error(`Error al crear tipo de documento: ${error.message}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error interno del servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los tipos de documento',
    description: 'Retorna la lista completa de tipos de documento ordenados alfabéticamente'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de tipos de documento obtenida exitosamente',
    type: TipoDocumentoArrayResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async findAll(): Promise<TipoDocumentoArrayResponseDto> {
    try {
      this.logger.log('Obteniendo todos los tipos de documento');
      
      const result = await this.tipoDocumentoService.findAllWithBaseResponse();
      
      if (!result.success) {
        throw new HttpException(result.message, result.statusCode || 500);
      }
      
      this.logger.log(`Se encontraron ${result.data?.length || 0} tipos de documento`);
      return result;
    } catch (error) {
      this.logger.error(`Error al obtener tipos de documento: ${error.message}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error interno del servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un tipo de documento por ID',
    description: 'Busca y retorna un tipo de documento específico usando su identificador único'
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del tipo de documento (formato UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de documento encontrado exitosamente',
    type: TipoDocumentoSingleResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'ID proporcionado no es un UUID válido',
  })
  @ApiResponse({
    status: 404,
    description: 'Tipo de documento no encontrado',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<TipoDocumentoSingleResponseDto> {
    try {
      this.logger.log(`Buscando tipo de documento con ID: ${id}`);
      
      const result = await this.tipoDocumentoService.findOneWithBaseResponse(id);
      
      if (!result.success) {
        const statusCode = result.statusCode || 404;
        throw new HttpException(result.message, statusCode);
      }
      
      this.logger.log(`Tipo de documento encontrado: ${result.data?.tipoDocumento}`);
      return result;
    } catch (error) {
      this.logger.error(`Error al buscar tipo de documento: ${error.message}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error interno del servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un tipo de documento',
    description: 'Actualiza parcial o totalmente un tipo de documento existente'
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del tipo de documento a actualizar (formato UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
    type: 'string',
    format: 'uuid',
  })
  @ApiBody({
    type: UpdateTipoDocumentoDto,
    description: 'Datos a actualizar del tipo de documento',
    examples: {
      actualizacion_parcial: {
        summary: 'Actualización parcial',
        description: 'Ejemplo de actualización solo del nombre',
        value: {
          tipoDocumento: 'Acta de Reunión'
        }
      },
      actualizacion_completa: {
        summary: 'Actualización completa',
        description: 'Ejemplo de actualización de todos los campos',
        value: {
          tipoDocumento: 'Reglamento Interno',
          descripcion: 'Documentos relacionados con reglamentos y normas internas del edificio'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de documento actualizado exitosamente',
    type: TipoDocumentoSingleResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos o ID no es UUID válido',
  })
  @ApiResponse({
    status: 404,
    description: 'Tipo de documento no encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'Ya existe otro tipo de documento con ese nombre',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTipoDocumentoDto: UpdateTipoDocumentoDto,
  ): Promise<TipoDocumentoSingleResponseDto> {
    try {
      this.logger.log(`Actualizando tipo de documento con ID: ${id}`);
      
      const result = await this.tipoDocumentoService.updateWithBaseResponse(id, updateTipoDocumentoDto);
      
      if (!result.success) {
        const statusCode = result.statusCode || 400;
        throw new HttpException(result.message, statusCode);
      }
      
      this.logger.log(`Tipo de documento actualizado exitosamente: ${result.data?.tipoDocumento}`);
      return result;
    } catch (error) {
      this.logger.error(`Error al actualizar tipo de documento: ${error.message}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error interno del servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Eliminar un tipo de documento',
    description: 'Elimina físicamente un tipo de documento si no tiene documentos asociados'
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del tipo de documento a eliminar (formato UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de documento eliminado exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Tipo de documento eliminado exitosamente' },
        data: { type: 'null', example: null },
        error: { type: 'null', example: null }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'ID proporcionado no es un UUID válido',
  })
  @ApiResponse({
    status: 404,
    description: 'Tipo de documento no encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'No se puede eliminar el tipo de documento porque tiene documentos asociados',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async remove(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<BaseResponseDto<undefined>> {
    try {
      this.logger.log(`Eliminando tipo de documento con ID: ${id}`);
      
      const result = await this.tipoDocumentoService.removeWithBaseResponse(id);
      
      if (!result.success) {
        const statusCode = result.error?.message === 'Tipo de documento en uso' ? 409 :
                         result.error?.message.includes('no encontrado') ? 404 : 500;
        throw new HttpException(result.message, statusCode);
      }
      
      this.logger.log(`Tipo de documento eliminado exitosamente con ID: ${id}`);
      return result;
    } catch (error) {
      this.logger.error(`Error al eliminar tipo de documento: ${error.message}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error interno del servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('buscar/:nombre')
  @ApiOperation({
    summary: 'Buscar tipo de documento por nombre específico',
    description: 'Busca un tipo de documento utilizando su nombre exacto como criterio de búsqueda'
  })
  @ApiParam({
    name: 'nombre',
    description: 'Nombre exacto del tipo de documento a buscar',
    example: 'Contrato de Arrendamiento',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de documento encontrado exitosamente',
    type: TipoDocumentoSingleResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontró un tipo de documento con ese nombre',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async findByTipoDocumento(
    @Param('nombre') tipoDocumento: string,
  ): Promise<TipoDocumentoSingleResponseDto> {
    try {
      this.logger.log(`Buscando tipo de documento por nombre: ${tipoDocumento}`);
      
      const result = await this.tipoDocumentoService.findByTipoWithBaseResponse(tipoDocumento);
      
      if (!result.success) {
        const statusCode = result.statusCode || 404;
        throw new HttpException(result.message, statusCode);
      }
      
      this.logger.log(`Tipo de documento encontrado: ${result.data?.tipoDocumento}`);
      return result;
    } catch (error) {
      this.logger.error(`Error al buscar tipo de documento por nombre: ${error.message}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error interno del servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

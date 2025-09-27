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
import { TipoCronogramaService } from '../../services/implementations/tipo-cronograma/tipo-cronograma.service';
import { BaseResponseDto } from '../../dtos/baseResponse/baseResponse.dto';
import { 
  CreateTipoCronogramaDto, 
  UpdateTipoCronogramaDto,
  TipoCronogramaResponseDto,
  TipoCronogramaSingleResponseDto,
  TipoCronogramaArrayResponseDto,
} from 'src/dtos';

@ApiTags('🕐 Tipo de Cronograma')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('tipo-cronograma')
export class TipoCronogramaController {
  private readonly logger = new Logger(TipoCronogramaController.name);

  constructor(private readonly tipoCronogramaService: TipoCronogramaService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Crear un nuevo tipo de cronograma',
    description: 'Crea un nuevo tipo de cronograma en el sistema con validación de duplicados'
  })
  @ApiBody({
    type: CreateTipoCronogramaDto,
    description: 'Datos para crear un tipo de cronograma',
    examples: {
      ejemplo1: {
        summary: 'Cronograma de reunión',
        description: 'Ejemplo de cronograma para reuniones',
        value: {
          tipoCronograma: 'Reunión ordinaria',
          descripcion: 'Cronograma utilizado para reuniones ordinarias de la junta de propietarios'
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Tipo de cronograma creado exitosamente',
    type: TipoCronogramaSingleResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos o campos requeridos faltantes',
  })
  @ApiResponse({
    status: 409,
    description: 'Ya existe un tipo de cronograma con ese nombre',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async create(
    @Body() createTipoCronogramaDto: CreateTipoCronogramaDto,
  ): Promise<TipoCronogramaSingleResponseDto> {
    try {
      this.logger.log(`Creando tipo de cronograma: ${createTipoCronogramaDto.tipoCronograma}`);
      
      const result = await this.tipoCronogramaService.createWithBaseResponse(createTipoCronogramaDto);
      
      if (!result.success) {
        const statusCode = result.statusCode || 400;
        throw new HttpException(result.message, statusCode);
      }
      
      this.logger.log(`Tipo de cronograma creado exitosamente con ID: ${result.data?.idTipoCronograma}`);
      return result;
    } catch (error) {
      this.logger.error(`Error al crear tipo de cronograma: ${error.message}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error interno del servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  @ApiOperation({ 
    summary: 'Obtener todos los tipos de cronograma',
    description: 'Retorna la lista completa de tipos de cronograma ordenados alfabéticamente'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de tipos de cronograma obtenida exitosamente',
    type: TipoCronogramaArrayResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async findAll(): Promise<TipoCronogramaArrayResponseDto> {
    try {
      this.logger.log('Obteniendo todos los tipos de cronograma');
      
      const result = await this.tipoCronogramaService.findAllWithBaseResponse();
      
      if (!result.success) {
        throw new HttpException(result.message, result.statusCode || 500);
      }
      
      this.logger.log(`Se encontraron ${result.data?.length || 0} tipos de cronograma`);
      return result;
    } catch (error) {
      this.logger.error(`Error al obtener tipos de cronograma: ${error.message}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error interno del servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Obtener un tipo de cronograma por ID',
    description: 'Busca y retorna un tipo de cronograma específico usando su identificador único'
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del tipo de cronograma (formato UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de cronograma encontrado exitosamente',
    type: TipoCronogramaSingleResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'ID proporcionado no es un UUID válido',
  })
  @ApiResponse({
    status: 404,
    description: 'Tipo de cronograma no encontrado',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<TipoCronogramaSingleResponseDto> {
    try {
      this.logger.log(`Buscando tipo de cronograma con ID: ${id}`);
      
      const result = await this.tipoCronogramaService.findOneWithBaseResponse(id);
      
      if (!result.success) {
        const statusCode = result.statusCode || 404;
        throw new HttpException(result.message, statusCode);
      }
      
      this.logger.log(`Tipo de cronograma encontrado: ${result.data?.tipoCronograma}`);
      return result;
    } catch (error) {
      this.logger.error(`Error al buscar tipo de cronograma: ${error.message}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error interno del servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Actualizar un tipo de cronograma',
    description: 'Actualiza parcial o totalmente un tipo de cronograma existente'
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del tipo de cronograma a actualizar (formato UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
    type: 'string',
    format: 'uuid',
  })
  @ApiBody({
    type: UpdateTipoCronogramaDto,
    description: 'Datos a actualizar del tipo de cronograma',
    examples: {
      actualizacion_parcial: {
        summary: 'Actualización parcial',
        description: 'Ejemplo de actualización solo del tipo',
        value: {
          tipoCronograma: 'Reunión extraordinaria'
        }
      },
      actualizacion_completa: {
        summary: 'Actualización completa',
        description: 'Ejemplo de actualización de todos los campos',
        value: {
          tipoCronograma: 'Mantenimiento preventivo',
          descripcion: 'Cronograma para actividades de mantenimiento preventivo del edificio'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de cronograma actualizado exitosamente',
    type: TipoCronogramaSingleResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos o ID no es UUID válido',
  })
  @ApiResponse({
    status: 404,
    description: 'Tipo de cronograma no encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'Ya existe otro tipo de cronograma con ese nombre',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTipoCronogramaDto: UpdateTipoCronogramaDto,
  ): Promise<TipoCronogramaSingleResponseDto> {
    try {
      this.logger.log(`Actualizando tipo de cronograma con ID: ${id}`);
      
      const result = await this.tipoCronogramaService.updateWithBaseResponse(id, updateTipoCronogramaDto);
      
      if (!result.success) {
        const statusCode = result.statusCode || 400;
        throw new HttpException(result.message, statusCode);
      }
      
      this.logger.log(`Tipo de cronograma actualizado exitosamente: ${result.data?.tipoCronograma}`);
      return result;
    } catch (error) {
      this.logger.error(`Error al actualizar tipo de cronograma: ${error.message}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error interno del servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Eliminar un tipo de cronograma',
    description: 'Elimina físicamente un tipo de cronograma si no tiene cronogramas asociados'
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del tipo de cronograma a eliminar (formato UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de cronograma eliminado exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Tipo de cronograma eliminado exitosamente' },
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
    description: 'Tipo de cronograma no encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'No se puede eliminar el tipo de cronograma porque tiene cronogramas asociados',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async remove(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<BaseResponseDto<undefined>> {
    try {
      this.logger.log(`Eliminando tipo de cronograma con ID: ${id}`);
      
      const result = await this.tipoCronogramaService.removeWithBaseResponse(id);
      
      if (!result.success) {
        const statusCode = result.error?.message === 'Tipo de cronograma en uso' ? 409 : 
                         result.error?.message.includes('no encontrado') ? 404 : 500;
        throw new HttpException(result.message, statusCode);
      }
      
      this.logger.log(`Tipo de cronograma eliminado exitosamente con ID: ${id}`);
      return result;
    } catch (error) {
      this.logger.error(`Error al eliminar tipo de cronograma: ${error.message}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error interno del servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('buscar/:tipo')
  @ApiOperation({ 
    summary: 'Buscar tipo de cronograma por nombre específico',
    description: 'Busca un tipo de cronograma utilizando su nombre exacto como criterio de búsqueda'
  })
  @ApiParam({
    name: 'tipo',
    description: 'Nombre exacto del tipo de cronograma a buscar',
    example: 'Reunión ordinaria',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de cronograma encontrado exitosamente',
    type: TipoCronogramaSingleResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontró un tipo de cronograma con ese nombre',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async findByTipo(@Param('tipo') tipo: string): Promise<TipoCronogramaSingleResponseDto> {
    try {
      this.logger.log(`Buscando tipo de cronograma por tipo: ${tipo}`);
      
      const result = await this.tipoCronogramaService.findByTipoWithBaseResponse(tipo);
      
      if (!result.success) {
        const statusCode = result.statusCode || 404;
        throw new HttpException(result.message, statusCode);
      }
      
      this.logger.log(`Tipo de cronograma encontrado: ${result.data?.tipoCronograma}`);
      return result;
    } catch (error) {
      this.logger.error(`Error al buscar tipo de cronograma por tipo: ${error.message}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error interno del servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

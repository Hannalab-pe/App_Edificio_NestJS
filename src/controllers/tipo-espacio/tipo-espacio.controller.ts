import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Patch,
  ParseUUIDPipe,
  HttpException,
  Logger,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import {
  CreateTipoEspacioDto,
  UpdateTipoEspacioDto,
  TipoEspacioResponseDto,
  TipoEspacioSingleResponseDto,
  TipoEspacioArrayResponseDto,
} from 'src/dtos';
import { BaseResponseDto } from '../../dtos/baseResponse/baseResponse.dto';
import { TipoEspacioService } from 'src/services/implementations';

@ApiTags('🏢 Tipos de Espacio')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('tipos-espacio')
export class TipoEspacioController {
  private readonly logger = new Logger(TipoEspacioController.name);

  constructor(private readonly tipoEspacioService: TipoEspacioService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear un nuevo tipo de espacio',
    description: 'Crea un nuevo tipo de espacio en el sistema con validación de duplicados'
  })
  @ApiBody({
    type: CreateTipoEspacioDto,
    description: 'Datos para crear un tipo de espacio',
    examples: {
      ejemplo1: {
        summary: 'Salón de eventos',
        description: 'Ejemplo de tipo de espacio para eventos',
        value: {
          nombre: 'Salón de eventos',
          descripcion: 'Espacio amplio para reuniones y eventos sociales',
          requiereContrato: true
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Tipo de espacio creado exitosamente',
    type: TipoEspacioSingleResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos o campos requeridos faltantes',
  })
  @ApiResponse({
    status: 409,
    description: 'Ya existe un tipo de espacio con ese nombre',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async create(
    @Body() createTipoEspacioDto: CreateTipoEspacioDto,
  ): Promise<TipoEspacioSingleResponseDto> {
    try {
      this.logger.log(`Creando tipo de espacio: ${createTipoEspacioDto.nombre}`);
      
      const result = await this.tipoEspacioService.createWithBaseResponse(createTipoEspacioDto);
      
      if (!result.success) {
        const statusCode = result.statusCode || 400;
        throw new HttpException(result.message, statusCode);
      }
      
      this.logger.log(`Tipo de espacio creado exitosamente con ID: ${result.data?.idTipoEspacio}`);
      return result;
    } catch (error) {
      this.logger.error(`Error al crear tipo de espacio: ${error.message}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error interno del servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los tipos de espacio',
    description: 'Retorna la lista completa de tipos de espacio ordenados alfabéticamente'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de tipos de espacio obtenida exitosamente',
    type: TipoEspacioArrayResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async findAll(): Promise<TipoEspacioArrayResponseDto> {
    try {
      this.logger.log('Obteniendo todos los tipos de espacio');
      
      const result = await this.tipoEspacioService.findAllWithBaseResponse();
      
      if (!result.success) {
        throw new HttpException(result.message, result.statusCode || 500);
      }
      
      this.logger.log(`Se encontraron ${result.data?.length || 0} tipos de espacio`);
      return result;
    } catch (error) {
      this.logger.error(`Error al obtener tipos de espacio: ${error.message}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error interno del servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un tipo de espacio por ID',
    description: 'Busca y retorna un tipo de espacio específico usando su identificador único'
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del tipo de espacio (formato UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de espacio encontrado exitosamente',
    type: TipoEspacioSingleResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'ID proporcionado no es un UUID válido',
  })
  @ApiResponse({
    status: 404,
    description: 'Tipo de espacio no encontrado',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<TipoEspacioSingleResponseDto> {
    try {
      this.logger.log(`Buscando tipo de espacio con ID: ${id}`);
      
      const result = await this.tipoEspacioService.findOneWithBaseResponse(id);
      
      if (!result.success) {
        const statusCode = result.statusCode || 404;
        throw new HttpException(result.message, statusCode);
      }
      
      this.logger.log(`Tipo de espacio encontrado: ${result.data?.nombre}`);
      return result;
    } catch (error) {
      this.logger.error(`Error al buscar tipo de espacio: ${error.message}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error interno del servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un tipo de espacio',
    description: 'Actualiza parcial o totalmente un tipo de espacio existente'
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del tipo de espacio a actualizar (formato UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
    type: 'string',
    format: 'uuid',
  })
  @ApiBody({
    type: UpdateTipoEspacioDto,
    description: 'Datos a actualizar del tipo de espacio',
    examples: {
      actualizacion_parcial: {
        summary: 'Actualización parcial',
        description: 'Ejemplo de actualización solo del nombre',
        value: {
          nombre: 'Sala de conferencias'
        }
      },
      actualizacion_completa: {
        summary: 'Actualización completa',
        description: 'Ejemplo de actualización de todos los campos',
        value: {
          nombre: 'Auditorio principal',
          descripcion: 'Espacio amplio para presentaciones y conferencias con capacidad para 200 personas',
          requiereContrato: true
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de espacio actualizado exitosamente',
    type: TipoEspacioSingleResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos o ID no es UUID válido',
  })
  @ApiResponse({
    status: 404,
    description: 'Tipo de espacio no encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'Ya existe otro tipo de espacio con ese nombre',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTipoEspacioDto: UpdateTipoEspacioDto,
  ): Promise<TipoEspacioSingleResponseDto> {
    try {
      this.logger.log(`Actualizando tipo de espacio con ID: ${id}`);
      
      const result = await this.tipoEspacioService.updateWithBaseResponse(id, updateTipoEspacioDto);
      
      if (!result.success) {
        const statusCode = result.statusCode || 400;
        throw new HttpException(result.message, statusCode);
      }
      
      this.logger.log(`Tipo de espacio actualizado exitosamente: ${result.data?.nombre}`);
      return result;
    } catch (error) {
      this.logger.error(`Error al actualizar tipo de espacio: ${error.message}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error interno del servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Eliminar un tipo de espacio',
    description: 'Elimina físicamente un tipo de espacio si no tiene espacios arrendables asociados'
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del tipo de espacio a eliminar (formato UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de espacio eliminado exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Tipo de espacio eliminado exitosamente' },
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
    description: 'Tipo de espacio no encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'No se puede eliminar el tipo de espacio porque tiene espacios arrendables asociados',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async remove(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<BaseResponseDto<undefined>> {
    try {
      this.logger.log(`Eliminando tipo de espacio con ID: ${id}`);
      
      const result = await this.tipoEspacioService.removeWithBaseResponse(id);
      
      if (!result.success) {
        const statusCode = result.error?.message === 'Tipo de espacio en uso' ? 409 :
                         result.error?.message.includes('no encontrado') ? 404 : 500;
        throw new HttpException(result.message, statusCode);
      }
      
      this.logger.log(`Tipo de espacio eliminado exitosamente con ID: ${id}`);
      return result;
    } catch (error) {
      this.logger.error(`Error al eliminar tipo de espacio: ${error.message}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error interno del servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('buscar/:nombre')
  @ApiOperation({
    summary: 'Buscar tipo de espacio por nombre específico',
    description: 'Busca un tipo de espacio utilizando su nombre exacto como criterio de búsqueda'
  })
  @ApiParam({
    name: 'nombre',
    description: 'Nombre exacto del tipo de espacio a buscar',
    example: 'Salón de eventos',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de espacio encontrado exitosamente',
    type: TipoEspacioSingleResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontró un tipo de espacio con ese nombre',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async findByNombre(@Param('nombre') nombre: string): Promise<TipoEspacioSingleResponseDto> {
    try {
      this.logger.log(`Buscando tipo de espacio por nombre: ${nombre}`);
      
      const result = await this.tipoEspacioService.findByNombreWithBaseResponse(nombre);
      
      if (!result.success) {
        const statusCode = result.statusCode || 404;
        throw new HttpException(result.message, statusCode);
      }
      
      this.logger.log(`Tipo de espacio encontrado: ${result.data?.nombre}`);
      return result;
    } catch (error) {
      this.logger.error(`Error al buscar tipo de espacio por nombre: ${error.message}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error interno del servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

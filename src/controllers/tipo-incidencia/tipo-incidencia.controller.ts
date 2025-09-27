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
  Inject,
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
  CreateTipoIncidenciaDto,
  UpdateTipoIncidenciaDto,
  TipoIncidenciaResponseDto,
  TipoIncidenciaSingleResponseDto,
  TipoIncidenciaArrayResponseDto,
} from 'src/dtos';
import { BaseResponseDto } from '../../dtos/baseResponse/baseResponse.dto';
import { ITipoIncidenciaService } from '../../services/interfaces/tipo-incidencia.interface';
import { PrioridadIncidencia } from '../../Enums/inicidencias.enum';

@ApiTags('🚨 Tipos de Incidencia')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('tipos-incidencia')
export class TipoIncidenciaController {
  private readonly logger = new Logger(TipoIncidenciaController.name);

  constructor(
    @Inject('ITipoIncidenciaService')
    private readonly tipoIncidenciaService: ITipoIncidenciaService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear un nuevo tipo de incidencia',
    description:
      'Crea un nuevo tipo de incidencia en el sistema con validación de duplicados y configuración de prioridad',
  })
  @ApiBody({
    type: CreateTipoIncidenciaDto,
    description: 'Datos para crear un tipo de incidencia',
    examples: {
      ejemplo_completo: {
        summary: 'Tipo de incidencia completo',
        description: 'Ejemplo con todos los campos opcionales incluidos',
        value: {
          nombre: 'Problema Eléctrico',
          descripcion:
            'Problemas relacionados con el sistema eléctrico del edificio como cortes de luz, fallas en tomas de corriente, etc.',
          prioridad: PrioridadIncidencia.ALTA,
          colorHex: '#FF5722',
          estaActivo: true,
        },
      },
      ejemplo_minimo: {
        summary: 'Tipo de incidencia mínimo',
        description: 'Ejemplo con solo los campos requeridos',
        value: {
          nombre: 'Plomería',
          prioridad: PrioridadIncidencia.MEDIA,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Tipo de incidencia creado exitosamente',
    type: TipoIncidenciaSingleResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos o campos requeridos faltantes',
  })
  @ApiResponse({
    status: 409,
    description: 'Ya existe un tipo de incidencia con ese nombre',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async create(
    @Body() createTipoIncidenciaDto: CreateTipoIncidenciaDto,
  ): Promise<TipoIncidenciaSingleResponseDto> {
    try {
      this.logger.log(
        `Creando tipo de incidencia: ${createTipoIncidenciaDto.nombre}`,
      );

      const result = await this.tipoIncidenciaService.createWithBaseResponse(
        createTipoIncidenciaDto,
      );

      if (!result.success) {
        const statusCode = result.statusCode || 400;
        throw new HttpException(result.message, statusCode);
      }

      this.logger.log(
        `Tipo de incidencia creado exitosamente con ID: ${result.data?.idTipoIncidencia}`,
      );
      return result;
    } catch (error) {
      this.logger.error(`Error al crear tipo de incidencia: ${error.message}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los tipos de incidencia',
    description:
      'Retorna la lista completa de tipos de incidencia ordenados alfabéticamente con información de prioridad y estado',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de tipos de incidencia obtenida exitosamente',
    type: TipoIncidenciaArrayResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async findAll(): Promise<TipoIncidenciaArrayResponseDto> {
    try {
      this.logger.log('Obteniendo todos los tipos de incidencia');

      const result = await this.tipoIncidenciaService.findAllWithBaseResponse();

      if (!result.success) {
        throw new HttpException(result.message, result.statusCode || 500);
      }

      this.logger.log(
        `Se encontraron ${result.data?.length || 0} tipos de incidencia`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Error al obtener tipos de incidencia: ${error.message}`,
      );
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un tipo de incidencia por ID',
    description:
      'Busca y retorna un tipo de incidencia específico usando su identificador único',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del tipo de incidencia (formato UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de incidencia encontrado exitosamente',
    type: TipoIncidenciaSingleResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'ID proporcionado no es un UUID válido',
  })
  @ApiResponse({
    status: 404,
    description: 'Tipo de incidencia no encontrado',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<TipoIncidenciaSingleResponseDto> {
    try {
      this.logger.log(`Buscando tipo de incidencia con ID: ${id}`);

      const result =
        await this.tipoIncidenciaService.findOneWithBaseResponse(id);

      if (!result.success) {
        const statusCode = result.statusCode || 404;
        throw new HttpException(result.message, statusCode);
      }

      this.logger.log(`Tipo de incidencia encontrado: ${result.data?.nombre}`);
      return result;
    } catch (error) {
      this.logger.error(`Error al buscar tipo de incidencia: ${error.message}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un tipo de incidencia',
    description:
      'Actualiza parcial o totalmente un tipo de incidencia existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del tipo de incidencia a actualizar (formato UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
    type: 'string',
    format: 'uuid',
  })
  @ApiBody({
    type: UpdateTipoIncidenciaDto,
    description: 'Datos a actualizar del tipo de incidencia',
    examples: {
      actualizacion_parcial: {
        summary: 'Actualización parcial',
        description: 'Ejemplo de actualización solo del nombre y descripción',
        value: {
          nombre: 'Problema Eléctrico Avanzado',
          descripcion:
            'Problemas complejos con el sistema eléctrico que requieren atención especializada',
        },
      },
      cambio_prioridad: {
        summary: 'Cambio de prioridad',
        description: 'Ejemplo de actualización de prioridad y color',
        value: {
          prioridad: PrioridadIncidencia.CRITICA,
          colorHex: '#D32F2F',
        },
      },
      desactivacion: {
        summary: 'Desactivar tipo',
        description: 'Ejemplo para desactivar un tipo de incidencia',
        value: {
          estaActivo: false,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de incidencia actualizado exitosamente',
    type: TipoIncidenciaSingleResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos o ID no es UUID válido',
  })
  @ApiResponse({
    status: 404,
    description: 'Tipo de incidencia no encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'Ya existe otro tipo de incidencia con ese nombre',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTipoIncidenciaDto: UpdateTipoIncidenciaDto,
  ): Promise<TipoIncidenciaSingleResponseDto> {
    try {
      this.logger.log(`Actualizando tipo de incidencia con ID: ${id}`);

      const result = await this.tipoIncidenciaService.updateWithBaseResponse(
        id,
        updateTipoIncidenciaDto,
      );

      if (!result.success) {
        const statusCode = result.statusCode || 400;
        throw new HttpException(result.message, statusCode);
      }

      this.logger.log(
        `Tipo de incidencia actualizado exitosamente: ${result.data?.nombre}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Error al actualizar tipo de incidencia: ${error.message}`,
      );
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Eliminar un tipo de incidencia (eliminación lógica)',
    description:
      'Elimina lógicamente un tipo de incidencia marcándolo como inactivo si no tiene incidencias activas asociadas',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del tipo de incidencia a eliminar (formato UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de incidencia eliminado exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        statusCode: { type: 'number', example: 200 },
        message: {
          type: 'string',
          example: 'Tipo de incidencia eliminado exitosamente',
        },
        data: { type: 'null', example: null },
        error: { type: 'null', example: null },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'ID proporcionado no es un UUID válido',
  })
  @ApiResponse({
    status: 404,
    description: 'Tipo de incidencia no encontrado',
  })
  @ApiResponse({
    status: 409,
    description:
      'No se puede eliminar el tipo de incidencia porque tiene incidencias activas asociadas',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<BaseResponseDto<undefined>> {
    try {
      this.logger.log(`Eliminando tipo de incidencia con ID: ${id}`);

      const result =
        await this.tipoIncidenciaService.removeWithBaseResponse(id);

      if (!result.success) {
        const statusCode =
          result.error?.message === 'Tipo de incidencia en uso'
            ? 409
            : result.error?.message.includes('no encontrado')
              ? 404
              : 500;
        throw new HttpException(result.message, statusCode);
      }

      this.logger.log(
        `Tipo de incidencia eliminado exitosamente con ID: ${id}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Error al eliminar tipo de incidencia: ${error.message}`,
      );
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('buscar/:nombre')
  @ApiOperation({
    summary: 'Buscar tipo de incidencia por nombre específico',
    description:
      'Busca un tipo de incidencia activo utilizando su nombre exacto como criterio de búsqueda',
  })
  @ApiParam({
    name: 'nombre',
    description: 'Nombre exacto del tipo de incidencia a buscar',
    example: 'Problema Eléctrico',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de incidencia encontrado exitosamente',
    type: TipoIncidenciaSingleResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontró un tipo de incidencia activo con ese nombre',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async findByNombre(
    @Param('nombre') nombre: string,
  ): Promise<TipoIncidenciaSingleResponseDto> {
    try {
      this.logger.log(`Buscando tipo de incidencia por nombre: ${nombre}`);

      const result =
        await this.tipoIncidenciaService.findByNombreWithBaseResponse(nombre);

      if (!result.success) {
        const statusCode = result.statusCode || 404;
        throw new HttpException(result.message, statusCode);
      }

      this.logger.log(`Tipo de incidencia encontrado: ${result.data?.nombre}`);
      return result;
    } catch (error) {
      this.logger.error(
        `Error al buscar tipo de incidencia por nombre: ${error.message}`,
      );
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('prioridad/:prioridad')
  @ApiOperation({
    summary: 'Obtener tipos de incidencia por nivel de prioridad',
    description:
      'Retorna todos los tipos de incidencia activos que tienen un nivel de prioridad específico',
  })
  @ApiParam({
    name: 'prioridad',
    description: 'Nivel de prioridad de los tipos de incidencia a buscar',
    example: PrioridadIncidencia.ALTA,
    enum: PrioridadIncidencia,
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Tipos de incidencia por prioridad obtenidos exitosamente',
    type: TipoIncidenciaArrayResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async findByPrioridad(
    @Param('prioridad') prioridad: string,
  ): Promise<TipoIncidenciaArrayResponseDto> {
    try {
      this.logger.log(
        `Buscando tipos de incidencia con prioridad: ${prioridad}`,
      );

      const result =
        await this.tipoIncidenciaService.findByPrioridadWithBaseResponse(
          prioridad,
        );

      if (!result.success) {
        throw new HttpException(result.message, result.statusCode || 500);
      }

      this.logger.log(
        `Se encontraron ${result.data?.length || 0} tipos de incidencia con prioridad ${prioridad}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Error al buscar tipos de incidencia por prioridad: ${error.message}`,
      );
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('activos/disponibles')
  @ApiOperation({
    summary: 'Obtener tipos de incidencia activos',
    description:
      'Retorna todos los tipos de incidencia que están marcados como activos en el sistema',
  })
  @ApiResponse({
    status: 200,
    description: 'Tipos de incidencia activos obtenidos exitosamente',
    type: TipoIncidenciaArrayResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async findActivos(): Promise<TipoIncidenciaArrayResponseDto> {
    try {
      this.logger.log('Obteniendo tipos de incidencia activos');

      const result =
        await this.tipoIncidenciaService.findActivosWithBaseResponse();

      if (!result.success) {
        throw new HttpException(result.message, result.statusCode || 500);
      }

      this.logger.log(
        `Se encontraron ${result.data?.length || 0} tipos de incidencia activos`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Error al obtener tipos de incidencia activos: ${error.message}`,
      );
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

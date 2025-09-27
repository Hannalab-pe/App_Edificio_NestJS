import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpException,
  HttpStatus,
  ParseUUIDPipe,
  Inject,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  CreateTipoContratoDto,
  UpdateTipoContratoDto,
  TipoContratoSingleResponseDto,
  TipoContratoArrayResponseDto,
} from '../../dtos';
import { BaseResponseDto } from '../../dtos/baseResponse/baseResponse.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ITipoContratoService } from '../../services/interfaces/tipo-contrato.interface';

@ApiTags('tipos-contrato')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('tipos-contrato')
export class TipoContratoController {
  constructor(
    @Inject('ITipoContratoService')
    private readonly tipoContratoService: ITipoContratoService,
  ) {}

  /**
   * Crear un nuevo tipo de contrato
   * @param createTipoContratoDto - Datos del tipo de contrato a crear
   * @returns TipoContratoSingleResponseDto - Respuesta con el tipo de contrato creado
   */
  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo tipo de contrato',
    description:
      'Crea un nuevo tipo de contrato en el sistema con autenticación JWT requerida. Valida que el nombre no esté duplicado.',
  })
  @ApiBody({
    type: CreateTipoContratoDto,
    description: 'Datos del tipo de contrato a crear',
    examples: {
      ejemplo1: {
        summary: 'Tipo de contrato de ejemplo',
        description: 'Ejemplo de creación de tipo de contrato',
        value: {
          nombre: 'Contrato de Arrendamiento',
          descripcion: 'Contrato utilizado para el arrendamiento de espacios',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Tipo de contrato creado exitosamente',
    type: TipoContratoSingleResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos o nombre duplicado',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: {
          type: 'string',
          example: 'Ya existe un tipo de contrato con este nombre',
        },
        data: { type: 'null' },
        errors: {
          type: 'array',
          items: { type: 'string' },
          example: ['El nombre es requerido'],
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticación inválido o faltante',
  })
  async create(
    @Body() createTipoContratoDto: CreateTipoContratoDto,
  ): Promise<TipoContratoSingleResponseDto> {
    try {
      return await this.tipoContratoService.createWithBaseResponse(
        createTipoContratoDto,
      );
    } catch (error) {
      throw new HttpException(
        error.message || 'Error interno del servidor',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Obtener todos los tipos de contrato
   * @returns TipoContratoArrayResponseDto - Lista de todos los tipos de contrato
   */
  @Get()
  @ApiOperation({
    summary: 'Obtener todos los tipos de contrato',
    description:
      'Retorna una lista de todos los tipos de contrato registrados en el sistema con autenticación JWT requerida.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de tipos de contrato obtenida exitosamente',
    type: TipoContratoArrayResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticación inválido o faltante',
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontraron tipos de contrato',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: {
          type: 'string',
          example: 'No se encontraron tipos de contrato',
        },
        data: { type: 'array', items: {}, example: [] },
        errors: { type: 'array', items: { type: 'string' }, example: [] },
      },
    },
  })
  async findAll(): Promise<TipoContratoArrayResponseDto> {
    try {
      return await this.tipoContratoService.findAllWithBaseResponse();
    } catch (error) {
      throw new HttpException(
        error.message || 'Error interno del servidor',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Obtener un tipo de contrato por ID
   * @param id - UUID del tipo de contrato
   * @returns TipoContratoSingleResponseDto - Tipo de contrato encontrado
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un tipo de contrato por ID',
    description:
      'Retorna un tipo de contrato específico basado en su UUID con autenticación JWT requerida.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'UUID único del tipo de contrato',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de contrato encontrado exitosamente',
    type: TipoContratoSingleResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'UUID inválido proporcionado',
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticación inválido o faltante',
  })
  @ApiResponse({
    status: 404,
    description: 'Tipo de contrato no encontrado',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Tipo de contrato no encontrado' },
        data: { type: 'null' },
        errors: { type: 'array', items: { type: 'string' }, example: [] },
      },
    },
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<TipoContratoSingleResponseDto> {
    try {
      return await this.tipoContratoService.findOneWithBaseResponse(id);
    } catch (error) {
      throw new HttpException(
        error.message || 'Error interno del servidor',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Actualizar un tipo de contrato
   * @param id - UUID del tipo de contrato
   * @param updateTipoContratoDto - Datos de actualización
   * @returns TipoContratoSingleResponseDto - Tipo de contrato actualizado
   */
  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un tipo de contrato',
    description:
      'Actualiza parcial o completamente los datos de un tipo de contrato existente con autenticación JWT requerida. Valida duplicados de nombre.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'UUID único del tipo de contrato a actualizar',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({
    type: UpdateTipoContratoDto,
    description:
      'Datos de actualización del tipo de contrato (campos opcionales)',
    examples: {
      actualizar_parcial: {
        summary: 'Actualización parcial',
        description: 'Ejemplo de actualización de solo algunos campos',
        value: {
          nombre: 'Contrato de Servicios',
        },
      },
      actualizar_completa: {
        summary: 'Actualización completa',
        description: 'Ejemplo de actualización de todos los campos',
        value: {
          nombre: 'Contrato de Mantenimiento',
          descripcion: 'Contrato para servicios de mantenimiento del edificio',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de contrato actualizado exitosamente',
    type: TipoContratoSingleResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos, UUID inválido o nombre duplicado',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: {
          type: 'string',
          example: 'Ya existe otro tipo de contrato con este nombre',
        },
        data: { type: 'null' },
        errors: {
          type: 'array',
          items: { type: 'string' },
          example: ['El nombre debe tener al menos 2 caracteres'],
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticación inválido o faltante',
  })
  @ApiResponse({
    status: 404,
    description: 'Tipo de contrato no encontrado',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Tipo de contrato no encontrado' },
        data: { type: 'null' },
        errors: { type: 'array', items: { type: 'string' }, example: [] },
      },
    },
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTipoContratoDto: UpdateTipoContratoDto,
  ): Promise<TipoContratoSingleResponseDto> {
    try {
      return await this.tipoContratoService.updateWithBaseResponse(
        id,
        updateTipoContratoDto,
      );
    } catch (error) {
      throw new HttpException(
        error.message || 'Error interno del servidor',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Eliminar un tipo de contrato
   * @param id - UUID del tipo de contrato
   * @returns BaseResponseDto - Confirmación de eliminación
   */
  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar un tipo de contrato',
    description:
      'Elimina un tipo de contrato del sistema con autenticación JWT requerida. Verifica que no esté en uso por registros existentes.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'UUID único del tipo de contrato a eliminar',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de contrato eliminado exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: {
          type: 'string',
          example: 'Tipo de contrato eliminado exitosamente',
        },
        data: { type: 'null' },
        errors: { type: 'array', items: { type: 'string' }, example: [] },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'UUID inválido o tipo de contrato en uso',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: {
          type: 'string',
          example:
            'No se puede eliminar el tipo de contrato porque está en uso por registros existentes',
        },
        data: { type: 'null' },
        errors: { type: 'array', items: { type: 'string' }, example: [] },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticación inválido o faltante',
  })
  @ApiResponse({
    status: 404,
    description: 'Tipo de contrato no encontrado',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Tipo de contrato no encontrado' },
        data: { type: 'null' },
        errors: { type: 'array', items: { type: 'string' }, example: [] },
      },
    },
  })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<BaseResponseDto<undefined>> {
    try {
      return await this.tipoContratoService.removeWithBaseResponse(id);
    } catch (error) {
      throw new HttpException(
        error.message || 'Error interno del servidor',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Buscar tipo de contrato por nombre
   * @param nombre - Nombre a buscar
   * @returns TipoContratoSingleResponseDto - Tipo de contrato encontrado
   */
  @Get('nombre/:nombre')
  @ApiOperation({
    summary: 'Buscar tipo de contrato por nombre',
    description:
      'Busca un tipo de contrato que contenga el nombre especificado (búsqueda parcial insensible a mayúsculas) con autenticación JWT requerida.',
  })
  @ApiParam({
    name: 'nombre',
    type: 'string',
    description: 'Nombre o parte del nombre del tipo de contrato a buscar',
    example: 'arrendamiento',
  })
  @ApiResponse({
    status: 200,
    description: 'Búsqueda realizada exitosamente',
    type: TipoContratoSingleResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticación inválido o faltante',
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontró tipo de contrato con ese nombre',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: {
          type: 'string',
          example: 'No se encontró tipo de contrato con el nombre especificado',
        },
        data: { type: 'null' },
        errors: { type: 'array', items: { type: 'string' }, example: [] },
      },
    },
  })
  async findByNombre(
    @Param('nombre') nombre: string,
  ): Promise<TipoContratoSingleResponseDto> {
    try {
      return await this.tipoContratoService.findByNombreWithBaseResponse(
        nombre,
      );
    } catch (error) {
      throw new HttpException(
        error.message || 'Error interno del servidor',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

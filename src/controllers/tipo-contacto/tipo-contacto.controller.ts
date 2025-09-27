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
  CreateTipoContactoDto,
  UpdateTipoContactoDto,
  TipoContactoSingleResponseDto,
  TipoContactoArrayResponseDto,
} from '../../dtos';
import { BaseResponseDto } from '../../dtos/baseResponse/baseResponse.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ITipoContactoService } from '../../services/interfaces/tipo-contacto.interface';
import { TipoContactoService } from '../../services/implementations/tipo-contacto/tipo-contacto.service';

@ApiTags('tipos-contacto')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('tipos-contacto')
export class TipoContactoController {
  constructor(
    @Inject('ITipoContactoService')
    private readonly tipoContactoService: ITipoContactoService,
  ) {}

  /**
   * Crear un nuevo tipo de contacto
   * @param createTipoContactoDto - Datos del tipo de contacto a crear
   * @returns TipoContactoSingleResponseDto - Respuesta con el tipo de contacto creado
   */
  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo tipo de contacto',
    description:
      'Crea un nuevo tipo de contacto en el sistema con autenticación JWT requerida. Valida que el nombre no esté duplicado.',
  })
  @ApiBody({
    type: CreateTipoContactoDto,
    description: 'Datos del tipo de contacto a crear',
    examples: {
      ejemplo1: {
        summary: 'Tipo de contacto de ejemplo',
        description: 'Ejemplo de creación de tipo de contacto',
        value: {
          nombre: 'Email',
          descripcion: 'Contacto por correo electrónico',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Tipo de contacto creado exitosamente',
    type: TipoContactoSingleResponseDto,
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
          example: 'Ya existe un tipo de contacto con este nombre',
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
    @Body() createTipoContactoDto: CreateTipoContactoDto,
  ): Promise<TipoContactoSingleResponseDto> {
    try {
      return await this.tipoContactoService.createWithBaseResponse(
        createTipoContactoDto,
      );
    } catch (error) {
      throw new HttpException(
        error.message || 'Error interno del servidor',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Obtener todos los tipos de contacto
   * @returns TipoContactoArrayResponseDto - Lista de todos los tipos de contacto
   */
  @Get()
  @ApiOperation({
    summary: 'Obtener todos los tipos de contacto',
    description:
      'Retorna una lista de todos los tipos de contacto registrados en el sistema con autenticación JWT requerida.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de tipos de contacto obtenida exitosamente',
    type: TipoContactoArrayResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticación inválido o faltante',
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontraron tipos de contacto',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: {
          type: 'string',
          example: 'No se encontraron tipos de contacto',
        },
        data: { type: 'array', items: {}, example: [] },
        errors: { type: 'array', items: { type: 'string' }, example: [] },
      },
    },
  })
  async findAll(): Promise<TipoContactoArrayResponseDto> {
    try {
      return await this.tipoContactoService.findAllWithBaseResponse();
    } catch (error) {
      throw new HttpException(
        error.message || 'Error interno del servidor',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Obtener un tipo de contacto por ID
   * @param id - UUID del tipo de contacto
   * @returns TipoContactoSingleResponseDto - Tipo de contacto encontrado
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un tipo de contacto por ID',
    description:
      'Retorna un tipo de contacto específico basado en su UUID con autenticación JWT requerida.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'UUID único del tipo de contacto',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de contacto encontrado exitosamente',
    type: TipoContactoSingleResponseDto,
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
    description: 'Tipo de contacto no encontrado',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Tipo de contacto no encontrado' },
        data: { type: 'null' },
        errors: { type: 'array', items: { type: 'string' }, example: [] },
      },
    },
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<TipoContactoSingleResponseDto> {
    try {
      return await this.tipoContactoService.findOneWithBaseResponse(id);
    } catch (error) {
      throw new HttpException(
        error.message || 'Error interno del servidor',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Actualizar un tipo de contacto
   * @param id - UUID del tipo de contacto
   * @param updateTipoContactoDto - Datos de actualización
   * @returns TipoContactoSingleResponseDto - Tipo de contacto actualizado
   */
  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un tipo de contacto',
    description:
      'Actualiza parcial o completamente los datos de un tipo de contacto existente con autenticación JWT requerida. Valida duplicados de nombre.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'UUID único del tipo de contacto a actualizar',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({
    type: UpdateTipoContactoDto,
    description:
      'Datos de actualización del tipo de contacto (campos opcionales)',
    examples: {
      actualizar_parcial: {
        summary: 'Actualización parcial',
        description: 'Ejemplo de actualización de solo algunos campos',
        value: {
          nombre: 'WhatsApp',
        },
      },
      actualizar_completa: {
        summary: 'Actualización completa',
        description: 'Ejemplo de actualización de todos los campos',
        value: {
          nombre: 'Telegram',
          descripcion: 'Mensajería por Telegram',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de contacto actualizado exitosamente',
    type: TipoContactoSingleResponseDto,
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
          example: 'Ya existe otro tipo de contacto con este nombre',
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
    description: 'Tipo de contacto no encontrado',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Tipo de contacto no encontrado' },
        data: { type: 'null' },
        errors: { type: 'array', items: { type: 'string' }, example: [] },
      },
    },
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTipoContactoDto: UpdateTipoContactoDto,
  ): Promise<TipoContactoSingleResponseDto> {
    try {
      return await this.tipoContactoService.updateWithBaseResponse(
        id,
        updateTipoContactoDto,
      );
    } catch (error) {
      throw new HttpException(
        error.message || 'Error interno del servidor',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Eliminar un tipo de contacto
   * @param id - UUID del tipo de contacto
   * @returns BaseResponseDto - Confirmación de eliminación
   */
  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar un tipo de contacto',
    description:
      'Elimina un tipo de contacto del sistema con autenticación JWT requerida. Verifica que no esté en uso por contactos existentes.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'UUID único del tipo de contacto a eliminar',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de contacto eliminado exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: {
          type: 'string',
          example: 'Tipo de contacto eliminado exitosamente',
        },
        data: { type: 'null' },
        errors: { type: 'array', items: { type: 'string' }, example: [] },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'UUID inválido o tipo de contacto en uso',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: {
          type: 'string',
          example:
            'No se puede eliminar el tipo de contacto porque está en uso por contactos existentes',
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
    description: 'Tipo de contacto no encontrado',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Tipo de contacto no encontrado' },
        data: { type: 'null' },
        errors: { type: 'array', items: { type: 'string' }, example: [] },
      },
    },
  })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<BaseResponseDto<undefined>> {
    try {
      return await this.tipoContactoService.removeWithBaseResponse(id);
    } catch (error) {
      throw new HttpException(
        error.message || 'Error interno del servidor',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Buscar tipos de contacto por nombre
   * @param nombre - Nombre a buscar
   * @returns TipoContactoArrayResponseDto - Tipos de contacto encontrados
   */
  @Get('nombre/:nombre')
  @ApiOperation({
    summary: 'Buscar tipos de contacto por nombre',
    description:
      'Busca tipos de contacto que contengan el nombre especificado (búsqueda parcial insensible a mayúsculas) con autenticación JWT requerida.',
  })
  @ApiParam({
    name: 'nombre',
    type: 'string',
    description: 'Nombre o parte del nombre del tipo de contacto a buscar',
    example: 'mail',
  })
  @ApiResponse({
    status: 200,
    description: 'Búsqueda realizada exitosamente',
    type: TipoContactoArrayResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticación inválido o faltante',
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontraron tipos de contacto con ese nombre',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: {
          type: 'string',
          example:
            'No se encontraron tipos de contacto con el nombre especificado',
        },
        data: { type: 'array', items: {}, example: [] },
        errors: { type: 'array', items: { type: 'string' }, example: [] },
      },
    },
  })
  async findByNombre(
    @Param('nombre') nombre: string,
  ): Promise<TipoContactoArrayResponseDto> {
    try {
      return await this.tipoContactoService.findByNombreWithBaseResponse(
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

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  HttpStatus,
  HttpCode,
  Inject,
  ParseUUIDPipe,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { IVisitaService } from '../../services/interfaces/visita.interface';
import {
  CreateVisitaDto,
  UpdateVisitaDto,
  VisitaResponseDto,
  VisitaListResponseDto,
  VisitaDto,
} from '../../dtos/visita';
import { ErrorResponseDto } from '../../dtos/auth';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

/**
 * Controlador para la gestión de visitas
 * Proporciona endpoints REST para CRUD y funcionalidades específicas de visitas
 * Incluye validaciones de autorización y documentación Swagger completa
 */
@ApiTags('Visitas') // Agrupación en Swagger
@Controller('visitas') // Ruta base: /api/v1/visitas
@UseGuards(JwtAuthGuard) // Requiere autenticación JWT para todos los endpoints
@ApiBearerAuth() // Indica en Swagger que requiere Bearer token
export class VisitaController {
  constructor(
    @Inject('IVisitaService')
    private readonly visitaService: IVisitaService,
  ) {}

  /**
   * Crear una nueva visita
   * POST /api/v1/visitas
   */
  @Post()
  @HttpCode(HttpStatus.CREATED) // Retorna 201 para creación exitosa
  @ApiOperation({
    summary: 'Crear nueva visita',
    description:
      'Crea una nueva visita con validaciones de usuario autorizador y propiedad. Genera código QR único.',
  })
  @ApiResponse({
    status: 201,
    description: 'Visita creada exitosamente',
    type: VisitaResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos (horarios, fechas pasadas, etc.)',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario autorizador o propiedad no encontrada',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido o expirado',
    type: ErrorResponseDto,
  })
  async create(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    createVisitaDto: CreateVisitaDto,
  ): Promise<VisitaResponseDto> {
    try {
      // Crear la visita usando el servicio
      const visitaCreada = await this.visitaService.create(createVisitaDto);

      // Formatear respuesta para el cliente
      return {
        success: true,
        message: 'Visita creada exitosamente',
        data: this.formatearVisitaParaRespuesta(visitaCreada),
      };
    } catch (error) {
      // Re-lanzar el error para que NestJS lo maneje apropiadamente
      throw error;
    }
  }

  /**
   * Obtener todas las visitas
   * GET /api/v1/visitas
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obtener todas las visitas',
    description:
      'Retorna todas las visitas ordenadas por fecha programada descendente',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de visitas obtenida exitosamente',
    type: VisitaListResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido o expirado',
    type: ErrorResponseDto,
  })
  async findAll(): Promise<VisitaListResponseDto> {
    try {
      // Obtener todas las visitas
      const visitas = await this.visitaService.findAll();

      // Formatear respuesta
      return {
        success: true,
        message: 'Visitas obtenidas exitosamente',
        data: visitas.map((visita) =>
          this.formatearVisitaParaRespuesta(visita),
        ),
        pagination: {
          total: visitas.length,
          page: 1,
          limit: visitas.length,
          totalPages: 1,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtener una visita específica por ID
   * GET /api/v1/visitas/:id
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obtener visita por ID',
    description:
      'Retorna una visita específica con todos sus detalles y relaciones',
  })
  @ApiParam({
    name: 'id',
    description: 'ID UUID de la visita',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Visita encontrada exitosamente',
    type: VisitaResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Visita no encontrada',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido o expirado',
    type: ErrorResponseDto,
  })
  async findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<VisitaResponseDto> {
    try {
      // Buscar la visita por ID
      const visita = await this.visitaService.findOne(id);

      // Formatear respuesta
      return {
        success: true,
        message: 'Visita encontrada exitosamente',
        data: this.formatearVisitaParaRespuesta(visita),
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Actualizar una visita existente
   * PUT /api/v1/visitas/:id
   */
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Actualizar visita',
    description:
      'Actualiza una visita existente con validaciones de datos y relaciones',
  })
  @ApiParam({
    name: 'id',
    description: 'ID UUID de la visita a actualizar',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Visita actualizada exitosamente',
    type: VisitaResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Visita, usuario o propiedad no encontrada',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido o expirado',
    type: ErrorResponseDto,
  })
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    updateVisitaDto: UpdateVisitaDto,
  ): Promise<VisitaResponseDto> {
    try {
      // Actualizar la visita
      const visitaActualizada = await this.visitaService.update(
        id,
        updateVisitaDto,
      );

      // Formatear respuesta
      return {
        success: true,
        message: 'Visita actualizada exitosamente',
        data: this.formatearVisitaParaRespuesta(visitaActualizada),
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Eliminar una visita (soft delete)
   * DELETE /api/v1/visitas/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Cancelar visita',
    description: 'Cancela una visita (soft delete - cambia estado a CANCELADA)',
  })
  @ApiParam({
    name: 'id',
    description: 'ID UUID de la visita a cancelar',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Visita cancelada exitosamente',
    schema: {
      example: {
        success: true,
        message: 'Visita cancelada exitosamente',
        data: null,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Visita no encontrada',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido o expirado',
    type: ErrorResponseDto,
  })
  async remove(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<{ success: boolean; message: string; data: null }> {
    try {
      // Cancelar la visita
      await this.visitaService.remove(id);

      // Retornar confirmación
      return {
        success: true,
        message: 'Visita cancelada exitosamente',
        data: null,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtener visitas por estado
   * GET /api/v1/visitas/estado/:estado
   */
  @Get('estado/:estado')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obtener visitas por estado',
    description:
      'Retorna todas las visitas que coincidan con el estado especificado',
  })
  @ApiParam({
    name: 'estado',
    description: 'Estado de la visita',
    enum: ['PROGRAMADA', 'EN_CURSO', 'FINALIZADA', 'CANCELADA'],
    example: 'PROGRAMADA',
  })
  @ApiResponse({
    status: 200,
    description: 'Visitas filtradas por estado obtenidas exitosamente',
    type: VisitaListResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido o expirado',
    type: ErrorResponseDto,
  })
  async findByEstado(
    @Param('estado') estado: string,
  ): Promise<VisitaListResponseDto> {
    try {
      // Obtener visitas por estado
      const visitas = await this.visitaService.findByEstado(estado);

      // Formatear respuesta
      return {
        success: true,
        message: `Visitas con estado ${estado} obtenidas exitosamente`,
        data: visitas.map((visita) =>
          this.formatearVisitaParaRespuesta(visita),
        ),
        pagination: {
          total: visitas.length,
          page: 1,
          limit: visitas.length,
          totalPages: 1,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtener visitas por propiedad
   * GET /api/v1/visitas/propiedad/:propiedadId
   */
  @Get('propiedad/:propiedadId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obtener visitas por propiedad',
    description:
      'Retorna todas las visitas programadas para una propiedad específica',
  })
  @ApiParam({
    name: 'propiedadId',
    description: 'ID UUID de la propiedad',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @ApiResponse({
    status: 200,
    description: 'Visitas de la propiedad obtenidas exitosamente',
    type: VisitaListResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Propiedad no encontrada',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido o expirado',
    type: ErrorResponseDto,
  })
  async findByPropiedad(
    @Param('propiedadId', new ParseUUIDPipe({ version: '4' }))
    propiedadId: string,
  ): Promise<VisitaListResponseDto> {
    try {
      // Obtener visitas por propiedad
      const visitas = await this.visitaService.findByPropiedad(propiedadId);

      // Formatear respuesta
      return {
        success: true,
        message: 'Visitas de la propiedad obtenidas exitosamente',
        data: visitas.map((visita) =>
          this.formatearVisitaParaRespuesta(visita),
        ),
        pagination: {
          total: visitas.length,
          page: 1,
          limit: visitas.length,
          totalPages: 1,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Registrar ingreso de visita mediante código QR
   * POST /api/v1/visitas/ingreso/:codigoQr
   */
  @Post('ingreso/:codigoQr')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Registrar ingreso de visita',
    description: 'Registra el ingreso de una visita usando su código QR único',
  })
  @ApiParam({
    name: 'codigoQr',
    description: 'Código QR único de la visita',
    example: 'VV_20240115_143000_ABC123',
  })
  @ApiResponse({
    status: 200,
    description: 'Ingreso registrado exitosamente',
    type: VisitaResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Código QR no válido o visita no encontrada',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Estado de visita no válido para registrar ingreso',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido o expirado',
    type: ErrorResponseDto,
  })
  async registrarIngreso(
    @Param('codigoQr') codigoQr: string,
  ): Promise<VisitaResponseDto> {
    try {
      // Registrar ingreso
      const visitaActualizada =
        await this.visitaService.registrarIngreso(codigoQr);

      // Formatear respuesta
      return {
        success: true,
        message: 'Ingreso registrado exitosamente',
        data: this.formatearVisitaParaRespuesta(visitaActualizada),
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Registrar salida de visita mediante código QR
   * POST /api/v1/visitas/salida/:codigoQr
   */
  @Post('salida/:codigoQr')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Registrar salida de visita',
    description: 'Registra la salida de una visita usando su código QR único',
  })
  @ApiParam({
    name: 'codigoQr',
    description: 'Código QR único de la visita',
    example: 'VV_20240115_143000_ABC123',
  })
  @ApiResponse({
    status: 200,
    description: 'Salida registrada exitosamente',
    type: VisitaResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Código QR no válido o visita no encontrada',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Estado de visita no válido para registrar salida',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido o expirado',
    type: ErrorResponseDto,
  })
  async registrarSalida(
    @Param('codigoQr') codigoQr: string,
  ): Promise<VisitaResponseDto> {
    try {
      // Registrar salida
      const visitaActualizada =
        await this.visitaService.registrarSalida(codigoQr);

      // Formatear respuesta
      return {
        success: true,
        message: 'Salida registrada exitosamente',
        data: this.formatearVisitaParaRespuesta(visitaActualizada),
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtener visitas en un rango de fechas
   * GET /api/v1/visitas/fechas?inicio=2024-01-01&fin=2024-01-31
   */
  @Get('rango-fechas')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obtener visitas por rango de fechas',
    description: 'Retorna visitas programadas en un rango de fechas específico',
  })
  @ApiQuery({
    name: 'inicio',
    description: 'Fecha de inicio del rango (YYYY-MM-DD)',
    example: '2024-01-01',
    required: true,
  })
  @ApiQuery({
    name: 'fin',
    description: 'Fecha de fin del rango (YYYY-MM-DD)',
    example: '2024-01-31',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Visitas en el rango de fechas obtenidas exitosamente',
    type: VisitaListResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Rango de fechas inválido',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido o expirado',
    type: ErrorResponseDto,
  })
  async findByFechaRange(
    @Query('inicio') fechaInicio: string,
    @Query('fin') fechaFin: string,
  ): Promise<VisitaListResponseDto> {
    try {
      // Convertir strings a fechas
      const inicio = new Date(fechaInicio);
      const fin = new Date(fechaFin);

      // Obtener visitas en el rango
      const visitas = await this.visitaService.findByFechaRange(inicio, fin);

      // Formatear respuesta
      return {
        success: true,
        message: `Visitas del ${fechaInicio} al ${fechaFin} obtenidas exitosamente`,
        data: visitas.map((visita) =>
          this.formatearVisitaParaRespuesta(visita),
        ),
        pagination: {
          total: visitas.length,
          page: 1,
          limit: visitas.length,
          totalPages: 1,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Método helper para formatear la entidad Visita a DTO de respuesta
   * Transforma las relaciones anidadas en un formato más limpio para el frontend
   */
  private formatearVisitaParaRespuesta(visita: any): VisitaDto {
    return {
      idVisita: visita.idVisita,
      codigoQr: visita.codigoQr,
      nombreVisitante: visita.nombreVisitante,
      documentoVisitante: visita.documentoVisitante,
      telefonoVisitante: visita.telefonoVisitante,
      motivo: visita.motivo,
      fechaProgramada: visita.fechaProgramada,
      horaInicio: visita.horaInicio,
      horaFin: visita.horaFin,
      fechaIngreso: visita.fechaIngreso,
      fechaSalida: visita.fechaSalida,
      estado: visita.estado,
      autorizadorUsuario: {
        idUsuario: visita.autorizadorUsuario.idUsuario,
        correo: visita.autorizadorUsuario.correo,
      },
      idPropiedad: {
        idPropiedad: visita.idPropiedad.idPropiedad,
        numeroDepartamento: visita.idPropiedad.numeroDepartamento,
        tipoPropiedad: visita.idPropiedad.tipoPropiedad,
        piso: visita.idPropiedad.piso,
      },
    };
  }
}

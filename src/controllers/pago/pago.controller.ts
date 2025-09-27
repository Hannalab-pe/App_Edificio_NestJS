import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  HttpStatus,
  HttpCode,
  Inject,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { IPagoService } from '../../services/interfaces/pago.interface';
import { CreatePagoDto, UpdatePagoDto, PagoResponseDto } from '../../dtos';
import { BaseResponseDto } from '../../dtos/baseResponse/baseResponse.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { EstadoPago } from '../../Enums/globales.enum';

@ApiTags('Pagos')
@Controller('pago')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class PagoController {
  constructor(
    @Inject('IPagoService')
    private readonly pagoService: IPagoService,
  ) {}

  /**
   * Crear un nuevo pago
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear nuevo pago',
    description: 'Crea un nuevo pago en el sistema',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Pago creado exitosamente',
    type: BaseResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos inválidos o concepto de pago no encontrado',
    schema: {
      example: {
        success: false,
        message: 'Error al crear el pago',
        error: {
          code: 'VALIDATION_ERROR',
          timestamp: '2024-01-01T12:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Concepto de pago, residencia o arrendamiento no encontrado',
    schema: {
      example: {
        success: false,
        message: 'El concepto de pago especificado no existe',
        error: {
          code: 'CONCEPT_NOT_FOUND',
          timestamp: '2024-01-01T12:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado',
  })
  async create(
    @Body() createPagoDto: CreatePagoDto,
  ): Promise<BaseResponseDto<PagoResponseDto>> {
    return await this.pagoService.create(createPagoDto);
  }

  /**
   * Obtener todos los pagos
   */
  @Get()
  @ApiOperation({
    summary: 'Obtener todos los pagos',
    description:
      'Retorna una lista de todos los pagos ordenados por fecha de vencimiento',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de pagos obtenida exitosamente',
    type: BaseResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado',
  })
  async findAll(): Promise<BaseResponseDto<PagoResponseDto[]>> {
    return await this.pagoService.findAll();
  }

  /**
   * Obtener pagos por estado
   */
  @Get('estado/:estado')
  @ApiOperation({
    summary: 'Obtener pagos por estado',
    description: 'Retorna todos los pagos con un estado específico',
  })
  @ApiParam({
    name: 'estado',
    description: 'Estado del pago',
    enum: EstadoPago,
    example: EstadoPago.PENDIENTE,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Pagos por estado obtenidos exitosamente',
    type: BaseResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado',
  })
  async findByEstado(
    @Param('estado') estado: string,
  ): Promise<BaseResponseDto<PagoResponseDto[]>> {
    return await this.pagoService.findByEstado(estado);
  }

  /**
   * Obtener pagos vencidos
   */
  @Get('vencidos')
  @ApiOperation({
    summary: 'Obtener pagos vencidos',
    description: 'Retorna todos los pagos vencidos que no han sido pagados',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Pagos vencidos obtenidos exitosamente',
    type: BaseResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado',
  })
  async findVencidos(): Promise<BaseResponseDto<PagoResponseDto[]>> {
    return await this.pagoService.findVencidos();
  }

  /**
   * Obtener pagos pendientes
   */
  @Get('pendientes')
  @ApiOperation({
    summary: 'Obtener pagos pendientes',
    description: 'Retorna todos los pagos con estado pendiente',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Pagos pendientes obtenidos exitosamente',
    type: BaseResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado',
  })
  async findPendientes(): Promise<BaseResponseDto<PagoResponseDto[]>> {
    return await this.pagoService.findPendientes();
  }

  /**
   * Obtener pagos por residencia
   */
  @Get('residencia/:residenciaId')
  @ApiOperation({
    summary: 'Obtener pagos por residencia',
    description:
      'Retorna todos los pagos asociados a una residencia específica',
  })
  @ApiParam({
    name: 'residenciaId',
    type: 'string',
    description: 'ID único de la residencia',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Pagos de la residencia obtenidos exitosamente',
    type: BaseResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado',
  })
  async findByResidencia(
    @Param('residenciaId', ParseUUIDPipe) residenciaId: string,
  ): Promise<BaseResponseDto<PagoResponseDto[]>> {
    return await this.pagoService.findByResidencia(residenciaId);
  }

  /**
   * Obtener pagos por arrendamiento
   */
  @Get('arrendamiento/:arrendamientoId')
  @ApiOperation({
    summary: 'Obtener pagos por arrendamiento',
    description:
      'Retorna todos los pagos asociados a un arrendamiento específico',
  })
  @ApiParam({
    name: 'arrendamientoId',
    type: 'string',
    description: 'ID único del arrendamiento',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Pagos del arrendamiento obtenidos exitosamente',
    type: BaseResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado',
  })
  async findByArrendamiento(
    @Param('arrendamientoId', ParseUUIDPipe) arrendamientoId: string,
  ): Promise<BaseResponseDto<PagoResponseDto[]>> {
    return await this.pagoService.findByArrendamiento(arrendamientoId);
  }

  /**
   * Obtener pagos por concepto
   */
  @Get('concepto/:conceptoId')
  @ApiOperation({
    summary: 'Obtener pagos por concepto',
    description:
      'Retorna todos los pagos asociados a un concepto de pago específico',
  })
  @ApiParam({
    name: 'conceptoId',
    type: 'string',
    description: 'ID único del concepto de pago',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Pagos del concepto obtenidos exitosamente',
    type: BaseResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado',
  })
  async findByConcepto(
    @Param('conceptoId', ParseUUIDPipe) conceptoId: string,
  ): Promise<BaseResponseDto<PagoResponseDto[]>> {
    return await this.pagoService.findByConcepto(conceptoId);
  }

  /**
   * Obtener un pago por ID
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Obtener pago por ID',
    description: 'Retorna un pago específico con su información completa',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID único del pago',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Pago obtenido exitosamente',
    type: BaseResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Pago no encontrado',
    schema: {
      example: {
        success: false,
        message: 'Pago con ID 123 no encontrado',
        error: {
          code: 'PAGO_NOT_FOUND',
          timestamp: '2024-01-01T12:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado',
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<BaseResponseDto<PagoResponseDto>> {
    return await this.pagoService.findOne(id);
  }

  /**
   * Actualizar un pago
   */
  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar pago',
    description: 'Actualiza los datos de un pago existente',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID único del pago',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Pago actualizado exitosamente',
    type: BaseResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Pago no encontrado',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos inválidos',
    schema: {
      example: {
        success: false,
        message: 'El concepto de pago especificado no existe',
        error: {
          code: 'CONCEPT_NOT_FOUND',
          timestamp: '2024-01-01T12:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePagoDto: UpdatePagoDto,
  ): Promise<BaseResponseDto<PagoResponseDto>> {
    return await this.pagoService.update(id, updatePagoDto);
  }

  /**
   * Eliminar un pago
   */
  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar pago',
    description:
      'Elimina un pago si no tiene movimientos de caja o recibos asociados',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID único del pago',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Pago eliminado exitosamente',
    type: BaseResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Pago no encontrado',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'No se puede eliminar porque tiene registros asociados',
    schema: {
      example: {
        success: false,
        message:
          'No se puede eliminar el pago porque tiene movimientos de caja asociados',
        error: {
          code: 'HAS_MOVEMENTS',
          timestamp: '2024-01-01T12:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado',
  })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<BaseResponseDto<{ idPago: string; mensaje: string }>> {
    return await this.pagoService.remove(id);
  }
}

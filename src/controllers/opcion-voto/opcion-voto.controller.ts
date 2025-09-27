import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Patch,
  Delete,
  HttpStatus,
  HttpCode,
  Inject,
  Query,
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
import { IOpcionVotoService } from '../../services/interfaces/opcion-voto.interface';
import {
  CreateOpcionVotoDto,
  UpdateOpcionVotoDto,
  CreateOpcionVotoResponseDto,
  GetOpcionVotoResponseDto,
  GetOpcionesVotoResponseDto,
  UpdateOpcionVotoResponseDto,
  DeleteOpcionVotoResponseDto,
} from '../../dtos';
import { BaseResponseDto } from '../../dtos/baseResponse/baseResponse.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('Opciones de Voto')
@Controller('opcion-voto')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class OpcionVotoController {
  constructor(
    @Inject('IOpcionVotoService')
    private readonly opcionVotoService: IOpcionVotoService,
  ) {}

  /**
   * Crear una nueva opción de voto
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear nueva opción de voto',
    description: 'Crea una nueva opción para una votación específica',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Opción de voto creada exitosamente',
    type: CreateOpcionVotoResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos inválidos o votación no encontrada',
    schema: {
      example: {
        success: false,
        message: 'Error al crear la opción de voto',
        error: {
          code: 'VALIDATION_ERROR',
          timestamp: '2024-01-01T12:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Ya existe una opción con el mismo texto o orden',
    schema: {
      example: {
        success: false,
        message: 'Ya existe una opción con el texto "Apruebo" en esta votación',
        error: {
          code: 'DUPLICATE_OPTION',
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
    @Body() createOpcionVotoDto: CreateOpcionVotoDto,
  ): Promise<CreateOpcionVotoResponseDto> {
    return await this.opcionVotoService.create(createOpcionVotoDto);
  }

  /**
   * Obtener todas las opciones de voto
   */
  @Get()
  @ApiOperation({
    summary: 'Obtener todas las opciones de voto',
    description:
      'Retorna una lista de todas las opciones de voto ordenadas por presentación',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de opciones de voto obtenida exitosamente',
    type: GetOpcionesVotoResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado',
  })
  async findAll(): Promise<GetOpcionesVotoResponseDto> {
    return await this.opcionVotoService.findAll();
  }

  /**
   * Obtener opciones de voto por ID de votación
   */
  @Get('by-votacion/:votacionId')
  @ApiOperation({
    summary: 'Obtener opciones por votación',
    description:
      'Retorna todas las opciones de voto de una votación específica',
  })
  @ApiParam({
    name: 'votacionId',
    type: 'string',
    description: 'ID único de la votación',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Opciones de la votación obtenidas exitosamente',
    type: GetOpcionesVotoResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Votación no encontrada',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado',
  })
  async findByVotacion(
    @Param('votacionId') votacionId: string,
  ): Promise<GetOpcionesVotoResponseDto> {
    return await this.opcionVotoService.findByVotacion(votacionId);
  }

  /**
   * Obtener una opción de voto por ID
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Obtener opción de voto por ID',
    description:
      'Retorna una opción de voto específica con su información completa',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID único de la opción de voto',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Opción de voto obtenida exitosamente',
    type: GetOpcionVotoResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Opción de voto no encontrada',
    schema: {
      example: {
        success: false,
        message: 'Opción de voto con ID 123 no encontrada',
        error: {
          code: 'NOT_FOUND',
          timestamp: '2024-01-01T12:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado',
  })
  async findOne(@Param('id') id: string): Promise<GetOpcionVotoResponseDto> {
    return await this.opcionVotoService.findOne(id);
  }

  /**
   * Actualizar una opción de voto
   */
  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar opción de voto',
    description: 'Actualiza los datos de una opción de voto existente',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID único de la opción de voto',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Opción de voto actualizada exitosamente',
    type: UpdateOpcionVotoResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Opción de voto no encontrada',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos inválidos o no se puede modificar por tener votos',
    schema: {
      example: {
        success: false,
        message:
          'No se puede cambiar el texto de una opción que ya tiene votos registrados',
        error: {
          code: 'VOTES_EXIST',
          timestamp: '2024-01-01T12:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Conflicto con texto u orden existente',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado',
  })
  async update(
    @Param('id') id: string,
    @Body() updateOpcionVotoDto: UpdateOpcionVotoDto,
  ): Promise<UpdateOpcionVotoResponseDto> {
    return await this.opcionVotoService.update(id, updateOpcionVotoDto);
  }

  /**
   * Eliminar una opción de voto
   */
  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar opción de voto',
    description: 'Elimina una opción de voto si no tiene votos registrados',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID único de la opción de voto',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Opción de voto eliminada exitosamente',
    type: DeleteOpcionVotoResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Opción de voto no encontrada',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'No se puede eliminar porque tiene votos registrados',
    schema: {
      example: {
        success: false,
        message:
          'No se puede eliminar una opción que ya tiene votos registrados',
        error: {
          code: 'VOTES_EXIST',
          timestamp: '2024-01-01T12:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado',
  })
  async remove(@Param('id') id: string): Promise<DeleteOpcionVotoResponseDto> {
    return await this.opcionVotoService.remove(id);
  }
}

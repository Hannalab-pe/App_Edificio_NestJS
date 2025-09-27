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
import { IVotacionService } from '../../services/interfaces/votacion.interface';
import {
  CreateVotacionDto,
  UpdateVotacionDto,
  VotacionSingleResponseDto,
  VotacionArrayResponseDto,
} from '../../dtos';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

/**
 * Controlador para la gestión de votaciones
 * Modernizado con BaseResponseDto pattern
 */
@ApiTags('Votaciones')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('votacion')
export class VotacionController {
  constructor(
    @Inject('IVotacionService')
    private readonly votacionService: IVotacionService,
  ) {}

  /**
   * Test endpoint
   */
  @Get('test')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Test endpoint' })
  async test(): Promise<{ message: string; timestamp: string }> {
    return {
      message: 'Controlador de votaciones funcionando correctamente',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Crear nueva votación
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear nueva votación' })
  @ApiResponse({ status: 201, type: VotacionSingleResponseDto })
  async create(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    createVotacionDto: CreateVotacionDto,
  ): Promise<VotacionSingleResponseDto> {
    return this.votacionService.createWithResponse(createVotacionDto);
  }

  /**
   * Obtener todas las votaciones con paginación
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener todas las votaciones' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, type: VotacionArrayResponseDto })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<VotacionArrayResponseDto> {
    return this.votacionService.findAllWithResponse(page, limit);
  }

  /**
   * Obtener votación por ID
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener votación por ID' })
  @ApiParam({ name: 'id', description: 'ID UUID de la votación' })
  @ApiResponse({ status: 200, type: VotacionSingleResponseDto })
  async findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<VotacionSingleResponseDto> {
    return this.votacionService.findOneWithResponse(id);
  }

  /**
   * Actualizar votación completa
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar votación completa' })
  @ApiParam({ name: 'id', description: 'ID UUID de la votación' })
  @ApiResponse({ status: 200, type: VotacionSingleResponseDto })
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    updateVotacionDto: UpdateVotacionDto,
  ): Promise<VotacionSingleResponseDto> {
    return this.votacionService.updateWithResponse(id, updateVotacionDto);
  }

  /**
   * Eliminar votación
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar votación' })
  @ApiParam({ name: 'id', description: 'ID UUID de la votación' })
  @ApiResponse({ status: 200, type: VotacionSingleResponseDto })
  async remove(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<VotacionSingleResponseDto> {
    return this.votacionService.removeWithResponse(id);
  }

  /**
   * Obtener votaciones por estado
   */
  @Get('estado/:estado')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener votaciones por estado' })
  @ApiParam({ name: 'estado', description: 'Estado de la votación' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, type: VotacionArrayResponseDto })
  async findByEstado(
    @Param('estado') estado: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<VotacionArrayResponseDto> {
    return this.votacionService.findByEstadoWithResponse(estado, page, limit);
  }

  /**
   * Obtener votaciones activas
   */
  @Get('estado/activas/all')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener votaciones activas' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, type: VotacionArrayResponseDto })
  async findActive(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<VotacionArrayResponseDto> {
    return this.votacionService.findActiveWithResponse(page, limit);
  }

  /**
   * Cerrar votación
   */
  @Post(':id/cerrar')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cerrar votación activa' })
  @ApiParam({ name: 'id', description: 'ID UUID de la votación' })
  @ApiResponse({ status: 200, type: VotacionSingleResponseDto })
  async cerrarVotacion(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<VotacionSingleResponseDto> {
    return this.votacionService.cerrarVotacionWithResponse(id);
  }

  /**
   * Activar votación
   */
  @Post(':id/activar')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Activar votación en borrador' })
  @ApiParam({ name: 'id', description: 'ID UUID de la votación' })
  @ApiResponse({ status: 200, type: VotacionSingleResponseDto })
  async activarVotacion(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<VotacionSingleResponseDto> {
    return this.votacionService.activarVotacionWithResponse(id);
  }

  /**
   * Cancelar votación
   */
  @Post(':id/cancelar')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancelar votación' })
  @ApiParam({ name: 'id', description: 'ID UUID de la votación' })
  @ApiResponse({ status: 200, type: VotacionSingleResponseDto })
  async cancelarVotacion(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<VotacionSingleResponseDto> {
    return this.votacionService.cancelarVotacionWithResponse(id);
  }

  /**
   * Obtener estadísticas generales de votaciones
   */
  @Get('estadisticas/general')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener estadísticas generales de votaciones' })
  @ApiResponse({ status: 200, type: VotacionArrayResponseDto })
  async getEstadisticasGenerales(): Promise<VotacionArrayResponseDto> {
    return this.votacionService.getEstadisticasGeneralesWithResponse();
  }
}

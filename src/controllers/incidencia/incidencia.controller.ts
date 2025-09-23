import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  Inject
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import { CreateIncidenciaDto, UpdateIncidenciaDto } from '../../dtos';
import { Incidencia } from '../../entities/Incidencia';
import { IIncidenciaService } from '../../services/interfaces/incidencia.interface';

@ApiTags('Incidencias')
@Controller('incidencia')
export class IncidenciaController {
  constructor(
    @Inject('IIncidenciaService')
    private readonly incidenciaService: IIncidenciaService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear una nueva incidencia',
    description: 'Reporta una nueva incidencia en el sistema'
  })
  @ApiBody({
    type: CreateIncidenciaDto,
    description: 'Datos de la incidencia a reportar'
  })
  @ApiResponse({
    status: 201,
    description: 'Incidencia creada exitosamente',
    type: Incidencia
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos'
  })
  async create(@Body() createIncidenciaDto: CreateIncidenciaDto): Promise<Incidencia> {
    return await this.incidenciaService.create(createIncidenciaDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todas las incidencias',
    description: 'Retorna una lista de todas las incidencias reportadas en el edificio'
  })
  @ApiQuery({
    name: 'estado',
    required: false,
    description: 'Filtrar por estado de la incidencia',
    example: 'Pendiente'
  })
  @ApiQuery({
    name: 'prioridad',
    required: false,
    description: 'Filtrar por prioridad',
    example: 'Alta'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de incidencias obtenida exitosamente',
    type: [Incidencia]
  })
  async findAll(
    @Query('estado') estado?: string,
    @Query('prioridad') prioridad?: string
  ): Promise<Incidencia[]> {
    if (estado || prioridad) {
      return await this.incidenciaService.findWithFilters(estado, prioridad);
    }
    return await this.incidenciaService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener una incidencia por ID',
    description: 'Retorna una incidencia específica basada en su ID'
  })
  @ApiParam({
    name: 'id',
    description: 'ID único de la incidencia',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({
    status: 200,
    description: 'Incidencia encontrada exitosamente',
    type: Incidencia
  })
  @ApiResponse({
    status: 404,
    description: 'Incidencia no encontrada'
  })
  async findOne(@Param('id') id: string): Promise<Incidencia> {
    return await this.incidenciaService.findOne(id);
  }

  @Get('usuario/:usuarioId')
  @ApiOperation({
    summary: 'Obtener incidencias por usuario',
    description: 'Retorna todas las incidencias reportadas por un usuario específico'
  })
  @ApiParam({
    name: 'usuarioId',
    description: 'ID del usuario que reportó la incidencia',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({
    status: 200,
    description: 'Incidencias del usuario obtenidas exitosamente',
    type: [Incidencia]
  })
  async findByUsuario(@Param('usuarioId') usuarioId: string): Promise<Incidencia[]> {
    return await this.incidenciaService.findByUsuario(usuarioId);
  }

  @Get('trabajador/:trabajadorId')
  @ApiOperation({
    summary: 'Obtener incidencias asignadas a un trabajador',
    description: 'Retorna todas las incidencias asignadas a un trabajador específico'
  })
  @ApiParam({
    name: 'trabajadorId',
    description: 'ID del trabajador asignado',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({
    status: 200,
    description: 'Incidencias del trabajador obtenidas exitosamente',
    type: [Incidencia]
  })
  async findByTrabajador(@Param('trabajadorId') trabajadorId: string): Promise<Incidencia[]> {
    return await this.incidenciaService.findByTrabajador(trabajadorId);
  }

  @Get('tipo/:tipoId')
  @ApiOperation({
    summary: 'Obtener incidencias por tipo',
    description: 'Retorna todas las incidencias de un tipo específico'
  })
  @ApiParam({
    name: 'tipoId',
    description: 'ID del tipo de incidencia',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({
    status: 200,
    description: 'Incidencias del tipo obtenidas exitosamente',
    type: [Incidencia]
  })
  async findByTipo(@Param('tipoId') tipoId: string): Promise<Incidencia[]> {
    return await this.incidenciaService.findByTipo(tipoId);
  }

  @Get('estado/:estado')
  @ApiOperation({
    summary: 'Obtener incidencias por estado',
    description: 'Retorna todas las incidencias con un estado específico'
  })
  @ApiParam({
    name: 'estado',
    description: 'Estado de la incidencia',
    example: 'Pendiente'
  })
  @ApiResponse({
    status: 200,
    description: 'Incidencias por estado obtenidas exitosamente',
    type: [Incidencia]
  })
  async findByEstado(@Param('estado') estado: string): Promise<Incidencia[]> {
    return await this.incidenciaService.findByEstado(estado);
  }

  @Get('prioridad/:prioridad')
  @ApiOperation({
    summary: 'Obtener incidencias por prioridad',
    description: 'Retorna todas las incidencias con una prioridad específica'
  })
  @ApiParam({
    name: 'prioridad',
    description: 'Prioridad de la incidencia',
    example: 'Alta'
  })
  @ApiResponse({
    status: 200,
    description: 'Incidencias por prioridad obtenidas exitosamente',
    type: [Incidencia]
  })
  async findByPrioridad(@Param('prioridad') prioridad: string): Promise<Incidencia[]> {
    return await this.incidenciaService.findByPrioridad(prioridad);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Actualizar una incidencia',
    description: 'Actualiza el estado o datos de una incidencia existente'
  })
  @ApiParam({
    name: 'id',
    description: 'ID único de la incidencia a actualizar',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiBody({
    type: UpdateIncidenciaDto,
    description: 'Datos de la incidencia a actualizar'
  })
  @ApiResponse({
    status: 200,
    description: 'Incidencia actualizada exitosamente',
    type: Incidencia
  })
  @ApiResponse({
    status: 404,
    description: 'Incidencia no encontrada'
  })
  async update(
    @Param('id') id: string,
    @Body() updateIncidenciaDto: UpdateIncidenciaDto
  ): Promise<Incidencia> {
    return await this.incidenciaService.update(id, updateIncidenciaDto);
  }

  @Put(':id/resolver')
  @ApiOperation({
    summary: 'Resolver una incidencia',
    description: 'Marca una incidencia como resuelta'
  })
  @ApiParam({
    name: 'id',
    description: 'ID único de la incidencia a resolver',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({
    status: 200,
    description: 'Incidencia resuelta exitosamente',
    type: Incidencia
  })
  @ApiResponse({
    status: 404,
    description: 'Incidencia no encontrada'
  })
  @ApiResponse({
    status: 400,
    description: 'La incidencia ya está resuelta'
  })
  async resolve(@Param('id') id: string): Promise<Incidencia> {
    return await this.incidenciaService.resolve(id);
  }

  @Put(':incidenciaId/asignar/:trabajadorId')
  @ApiOperation({
    summary: 'Asignar trabajador a una incidencia',
    description: 'Asigna un trabajador específico a una incidencia'
  })
  @ApiParam({
    name: 'incidenciaId',
    description: 'ID único de la incidencia',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiParam({
    name: 'trabajadorId',
    description: 'ID único del trabajador a asignar',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({
    status: 200,
    description: 'Trabajador asignado exitosamente',
    type: Incidencia
  })
  @ApiResponse({
    status: 404,
    description: 'Incidencia no encontrada'
  })
  async asignarTrabajador(
    @Param('incidenciaId') incidenciaId: string,
    @Param('trabajadorId') trabajadorId: string
  ): Promise<Incidencia> {
    return await this.incidenciaService.asignarTrabajador(incidenciaId, trabajadorId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar una incidencia',
    description: 'Elimina una incidencia del sistema'
  })
  @ApiParam({
    name: 'id',
    description: 'ID único de la incidencia a eliminar',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({
    status: 204,
    description: 'Incidencia eliminada exitosamente'
  })
  @ApiResponse({
    status: 404,
    description: 'Incidencia no encontrada'
  })
  async remove(@Param('id') id: string): Promise<void> {
    return await this.incidenciaService.remove(id);
  }
}
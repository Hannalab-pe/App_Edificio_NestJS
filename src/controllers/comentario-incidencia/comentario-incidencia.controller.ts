import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Inject
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateComentarioIncidenciaDto, UpdateComentarioIncidenciaDto } from '../../dtos';
import { ComentarioIncidencia } from '../../entities/ComentarioIncidencia';
import { IComentarioIncidenciaService } from '../../services/interfaces/comentario-incidencia.interface';

@ApiTags('Comentarios de Incidencia')
@Controller('comentario-incidencia')
export class ComentarioIncidenciaController {
  constructor(
    @Inject('IComentarioIncidenciaService')
    private readonly comentarioIncidenciaService: IComentarioIncidenciaService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear un nuevo comentario de incidencia',
    description: 'Crea un nuevo comentario para una incidencia específica'
  })
  @ApiBody({
    type: CreateComentarioIncidenciaDto,
    description: 'Datos del comentario de incidencia a crear'
  })
  @ApiResponse({
    status: 201,
    description: 'Comentario de incidencia creado exitosamente',
    type: ComentarioIncidencia
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos'
  })
  async create(@Body() createComentarioIncidenciaDto: CreateComentarioIncidenciaDto): Promise<ComentarioIncidencia> {
    return await this.comentarioIncidenciaService.create(createComentarioIncidenciaDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los comentarios de incidencia',
    description: 'Retorna una lista de todos los comentarios de incidencia del sistema'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de comentarios de incidencia obtenida exitosamente',
    type: [ComentarioIncidencia]
  })
  async findAll(): Promise<ComentarioIncidencia[]> {
    return await this.comentarioIncidenciaService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un comentario de incidencia por ID',
    description: 'Retorna un comentario de incidencia específico por su ID'
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del comentario de incidencia',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({
    status: 200,
    description: 'Comentario de incidencia encontrado exitosamente',
    type: ComentarioIncidencia
  })
  @ApiResponse({
    status: 404,
    description: 'Comentario de incidencia no encontrado'
  })
  async findOne(@Param('id') id: string): Promise<ComentarioIncidencia> {
    return await this.comentarioIncidenciaService.findOne(id);
  }

  @Get('incidencia/:idIncidencia')
  @ApiOperation({
    summary: 'Obtener comentarios por incidencia',
    description: 'Retorna todos los comentarios de una incidencia específica'
  })
  @ApiParam({
    name: 'idIncidencia',
    description: 'ID de la incidencia',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({
    status: 200,
    description: 'Comentarios de la incidencia obtenidos exitosamente',
    type: [ComentarioIncidencia]
  })
  async findByIncidencia(@Param('idIncidencia') idIncidencia: string): Promise<ComentarioIncidencia[]> {
    return await this.comentarioIncidenciaService.findByIncidencia(idIncidencia);
  }

  @Get('usuario/:idUsuario')
  @ApiOperation({
    summary: 'Obtener comentarios por usuario',
    description: 'Retorna todos los comentarios realizados por un usuario específico'
  })
  @ApiParam({
    name: 'idUsuario',
    description: 'ID del usuario',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({
    status: 200,
    description: 'Comentarios del usuario obtenidos exitosamente',
    type: [ComentarioIncidencia]
  })
  async findByUsuario(@Param('idUsuario') idUsuario: string): Promise<ComentarioIncidencia[]> {
    return await this.comentarioIncidenciaService.findByUsuario(idUsuario);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Actualizar un comentario de incidencia',
    description: 'Actualiza los datos de un comentario de incidencia existente'
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del comentario de incidencia',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiBody({
    type: UpdateComentarioIncidenciaDto,
    description: 'Datos del comentario de incidencia a actualizar'
  })
  @ApiResponse({
    status: 200,
    description: 'Comentario de incidencia actualizado exitosamente',
    type: ComentarioIncidencia
  })
  @ApiResponse({
    status: 404,
    description: 'Comentario de incidencia no encontrado'
  })
  async update(
    @Param('id') id: string,
    @Body() updateComentarioIncidenciaDto: UpdateComentarioIncidenciaDto
  ): Promise<ComentarioIncidencia> {
    return await this.comentarioIncidenciaService.update(id, updateComentarioIncidenciaDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar un comentario de incidencia',
    description: 'Elimina un comentario de incidencia del sistema'
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del comentario de incidencia',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({
    status: 204,
    description: 'Comentario de incidencia eliminado exitosamente'
  })
  @ApiResponse({
    status: 404,
    description: 'Comentario de incidencia no encontrado'
  })
  async remove(@Param('id') id: string): Promise<void> {
    return await this.comentarioIncidenciaService.remove(id);
  }
}

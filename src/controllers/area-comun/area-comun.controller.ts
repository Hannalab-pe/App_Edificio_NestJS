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
  Inject,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { CreateAreaComunDto, UpdateAreaComunDto } from '../../dtos';
import { AreaComun } from '../../entities/AreaComun';
import { IAreaComunService } from '../../services/interfaces/area-comun.interface';

@ApiTags('Áreas Comunes')
@Controller('area-comun')
export class AreaComunController {
  constructor(
    @Inject('IAreaComunService')
    private readonly areaComunService: IAreaComunService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear una nueva área común',
    description: 'Crea una nueva área común en el edificio',
  })
  @ApiBody({
    type: CreateAreaComunDto,
    description: 'Datos del área común a crear',
  })
  @ApiResponse({
    status: 201,
    description: 'Área común creada exitosamente',
    type: AreaComun,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos',
  })
  async create(
    @Body() createAreaComunDto: CreateAreaComunDto,
  ): Promise<AreaComun> {
    return await this.areaComunService.create(createAreaComunDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todas las áreas comunes',
    description: 'Retorna una lista de todas las áreas comunes del edificio',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de áreas comunes obtenida exitosamente',
    type: [AreaComun],
  })
  async findAll(): Promise<AreaComun[]> {
    return await this.areaComunService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un área común por ID',
    description: 'Retorna un área común específica por su ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del área común',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Área común encontrada exitosamente',
    type: AreaComun,
  })
  @ApiResponse({
    status: 404,
    description: 'Área común no encontrada',
  })
  async findOne(@Param('id') id: string): Promise<AreaComun> {
    return await this.areaComunService.findOne(id);
  }

  @Get('estado/:estado')
  @ApiOperation({
    summary: 'Obtener áreas comunes por estado',
    description:
      'Retorna una lista de áreas comunes filtradas por su estado (activo/inactivo)',
  })
  @ApiParam({
    name: 'estado',
    description: 'Estado del área común (true = activo, false = inactivo)',
    example: 'true',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de áreas comunes por estado obtenida exitosamente',
    type: [AreaComun],
  })
  async findByEstado(@Param('estado') estado: string): Promise<AreaComun[]> {
    const estadoBoolean = estado.toLowerCase() === 'true';
    return await this.areaComunService.findByEstado(estadoBoolean);
  }

  @Get('disponibles/activas')
  @ApiOperation({
    summary: 'Obtener áreas comunes disponibles',
    description:
      'Retorna una lista de todas las áreas comunes activas/disponibles',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de áreas comunes disponibles obtenida exitosamente',
    type: [AreaComun],
  })
  async findAvailable(): Promise<AreaComun[]> {
    return await this.areaComunService.findAvailable();
  }

  @Get('capacidad/:capacidadMinima')
  @ApiOperation({
    summary: 'Obtener áreas comunes por capacidad mínima',
    description:
      'Retorna áreas comunes que tienen al menos la capacidad especificada',
  })
  @ApiParam({
    name: 'capacidadMinima',
    description: 'Capacidad mínima requerida',
    example: '50',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de áreas comunes por capacidad obtenida exitosamente',
    type: [AreaComun],
  })
  async findByCapacidad(
    @Param('capacidadMinima') capacidadMinima: string,
  ): Promise<AreaComun[]> {
    const capacidad = parseInt(capacidadMinima);
    return await this.areaComunService.findByCapacidad(capacidad);
  }

  @Get('precio/:precioMaximo')
  @ApiOperation({
    summary: 'Obtener áreas comunes por precio máximo',
    description:
      'Retorna áreas comunes que cuestan máximo el precio especificado',
  })
  @ApiParam({
    name: 'precioMaximo',
    description: 'Precio máximo de reserva',
    example: '200',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de áreas comunes por precio obtenida exitosamente',
    type: [AreaComun],
  })
  async findByPrecio(
    @Param('precioMaximo') precioMaximo: string,
  ): Promise<AreaComun[]> {
    const precio = parseFloat(precioMaximo);
    return await this.areaComunService.findByPrecio(precio);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Actualizar un área común',
    description: 'Actualiza los datos de un área común existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del área común',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    type: UpdateAreaComunDto,
    description: 'Datos del área común a actualizar',
  })
  @ApiResponse({
    status: 200,
    description: 'Área común actualizada exitosamente',
    type: AreaComun,
  })
  @ApiResponse({
    status: 404,
    description: 'Área común no encontrada',
  })
  async update(
    @Param('id') id: string,
    @Body() updateAreaComunDto: UpdateAreaComunDto,
  ): Promise<AreaComun> {
    return await this.areaComunService.update(id, updateAreaComunDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar un área común (eliminación lógica)',
    description: 'Elimina lógicamente un área común marcándola como inactiva',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del área común',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 204,
    description: 'Área común eliminada exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Área común no encontrada',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return await this.areaComunService.remove(id);
  }
}

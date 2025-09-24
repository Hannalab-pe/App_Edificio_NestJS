import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Inject,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { CreateCronogramaDto, UpdateCronogramaDto } from '../../dtos';
import { Cronograma } from '../../entities/Cronograma';
import { ICronogramaService } from '../../services/interfaces/cronograma.interface';

@ApiTags('Cronogramas')
@Controller('cronograma')
export class CronogramaController {
  constructor(
    @Inject('ICronogramaService')
    private readonly cronogramaService: ICronogramaService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear un nuevo cronograma',
    description: 'Crea un nuevo cronograma en el sistema',
  })
  @ApiBody({
    type: CreateCronogramaDto,
    description: 'Datos del cronograma a crear',
  })
  @ApiResponse({
    status: 201,
    description: 'Cronograma creado exitosamente',
    type: Cronograma,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o fecha de fin anterior a fecha de inicio',
  })
  async create(
    @Body() createCronogramaDto: CreateCronogramaDto,
  ): Promise<Cronograma> {
    return await this.cronogramaService.create(createCronogramaDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los cronogramas',
    description:
      'Retorna una lista de todos los cronogramas del sistema ordenados por fecha de inicio',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de cronogramas obtenida exitosamente',
    type: [Cronograma],
  })
  async findAll(): Promise<Cronograma[]> {
    return await this.cronogramaService.findAll();
  }

  @Get('activos')
  @ApiOperation({
    summary: 'Obtener cronogramas activos',
    description:
      'Retorna todos los cronogramas que no han terminado (fecha fin >= hoy)',
  })
  @ApiResponse({
    status: 200,
    description: 'Cronogramas activos obtenidos exitosamente',
    type: [Cronograma],
  })
  async findActive(): Promise<Cronograma[]> {
    return await this.cronogramaService.findActive();
  }

  @Get('rango-fechas')
  @ApiOperation({
    summary: 'Obtener cronogramas por rango de fechas',
    description:
      'Retorna cronogramas que inicien dentro del rango de fechas especificado',
  })
  @ApiQuery({
    name: 'fechaInicio',
    description: 'Fecha de inicio del rango (YYYY-MM-DD)',
    example: '2024-01-01',
  })
  @ApiQuery({
    name: 'fechaFin',
    description: 'Fecha de fin del rango (YYYY-MM-DD)',
    example: '2024-12-31',
  })
  @ApiResponse({
    status: 200,
    description: 'Cronogramas en el rango de fechas obtenidos exitosamente',
    type: [Cronograma],
  })
  async findByFechaRange(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
  ): Promise<Cronograma[]> {
    return await this.cronogramaService.findByFechaRange(fechaInicio, fechaFin);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un cronograma por ID',
    description: 'Retorna un cronograma específico por su ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del cronograma',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Cronograma encontrado exitosamente',
    type: Cronograma,
  })
  @ApiResponse({
    status: 404,
    description: 'Cronograma no encontrado',
  })
  async findOne(@Param('id') id: string): Promise<Cronograma> {
    return await this.cronogramaService.findOne(id);
  }

  @Get('tipo/:idTipoCronograma')
  @ApiOperation({
    summary: 'Obtener cronogramas por tipo',
    description: 'Retorna todos los cronogramas de un tipo específico',
  })
  @ApiParam({
    name: 'idTipoCronograma',
    description: 'ID del tipo de cronograma',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Cronogramas por tipo obtenidos exitosamente',
    type: [Cronograma],
  })
  async findByTipo(
    @Param('idTipoCronograma') idTipoCronograma: string,
  ): Promise<Cronograma[]> {
    return await this.cronogramaService.findByTipo(idTipoCronograma);
  }

  @Get('residente/:idResidente')
  @ApiOperation({
    summary: 'Obtener cronogramas por residente',
    description:
      'Retorna todos los cronogramas asociados a un residente específico',
  })
  @ApiParam({
    name: 'idResidente',
    description: 'ID del residente',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Cronogramas del residente obtenidos exitosamente',
    type: [Cronograma],
  })
  async findByResidente(
    @Param('idResidente') idResidente: string,
  ): Promise<Cronograma[]> {
    return await this.cronogramaService.findByResidente(idResidente);
  }

  @Get('trabajador/:idTrabajador')
  @ApiOperation({
    summary: 'Obtener cronogramas por trabajador',
    description:
      'Retorna todos los cronogramas asignados a un trabajador específico',
  })
  @ApiParam({
    name: 'idTrabajador',
    description: 'ID del trabajador',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Cronogramas del trabajador obtenidos exitosamente',
    type: [Cronograma],
  })
  async findByTrabajador(
    @Param('idTrabajador') idTrabajador: string,
  ): Promise<Cronograma[]> {
    return await this.cronogramaService.findByTrabajador(idTrabajador);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un cronograma (actualización parcial)',
    description:
      'Actualiza parcialmente los datos de un cronograma existente. Solo los campos enviados serán actualizados.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del cronograma',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    type: UpdateCronogramaDto,
    description: 'Datos del cronograma a actualizar (campos opcionales)',
  })
  @ApiResponse({
    status: 200,
    description: 'Cronograma actualizado exitosamente',
    type: Cronograma,
  })
  @ApiResponse({
    status: 404,
    description: 'Cronograma no encontrado',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o fecha de fin anterior a fecha de inicio',
  })
  async update(
    @Param('id') id: string,
    @Body() updateCronogramaDto: UpdateCronogramaDto,
  ): Promise<Cronograma> {
    return await this.cronogramaService.update(id, updateCronogramaDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar un cronograma',
    description: 'Elimina un cronograma del sistema',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del cronograma',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 204,
    description: 'Cronograma eliminado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Cronograma no encontrado',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return await this.cronogramaService.remove(id);
  }
}

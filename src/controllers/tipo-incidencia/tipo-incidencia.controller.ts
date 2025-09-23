<<<<<<< HEAD
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
import { CreateTipoIncidenciaDto, UpdateTipoIncidenciaDto } from '../../dtos';
import { TipoIncidencia } from '../../entities/TipoIncidencia';
import { ITipoIncidenciaService } from '../../services/interfaces/tipo-incidencia.interface';
=======
import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CreateTipoIncidenciaDto, UpdateTipoIncidenciaDto } from 'src/dtos';
import { TipoIncidenciaService } from 'src/services/implementations';
>>>>>>> 56ba60af9806ab17fa9dd2551616d39c4ecc114c

@ApiTags('Tipos de Incidencia')
@Controller('tipo-incidencia')
export class TipoIncidenciaController {
<<<<<<< HEAD
  constructor(
    @Inject('ITipoIncidenciaService')
    private readonly tipoIncidenciaService: ITipoIncidenciaService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear un nuevo tipo de incidencia',
    description: 'Crea un nuevo tipo de incidencia en el sistema'
  })
  @ApiBody({
    type: CreateTipoIncidenciaDto,
    description: 'Datos del tipo de incidencia a crear'
  })
  @ApiResponse({
    status: 201,
    description: 'Tipo de incidencia creado exitosamente',
    type: TipoIncidencia
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos'
  })
  @ApiResponse({
    status: 409,
    description: 'Ya existe un tipo de incidencia con este nombre'
  })
  async create(@Body() createTipoIncidenciaDto: CreateTipoIncidenciaDto): Promise<TipoIncidencia> {
    return await this.tipoIncidenciaService.create(createTipoIncidenciaDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los tipos de incidencia',
    description: 'Retorna una lista de todos los tipos de incidencia del sistema'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de tipos de incidencia obtenida exitosamente',
    type: [TipoIncidencia]
  })
  async findAll(): Promise<TipoIncidencia[]> {
    return await this.tipoIncidenciaService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un tipo de incidencia por ID',
    description: 'Retorna un tipo de incidencia específico por su ID'
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del tipo de incidencia',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de incidencia encontrado exitosamente',
    type: TipoIncidencia
  })
  @ApiResponse({
    status: 404,
    description: 'Tipo de incidencia no encontrado'
  })
  async findOne(@Param('id') id: string): Promise<TipoIncidencia> {
    return await this.tipoIncidenciaService.findOne(id);
  }

  @Get('nombre/:nombre')
  @ApiOperation({
    summary: 'Obtener tipo de incidencia por nombre',
    description: 'Retorna un tipo de incidencia específico por su nombre'
  })
  @ApiParam({
    name: 'nombre',
    description: 'Nombre del tipo de incidencia',
    example: 'Problema Eléctrico'
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de incidencia encontrado exitosamente',
    type: TipoIncidencia
  })
  @ApiResponse({
    status: 404,
    description: 'Tipo de incidencia no encontrado'
  })
  async findByNombre(@Param('nombre') nombre: string): Promise<TipoIncidencia> {
    return await this.tipoIncidenciaService.findByNombre(nombre);
  }

  @Get('prioridad/:prioridad')
  @ApiOperation({
    summary: 'Obtener tipos de incidencia por prioridad',
    description: 'Retorna todos los tipos de incidencia con una prioridad específica'
  })
  @ApiParam({
    name: 'prioridad',
    description: 'Prioridad del tipo de incidencia',
    example: 'Alta'
  })
  @ApiResponse({
    status: 200,
    description: 'Tipos de incidencia por prioridad obtenidos exitosamente',
    type: [TipoIncidencia]
  })
  async findByPrioridad(@Param('prioridad') prioridad: string): Promise<TipoIncidencia[]> {
    return await this.tipoIncidenciaService.findByPrioridad(prioridad);
  }

  @Get('activos/disponibles')
  @ApiOperation({
    summary: 'Obtener tipos de incidencia activos',
    description: 'Retorna todos los tipos de incidencia que están activos'
  })
  @ApiResponse({
    status: 200,
    description: 'Tipos de incidencia activos obtenidos exitosamente',
    type: [TipoIncidencia]
  })
  async findActivos(): Promise<TipoIncidencia[]> {
    return await this.tipoIncidenciaService.findActivos();
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Actualizar un tipo de incidencia',
    description: 'Actualiza los datos de un tipo de incidencia existente'
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del tipo de incidencia',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiBody({
    type: UpdateTipoIncidenciaDto,
    description: 'Datos del tipo de incidencia a actualizar'
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de incidencia actualizado exitosamente',
    type: TipoIncidencia
  })
  @ApiResponse({
    status: 404,
    description: 'Tipo de incidencia no encontrado'
  })
  @ApiResponse({
    status: 409,
    description: 'Ya existe otro tipo de incidencia con este nombre'
  })
  async update(
    @Param('id') id: string,
    @Body() updateTipoIncidenciaDto: UpdateTipoIncidenciaDto
  ): Promise<TipoIncidencia> {
    return await this.tipoIncidenciaService.update(id, updateTipoIncidenciaDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar un tipo de incidencia (eliminación lógica)',
    description: 'Elimina lógicamente un tipo de incidencia marcándolo como inactivo'
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del tipo de incidencia',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({
    status: 204,
    description: 'Tipo de incidencia eliminado exitosamente'
  })
  @ApiResponse({
    status: 404,
    description: 'Tipo de incidencia no encontrado'
  })
  @ApiResponse({
    status: 400,
    description: 'No se puede eliminar un tipo de incidencia con incidencias activas asociadas'
  })
  async remove(@Param('id') id: string): Promise<void> {
    return await this.tipoIncidenciaService.remove(id);
  }
}
=======
	constructor(private readonly tipoIncidenciaService: TipoIncidenciaService) {}

	@Post()
	@ApiOperation({ summary: 'Crear un nuevo tipo de incidencia', description: 'Crea un nuevo tipo de incidencia en el sistema' })
	@ApiResponse({ status: 201, description: 'Tipo de incidencia creado exitosamente' })
	@ApiResponse({ status: 400, description: 'Datos inválidos' })
	async create(@Body() createTipoIncidenciaDto: CreateTipoIncidenciaDto, @Res() res: Response) {
		try {
			const result = await this.tipoIncidenciaService.create(createTipoIncidenciaDto);
			if (result.success) {
				return res.status(HttpStatus.CREATED).json(result);
			} else {
				return res.status(HttpStatus.BAD_REQUEST).json(result);
			}
		} catch (error) {
			return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Error interno del servidor', data: null, error: error.message });
		}
	}

	@Get()
	@ApiOperation({ summary: 'Obtener todos los tipos de incidencia', description: 'Retorna una lista de todos los tipos de incidencia del sistema' })
	@ApiResponse({ status: 200, description: 'Lista de tipos de incidencia obtenida exitosamente' })
	async findAll(@Res() res: Response) {
		try {
			const result = await this.tipoIncidenciaService.findAll();
			if (result.success) {
				return res.status(HttpStatus.OK).json(result);
			} else {
				return res.status(HttpStatus.BAD_REQUEST).json(result);
			}
		} catch (error) {
			return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Error interno del servidor', data: [], error: error.message });
		}
	}

	@Get('nombre/:nombre')
	@ApiOperation({ summary: 'Obtener tipo de incidencia por nombre', description: 'Retorna un tipo de incidencia específico por su nombre' })
	@ApiParam({ name: 'nombre', type: 'string', description: 'Nombre del tipo de incidencia', example: 'Eléctrica' })
	@ApiResponse({ status: 200, description: 'Tipo de incidencia encontrado exitosamente' })
	@ApiResponse({ status: 404, description: 'Tipo de incidencia no encontrado' })
	async findByNombre(@Param('nombre') nombre: string, @Res() res: Response) {
		try {
			const result = await this.tipoIncidenciaService.findByNombre(nombre);
			if (result.success) {
				return res.status(HttpStatus.OK).json(result);
			} else {
				return res.status(HttpStatus.BAD_REQUEST).json(result);
			}
		} catch (error) {
			return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Error interno del servidor', data: null, error: error.message });
		}
	}

	@Get(':id')
	@ApiOperation({ summary: 'Obtener un tipo de incidencia por ID', description: 'Retorna un tipo de incidencia específico por su ID' })
	@ApiParam({ name: 'id', type: 'string', description: 'ID único del tipo de incidencia', example: 'uuid-example' })
	@ApiResponse({ status: 200, description: 'Tipo de incidencia encontrado exitosamente' })
	@ApiResponse({ status: 404, description: 'Tipo de incidencia no encontrado' })
	async findOne(@Param('id') id: string, @Res() res: Response) {
		try {
			const result = await this.tipoIncidenciaService.findOne(id);
			if (result.success) {
				return res.status(HttpStatus.OK).json(result);
			} else {
				return res.status(HttpStatus.BAD_REQUEST).json(result);
			}
		} catch (error) {
			return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Error interno del servidor', data: null, error: error.message });
		}
	}

	@Put(':id')
	@ApiOperation({ summary: 'Actualizar un tipo de incidencia', description: 'Actualiza los datos de un tipo de incidencia existente' })
	@ApiParam({ name: 'id', type: 'string', description: 'ID único del tipo de incidencia', example: 'uuid-example' })
	@ApiResponse({ status: 200, description: 'Tipo de incidencia actualizado exitosamente' })
	@ApiResponse({ status: 404, description: 'Tipo de incidencia no encontrado' })
	async update(@Param('id') id: string, @Body() updateTipoIncidenciaDto: UpdateTipoIncidenciaDto, @Res() res: Response) {
		try {
			const result = await this.tipoIncidenciaService.update(id, updateTipoIncidenciaDto);
			if (result.success) {
				return res.status(HttpStatus.OK).json(result);
			} else {
				return res.status(HttpStatus.BAD_REQUEST).json(result);
			}
		} catch (error) {
			return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Error interno del servidor', data: null, error: error.message });
		}
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Eliminar un tipo de incidencia (eliminación lógica)', description: 'Elimina lógicamente un tipo de incidencia marcándolo como inactivo' })
	@ApiParam({ name: 'id', type: 'string', description: 'ID único del tipo de incidencia', example: 'uuid-example' })
	@ApiResponse({ status: 200, description: 'Tipo de incidencia eliminado exitosamente' })
	@ApiResponse({ status: 404, description: 'Tipo de incidencia no encontrado' })
	async remove(@Param('id') id: string, @Res() res: Response) {
		try {
			const result = await this.tipoIncidenciaService.remove(id);
			if (result.success) {
				return res.status(HttpStatus.OK).json(result);
			} else {
				return res.status(HttpStatus.BAD_REQUEST).json(result);
			}
		} catch (error) {
			return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Error interno del servidor', data: undefined, error: error.message });
		}
	}
}
>>>>>>> 56ba60af9806ab17fa9dd2551616d39c4ecc114c

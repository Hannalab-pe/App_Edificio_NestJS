import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  HttpStatus,
  HttpException,
  UseGuards,
  Query,
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ResidenciaService } from 'src/services/implementations/residencia/residencia.service';
import { 
  CreateResidenciaDto,
  UpdateResidenciaDto,
  ResidenciaSingleResponseDto,
  ResidenciaArrayResponseDto,
} from 'src/dtos';
import { BaseResponseDto } from 'src/dtos/baseResponse/baseResponse.dto';

@ApiTags('Residencias')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('residencia')
export class ResidenciaController {
  constructor(
    private readonly residenciaService: ResidenciaService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Crear nueva residencia',
    description: 'Crea una nueva residencia asociando una propiedad con un propietario y residente, con validación de conflictos',
  })
  @ApiResponse({
    status: 201,
    description: 'Residencia creada exitosamente',
    type: ResidenciaSingleResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
  })
  @ApiResponse({
    status: 404,
    description: 'Propiedad, propietario o residente no encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'Ya existe una residencia activa para esta propiedad',
  })
  async create(@Body() createResidenciaDto: CreateResidenciaDto): Promise<BaseResponseDto<any>> {
    try {
      return await this.residenciaService.create(createResidenciaDto);
    } catch (error) {
      throw new HttpException(
        `Error al crear la residencia: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todas las residencias',
    description: 'Retorna una lista de todas las residencias registradas en el sistema con información de propiedades, propietarios y residentes',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de residencias obtenida exitosamente',
    type: ResidenciaArrayResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async findAll(): Promise<BaseResponseDto<any[]>> {
    try {
      return await this.residenciaService.findAll();
    } catch (error) {
      throw new HttpException(
        `Error al obtener las residencias: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener residencia por ID',
    description: 'Retorna una residencia específica identificada por su UUID con toda la información relacionada',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID único de la residencia',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Residencia encontrada exitosamente',
    type: ResidenciaSingleResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Residencia no encontrada',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async findOne(@Param('id') id: string): Promise<BaseResponseDto<any>> {
    try {
      return await this.residenciaService.findOne(id);
    } catch (error) {
      throw new HttpException(
        `Error al buscar la residencia: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar residencia',
    description: 'Actualiza parcialmente una residencia existente con validación de conflictos de propiedad activa',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID único de la residencia a actualizar',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Residencia actualizada exitosamente',
    type: ResidenciaSingleResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
  })
  @ApiResponse({
    status: 404,
    description: 'Residencia, propiedad, propietario o residente no encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflicto con residencia activa existente',
  })
  async update(
    @Param('id') id: string, 
    @Body() updateResidenciaDto: UpdateResidenciaDto
  ): Promise<BaseResponseDto<any>> {
    try {
      return await this.residenciaService.update(id, updateResidenciaDto);
    } catch (error) {
      throw new HttpException(
        `Error al actualizar la residencia: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar residencia',
    description: 'Elimina una residencia específica del sistema identificada por su UUID',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID único de la residencia a eliminar',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Residencia eliminada exitosamente',
    type: ResidenciaSingleResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Residencia no encontrada',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async remove(@Param('id') id: string): Promise<BaseResponseDto<any>> {
    try {
      return await this.residenciaService.remove(id);
    } catch (error) {
      throw new HttpException(
        `Error al eliminar la residencia: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('propiedad/:propiedadId')
  @ApiOperation({
    summary: 'Obtener residencias por propiedad',
    description: 'Retorna todas las residencias asociadas a una propiedad específica ordenadas por fecha de inicio',
  })
  @ApiParam({
    name: 'propiedadId',
    description: 'UUID de la propiedad para buscar sus residencias',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Residencias encontradas para la propiedad exitosamente',
    type: ResidenciaArrayResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async findByPropiedad(@Param('propiedadId') propiedadId: string): Promise<BaseResponseDto<any[]>> {
    try {
      return await this.residenciaService.findByPropiedad(propiedadId);
    } catch (error) {
      throw new HttpException(
        `Error al buscar residencias por propiedad: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('residente/:residenteId')
  @ApiOperation({
    summary: 'Obtener residencias por residente',
    description: 'Retorna todas las residencias asociadas a un residente específico ordenadas por fecha de inicio',
  })
  @ApiParam({
    name: 'residenteId',
    description: 'UUID del residente para buscar sus residencias',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Residencias encontradas para el residente exitosamente',
    type: ResidenciaArrayResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async findByResidente(@Param('residenteId') residenteId: string): Promise<BaseResponseDto<any[]>> {
    try {
      return await this.residenciaService.findByResidente(residenteId);
    } catch (error) {
      throw new HttpException(
        `Error al buscar residencias por residente: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('estado/:estado')
  @ApiOperation({
    summary: 'Obtener residencias por estado',
    description: 'Retorna todas las residencias que tienen un estado específico ordenadas por fecha de inicio',
  })
  @ApiParam({
    name: 'estado',
    description: 'Estado de las residencias a buscar',
    example: 'activa',
    enum: ['activa', 'inactiva', 'suspendida', 'finalizada'],
  })
  @ApiResponse({
    status: 200,
    description: 'Residencias encontradas por estado exitosamente',
    type: ResidenciaArrayResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async findByEstado(@Param('estado') estado: string): Promise<BaseResponseDto<any[]>> {
    try {
      return await this.residenciaService.findByEstado(estado);
    } catch (error) {
      throw new HttpException(
        `Error al buscar residencias por estado: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

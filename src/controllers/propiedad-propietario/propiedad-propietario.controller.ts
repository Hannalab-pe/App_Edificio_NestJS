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
import { PropiedadPropietarioService } from 'src/services/implementations/propiedad-propietario/propiedad-propietario.service';
import { 
  CreatePropiedadPropietarioDto,
  UpdatePropiedadPropietarioDto,
} from 'src/dtos';
import { BaseResponseDto } from 'src/dtos/baseResponse/baseResponse.dto';

@ApiTags('Propiedad-Propietario')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('propiedad-propietario')
export class PropiedadPropietarioController {
  constructor(
    private readonly propiedadPropietarioService: PropiedadPropietarioService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Crear nueva relación propiedad-propietario',
    description: 'Crea una nueva relación entre una propiedad existente y un propietario (nuevo o existente)',
  })
  @ApiResponse({
    status: 201,
    description: 'Relación propiedad-propietario creada exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token inválido o expirado',
  })
  @ApiResponse({
    status: 404,
    description: 'Propiedad no encontrada',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflicto - Relación ya existe o propietario ya registrado',
  })
  async create(
    @Body() createDto: CreatePropiedadPropietarioDto,
  ): Promise<any> {
    return await this.propiedadPropietarioService.create(createDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todas las relaciones propiedad-propietario',
    description: 'Recupera una lista de todas las relaciones propiedad-propietario registradas',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de relaciones propiedad-propietario recuperada exitosamente',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token inválido o expirado',
  })
  async findAll(): Promise<BaseResponseDto<any[]>> {
    try {
      const result = await this.propiedadPropietarioService.findAll();
      return BaseResponseDto.success(
        result,
        'Relaciones propiedad-propietario recuperadas exitosamente',
        HttpStatus.OK,
      );
    } catch (error) {
      throw new HttpException(
        `Error al recuperar las relaciones propiedad-propietario: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener relación propiedad-propietario por ID',
    description: 'Recupera una relación propiedad-propietario específica por su ID único',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID único de la relación propiedad-propietario',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Relación propiedad-propietario encontrada exitosamente',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token inválido o expirado',
  })
  @ApiResponse({
    status: 404,
    description: 'Relación propiedad-propietario no encontrada',
  })
  async findOne(@Param('id') id: string): Promise<BaseResponseDto<any>> {
    try {
      const result = await this.propiedadPropietarioService.findOne(id);
      if (!result) {
        throw new HttpException(
          'Relación propiedad-propietario no encontrada',
          HttpStatus.NOT_FOUND,
        );
      }
      return BaseResponseDto.success(
        result,
        'Relación propiedad-propietario encontrada exitosamente',
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Error al buscar la relación propiedad-propietario: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar relación propiedad-propietario',
    description: 'Actualiza los datos de una relación propiedad-propietario existente',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID único de la relación propiedad-propietario',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Relación propiedad-propietario actualizada exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token inválido o expirado',
  })
  @ApiResponse({
    status: 404,
    description: 'Relación propiedad-propietario no encontrada',
  })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdatePropiedadPropietarioDto,
  ): Promise<BaseResponseDto<any>> {
    try {
      const result = await this.propiedadPropietarioService.update(id, updateDto);
      if (!result) {
        throw new HttpException(
          'Relación propiedad-propietario no encontrada',
          HttpStatus.NOT_FOUND,
        );
      }
      return BaseResponseDto.success(
        result,
        'Relación propiedad-propietario actualizada exitosamente',
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Error al actualizar la relación propiedad-propietario: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar relación propiedad-propietario',
    description: 'Elimina una relación propiedad-propietario del sistema',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID único de la relación propiedad-propietario',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Relación propiedad-propietario eliminada exitosamente',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token inválido o expirado',
  })
  @ApiResponse({
    status: 404,
    description: 'Relación propiedad-propietario no encontrada',
  })
  async remove(@Param('id') id: string): Promise<BaseResponseDto<any>> {
    try {
      const result = await this.propiedadPropietarioService.remove(id);
      if (!result) {
        throw new HttpException(
          'Relación propiedad-propietario no encontrada',
          HttpStatus.NOT_FOUND,
        );
      }
      return BaseResponseDto.success(
        null,
        'Relación propiedad-propietario eliminada exitosamente',
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Error al eliminar la relación propiedad-propietario: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('por-propiedad/:propiedadId')
  @ApiOperation({
    summary: 'Obtener propietarios por propiedad',
    description: 'Recupera todas las relaciones de propietarios para una propiedad específica',
  })
  @ApiParam({
    name: 'propiedadId',
    type: 'string',
    description: 'ID único de la propiedad',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @ApiResponse({
    status: 200,
    description: 'Propietarios de la propiedad recuperados exitosamente',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token inválido o expirado',
  })
  async findByPropiedad(@Param('propiedadId') propiedadId: string): Promise<BaseResponseDto<any[]>> {
    try {
      const result = await this.propiedadPropietarioService.findByPropiedad(propiedadId);
      return BaseResponseDto.success(
        result,
        'Propietarios de la propiedad recuperados exitosamente',
        HttpStatus.OK,
      );
    } catch (error) {
      throw new HttpException(
        `Error al recuperar los propietarios de la propiedad: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('por-propietario/:propietarioId')
  @ApiOperation({
    summary: 'Obtener propiedades por propietario',
    description: 'Recupera todas las propiedades asociadas a un propietario específico',
  })
  @ApiParam({
    name: 'propietarioId',
    type: 'string',
    description: 'ID único del propietario',
    example: '123e4567-e89b-12d3-a456-426614174002',
  })
  @ApiResponse({
    status: 200,
    description: 'Propiedades del propietario recuperadas exitosamente',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token inválido o expirado',
  })
  async findByPropietario(@Param('propietarioId') propietarioId: string): Promise<BaseResponseDto<any[]>> {
    try {
      const result = await this.propiedadPropietarioService.findByPropietario(propietarioId);
      return BaseResponseDto.success(
        result,
        'Propiedades del propietario recuperadas exitosamente',
        HttpStatus.OK,
      );
    } catch (error) {
      throw new HttpException(
        `Error al recuperar las propiedades del propietario: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

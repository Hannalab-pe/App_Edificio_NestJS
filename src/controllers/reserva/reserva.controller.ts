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
import { ReservaService } from 'src/services/implementations/reserva/reserva.service';
import {
  CreateReservaDto,
  UpdateReservaDto,
  ReservaSingleResponseDto,
  ReservaArrayResponseDto,
} from 'src/dtos';
import { BaseResponseDto } from 'src/dtos/baseResponse/baseResponse.dto';

@ApiTags('Reservas')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('reserva')
export class ReservaController {
  constructor(private readonly reservaService: ReservaService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear nueva reserva',
    description:
      'Crea una nueva reserva para un área común específica con validación de conflictos de horario',
  })
  @ApiResponse({
    status: 201,
    description: 'Reserva creada exitosamente',
    type: ReservaSingleResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos o área común no disponible',
  })
  @ApiResponse({
    status: 404,
    description: 'Área común o usuario no encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflicto de horario con otra reserva existente',
  })
  async create(
    @Body() createReservaDto: CreateReservaDto,
  ): Promise<BaseResponseDto<any>> {
    try {
      return await this.reservaService.create(createReservaDto);
    } catch (error) {
      throw new HttpException(
        `Error al crear la reserva: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todas las reservas',
    description:
      'Retorna una lista de todas las reservas registradas en el sistema ordenadas por fecha de creación',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de reservas obtenida exitosamente',
    type: ReservaArrayResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async findAll(): Promise<BaseResponseDto<any[]>> {
    try {
      return await this.reservaService.findAll();
    } catch (error) {
      throw new HttpException(
        `Error al obtener las reservas: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener reserva por ID',
    description: 'Retorna una reserva específica identificada por su UUID',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID único de la reserva',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Reserva encontrada exitosamente',
    type: ReservaSingleResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Reserva no encontrada',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async findOne(@Param('id') id: string): Promise<BaseResponseDto<any>> {
    try {
      return await this.reservaService.findOne(id);
    } catch (error) {
      throw new HttpException(
        `Error al buscar la reserva: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar reserva',
    description:
      'Actualiza parcialmente una reserva existente con validación de conflictos de horario',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID único de la reserva a actualizar',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Reserva actualizada exitosamente',
    type: ReservaSingleResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
  })
  @ApiResponse({
    status: 404,
    description: 'Reserva, área común o usuario no encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflicto de horario con otra reserva existente',
  })
  async update(
    @Param('id') id: string,
    @Body() updateReservaDto: UpdateReservaDto,
  ): Promise<BaseResponseDto<any>> {
    try {
      return await this.reservaService.update(id, updateReservaDto);
    } catch (error) {
      throw new HttpException(
        `Error al actualizar la reserva: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar reserva',
    description:
      'Elimina una reserva específica del sistema identificada por su UUID',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID único de la reserva a eliminar',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Reserva eliminada exitosamente',
    type: ReservaSingleResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Reserva no encontrada',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async remove(@Param('id') id: string): Promise<BaseResponseDto<any>> {
    try {
      return await this.reservaService.remove(id);
    } catch (error) {
      throw new HttpException(
        `Error al eliminar la reserva: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('usuario/:usuarioId')
  @ApiOperation({
    summary: 'Obtener reservas por usuario',
    description: 'Retorna todas las reservas asociadas a un usuario específico',
  })
  @ApiParam({
    name: 'usuarioId',
    description: 'UUID del usuario para buscar sus reservas',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Reservas encontradas para el usuario exitosamente',
    type: ReservaArrayResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async findByUsuario(
    @Param('usuarioId') usuarioId: string,
  ): Promise<BaseResponseDto<any[]>> {
    try {
      return await this.reservaService.findByUsuario(usuarioId);
    } catch (error) {
      throw new HttpException(
        `Error al buscar reservas por usuario: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('area-comun/:areaComunId')
  @ApiOperation({
    summary: 'Obtener reservas por área común',
    description:
      'Retorna todas las reservas asociadas a un área común específica ordenadas por fecha y hora',
  })
  @ApiParam({
    name: 'areaComunId',
    description: 'UUID del área común para buscar sus reservas',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Reservas encontradas para el área común exitosamente',
    type: ReservaArrayResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async findByAreaComun(
    @Param('areaComunId') areaComunId: string,
  ): Promise<BaseResponseDto<any[]>> {
    try {
      return await this.reservaService.findByAreaComun(areaComunId);
    } catch (error) {
      throw new HttpException(
        `Error al buscar reservas por área común: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('estado/:estado')
  @ApiOperation({
    summary: 'Obtener reservas por estado',
    description: 'Retorna todas las reservas que tienen un estado específico',
  })
  @ApiParam({
    name: 'estado',
    description: 'Estado de las reservas a buscar',
    example: 'confirmada',
    enum: ['pendiente', 'confirmada', 'cancelada', 'completada'],
  })
  @ApiResponse({
    status: 200,
    description: 'Reservas encontradas por estado exitosamente',
    type: ReservaArrayResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async findByEstado(
    @Param('estado') estado: string,
  ): Promise<BaseResponseDto<any[]>> {
    try {
      return await this.reservaService.findByEstado(estado);
    } catch (error) {
      throw new HttpException(
        `Error al buscar reservas por estado: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

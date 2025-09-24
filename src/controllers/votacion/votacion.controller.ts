import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  Inject,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { IVotacionService } from '../../services/interfaces/votacion.interface';
import { CreateVotacionDto, UpdateVotacionDto } from '../../dtos';
import { BaseResponseDto } from '../../dtos/baseResponse/baseResponse.dto';
import { Votacion } from '../../entities/Votacion';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('Votaciones')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('votacion')
export class VotacionController {
  constructor(
    @Inject('IVotacionService')
    private readonly votacionService: IVotacionService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear una nueva votación' })
  @ApiResponse({
    status: 201,
    description: 'Votación creada exitosamente',
    type: BaseResponseDto<Votacion>,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
  })
  async create(
    @Body() createVotacionDto: CreateVotacionDto,
  ): Promise<BaseResponseDto<Votacion>> {
    try {
      const votacion = await this.votacionService.create(createVotacionDto);
      return BaseResponseDto.success(
        votacion,
        'Votación creada exitosamente',
        HttpStatus.CREATED,
      );
    } catch (error) {
      return BaseResponseDto.error(
        'Error al crear la votación',
        HttpStatus.BAD_REQUEST,
        error.message,
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las votaciones' })
  @ApiResponse({
    status: 200,
    description: 'Lista de votaciones obtenida exitosamente',
    type: BaseResponseDto<Votacion[]>,
  })
  async findAll(): Promise<BaseResponseDto<Votacion[]>> {
    try {
      const votaciones = await this.votacionService.findAll();
      return BaseResponseDto.success(
        votaciones,
        'Votaciones obtenidas exitosamente',
        HttpStatus.OK,
      );
    } catch (error) {
      return BaseResponseDto.error(
        'Error al obtener las votaciones',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una votación por ID' })
  @ApiResponse({
    status: 200,
    description: 'Votación encontrada exitosamente',
    type: BaseResponseDto<Votacion>,
  })
  @ApiResponse({
    status: 404,
    description: 'Votación no encontrada',
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<BaseResponseDto<Votacion>> {
    try {
      const votacion = await this.votacionService.findOne(id);
      return BaseResponseDto.success(
        votacion,
        'Votación encontrada exitosamente',
        HttpStatus.OK,
      );
    } catch (error) {
      return BaseResponseDto.error(
        'Error al obtener la votación',
        HttpStatus.NOT_FOUND,
        error.message,
      );
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una votación' })
  @ApiResponse({
    status: 200,
    description: 'Votación actualizada exitosamente',
    type: BaseResponseDto<Votacion>,
  })
  @ApiResponse({
    status: 404,
    description: 'Votación no encontrada',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateVotacionDto: UpdateVotacionDto,
  ): Promise<BaseResponseDto<Votacion>> {
    try {
      const votacion = await this.votacionService.update(id, updateVotacionDto);
      return BaseResponseDto.success(
        votacion,
        'Votación actualizada exitosamente',
        HttpStatus.OK,
      );
    } catch (error) {
      return BaseResponseDto.error(
        'Error al actualizar la votación',
        error.status || HttpStatus.BAD_REQUEST,
        error.message,
      );
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una votación' })
  @ApiResponse({
    status: 204,
    description: 'Votación eliminada exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Votación no encontrada',
  })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<BaseResponseDto<null>> {
    try {
      await this.votacionService.remove(id);
      return BaseResponseDto.success(
        null,
        'Votación eliminada exitosamente',
        HttpStatus.NO_CONTENT,
      );
    } catch (error) {
      return BaseResponseDto.error(
        'Error al eliminar la votación',
        error.status || HttpStatus.BAD_REQUEST,
        error.message,
      );
    }
  }
}

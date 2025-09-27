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
import { IArrendatarioService } from '../../services/interfaces/arrendatario.interface';
import { CreateArrendatarioDto, UpdateArrendatarioDto } from '../../dtos';
import { BaseResponseDto } from '../../dtos/baseResponse/baseResponse.dto';
import { Arrendatario } from '../../entities/Arrendatario';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('Arrendatarios')
@Controller('arrendatario')
export class ArrendatarioController {
  constructor(
    @Inject('IArrendatarioService')
    private readonly arrendatarioService: IArrendatarioService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo arrendatario' })
  @ApiResponse({
    status: 201,
    description: 'Arrendatario creado exitosamente',
    type: BaseResponseDto<Arrendatario>,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
  })
  @ApiResponse({
    status: 409,
    description: 'Ya existe un arrendatario con este documento',
  })
  async create(
    @Body() createArrendatarioDto: CreateArrendatarioDto,
  ): Promise<BaseResponseDto<Arrendatario>> {
    try {
      return await this.arrendatarioService.create(createArrendatarioDto);
    } catch (error) {
      return BaseResponseDto.error(
        'Error al crear el arrendatario',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message,
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los arrendatarios' })
  @ApiResponse({
    status: 200,
    description: 'Lista de arrendatarios obtenida exitosamente',
    type: BaseResponseDto<Arrendatario[]>,
  })
  async findAll(): Promise<BaseResponseDto<Arrendatario[]>> {
    try {
      return await this.arrendatarioService.findAll();
    } catch (error) {
      return BaseResponseDto.error(
        'Error al obtener los arrendatarios',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message,
      );
    }
  }

  @Get('activos')
  @ApiOperation({ summary: 'Obtener arrendatarios activos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de arrendatarios activos obtenida exitosamente',
    type: BaseResponseDto<Arrendatario[]>,
  })
  async findActiveArrendatarios(): Promise<BaseResponseDto<Arrendatario[]>> {
    try {
      return await this.arrendatarioService.findActiveArrendatarios();
    } catch (error) {
      return BaseResponseDto.error(
        'Error al obtener arrendatarios activos',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message,
      );
    }
  }

  @Get('estado/:estado')
  @ApiOperation({ summary: 'Obtener arrendatarios por estado de verificación' })
  @ApiParam({
    name: 'estado',
    description: 'Estado de verificación',
    enum: ['pendiente', 'verificado', 'rechazado'],
    example: 'pendiente',
  })
  @ApiResponse({
    status: 200,
    description: 'Arrendatarios filtrados por estado obtenidos exitosamente',
    type: BaseResponseDto<Arrendatario[]>,
  })
  async findByEstado(
    @Param('estado') estado: string,
  ): Promise<BaseResponseDto<Arrendatario[]>> {
    try {
      return await this.arrendatarioService.findByEstado(estado);
    } catch (error) {
      return BaseResponseDto.error(
        'Error al obtener arrendatarios por estado',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message,
      );
    }
  }

  @Get('documento/:numeroDocumento')
  @ApiOperation({ summary: 'Obtener arrendatario por número de documento' })
  @ApiParam({
    name: 'numeroDocumento',
    description: 'Número de documento de identidad',
    example: '12345678',
  })
  @ApiResponse({
    status: 200,
    description: 'Arrendatario encontrado exitosamente',
    type: BaseResponseDto<Arrendatario>,
  })
  @ApiResponse({
    status: 404,
    description: 'Arrendatario no encontrado',
  })
  async findByDocumento(
    @Param('numeroDocumento') numeroDocumento: string,
  ): Promise<BaseResponseDto<Arrendatario>> {
    try {
      return await this.arrendatarioService.findByDocumento(numeroDocumento);
    } catch (error) {
      return BaseResponseDto.error(
        'Error al buscar arrendatario por documento',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message,
      );
    }
  }

  @Get('usuario/:usuarioId')
  @ApiOperation({ summary: 'Obtener arrendatario por ID de usuario' })
  @ApiParam({
    name: 'usuarioId',
    description: 'ID del usuario asociado',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Arrendatario encontrado exitosamente',
    type: BaseResponseDto<Arrendatario>,
  })
  @ApiResponse({
    status: 404,
    description: 'Arrendatario no encontrado',
  })
  async findByUsuario(
    @Param('usuarioId', ParseUUIDPipe) usuarioId: string,
  ): Promise<BaseResponseDto<Arrendatario>> {
    try {
      return await this.arrendatarioService.findByUsuario(usuarioId);
    } catch (error) {
      return BaseResponseDto.error(
        'Error al buscar arrendatario por usuario',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un arrendatario por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID único del arrendatario',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Arrendatario encontrado exitosamente',
    type: BaseResponseDto<Arrendatario>,
  })
  @ApiResponse({
    status: 404,
    description: 'Arrendatario no encontrado',
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<BaseResponseDto<Arrendatario>> {
    try {
      return await this.arrendatarioService.findOne(id);
    } catch (error) {
      return BaseResponseDto.error(
        'Error al obtener el arrendatario',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message,
      );
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un arrendatario' })
  @ApiParam({
    name: 'id',
    description: 'ID único del arrendatario a actualizar',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Arrendatario actualizado exitosamente',
    type: BaseResponseDto<Arrendatario>,
  })
  @ApiResponse({
    status: 404,
    description: 'Arrendatario no encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflicto con documento existente',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateArrendatarioDto: UpdateArrendatarioDto,
  ): Promise<BaseResponseDto<Arrendatario>> {
    try {
      return await this.arrendatarioService.update(id, updateArrendatarioDto);
    } catch (error) {
      return BaseResponseDto.error(
        'Error al actualizar el arrendatario',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message,
      );
    }
  }

  @Post(':id/verificar')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verificar un arrendatario' })
  @ApiParam({
    name: 'id',
    description: 'ID único del arrendatario a verificar',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Arrendatario verificado exitosamente',
    type: BaseResponseDto<Arrendatario>,
  })
  @ApiResponse({
    status: 404,
    description: 'Arrendatario no encontrado',
  })
  async verificarArrendatario(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<BaseResponseDto<Arrendatario>> {
    try {
      return await this.arrendatarioService.verificarArrendatario(id);
    } catch (error) {
      return BaseResponseDto.error(
        'Error al verificar el arrendatario',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message,
      );
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar (desactivar) un arrendatario' })
  @ApiParam({
    name: 'id',
    description: 'ID único del arrendatario a eliminar',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Arrendatario eliminado exitosamente',
    type: BaseResponseDto<null>,
  })
  @ApiResponse({
    status: 404,
    description: 'Arrendatario no encontrado',
  })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<BaseResponseDto<void>> {
    try {
      return await this.arrendatarioService.remove(id);
    } catch (error) {
      return BaseResponseDto.error(
        'Error al eliminar el arrendatario',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message,
      );
    }
  }
}

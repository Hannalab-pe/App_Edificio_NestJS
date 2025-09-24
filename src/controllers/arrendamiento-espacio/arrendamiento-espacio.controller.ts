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
import { IArrendamientoEspacioService } from '../../services/interfaces/arrendamiento-espacio.interface';
import {
  CreateArrendamientoEspacioDto,
  UpdateArrendamientoEspacioDto,
  CreateArrendamientoCompletoDto,
} from '../../dtos';
import { BaseResponseDto } from '../../dtos/baseResponse/baseResponse.dto';
import { ArrendamientoEspacio } from '../../entities/ArrendamientoEspacio';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('Arrendamiento de Espacios')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('arrendamiento-espacio')
export class ArrendamientoEspacioController {
  constructor(
    @Inject('IArrendamientoEspacioService')
    private readonly arrendamientoEspacioService: IArrendamientoEspacioService,
  ) {}

  @Post('completo')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: '🚀 CREAR ARRENDAMIENTO COMPLETO (TRANSACCIÓN PRINCIPAL)',
    description: `
        ⭐ ENDPOINT PRINCIPAL para crear un arrendamiento completo:

        🔄 **Flujo de proceso:**
        1. 📋 Validar espacio disponible
        2. 👤 Crear arrendatario con datos completos
        3. 🔐 Generar usuario automáticamente
        4. 🤝 Crear contrato de arrendamiento
        5. ✅ Asignar espacio al arrendatario

        ✨ **Beneficios:**
        - Transacción atómica (todo o nada)
        - Usuario creado automáticamente
        - Espacio actualizado a ocupado
        - Rollback automático en caso de error
        `,
  })
  @ApiResponse({
    status: 201,
    description: 'Arrendamiento completo creado exitosamente',
    type: BaseResponseDto<ArrendamientoEspacio>,
  })
  @ApiResponse({
    status: 400,
    description: 'Espacio no disponible o datos inválidos',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflicto con arrendamiento existente',
  })
  async crearArrendamientoCompleto(
    @Body() createArrendamientoCompletoDto: CreateArrendamientoCompletoDto,
  ): Promise<BaseResponseDto<ArrendamientoEspacio>> {
    try {
      return await this.arrendamientoEspacioService.crearArrendamientoCompleto(
        createArrendamientoCompletoDto,
      );
    } catch (error) {
      return BaseResponseDto.error(
        'Error en la transacción de arrendamiento completo',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message,
      );
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear arrendamiento básico',
    description: 'Crea un arrendamiento con arrendatario existente',
  })
  @ApiResponse({
    status: 201,
    description: 'Arrendamiento creado exitosamente',
    type: BaseResponseDto<ArrendamientoEspacio>,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
  })
  async create(
    @Body() createArrendamientoDto: CreateArrendamientoEspacioDto,
  ): Promise<BaseResponseDto<ArrendamientoEspacio>> {
    try {
      return await this.arrendamientoEspacioService.create(
        createArrendamientoDto,
      );
    } catch (error) {
      return BaseResponseDto.error(
        'Error al crear el arrendamiento',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message,
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los arrendamientos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de arrendamientos obtenida exitosamente',
    type: BaseResponseDto<ArrendamientoEspacio[]>,
  })
  async findAll(): Promise<BaseResponseDto<ArrendamientoEspacio[]>> {
    try {
      return await this.arrendamientoEspacioService.findAll();
    } catch (error) {
      return BaseResponseDto.error(
        'Error al obtener los arrendamientos',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message,
      );
    }
  }

  @Get('activos')
  @ApiOperation({ summary: 'Obtener arrendamientos activos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de arrendamientos activos obtenida exitosamente',
    type: BaseResponseDto<ArrendamientoEspacio[]>,
  })
  async findActivos(): Promise<BaseResponseDto<ArrendamientoEspacio[]>> {
    try {
      return await this.arrendamientoEspacioService.findActivos();
    } catch (error) {
      return BaseResponseDto.error(
        'Error al obtener arrendamientos activos',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message,
      );
    }
  }

  @Get('vencidos')
  @ApiOperation({ summary: 'Obtener arrendamientos vencidos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de arrendamientos vencidos obtenida exitosamente',
    type: BaseResponseDto<ArrendamientoEspacio[]>,
  })
  async findVencidos(): Promise<BaseResponseDto<ArrendamientoEspacio[]>> {
    try {
      return await this.arrendamientoEspacioService.findVencidos();
    } catch (error) {
      return BaseResponseDto.error(
        'Error al obtener arrendamientos vencidos',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message,
      );
    }
  }

  @Get('proximos-vencer')
  @ApiOperation({ summary: 'Obtener arrendamientos próximos a vencer' })
  @ApiQuery({
    name: 'dias',
    description: 'Días de antelación para considerar próximo a vencer',
    example: 30,
    required: false,
  })
  @ApiResponse({
    status: 200,
    description:
      'Lista de arrendamientos próximos a vencer obtenida exitosamente',
    type: BaseResponseDto<ArrendamientoEspacio[]>,
  })
  async findProximosAVencer(
    @Query('dias') dias?: string,
  ): Promise<BaseResponseDto<ArrendamientoEspacio[]>> {
    try {
      const diasAntelacion = dias ? parseInt(dias) : 30;
      return await this.arrendamientoEspacioService.findProximosAVencer(
        diasAntelacion,
      );
    } catch (error) {
      return BaseResponseDto.error(
        'Error al obtener arrendamientos próximos a vencer',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message,
      );
    }
  }

  @Get('estado/:estado')
  @ApiOperation({ summary: 'Obtener arrendamientos por estado' })
  @ApiParam({
    name: 'estado',
    description: 'Estado del arrendamiento',
    enum: ['ACTIVO', 'INACTIVO', 'VENCIDO', 'TERMINADO'],
    example: 'ACTIVO',
  })
  @ApiResponse({
    status: 200,
    description: 'Arrendamientos filtrados por estado obtenidos exitosamente',
    type: BaseResponseDto<ArrendamientoEspacio[]>,
  })
  async findByEstado(
    @Param('estado') estado: string,
  ): Promise<BaseResponseDto<ArrendamientoEspacio[]>> {
    try {
      return await this.arrendamientoEspacioService.findByEstado(estado);
    } catch (error) {
      return BaseResponseDto.error(
        'Error al obtener arrendamientos por estado',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message,
      );
    }
  }

  @Get('espacio/:espacioId')
  @ApiOperation({
    summary: 'Obtener historial de arrendamientos de un espacio',
  })
  @ApiParam({
    name: 'espacioId',
    description: 'ID del espacio arrendable',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description:
      'Historial de arrendamientos del espacio obtenido exitosamente',
    type: BaseResponseDto<ArrendamientoEspacio[]>,
  })
  async findByEspacio(
    @Param('espacioId', ParseUUIDPipe) espacioId: string,
  ): Promise<BaseResponseDto<ArrendamientoEspacio[]>> {
    try {
      return await this.arrendamientoEspacioService.findByEspacio(espacioId);
    } catch (error) {
      return BaseResponseDto.error(
        'Error al obtener arrendamientos por espacio',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message,
      );
    }
  }

  @Get('arrendatario/:arrendatarioId')
  @ApiOperation({ summary: 'Obtener arrendamientos de un arrendatario' })
  @ApiParam({
    name: 'arrendatarioId',
    description: 'ID del arrendatario',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Arrendamientos del arrendatario obtenidos exitosamente',
    type: BaseResponseDto<ArrendamientoEspacio[]>,
  })
  async findByArrendatario(
    @Param('arrendatarioId', ParseUUIDPipe) arrendatarioId: string,
  ): Promise<BaseResponseDto<ArrendamientoEspacio[]>> {
    try {
      return await this.arrendamientoEspacioService.findByArrendatario(
        arrendatarioId,
      );
    } catch (error) {
      return BaseResponseDto.error(
        'Error al obtener arrendamientos por arrendatario',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message,
      );
    }
  }

  @Get('validar-espacio/:espacioId')
  @ApiOperation({
    summary: 'Validar si un espacio está disponible para arrendamiento',
  })
  @ApiParam({
    name: 'espacioId',
    description: 'ID del espacio a validar',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Validación de disponibilidad completada',
    type: BaseResponseDto<boolean>,
  })
  async validarEspacioDisponible(
    @Param('espacioId', ParseUUIDPipe) espacioId: string,
  ): Promise<BaseResponseDto<boolean>> {
    try {
      return await this.arrendamientoEspacioService.validarEspacioDisponible(
        espacioId,
      );
    } catch (error) {
      return BaseResponseDto.error(
        'Error al validar disponibilidad del espacio',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un arrendamiento por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID único del arrendamiento',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Arrendamiento encontrado exitosamente',
    type: BaseResponseDto<ArrendamientoEspacio>,
  })
  @ApiResponse({
    status: 404,
    description: 'Arrendamiento no encontrado',
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<BaseResponseDto<ArrendamientoEspacio>> {
    try {
      return await this.arrendamientoEspacioService.findOne(id);
    } catch (error) {
      return BaseResponseDto.error(
        'Error al obtener el arrendamiento',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message,
      );
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un arrendamiento' })
  @ApiParam({
    name: 'id',
    description: 'ID único del arrendamiento a actualizar',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Arrendamiento actualizado exitosamente',
    type: BaseResponseDto<ArrendamientoEspacio>,
  })
  @ApiResponse({
    status: 404,
    description: 'Arrendamiento no encontrado',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateArrendamientoDto: UpdateArrendamientoEspacioDto,
  ): Promise<BaseResponseDto<ArrendamientoEspacio>> {
    try {
      return await this.arrendamientoEspacioService.update(
        id,
        updateArrendamientoDto,
      );
    } catch (error) {
      return BaseResponseDto.error(
        'Error al actualizar el arrendamiento',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message,
      );
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Terminar un arrendamiento',
    description: 'Termina el arrendamiento y libera el espacio',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del arrendamiento a terminar',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Arrendamiento terminado exitosamente',
    type: BaseResponseDto<null>,
  })
  @ApiResponse({
    status: 404,
    description: 'Arrendamiento no encontrado',
  })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<BaseResponseDto<void>> {
    try {
      return await this.arrendamientoEspacioService.remove(id);
    } catch (error) {
      return BaseResponseDto.error(
        'Error al terminar el arrendamiento',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message,
      );
    }
  }
}

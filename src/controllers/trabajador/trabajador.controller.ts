import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Patch,
  ParseUUIDPipe,
  HttpException,
  Logger,
  UseGuards,
  HttpCode,
  Inject,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import {
  CreateTrabajadorDto,
  UpdateTrabajadorDto,
  TrabajadorRegisterResponseDto,
  TrabajadorResponseDto,
  TrabajadorSingleResponseDto,
  TrabajadorArrayResponseDto,
} from '../../dtos';
import { BaseResponseDto } from '../../dtos/baseResponse/baseResponse.dto';
import { ITrabajadorService } from '../../services/interfaces/trabajador.interface';
import { TipoDocumentoIdentidad } from '../../Enums/documento-identidad.enum';

@ApiTags('👷 Trabajadores')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('api/v1/trabajadores')
export class TrabajadorController {
  private readonly logger = new Logger(TrabajadorController.name);

  constructor(
    @Inject('ITrabajadorService')
    private readonly trabajadorService: ITrabajadorService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Registrar nuevo trabajador con usuario',
    description: 'Crea un nuevo trabajador junto con su usuario y documento de identidad en una sola transacción. Ideal para registro completo de empleados.'
  })
  @ApiBody({
    type: CreateTrabajadorDto,
    description: 'Datos completos para registrar trabajador con usuario',
    examples: {
      registro_completo: {
        summary: 'Registro completo de trabajador',
        description: 'Ejemplo con todos los campos para crear trabajador, usuario y documento',
        value: {
          nombre: 'Juan Carlos',
          apellido: 'Pérez García',
          correo: 'trabajador@viveconecta.com',
          contrasena: 'MiContraseña123!',
          confirmarContrasena: 'MiContraseña123!',
          telefono: '+51987654321',
          fechaNacimiento: '1990-05-15',
          fechaIngreso: '2024-01-15',
          salarioActual: '2500.00',
          tipoDocumento: TipoDocumentoIdentidad.DNI,
          numeroDocumento: 12345678,
          idRol: '550e8400-e29b-41d4-a716-446655440000'
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Trabajador registrado exitosamente con usuario creado',
    type: TrabajadorRegisterResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o contraseñas no coinciden',
  })
  @ApiResponse({
    status: 409,
    description: 'Email ya registrado o documento duplicado',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async register(
    @Body() createTrabajadorDto: CreateTrabajadorDto,
  ): Promise<TrabajadorRegisterResponseDto> {
    try {
      this.logger.log(`Registrando trabajador completo: ${createTrabajadorDto.correo}`);
      return await this.trabajadorService.register(createTrabajadorDto);
    } catch (error) {
      this.logger.error(`Error al registrar trabajador: ${error.message}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error interno del servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear un nuevo trabajador',
    description: 'Crea un nuevo trabajador en el sistema con validaciones completas'
  })
  @ApiBody({
    type: CreateTrabajadorDto,
    description: 'Datos para crear un trabajador',
    examples: {
      trabajador_basico: {
        summary: 'Trabajador básico',
        description: 'Ejemplo con los campos mínimos requeridos',
        value: {
          nombre: 'María Elena',
          apellido: 'González López',
          correo: 'mgonzalez@viveconecta.com',
          contrasena: 'Password123!',
          confirmarContrasena: 'Password123!',
          tipoDocumento: TipoDocumentoIdentidad.DNI,
          numeroDocumento: 87654321
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Trabajador creado exitosamente',
    type: TrabajadorSingleResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos o campos requeridos faltantes',
  })
  @ApiResponse({
    status: 409,
    description: 'Ya existe un trabajador con ese correo o número de documento',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async create(
    @Body() createTrabajadorDto: CreateTrabajadorDto,
  ): Promise<TrabajadorSingleResponseDto> {
    try {
      this.logger.log(`Creando trabajador: ${createTrabajadorDto.correo}`);
      
      const result = await this.trabajadorService.createWithBaseResponse(createTrabajadorDto);
      
      if (!result.success) {
        const statusCode = result.statusCode || 400;
        throw new HttpException(result.message, statusCode);
      }
      
      this.logger.log(`Trabajador creado exitosamente con ID: ${result.data?.idTrabajador}`);
      return result;
    } catch (error) {
      this.logger.error(`Error al crear trabajador: ${error.message}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error interno del servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los trabajadores',
    description: 'Retorna la lista completa de trabajadores con información de usuario y documento de identidad'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de trabajadores obtenida exitosamente',
    type: TrabajadorArrayResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async findAll(): Promise<TrabajadorArrayResponseDto> {
    try {
      this.logger.log('Obteniendo todos los trabajadores');
      
      const result = await this.trabajadorService.findAllWithBaseResponse();
      
      if (!result.success) {
        throw new HttpException(result.message, result.statusCode || 500);
      }
      
      this.logger.log(`Se encontraron ${result.data?.length || 0} trabajadores`);
      return result;
    } catch (error) {
      this.logger.error(`Error al obtener trabajadores: ${error.message}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error interno del servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('activos')
  @ApiOperation({
    summary: 'Obtener trabajadores activos',
    description: 'Retorna solo los trabajadores que están marcados como activos en el sistema'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de trabajadores activos obtenida exitosamente',
    type: TrabajadorArrayResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async findActivos(): Promise<TrabajadorArrayResponseDto> {
    try {
      this.logger.log('Obteniendo trabajadores activos');
      
      const result = await this.trabajadorService.findActivosWithBaseResponse();
      
      if (!result.success) {
        throw new HttpException(result.message, result.statusCode || 500);
      }
      
      this.logger.log(`Se encontraron ${result.data?.length || 0} trabajadores activos`);
      return result;
    } catch (error) {
      this.logger.error(`Error al obtener trabajadores activos: ${error.message}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error interno del servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un trabajador por ID',
    description: 'Busca y retorna un trabajador específico usando su identificador único con información completa'
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del trabajador (formato UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Trabajador encontrado exitosamente',
    type: TrabajadorSingleResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'ID proporcionado no es un UUID válido',
  })
  @ApiResponse({
    status: 404,
    description: 'Trabajador no encontrado',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<TrabajadorSingleResponseDto> {
    try {
      this.logger.log(`Buscando trabajador con ID: ${id}`);
      
      const result = await this.trabajadorService.findOneWithBaseResponse(id);
      
      if (!result.success) {
        const statusCode = result.statusCode || 404;
        throw new HttpException(result.message, statusCode);
      }
      
      this.logger.log(`Trabajador encontrado: ${result.data?.nombre} ${result.data?.apellido}`);
      return result;
    } catch (error) {
      this.logger.error(`Error al buscar trabajador: ${error.message}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error interno del servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un trabajador',
    description: 'Actualiza parcial o totalmente los datos de un trabajador existente'
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del trabajador a actualizar (formato UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
    type: 'string',
    format: 'uuid',
  })
  @ApiBody({
    type: UpdateTrabajadorDto,
    description: 'Datos a actualizar del trabajador',
    examples: {
      actualizacion_parcial: {
        summary: 'Actualización parcial',
        description: 'Ejemplo de actualización de información personal',
        value: {
          telefono: '+51912345678',
          salarioActual: '3000.00'
        }
      },
      cambio_estado: {
        summary: 'Activar/Desactivar trabajador',
        description: 'Ejemplo para cambiar estado de actividad',
        value: {
          estaActivo: false
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Trabajador actualizado exitosamente',
    type: TrabajadorSingleResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos o ID no es UUID válido',
  })
  @ApiResponse({
    status: 404,
    description: 'Trabajador no encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'Ya existe otro trabajador con ese correo',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTrabajadorDto: UpdateTrabajadorDto,
  ): Promise<TrabajadorSingleResponseDto> {
    try {
      this.logger.log(`Actualizando trabajador con ID: ${id}`);
      
      const result = await this.trabajadorService.updateWithBaseResponse(id, updateTrabajadorDto);
      
      if (!result.success) {
        const statusCode = result.statusCode || 400;
        throw new HttpException(result.message, statusCode);
      }
      
      this.logger.log(`Trabajador actualizado exitosamente: ${result.data?.nombre} ${result.data?.apellido}`);
      return result;
    } catch (error) {
      this.logger.error(`Error al actualizar trabajador: ${error.message}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error interno del servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Eliminar un trabajador (desactivación lógica)',
    description: 'Elimina lógicamente un trabajador marcándolo como inactivo en lugar de eliminación física'
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del trabajador a eliminar (formato UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Trabajador desactivado exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Trabajador desactivado exitosamente' },
        data: { type: 'null', example: null },
        error: { type: 'null', example: null }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'ID proporcionado no es un UUID válido o trabajador ya inactivo',
  })
  @ApiResponse({
    status: 404,
    description: 'Trabajador no encontrado',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async remove(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<BaseResponseDto<undefined>> {
    try {
      this.logger.log(`Eliminando (desactivando) trabajador con ID: ${id}`);
      
      const result = await this.trabajadorService.removeWithBaseResponse(id);
      
      if (!result.success) {
        const statusCode = result.statusCode || 400;
        throw new HttpException(result.message, statusCode);
      }
      
      this.logger.log(`Trabajador desactivado exitosamente con ID: ${id}`);
      return result;
    } catch (error) {
      this.logger.error(`Error al eliminar trabajador: ${error.message}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error interno del servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('documento/:numeroDocumento')
  @ApiOperation({
    summary: 'Buscar trabajador por número de documento',
    description: 'Encuentra un trabajador utilizando su número de documento de identidad'
  })
  @ApiParam({
    name: 'numeroDocumento',
    description: 'Número del documento de identidad del trabajador',
    example: '12345678',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Trabajador encontrado exitosamente',
    type: TrabajadorSingleResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontró trabajador con ese número de documento',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async findByNumeroDocumento(
    @Param('numeroDocumento') numeroDocumento: string,
  ): Promise<TrabajadorSingleResponseDto> {
    try {
      this.logger.log(`Buscando trabajador por número de documento: ${numeroDocumento}`);
      
      const result = await this.trabajadorService.findByNumeroDocumentoWithBaseResponse(numeroDocumento);
      
      if (!result.success) {
        const statusCode = result.statusCode || 404;
        throw new HttpException(result.message, statusCode);
      }
      
      this.logger.log(`Trabajador encontrado: ${result.data?.nombre} ${result.data?.apellido}`);
      return result;
    } catch (error) {
      this.logger.error(`Error al buscar trabajador por documento: ${error.message}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error interno del servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('correo/:correo')
  @ApiOperation({
    summary: 'Buscar trabajador por correo electrónico',
    description: 'Encuentra un trabajador utilizando su correo electrónico registrado'
  })
  @ApiParam({
    name: 'correo',
    description: 'Correo electrónico del trabajador',
    example: 'trabajador@viveconecta.com',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Trabajador encontrado exitosamente',
    type: TrabajadorSingleResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontró trabajador con ese correo',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async findByCorreo(
    @Param('correo') correo: string,
  ): Promise<TrabajadorSingleResponseDto> {
    try {
      this.logger.log(`Buscando trabajador por correo: ${correo}`);
      
      const result = await this.trabajadorService.findByCorreoWithBaseResponse(correo);
      
      if (!result.success) {
        const statusCode = result.statusCode || 404;
        throw new HttpException(result.message, statusCode);
      }
      
      this.logger.log(`Trabajador encontrado: ${result.data?.nombre} ${result.data?.apellido}`);
      return result;
    } catch (error) {
      this.logger.error(`Error al buscar trabajador por correo: ${error.message}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error interno del servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('cargo/:cargo')
  @ApiOperation({
    summary: 'Buscar trabajadores por cargo o rol',
    description: 'Encuentra todos los trabajadores activos que tienen un cargo o rol específico'
  })
  @ApiParam({
    name: 'cargo',
    description: 'Cargo o rol del trabajador a buscar',
    example: 'Supervisor',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de trabajadores por cargo obtenida exitosamente',
    type: TrabajadorArrayResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async findByCargo(@Param('cargo') cargo: string): Promise<TrabajadorArrayResponseDto> {
    try {
      this.logger.log(`Buscando trabajadores por cargo: ${cargo}`);
      
      const result = await this.trabajadorService.findByCargoWithBaseResponse(cargo);
      
      if (!result.success) {
        throw new HttpException(result.message, result.statusCode || 500);
      }
      
      this.logger.log(`Se encontraron ${result.data?.length || 0} trabajadores con cargo ${cargo}`);
      return result;
    } catch (error) {
      this.logger.error(`Error al buscar trabajadores por cargo: ${error.message}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error interno del servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

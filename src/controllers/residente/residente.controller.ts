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
  UseGuards,
  HttpException,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import {
  CreateResidenteDto,
  UpdateResidenteDto,
  ResidenteRegisterResponseDto,
  ResidenteSingleResponseDto,
  ResidenteArrayResponseDto,
  ResidenteRegisterCompleteResponseDto,
} from '../../dtos';
import { BaseResponseDto } from '../../dtos/baseResponse/baseResponse.dto';
import { Residente } from '../../entities/Residente';
import { IResidenteService } from '../../services/interfaces/residente.interface';
import { ResidenteService } from '../../services/implementations/residente/residente.service';

@ApiTags('Residentes')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('residente')
export class ResidenteController {
  constructor(
    @Inject('IResidenteService')
    private readonly residenteService: IResidenteService,
    private readonly residenteServiceDirect: ResidenteService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Crear nuevo residente básico',
    description: 'Crea un nuevo residente básico sin usuario ni documento de identidad asociado',
  })
  @ApiResponse({
    status: 201,
    description: 'Residente creado exitosamente',
    type: ResidenteSingleResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async create(@Body() createResidenteDto: CreateResidenteDto): Promise<BaseResponseDto<any>> {
    try {
      return await this.residenteServiceDirect.createWithBaseResponse(createResidenteDto);
    } catch (error) {
      throw new HttpException(
        `Error al crear el residente: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('register')
  @ApiOperation({
    summary: 'Registrar nuevo residente',
    description: 'Registra un nuevo residente en el sistema con validaciones completas y creación de usuario asociado',
  })
  @ApiBody({
    type: CreateResidenteDto,
    description: 'Datos completos del residente a registrar',
  })
  @ApiResponse({
    status: 201,
    description: 'Residente registrado exitosamente',
    type: ResidenteRegisterCompleteResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos o faltantes',
  })
  @ApiResponse({
    status: 409,
    description: 'Correo o número de documento ya registrado en el sistema',
  })
  async register(
    @Body() createResidenteDto: CreateResidenteDto,
  ): Promise<BaseResponseDto<any>> {
    try {
      const result = await this.residenteService.register(createResidenteDto);
      return BaseResponseDto.success(
        result,
        'Residente registrado exitosamente en el sistema'
      );
    } catch (error) {
      throw new HttpException(
        `Error al registrar el residente: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los residentes',
    description: 'Retorna una lista de todos los residentes activos del sistema con información completa de relaciones',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de residentes obtenida exitosamente',
    type: ResidenteArrayResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async findAll(): Promise<BaseResponseDto<any[]>> {
    try {
      return await this.residenteServiceDirect.findAllWithBaseResponse();
    } catch (error) {
      throw new HttpException(
        `Error al obtener los residentes: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener residente por ID',
    description: 'Retorna un residente específico identificado por su UUID con toda la información relacionada',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID único del residente',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Residente encontrado exitosamente',
    type: ResidenteSingleResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Residente no encontrado',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async findOne(@Param('id') id: string): Promise<BaseResponseDto<any>> {
    try {
      return await this.residenteServiceDirect.findOneWithBaseResponse(id);
    } catch (error) {
      throw new HttpException(
        `Error al buscar el residente: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('propiedad/:propiedadId')
  @ApiOperation({
    summary: 'Obtener residentes por propiedad',
    description: 'Retorna todos los residentes asociados a una propiedad específica',
  })
  @ApiParam({
    name: 'propiedadId',
    description: 'UUID de la propiedad',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Residentes de la propiedad obtenidos exitosamente',
    type: ResidenteArrayResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontraron residentes para la propiedad especificada',
  })
  async findByPropiedad(
    @Param('propiedadId') propiedadId: string,
  ): Promise<BaseResponseDto<any[]>> {
    try {
      return await this.residenteServiceDirect.findByPropiedadWithBaseResponse(propiedadId);
    } catch (error) {
      throw new HttpException(
        `Error al buscar residentes por propiedad: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('documento/:numeroDocumento')
  @ApiOperation({
    summary: 'Obtener residente por número de documento',
    description: 'Busca un residente específico por su número de documento de identidad',
  })
  @ApiParam({
    name: 'numeroDocumento',
    description: 'Número del documento de identidad del residente',
    example: '12345678',
  })
  @ApiResponse({
    status: 200,
    description: 'Residente encontrado exitosamente',
    type: ResidenteSingleResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Residente no encontrado con el número de documento especificado',
  })
  async findByNumeroDocumento(
    @Param('numeroDocumento') numeroDocumento: string,
  ): Promise<BaseResponseDto<any>> {
    try {
      const residente = await this.residenteService.findByNumeroDocumento(numeroDocumento);
      if (!residente) {
        throw new HttpException('Residente no encontrado', HttpStatus.NOT_FOUND);
      }
      return BaseResponseDto.success(
        this.mapToResponseDto(residente),
        'Residente encontrado exitosamente'
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Error al buscar residente por documento: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('correo/:correo')
  @ApiOperation({
    summary: 'Obtener residente por correo',
    description: 'Busca un residente específico por su dirección de correo electrónico',
  })
  @ApiParam({
    name: 'correo',
    description: 'Correo electrónico del residente',
    example: 'residente@viveconecta.com',
  })
  @ApiResponse({
    status: 200,
    description: 'Residente encontrado exitosamente',
    type: ResidenteSingleResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Residente no encontrado con el correo especificado',
  })
  async findByCorreo(@Param('correo') correo: string): Promise<BaseResponseDto<any>> {
    try {
      const residente = await this.residenteService.findByCorreo(correo);
      if (!residente) {
        throw new HttpException('Residente no encontrado', HttpStatus.NOT_FOUND);
      }
      return BaseResponseDto.success(
        this.mapToResponseDto(residente),
        'Residente encontrado exitosamente'
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Error al buscar residente por correo: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('estado/:estaActivo')
  @ApiOperation({
    summary: 'Obtener residentes por estado',
    description: 'Retorna todos los residentes filtrados por su estado (activo/inactivo)',
  })
  @ApiParam({
    name: 'estaActivo',
    description: 'Estado del residente (true para activos, false para inactivos)',
    example: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Residentes obtenidos exitosamente',
    type: ResidenteArrayResponseDto,
  })
  async findByEstado(@Param('estaActivo') estaActivo: boolean): Promise<BaseResponseDto<any[]>> {
    try {
      return await this.residenteServiceDirect.findByEstadoWithBaseResponse(estaActivo);
    } catch (error) {
      throw new HttpException(
        `Error al buscar residentes por estado: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Método helper para mapear entidad a DTO de respuesta
  private mapToResponseDto(residente: any): any {
    if (!residente) return null;

    return {
      idResidente: residente.idResidente,
      nombre: residente.nombre,
      apellido: residente.apellido,
      correo: residente.correo,
      telefono: residente.telefono,
      fechaNacimiento: residente.fechaNacimiento,
      estaActivo: residente.estaActivo,
      fechaCreacion: residente.fechaCreacion,
      fechaModificacion: residente.fechaModificacion,
      documentoIdentidad: residente.documentoIdentidad ? {
        idDocumentoIdentidad: residente.documentoIdentidad.idDocumentoIdentidad,
        numeroDocumento: residente.documentoIdentidad.numeroDocumento,
        tipoDocumento: residente.documentoIdentidad.tipoDocumento ? {
          idTipoDocumento: residente.documentoIdentidad.tipoDocumento.idTipoDocumento,
          nombre: residente.documentoIdentidad.tipoDocumento.nombre,
          descripcion: residente.documentoIdentidad.tipoDocumento.descripcion,
        } : null,
      } : null,
      usuario: residente.usuario ? {
        idUsuario: residente.usuario.idUsuario,
        nombreUsuario: residente.usuario.nombreUsuario,
        correo: residente.usuario.correo,
        estaActivo: residente.usuario.estaActivo,
        rol: residente.usuario.rol ? {
          idRol: residente.usuario.rol.idRol,
          nombre: residente.usuario.rol.nombre,
          descripcion: residente.usuario.rol.descripcion,
        } : null,
      } : null,
      cronogramas: residente.cronogramas?.map(cronograma => ({
        idCronograma: cronograma.idCronograma,
        fechaInicio: cronograma.fechaInicio,
        fechaFin: cronograma.fechaFin,
        descripcion: cronograma.descripcion,
      })) || [],
      residencias: residente.residencias?.map(residencia => ({
        idResidencia: residencia.idResidencia,
        fechaInicio: residencia.fechaInicio,
        fechaFin: residencia.fechaFin,
        estaActivo: residencia.estaActivo,
        propiedad: residencia.propiedad ? {
          idPropiedad: residencia.propiedad.idPropiedad,
          numeroPropiedad: residencia.propiedad.numeroPropiedad,
          piso: residencia.propiedad.piso,
          torre: residencia.propiedad.torre,
        } : null,
      })) || [],
    };
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar residente',
    description: 'Actualiza parcialmente un residente existente con validación de conflictos de correo',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID único del residente a actualizar',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Residente actualizado exitosamente',
    type: ResidenteSingleResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
  })
  @ApiResponse({
    status: 404,
    description: 'Residente no encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflicto con correo existente',
  })
  async update(
    @Param('id') id: string,
    @Body() updateResidenteDto: UpdateResidenteDto,
  ): Promise<BaseResponseDto<any>> {
    try {
      return await this.residenteServiceDirect.updateWithBaseResponse(id, updateResidenteDto);
    } catch (error) {
      throw new HttpException(
        `Error al actualizar el residente: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar residente',
    description: 'Elimina lógicamente un residente marcándolo como inactivo',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID único del residente a eliminar',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Residente eliminado exitosamente',
    type: BaseResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Residente no encontrado',
  })
  async remove(@Param('id') id: string): Promise<BaseResponseDto<null>> {
    try {
      return await this.residenteServiceDirect.removeWithBaseResponse(id);
    } catch (error) {
      throw new HttpException(
        `Error al eliminar el residente: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

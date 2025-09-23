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
  Inject
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateResidenteDto, UpdateResidenteDto, ResidenteRegisterResponseDto } from '../../dtos';
import { Residente } from '../../entities/Residente';
import { IResidenteService } from '../../services/interfaces/residente.interface';

@ApiTags('Residentes')
@Controller('residente')
export class ResidenteController {
  constructor(
    @Inject('IResidenteService')
    private readonly residenteService: IResidenteService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear un nuevo residente (básico)',
    description: 'Crea un nuevo residente sin usuario ni documento de identidad'
  })
  @ApiBody({
    type: CreateResidenteDto,
    description: 'Datos del residente a crear'
  })
  @ApiResponse({
    status: 201,
    description: 'Residente creado exitosamente',
    type: Residente
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos'
  })
  async create(@Body() createResidenteDto: CreateResidenteDto): Promise<Residente> {
    return await this.residenteService.create(createResidenteDto);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Registrar un nuevo residente (completo)',
    description: 'Registra un nuevo residente con usuario y documento de identidad usando transacción'
  })
  @ApiBody({
    type: CreateResidenteDto,
    description: 'Datos completos del residente a registrar'
  })
  @ApiResponse({
    status: 201,
    description: 'Residente registrado exitosamente con usuario y documento',
    type: ResidenteRegisterResponseDto
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o contraseñas no coinciden'
  })
  @ApiResponse({
    status: 409,
    description: 'Correo o número de documento ya registrado'
  })
  async register(@Body() createResidenteDto: CreateResidenteDto): Promise<ResidenteRegisterResponseDto> {
    return await this.residenteService.register(createResidenteDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los residentes',
    description: 'Retorna una lista de todos los residentes del sistema con sus relaciones'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de residentes obtenida exitosamente',
    type: [Residente]
  })
  async findAll(): Promise<Residente[]> {
    return await this.residenteService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un residente por ID',
    description: 'Retorna un residente específico por su ID con todas sus relaciones'
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del residente',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({
    status: 200,
    description: 'Residente encontrado exitosamente',
    type: Residente
  })
  @ApiResponse({
    status: 404,
    description: 'Residente no encontrado'
  })
  async findOne(@Param('id') id: string): Promise<Residente> {
    return await this.residenteService.findOne(id);
  }

  @Get('propiedad/:propiedadId')
  @ApiOperation({
    summary: 'Obtener residentes por propiedad',
    description: 'Retorna todos los residentes asociados a una propiedad específica'
  })
  @ApiParam({
    name: 'propiedadId',
    description: 'ID de la propiedad',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({
    status: 200,
    description: 'Residentes de la propiedad obtenidos exitosamente',
    type: [Residente]
  })
  async findByPropiedad(@Param('propiedadId') propiedadId: string): Promise<Residente[]> {
    return await this.residenteService.findByPropiedad(propiedadId);
  }

  @Get('documento/:numeroDocumento')
  @ApiOperation({
    summary: 'Obtener residente por número de documento',
    description: 'Retorna un residente específico por su número de documento'
  })
  @ApiParam({
    name: 'numeroDocumento',
    description: 'Número del documento de identidad',
    example: '87654321'
  })
  @ApiResponse({
    status: 200,
    description: 'Residente encontrado exitosamente',
    type: Residente
  })
  @ApiResponse({
    status: 404,
    description: 'Residente no encontrado'
  })
  async findByNumeroDocumento(@Param('numeroDocumento') numeroDocumento: string): Promise<Residente> {
    return await this.residenteService.findByNumeroDocumento(numeroDocumento);
  }

  @Get('correo/:correo')
  @ApiOperation({
    summary: 'Obtener residente por correo',
    description: 'Retorna un residente específico por su correo electrónico'
  })
  @ApiParam({
    name: 'correo',
    description: 'Correo electrónico del residente',
    example: 'residente@viveconecta.com'
  })
  @ApiResponse({
    status: 200,
    description: 'Residente encontrado exitosamente',
    type: Residente
  })
  @ApiResponse({
    status: 404,
    description: 'Residente no encontrado'
  })
  async findByCorreo(@Param('correo') correo: string): Promise<Residente> {
    return await this.residenteService.findByCorreo(correo);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un residente (actualización parcial)',
    description: 'Actualiza parcialmente los datos de un residente existente. Solo los campos enviados serán actualizados.'
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del residente',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiBody({
    type: UpdateResidenteDto,
    description: 'Datos del residente a actualizar (campos opcionales)'
  })
  @ApiResponse({
    status: 200,
    description: 'Residente actualizado exitosamente',
    type: Residente
  })
  @ApiResponse({
    status: 404,
    description: 'Residente no encontrado'
  })
  async update(
    @Param('id') id: string,
    @Body() updateResidenteDto: UpdateResidenteDto
  ): Promise<Residente> {
    return await this.residenteService.update(id, updateResidenteDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar un residente (eliminación lógica)',
    description: 'Elimina lógicamente un residente marcándolo como inactivo, también desactiva el usuario asociado'
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del residente',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({
    status: 204,
    description: 'Residente eliminado exitosamente'
  })
  @ApiResponse({
    status: 404,
    description: 'Residente no encontrado'
  })
  async remove(@Param('id') id: string): Promise<void> {
    return await this.residenteService.remove(id);
  }
}

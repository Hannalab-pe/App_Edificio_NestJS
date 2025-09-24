import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Inject,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { ITrabajadorService } from '../../services/interfaces/trabajador.interface';
import {
  CreateTrabajadorDto,
  UpdateTrabajadorDto,
  TrabajadorRegisterResponseDto,
} from '../../dtos';
import { Trabajador } from '../../entities/Trabajador';

@ApiTags('Trabajadores')
@Controller('trabajador')
export class TrabajadorController {
  constructor(
    @Inject('ITrabajadorService')
    private readonly trabajadorService: ITrabajadorService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Registrar nuevo trabajador',
    description:
      'Crea un nuevo trabajador junto con su usuario en una transacción',
  })
  @ApiBody({ type: CreateTrabajadorDto })
  @ApiResponse({
    status: 201,
    description: 'Trabajador registrado exitosamente',
    type: TrabajadorRegisterResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 409, description: 'Email ya registrado' })
  async register(
    @Body() createTrabajadorDto: CreateTrabajadorDto,
  ): Promise<TrabajadorRegisterResponseDto> {
    return await this.trabajadorService.register(createTrabajadorDto);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear trabajador básico',
    description: 'Crea un trabajador sin crear usuario automáticamente',
  })
  @ApiResponse({
    status: 201,
    description: 'Trabajador creado exitosamente',
    type: Trabajador,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async create(@Body() createTrabajadorDto: any): Promise<Trabajador> {
    return await this.trabajadorService.create(createTrabajadorDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los trabajadores' })
  @ApiResponse({
    status: 200,
    description: 'Lista de trabajadores',
    type: [Trabajador],
  })
  async findAll(): Promise<Trabajador[]> {
    return await this.trabajadorService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener trabajador por ID' })
  @ApiParam({ name: 'id', description: 'ID del trabajador' })
  @ApiResponse({
    status: 200,
    description: 'Trabajador encontrado',
    type: Trabajador,
  })
  @ApiResponse({ status: 404, description: 'Trabajador no encontrado' })
  async findOne(@Param('id') id: string): Promise<Trabajador> {
    return await this.trabajadorService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar trabajador' })
  @ApiParam({ name: 'id', description: 'ID del trabajador' })
  @ApiResponse({
    status: 200,
    description: 'Trabajador actualizado',
    type: Trabajador,
  })
  @ApiResponse({ status: 404, description: 'Trabajador no encontrado' })
  async update(
    @Param('id') id: string,
    @Body() updateTrabajadorDto: UpdateTrabajadorDto,
  ): Promise<Trabajador> {
    return await this.trabajadorService.update(id, updateTrabajadorDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar (desactivar) trabajador' })
  @ApiParam({ name: 'id', description: 'ID del trabajador' })
  @ApiResponse({
    status: 204,
    description: 'Trabajador desactivado exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Trabajador no encontrado' })
  async remove(@Param('id') id: string): Promise<void> {
    return await this.trabajadorService.remove(id);
  }

  @Get('documento/:numeroDocumento')
  @ApiOperation({ summary: 'Buscar trabajador por número de documento' })
  @ApiParam({
    name: 'numeroDocumento',
    description: 'Número de documento del trabajador',
  })
  @ApiResponse({
    status: 200,
    description: 'Trabajador encontrado',
    type: Trabajador,
  })
  @ApiResponse({ status: 404, description: 'Trabajador no encontrado' })
  async findByNumeroDocumento(
    @Param('numeroDocumento') numeroDocumento: string,
  ): Promise<Trabajador> {
    return await this.trabajadorService.findByNumeroDocumento(numeroDocumento);
  }

  @Get('cargo/:cargo')
  @ApiOperation({ summary: 'Buscar trabajadores por cargo' })
  @ApiParam({ name: 'cargo', description: 'Cargo del trabajador' })
  @ApiResponse({
    status: 200,
    description: 'Lista de trabajadores por cargo',
    type: [Trabajador],
  })
  async findByCargo(@Param('cargo') cargo: string): Promise<Trabajador[]> {
    return await this.trabajadorService.findByCargo(cargo);
  }
}

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Logger,
  Inject,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { 
  CreateUsuarioDto, 
  UpdateUsuarioDto, 
  UsuarioResponseDto,
  UsuarioSingleResponseDto,
  UsuarioArrayResponseDto 
} from '../../dtos';
import { IUsuarioService } from '../../services/interfaces/usuario.interface';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('Usuarios')
@Controller('usuario')
export class UsuarioController {
  private readonly logger = new Logger(UsuarioController.name);

  constructor(
    @Inject('IUsuarioService') private readonly usuarioService: IUsuarioService
  ) {}
  // ===============================================
  // ENDPOINT DE PRUEBA
  // ===============================================

  @Get('test')
  @ApiOperation({
    summary: 'Endpoint de prueba',
    description: 'Endpoint simple para verificar que el controlador Usuario funciona',
  })
  async test() {
    this.logger.log('Test del controlador Usuario');
    return { message: 'Usuario Controller funcionando correctamente!', timestamp: new Date() };
  }

  // ===============================================
  // ENDPOINTS PRINCIPALES CON BASE RESPONSE DTO
  // ===============================================

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los usuarios',
    description: 'Retorna una lista completa de todos los usuarios registrados con sus perfiles y estadísticas',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios obtenida exitosamente',
    type: UsuarioArrayResponseDto,
  })
  async findAll(): Promise<UsuarioArrayResponseDto> {
    this.logger.log('Solicitud para obtener todos los usuarios');
    return await this.usuarioService.findAllWithBaseResponse();
  }

  @Get('activos')
  @ApiOperation({
    summary: 'Obtener usuarios activos',
    description: 'Retorna únicamente los usuarios que están activos en el sistema',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios activos obtenida exitosamente',
    type: UsuarioArrayResponseDto,
  })
  async findActiveUsers(): Promise<UsuarioArrayResponseDto> {
    this.logger.log('Solicitud para obtener usuarios activos');
    return await this.usuarioService.findActiveUsersWithBaseResponse();
  }

  @Get('por-rol/:roleId')
  @ApiOperation({
    summary: 'Obtener usuarios por rol',
    description: 'Retorna todos los usuarios que tienen un rol específico',
  })
  @ApiParam({
    name: 'roleId',
    description: 'ID del rol a filtrar',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios por rol obtenida exitosamente',
    type: UsuarioArrayResponseDto,
  })
  async findByRole(@Param('roleId') roleId: string): Promise<UsuarioArrayResponseDto> {
    this.logger.log(`Solicitud para obtener usuarios con rol: ${roleId}`);
    return await this.usuarioService.findByRoleWithBaseResponse(roleId);
  }

  @Get('por-email/:email')
  @ApiOperation({
    summary: 'Buscar usuario por email',
    description: 'Busca y retorna un usuario específico por su dirección de correo electrónico',
  })
  @ApiParam({
    name: 'email',
    description: 'Email del usuario a buscar',
    example: 'usuario@ejemplo.com',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario encontrado por email',
    type: UsuarioSingleResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  async findByEmail(@Param('email') email: string): Promise<UsuarioSingleResponseDto> {
    this.logger.log(`Solicitud para buscar usuario por email: ${email}`);
    return await this.usuarioService.findByEmailWithBaseResponse(email);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un usuario por ID',
    description: 'Retorna un usuario específico con toda su información de perfiles, estadísticas y notificaciones',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del usuario (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario encontrado exitosamente',
    type: UsuarioSingleResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  async findOne(@Param('id') id: string): Promise<UsuarioSingleResponseDto> {
    this.logger.log(`Solicitud para obtener usuario con ID: ${id}`);
    return await this.usuarioService.findOneWithBaseResponse(id);
  }

  @Get(':id/perfil')
  @ApiOperation({
    summary: 'Obtener perfil completo del usuario',
    description: 'Retorna el perfil completo del usuario con información detallada de todos sus roles y perfiles asociados',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del usuario (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil de usuario obtenido exitosamente',
    type: UsuarioSingleResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  async getUserProfile(@Param('id') id: string): Promise<UsuarioSingleResponseDto> {
    this.logger.log(`Solicitud para obtener perfil completo del usuario: ${id}`);
    return await this.usuarioService.getUserProfileWithBaseResponse(id);
  }

  @Get(':id/estadisticas')
  @ApiOperation({
    summary: 'Obtener estadísticas del usuario',
    description: 'Retorna estadísticas detalladas de la actividad del usuario en el sistema',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del usuario (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas de usuario obtenidas exitosamente',
    type: UsuarioSingleResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  async getUserStatistics(@Param('id') id: string): Promise<UsuarioSingleResponseDto> {
    this.logger.log(`Solicitud para obtener estadísticas del usuario: ${id}`);
    return await this.usuarioService.getUserStatisticsWithBaseResponse(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo usuario',
    description: 'Crea un nuevo usuario en el sistema con validaciones de seguridad y integridad',
  })
  @ApiBody({
    type: CreateUsuarioDto,
    description: 'Datos del usuario a crear',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario creado exitosamente',
    type: UsuarioSingleResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
  })
  @ApiResponse({
    status: 409,
    description: 'Email ya existe en el sistema',
  })
  async create(@Body() createUsuarioDto: CreateUsuarioDto): Promise<UsuarioSingleResponseDto> {
    this.logger.log(`Solicitud para crear usuario: ${createUsuarioDto.correo}`);
    return await this.usuarioService.createWithBaseResponse(createUsuarioDto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un usuario',
    description: 'Actualiza parcialmente la información de un usuario existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del usuario a actualizar (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    type: UpdateUsuarioDto,
    description: 'Datos del usuario a actualizar (campos opcionales)',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario actualizado exitosamente',
    type: UsuarioSingleResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'Email ya existe en el sistema',
  })
  async update(
    @Param('id') id: string, 
    @Body() updateUsuarioDto: UpdateUsuarioDto
  ): Promise<UsuarioSingleResponseDto> {
    this.logger.log(`Solicitud para actualizar usuario: ${id}`);
    return await this.usuarioService.updateWithBaseResponse(id, updateUsuarioDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Desactivar un usuario',
    description: 'Desactiva un usuario del sistema (eliminación lógica). El usuario se mantiene en la base de datos pero se marca como inactivo',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del usuario a desactivar (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario desactivado exitosamente',
    type: UsuarioSingleResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  async remove(@Param('id') id: string): Promise<UsuarioSingleResponseDto> {
    this.logger.log(`Solicitud para desactivar usuario: ${id}`);
    return await this.usuarioService.removeWithBaseResponse(id);
  }

  // ===============================================
  // ENDPOINTS LEGADOS (COMPATIBILIDAD)
  // ===============================================

  @Get('legacy/all')
  @ApiOperation({
    summary: '[LEGACY] Obtener todos los usuarios (formato anterior)',
    description: 'Endpoint de compatibilidad que retorna usuarios en formato anterior sin BaseResponseDto',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios en formato legado',
  })
  async findAllLegacy() {
    this.logger.log('Solicitud legacy para obtener todos los usuarios');
    return await this.usuarioService.findAll();
  }

  @Get('legacy/:id')
  @ApiOperation({
    summary: '[LEGACY] Obtener usuario por ID (formato anterior)',
    description: 'Endpoint de compatibilidad que retorna usuario en formato anterior sin BaseResponseDto',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del usuario',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario en formato legado',
  })
  async findOneLegacy(@Param('id') id: string) {
    this.logger.log(`Solicitud legacy para obtener usuario: ${id}`);
    return await this.usuarioService.findOne(id);
  }
}

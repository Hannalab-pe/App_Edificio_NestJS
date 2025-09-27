import {
  Injectable,
  ConflictException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUsuarioService } from '../../interfaces/usuario.interface';
import { 
  CreateUsuarioDto, 
  UpdateUsuarioDto,
  UsuarioResponseDto,
  UsuarioSingleResponseDto,
  UsuarioArrayResponseDto 
} from '../../../dtos';
import { Usuario } from '../../../entities/Usuario';
import { BaseResponseDto } from '../../../dtos/baseResponse/baseResponse.dto';

@Injectable()
export class UsuarioService implements IUsuarioService {
  private readonly logger = new Logger(UsuarioService.name);

  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  /**
   * Crear un nuevo usuario
   * Verifica que el correo no exista antes de crear
   */
  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    // Verificar si el correo ya existe
    const existingUser = await this.usuarioRepository.findOne({
      where: { correo: createUsuarioDto.correo },
    });

    if (existingUser) {
      throw new ConflictException(
        'Ya existe un usuario con este correo electrónico',
      );
    }

    // Crear el nuevo usuario con la estructura correcta
    const usuario = this.usuarioRepository.create({
      correo: createUsuarioDto.correo,
      contrasena: createUsuarioDto.contrasena,
      idRol: { idRol: createUsuarioDto.idRol } as any, // TypeORM necesita el objeto
      estaActivo: true, // Por defecto activo
    });

    // Guardar en la base de datos
    return await this.usuarioRepository.save(usuario);
  }

  /**
   * Obtener todos los usuarios
   * Incluye información del rol
   */
  async findAll(): Promise<Usuario[]> {
    return await this.usuarioRepository.find({
      relations: ['idRol'], // Cargar relación con rol
    });
  }

  /**
   * Buscar usuario por ID
   * Incluye información del rol
   */
  async findOne(id: string): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { idUsuario: id },
      relations: ['idRol'], // Cargar relación con rol
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return usuario;
  }

  /**
   * Buscar usuario por correo electrónico
   * Incluye información del rol
   */
  async findByEmail(email: string): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { correo: email },
      relations: ['idRol'], // Cargar relación con rol
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con correo ${email} no encontrado`);
    }

    return usuario;
  }

  /**
   * Actualizar un usuario
   */
  async update(
    id: string,
    updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<Usuario> {
    // Verificar que el usuario existe
    const usuario = await this.findOne(id);

    // Si se está actualizando el correo, verificar que no esté en uso
    if (updateUsuarioDto.correo && updateUsuarioDto.correo !== usuario.correo) {
      const existingUser = await this.usuarioRepository.findOne({
        where: { correo: updateUsuarioDto.correo },
      });

      if (existingUser) {
        throw new ConflictException(
          'Ya existe un usuario con este correo electrónico',
        );
      }
    }

    // Preparar los datos de actualización
    const updateData: any = {
      ...updateUsuarioDto,
    };

    // Si se está actualizando el rol, convertir a la estructura correcta
    if (updateUsuarioDto.idRol) {
      updateData.idRol = { idRol: updateUsuarioDto.idRol };
    }

    // Actualizar los datos
    await this.usuarioRepository.update(id, updateData);

    // Retornar el usuario actualizado
    return await this.findOne(id);
  }

  /**
   * Eliminar (desactivar) un usuario
   * En lugar de eliminar físicamente, marcamos como inactivo
   */
  async remove(id: string): Promise<void> {
    // Verificar que el usuario existe
    await this.findOne(id);

    // Marcar como inactivo en lugar de eliminar
    await this.usuarioRepository.update(id, { estaActivo: false });
  }

  /**
   * Obtener usuarios activos
   */
  async findActiveUsers(): Promise<Usuario[]> {
    return await this.usuarioRepository.find({
      where: { estaActivo: true },
      relations: ['idRol'],
    });
  }

  /**
   * Verificar si un correo ya está en uso
   * Útil para validaciones
   */
  async emailExists(email: string): Promise<boolean> {
    const count = await this.usuarioRepository.count({
      where: { correo: email },
    });

    return count > 0;
  }

  /**
   * Activar un usuario
   */
  async activateUser(id: string): Promise<Usuario> {
    await this.usuarioRepository.update(id, { estaActivo: true });
    return await this.findOne(id);
  }

  /**
   * Desactivar un usuario
   */
  async deactivateUser(id: string): Promise<Usuario> {
    await this.usuarioRepository.update(id, { estaActivo: false });
    return await this.findOne(id);
  }

  // ===============================================
  // MÉTODOS CON BASE RESPONSE DTO
  // ===============================================

  /**
   * Helper method para mapear Usuario entity a UsuarioResponseDto
   */
  private async mapToResponseDto(usuario: Usuario): Promise<UsuarioResponseDto> {
    // Estadísticas simplificadas inicialmente (sin consultas complejas)
    const totalIncidenciasReportadas = 0;
    const totalReservasActivas = 0;
    const totalVotacionesCreadas = 0;
    const totalMensajesEnviados = 0;

    // Perfiles simplificados inicialmente (sin consultas complejas)
    const propietario = null;
    const residente = null;
    const trabajador = null;
    const arrendatario = null;

    // Notificaciones simplificadas inicialmente
    const notificacionesPendientes = [];

    return {
      idUsuario: usuario.idUsuario,
      correo: usuario.correo,
      estaActivo: usuario.estaActivo,
      rol: usuario.idRol ? {
        idRol: usuario.idRol.idRol,
        nombreRol: usuario.idRol.nombre,
        descripcion: usuario.idRol.descripcion || undefined
      } : undefined,
      estadisticas: {
        totalIncidenciasReportadas,
        totalReservasActivas,
        totalVotacionesCreadas,
        totalMensajesEnviados,
        ultimaActividad: new Date().toISOString()
      },
      perfiles: {
        esPropietario: false,
        esResidente: false,
        esTrabajador: false,
        esArrendatario: false,
        detallesPropietario: undefined,
        detallesResidente: undefined,
        detallesTrabajador: undefined,
        detallesArrendatario: undefined
      },
      notificaciones: {
        totalPendientes: 0,
        ultimasNotificaciones: []
      }
    };
  }

  /**
   * Crear usuario con BaseResponseDto
   */
  async createWithBaseResponse(createUsuarioDto: CreateUsuarioDto): Promise<UsuarioSingleResponseDto> {
    try {
      this.logger.log(`Creando usuario: ${createUsuarioDto.correo}`);
      const usuario = await this.create(createUsuarioDto);
      
      // Cargar el usuario con relaciones para el mapeo completo
      const usuarioCompleto = await this.usuarioRepository.findOne({
        where: { idUsuario: usuario.idUsuario },
        relations: ['idRol']
      });

      if (!usuarioCompleto) {
        throw new NotFoundException(`Usuario con ID ${usuario.idUsuario} no encontrado después de la creación`);
      }

      const usuarioData = await this.mapToResponseDto(usuarioCompleto);
      
      return BaseResponseDto.success(usuarioData, 'Usuario creado exitosamente');
    } catch (error) {
      this.logger.error(`Error al crear usuario: ${error.message}`);
      return BaseResponseDto.error('Error al crear usuario', error.message);
    }
  }

  /**
   * Obtener todos los usuarios con BaseResponseDto
   */
  async findAllWithBaseResponse(): Promise<UsuarioArrayResponseDto> {
    try {
      this.logger.log('Obteniendo todos los usuarios');
      const usuarios = await this.findAll();
      const usuariosData = await Promise.all(
        usuarios.map(usuario => this.mapToResponseDto(usuario))
      );
      
      return BaseResponseDto.success(usuariosData, `${usuariosData.length} usuarios encontrados`);
    } catch (error) {
      this.logger.error(`Error al obtener usuarios: ${error.message}`);
      return BaseResponseDto.error('Error al obtener usuarios', error.message);
    }
  }

  /**
   * Obtener usuario por ID con BaseResponseDto
   */
  async findOneWithBaseResponse(id: string): Promise<UsuarioSingleResponseDto> {
    try {
      this.logger.log(`Obteniendo usuario con ID: ${id}`);
      const usuario = await this.findOne(id);
      const usuarioData = await this.mapToResponseDto(usuario);
      
      return BaseResponseDto.success(usuarioData, 'Usuario encontrado exitosamente');
    } catch (error) {
      this.logger.error(`Error al obtener usuario ${id}: ${error.message}`);
      return BaseResponseDto.error('Usuario no encontrado', error.message);
    }
  }

  /**
   * Actualizar usuario con BaseResponseDto
   */
  async updateWithBaseResponse(id: string, updateUsuarioDto: UpdateUsuarioDto): Promise<UsuarioSingleResponseDto> {
    try {
      this.logger.log(`Actualizando usuario: ${id}`);
      const usuario = await this.update(id, updateUsuarioDto);
      const usuarioData = await this.mapToResponseDto(usuario);
      
      return BaseResponseDto.success(usuarioData, 'Usuario actualizado exitosamente');
    } catch (error) {
      this.logger.error(`Error al actualizar usuario ${id}: ${error.message}`);
      return BaseResponseDto.error('Error al actualizar usuario', error.message);
    }
  }

  /**
   * Eliminar usuario con BaseResponseDto
   */
  async removeWithBaseResponse(id: string): Promise<UsuarioSingleResponseDto> {
    try {
      this.logger.log(`Eliminando usuario: ${id}`);
      const usuario = await this.findOne(id);
      await this.remove(id);
      
      // Obtener el usuario actualizado (desactivado)
      const usuarioDesactivado = await this.findOne(id);
      const usuarioData = await this.mapToResponseDto(usuarioDesactivado);
      
      return BaseResponseDto.success(usuarioData, 'Usuario desactivado exitosamente');
    } catch (error) {
      this.logger.error(`Error al eliminar usuario ${id}: ${error.message}`);
      return BaseResponseDto.error('Error al eliminar usuario', error.message);
    }
  }

  /**
   * Buscar usuario por email con BaseResponseDto
   */
  async findByEmailWithBaseResponse(email: string): Promise<UsuarioSingleResponseDto> {
    try {
      this.logger.log(`Buscando usuario por email: ${email}`);
      const usuario = await this.findByEmail(email);
      const usuarioData = await this.mapToResponseDto(usuario);
      
      return BaseResponseDto.success(usuarioData, 'Usuario encontrado por email');
    } catch (error) {
      this.logger.error(`Error al buscar usuario por email ${email}: ${error.message}`);
      return BaseResponseDto.error('Usuario no encontrado', error.message);
    }
  }

  /**
   * Obtener usuarios activos con BaseResponseDto
   */
  async findActiveUsersWithBaseResponse(): Promise<UsuarioArrayResponseDto> {
    try {
      this.logger.log('Obteniendo usuarios activos');
      const usuarios = await this.findActiveUsers();
      const usuariosData = await Promise.all(
        usuarios.map(usuario => this.mapToResponseDto(usuario))
      );
      
      return BaseResponseDto.success(usuariosData, `${usuariosData.length} usuarios activos encontrados`);
    } catch (error) {
      this.logger.error(`Error al obtener usuarios activos: ${error.message}`);
      return BaseResponseDto.error('Error al obtener usuarios activos', error.message);
    }
  }

  /**
   * Buscar usuarios por rol con BaseResponseDto
   */
  async findByRoleWithBaseResponse(roleId: string): Promise<UsuarioArrayResponseDto> {
    try {
      this.logger.log(`Buscando usuarios por rol: ${roleId}`);
      const usuarios = await this.usuarioRepository.find({
        where: { 
          idRol: { idRol: roleId } as any,
          estaActivo: true 
        },
        relations: ['idRol']
      });
      
      const usuariosData = await Promise.all(
        usuarios.map(usuario => this.mapToResponseDto(usuario))
      );
      
      return BaseResponseDto.success(usuariosData, `${usuariosData.length} usuarios encontrados con rol ${roleId}`);
    } catch (error) {
      this.logger.error(`Error al buscar usuarios por rol ${roleId}: ${error.message}`);
      return BaseResponseDto.error('Error al buscar usuarios por rol', error.message);
    }
  }

  /**
   * Obtener perfil completo del usuario con BaseResponseDto
   */
  async getUserProfileWithBaseResponse(id: string): Promise<UsuarioSingleResponseDto> {
    try {
      this.logger.log(`Obteniendo perfil completo del usuario: ${id}`);
      
      // Obtener usuario con todas las relaciones necesarias
      const usuario = await this.usuarioRepository.findOne({
        where: { idUsuario: id },
        relations: ['idRol', 'propietarios', 'residentes', 'trabajadors', 'arrendatarios']
      });

      if (!usuario) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
      }

      const usuarioData = await this.mapToResponseDto(usuario);
      
      return BaseResponseDto.success(usuarioData, 'Perfil de usuario obtenido exitosamente');
    } catch (error) {
      this.logger.error(`Error al obtener perfil del usuario ${id}: ${error.message}`);
      return BaseResponseDto.error('Error al obtener perfil de usuario', error.message);
    }
  }

  /**
   * Obtener estadísticas del usuario con BaseResponseDto
   */
  async getUserStatisticsWithBaseResponse(id: string): Promise<UsuarioSingleResponseDto> {
    try {
      this.logger.log(`Obteniendo estadísticas del usuario: ${id}`);
      const usuario = await this.findOne(id);
      const usuarioData = await this.mapToResponseDto(usuario);
      
      return BaseResponseDto.success(usuarioData, 'Estadísticas de usuario obtenidas exitosamente');
    } catch (error) {
      this.logger.error(`Error al obtener estadísticas del usuario ${id}: ${error.message}`);
      return BaseResponseDto.error('Error al obtener estadísticas de usuario', error.message);
    }
  }
}

import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUsuarioService } from '../../interfaces/usuario.interface';
import { CreateUsuarioDto, UpdateUsuarioDto } from '../../../dtos';
import { Usuario } from '../../../entities/Usuario';

@Injectable()
export class UsuarioService implements IUsuarioService {
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
      where: { correo: createUsuarioDto.correo }
    });

    if (existingUser) {
      throw new ConflictException('Ya existe un usuario con este correo electrónico');
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
  async update(id: string, updateUsuarioDto: UpdateUsuarioDto): Promise<Usuario> {
    // Verificar que el usuario existe
    const usuario = await this.findOne(id);

    // Si se está actualizando el correo, verificar que no esté en uso
    if (updateUsuarioDto.correo && updateUsuarioDto.correo !== usuario.correo) {
      const existingUser = await this.usuarioRepository.findOne({
        where: { correo: updateUsuarioDto.correo }
      });

      if (existingUser) {
        throw new ConflictException('Ya existe un usuario con este correo electrónico');
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
      where: { correo: email }
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
}
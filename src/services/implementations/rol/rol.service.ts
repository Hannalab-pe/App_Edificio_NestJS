import { Injectable, NotFoundException, Logger, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IRolService } from '../../interfaces/rol.interface';
import { CreateRolDto, UpdateRolDto } from '../../../dtos';
import { Rol } from '../../../entities/Rol';
import { BaseResponseDto } from '../../../dtos/baseResponse/baseResponse.dto';

@Injectable()
export class RolService implements IRolService {
  private readonly logger = new Logger(RolService.name);

  constructor(
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
  ) {}

  /**
   * Crear un nuevo rol
   */
  async create(createRolDto: CreateRolDto): Promise<Rol> {
    const rol = this.rolRepository.create(createRolDto);
    return await this.rolRepository.save(rol);
  }

  /**
   * Obtener todos los roles
   */
  async findAll(): Promise<Rol[]> {
    return await this.rolRepository.find();
  }

  /**
   * Buscar rol por ID
   */
  async findOne(id: string): Promise<Rol> {
    const rol = await this.rolRepository.findOne({
      where: { idRol: id },
    });

    if (!rol) {
      throw new NotFoundException(`Rol con ID ${id} no encontrado`);
    }

    return rol;
  }

  /**
   * Buscar rol por nombre
   * MÉTODO CLAVE para el registro de usuarios
   */
  async findByNombre(nombre: string): Promise<Rol> {
    const rol = await this.rolRepository.findOne({
      where: { nombre: nombre },
    });

    if (!rol) {
      throw new NotFoundException(`Rol con nombre '${nombre}' no encontrado`);
    }

    return rol;
  }

  /**
   * Actualizar un rol
   */
  async update(id: string, updateRolDto: UpdateRolDto): Promise<Rol> {
    // Verificar que el rol existe
    await this.findOne(id);

    // Actualizar los datos
    await this.rolRepository.update(id, updateRolDto);

    // Retornar el rol actualizado
    return await this.findOne(id);
  }

  /**
   * Eliminar un rol
   */
  async remove(id: string): Promise<void> {
    // Verificar que el rol existe
    await this.findOne(id);

    // Eliminar el rol
    await this.rolRepository.delete(id);
  }

  /**
   * Verificar si existen roles en el sistema
   * Útil para el seeder
   */
  async hasRoles(): Promise<boolean> {
    const count = await this.rolRepository.count();
    return count > 0;
  }

  /**
   * Crear roles por defecto si no existen
   * MÉTODO CLAVE para inicializar el sistema
   */
  async createDefaultRoles(): Promise<void> {
    const rolesExist = await this.hasRoles();

    if (!rolesExist) {
      const defaultRoles = [
        {
          nombre: 'Administrador',
          descripcion: 'Administrador del sistema con acceso completo',
        },
        {
          nombre: 'Propietario',
          descripcion: 'Propietario de una unidad en el edificio',
        },
        {
          nombre: 'Residente',
          descripcion: 'Residente que vive en una unidad del edificio',
        },
        {
          nombre: 'Portero',
          descripcion: 'Personal de portería y seguridad',
        },
        {
          nombre: 'Conserje',
          descripcion: 'Personal de mantenimiento y servicios',
        },
      ];

      for (const rolData of defaultRoles) {
        await this.create(rolData);
      }

      this.logger.log('✅ Roles por defecto creados exitosamente');
    } else {
      this.logger.log('ℹ️ Los roles ya existen en el sistema');
    }
  }

  // ==================== MÉTODOS CON BaseResponseDto ====================

  /**
   * Crear rol con respuesta estandarizada
   */
  async createWithBaseResponse(createRolDto: CreateRolDto): Promise<BaseResponseDto<any>> {
    try {
      this.logger.log(`Intentando crear rol: ${createRolDto.nombre}`);

      // Verificar si ya existe un rol con el mismo nombre
      const existingRol = await this.rolRepository.findOne({
        where: { nombre: createRolDto.nombre },
      });

      if (existingRol) {
        throw new ConflictException(`Ya existe un rol con el nombre '${createRolDto.nombre}'`);
      }

      const rol = this.rolRepository.create(createRolDto);
      const savedRol = await this.rolRepository.save(rol);
      
      const responseData = this.mapToResponseDto(savedRol);
      this.logger.log(`✅ Rol creado exitosamente: ${savedRol.idRol}`);
      
      return BaseResponseDto.success(responseData, 'Rol creado exitosamente');
    } catch (error) {
      this.logger.error(`❌ Error al crear rol: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Obtener todos los roles con respuesta estandarizada
   */
  async findAllWithBaseResponse(): Promise<BaseResponseDto<any[]>> {
    try {
      this.logger.log('Obteniendo todos los roles');
      
      const roles = await this.rolRepository.find({
        relations: ['usuarios', 'notificacions'],
        order: { nombre: 'ASC' },
      });

      const responseData = roles.map(rol => this.mapToResponseDto(rol));
      this.logger.log(`✅ ${roles.length} roles obtenidos exitosamente`);
      
      return BaseResponseDto.success(responseData, `${roles.length} roles obtenidos exitosamente`);
    } catch (error) {
      this.logger.error(`❌ Error al obtener roles: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Obtener rol por ID con respuesta estandarizada
   */
  async findOneWithBaseResponse(id: string): Promise<BaseResponseDto<any>> {
    try {
      this.logger.log(`Buscando rol por ID: ${id}`);
      
      const rol = await this.rolRepository.findOne({
        where: { idRol: id },
        relations: ['usuarios', 'notificacions'],
      });

      if (!rol) {
        throw new NotFoundException(`Rol con ID ${id} no encontrado`);
      }

      const responseData = this.mapToResponseDto(rol);
      this.logger.log(`✅ Rol encontrado: ${rol.idRol}`);
      
      return BaseResponseDto.success(responseData, 'Rol obtenido exitosamente');
    } catch (error) {
      this.logger.error(`❌ Error al buscar rol: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Actualizar rol con respuesta estandarizada
   */
  async updateWithBaseResponse(id: string, updateRolDto: UpdateRolDto): Promise<BaseResponseDto<any>> {
    try {
      this.logger.log(`Actualizando rol: ${id}`);

      // Verificar que el rol existe
      const existingRol = await this.rolRepository.findOne({
        where: { idRol: id },
        relations: ['usuarios', 'notificacions'],
      });

      if (!existingRol) {
        throw new NotFoundException(`Rol con ID ${id} no encontrado`);
      }

      // Verificar conflicto de nombre si se está actualizando
      if (updateRolDto.nombre && updateRolDto.nombre !== existingRol.nombre) {
        const rolWithSameName = await this.rolRepository.findOne({
          where: { nombre: updateRolDto.nombre },
        });

        if (rolWithSameName) {
          throw new ConflictException(`Ya existe un rol con el nombre '${updateRolDto.nombre}'`);
        }
      }

      // Actualizar el rol
      await this.rolRepository.update(id, updateRolDto);
      
      // Obtener el rol actualizado
      const updatedRol = await this.rolRepository.findOne({
        where: { idRol: id },
        relations: ['usuarios', 'notificacions'],
      });

      const responseData = this.mapToResponseDto(updatedRol);
      this.logger.log(`✅ Rol actualizado exitosamente: ${id}`);
      
      return BaseResponseDto.success(responseData, 'Rol actualizado exitosamente');
    } catch (error) {
      this.logger.error(`❌ Error al actualizar rol: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Eliminar rol con respuesta estandarizada
   */
  async removeWithBaseResponse(id: string): Promise<BaseResponseDto<null>> {
    try {
      this.logger.log(`Eliminando rol: ${id}`);

      // Verificar que el rol existe
      const rol = await this.rolRepository.findOne({
        where: { idRol: id },
        relations: ['usuarios'],
      });

      if (!rol) {
        throw new NotFoundException(`Rol con ID ${id} no encontrado`);
      }

      // Verificar si hay usuarios asociados
      if (rol.usuarios && rol.usuarios.length > 0) {
        throw new ConflictException(`No se puede eliminar el rol porque tiene ${rol.usuarios.length} usuario(s) asociado(s)`);
      }

      // Eliminar el rol
      await this.rolRepository.delete(id);
      this.logger.log(`✅ Rol eliminado exitosamente: ${id}`);
      
      return BaseResponseDto.success(null, 'Rol eliminado exitosamente');
    } catch (error) {
      this.logger.error(`❌ Error al eliminar rol: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Buscar rol por nombre con respuesta estandarizada
   */
  async findByNombreWithBaseResponse(nombre: string): Promise<BaseResponseDto<any>> {
    try {
      this.logger.log(`Buscando rol por nombre: ${nombre}`);
      
      const rol = await this.rolRepository.findOne({
        where: { nombre: nombre },
        relations: ['usuarios', 'notificacions'],
      });

      if (!rol) {
        throw new NotFoundException(`Rol con nombre '${nombre}' no encontrado`);
      }

      const responseData = this.mapToResponseDto(rol);
      this.logger.log(`✅ Rol encontrado por nombre: ${rol.idRol}`);
      
      return BaseResponseDto.success(responseData, 'Rol encontrado exitosamente');
    } catch (error) {
      this.logger.error(`❌ Error al buscar rol por nombre: ${error.message}`, error.stack);
      throw error;
    }
  }

  // ==================== MÉTODO HELPER ====================

  /**
   * Mapear entidad Rol a DTO de respuesta
   */
  private mapToResponseDto(rol: any): any {
    if (!rol) return null;

    return {
      idRol: rol.idRol,
      nombre: rol.nombre,
      descripcion: rol.descripcion,
      usuarios: rol.usuarios?.map(usuario => ({
        idUsuario: usuario.idUsuario,
        nombreUsuario: usuario.nombreUsuario,
        correo: usuario.correo,
        estaActivo: usuario.estaActivo,
      })) || [],
      notificaciones: rol.notificacions?.map(notificacion => ({
        idNotificacion: notificacion.idNotificacion,
        titulo: notificacion.titulo,
        mensaje: notificacion.mensaje,
        fechaEnvio: notificacion.fechaEnvio,
      })) || [],
    };
  }
}

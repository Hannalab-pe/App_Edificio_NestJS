import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IRolService } from '../../interfaces/rol.interface';
import { CreateRolDto, UpdateRolDto } from '../../../dtos';
import { Rol } from '../../../entities/Rol';

@Injectable()
export class RolService implements IRolService {
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
          descripcion: 'Administrador del sistema con acceso completo'
        },
        {
          nombre: 'Propietario',
          descripcion: 'Propietario de una unidad en el edificio'
        },
        {
          nombre: 'Residente',
          descripcion: 'Residente que vive en una unidad del edificio'
        },
        {
          nombre: 'Portero',
          descripcion: 'Personal de portería y seguridad'
        },
        {
          nombre: 'Conserje',
          descripcion: 'Personal de mantenimiento y servicios'
        }
      ];

      for (const rolData of defaultRoles) {
        await this.create(rolData);
      }

      console.log('✅ Roles por defecto creados exitosamente');
    } else {
      console.log('ℹ️ Los roles ya existen en el sistema');
    }
  }
}
import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ITipoIncidenciaService } from '../../interfaces/tipo-incidencia.interface';
import { TipoIncidencia } from '../../../entities/TipoIncidencia';
import { CreateTipoIncidenciaDto, UpdateTipoIncidenciaDto } from '../../../dtos';

@Injectable()
export class TipoIncidenciaService implements ITipoIncidenciaService {
  constructor(
    @InjectRepository(TipoIncidencia)
    private readonly tipoIncidenciaRepository: Repository<TipoIncidencia>,
  ) {}

  async create(createTipoIncidenciaDto: CreateTipoIncidenciaDto): Promise<TipoIncidencia> {
    // Verificar si ya existe un tipo de incidencia con el mismo nombre
    const existingTipo = await this.tipoIncidenciaRepository.findOne({
      where: { nombre: createTipoIncidenciaDto.nombre }
    });

    if (existingTipo) {
      throw new ConflictException('Ya existe un tipo de incidencia con este nombre');
    }

    const tipoIncidencia = this.tipoIncidenciaRepository.create({
      ...createTipoIncidenciaDto,
      estaActivo: true,
    });

    const result = await this.tipoIncidenciaRepository.save(tipoIncidencia);
    return Array.isArray(result) ? result[0] : result;
  }

  async findAll(): Promise<TipoIncidencia[]> {
    return await this.tipoIncidenciaRepository.find({
      relations: ['incidencias'],
      order: {
        nombre: 'ASC'
      }
    });
  }

  async findOne(id: string): Promise<TipoIncidencia> {
    const tipoIncidencia = await this.tipoIncidenciaRepository.findOne({
      where: { idTipoIncidencia: id },
      relations: ['incidencias'],
    });

    if (!tipoIncidencia) {
      throw new NotFoundException(`Tipo de incidencia con ID ${id} no encontrado`);
    }

    return tipoIncidencia;
  }

  async update(id: string, updateTipoIncidenciaDto: UpdateTipoIncidenciaDto): Promise<TipoIncidencia> {
    await this.findOne(id);

    // Si se actualiza el nombre, verificar que no exista otro con el mismo nombre
    if (updateTipoIncidenciaDto.nombre) {
      const existingTipo = await this.tipoIncidenciaRepository.findOne({
        where: {
          nombre: updateTipoIncidenciaDto.nombre,
          idTipoIncidencia: require('typeorm').Not(id)
        }
      });

      if (existingTipo) {
        throw new ConflictException('Ya existe otro tipo de incidencia con este nombre');
      }
    }

    await this.tipoIncidenciaRepository.update(id, updateTipoIncidenciaDto);
    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const tipoIncidencia = await this.findOne(id);

    // Verificar si tiene incidencias asociadas activas
    const incidenciasActivas = await this.tipoIncidenciaRepository
      .createQueryBuilder('tipo')
      .leftJoin('tipo.incidencias', 'incidencia')
      .where('tipo.idTipoIncidencia = :id', { id })
      .andWhere('incidencia.estado != :estado', { estado: 'Resuelto' })
      .getCount();

    if (incidenciasActivas > 0) {
      throw new BadRequestException('No se puede eliminar un tipo de incidencia que tiene incidencias activas asociadas');
    }

    // Eliminación lógica: marcar como inactivo
    await this.tipoIncidenciaRepository.update(id, { estaActivo: false });
  }

  async findByNombre(nombre: string): Promise<TipoIncidencia> {
    const tipoIncidencia = await this.tipoIncidenciaRepository.findOne({
      where: {
        nombre,
        estaActivo: true
      },
      relations: ['incidencias'],
    });

    if (!tipoIncidencia) {
      throw new NotFoundException(`Tipo de incidencia con nombre '${nombre}' no encontrado`);
    }

    return tipoIncidencia;
  }

  async findByPrioridad(prioridad: string): Promise<TipoIncidencia[]> {
    return await this.tipoIncidenciaRepository.find({
      where: {
        prioridad,
        estaActivo: true
      },
      relations: ['incidencias'],
      order: {
        nombre: 'ASC'
      }
    });
  }

  async findActivos(): Promise<TipoIncidencia[]> {
    return await this.tipoIncidenciaRepository.find({
      where: { estaActivo: true },
      relations: ['incidencias'],
      order: {
        nombre: 'ASC'
      }
    });
  }
}
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IIncidenciaService } from '../../interfaces/incidencia.interface';
import { Incidencia } from '../../../entities/Incidencia';
import { CreateIncidenciaDto, UpdateIncidenciaDto } from '../../../dtos';
import { EstadoIncidencia } from '../../../Enums/inicidencias.enum';

@Injectable()
export class IncidenciaService implements IIncidenciaService {
  constructor(
    @InjectRepository(Incidencia)
    private readonly incidenciaRepository: Repository<Incidencia>,
  ) {}

  async create(createIncidenciaDto: CreateIncidenciaDto): Promise<Incidencia> {
    const incidencia = this.incidenciaRepository.create({
      titulo: createIncidenciaDto.titulo,
      descripcion: createIncidenciaDto.descripcion,
      estado: createIncidenciaDto.estado,
      prioridad: createIncidenciaDto.prioridad,
      ubicacion: createIncidenciaDto.ubicacion,
      fechaIncidente: createIncidenciaDto.fechaIncidente ? new Date(createIncidenciaDto.fechaIncidente) : null,
      fechaCreacion: new Date(),
      idAreaComun: { idAreaComun: createIncidenciaDto.idAreaComun } as any,
      idTipoIncidencia: { idTipoIncidencia: createIncidenciaDto.idTipoIncidencia } as any,
      reportadoPorUsuario: { idUsuario: createIncidenciaDto.reportadoPorUsuario } as any,
      asignadoATrabajador: createIncidenciaDto.asignadoATrabajador
        ? { idTrabajador: createIncidenciaDto.asignadoATrabajador } as any
        : null,
    });

    const result = await this.incidenciaRepository.save(incidencia);
    return Array.isArray(result) ? result[0] : result;
  }

  async findAll(): Promise<Incidencia[]> {
    return await this.incidenciaRepository.find({
      relations: [
        'idAreaComun',
        'idTipoIncidencia',
        'reportadoPorUsuario',
        'asignadoATrabajador',
        'comentarioIncidencias'
      ],
      order: {
        fechaCreacion: 'DESC'
      }
    });
  }

  async findOne(id: string): Promise<Incidencia> {
    const incidencia = await this.incidenciaRepository.findOne({
      where: { idIncidencia: id },
      relations: [
        'idAreaComun',
        'idTipoIncidencia',
        'reportadoPorUsuario',
        'asignadoATrabajador',
        'comentarioIncidencias'
      ],
    });

    if (!incidencia) {
      throw new NotFoundException(`Incidencia con ID ${id} no encontrada`);
    }

    return incidencia;
  }

  async update(id: string, updateIncidenciaDto: UpdateIncidenciaDto): Promise<Incidencia> {
    await this.findOne(id);

    const updateData: any = { ...updateIncidenciaDto };

    // Si se actualiza la fecha del incidente, convertir a Date
    if (updateIncidenciaDto.fechaIncidente) {
      updateData.fechaIncidente = new Date(updateIncidenciaDto.fechaIncidente);
    }

    // Si se asigna un trabajador, formatear correctamente
    if (updateIncidenciaDto.asignadoATrabajador) {
      updateData.asignadoATrabajador = { idTrabajador: updateIncidenciaDto.asignadoATrabajador };
    }

    await this.incidenciaRepository.update(id, updateData);
    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.incidenciaRepository.delete(id);
  }

  async findByEstado(estado: string): Promise<Incidencia[]> {
    return await this.incidenciaRepository.find({
      where: { estado },
      relations: [
        'idAreaComun',
        'idTipoIncidencia',
        'reportadoPorUsuario',
        'asignadoATrabajador'
      ],
      order: {
        fechaCreacion: 'DESC'
      }
    });
  }

  async findByPrioridad(prioridad: string): Promise<Incidencia[]> {
    return await this.incidenciaRepository.find({
      where: { prioridad },
      relations: [
        'idAreaComun',
        'idTipoIncidencia',
        'reportadoPorUsuario',
        'asignadoATrabajador'
      ],
      order: {
        fechaCreacion: 'DESC'
      }
    });
  }

  async findByTipo(tipoId: string): Promise<Incidencia[]> {
    return await this.incidenciaRepository.find({
      where: { idTipoIncidencia: { idTipoIncidencia: tipoId } as any },
      relations: [
        'idAreaComun',
        'idTipoIncidencia',
        'reportadoPorUsuario',
        'asignadoATrabajador'
      ],
      order: {
        fechaCreacion: 'DESC'
      }
    });
  }

  async findByUsuario(usuarioId: string): Promise<Incidencia[]> {
    return await this.incidenciaRepository.find({
      where: { reportadoPorUsuario: { idUsuario: usuarioId } as any },
      relations: [
        'idAreaComun',
        'idTipoIncidencia',
        'reportadoPorUsuario',
        'asignadoATrabajador'
      ],
      order: {
        fechaCreacion: 'DESC'
      }
    });
  }

  async findByTrabajador(trabajadorId: string): Promise<Incidencia[]> {
    return await this.incidenciaRepository.find({
      where: { asignadoATrabajador: { idTrabajador: trabajadorId } as any },
      relations: [
        'idAreaComun',
        'idTipoIncidencia',
        'reportadoPorUsuario',
        'asignadoATrabajador'
      ],
      order: {
        fechaCreacion: 'DESC'
      }
    });
  }

  async resolve(id: string): Promise<Incidencia> {
    const incidencia = await this.findOne(id);

    if (incidencia.estado === EstadoIncidencia.RESUELTO) {
      throw new BadRequestException('La incidencia ya está resuelta');
    }

    await this.incidenciaRepository.update(id, {
      estado: EstadoIncidencia.RESUELTO,
      fechaResolucion: new Date()
    });

    return await this.findOne(id);
  }

  async asignarTrabajador(incidenciaId: string, trabajadorId: string): Promise<Incidencia> {
    await this.findOne(incidenciaId);

    await this.incidenciaRepository.update(incidenciaId, {
      asignadoATrabajador: { idTrabajador: trabajadorId } as any,
      estado: EstadoIncidencia.EN_PROCESO
    });

    return await this.findOne(incidenciaId);
  }

  async findWithFilters(estado?: string, prioridad?: string): Promise<Incidencia[]> {
    const where: any = {};

    if (estado) {
      where.estado = estado;
    }

    if (prioridad) {
      where.prioridad = prioridad;
    }

    return await this.incidenciaRepository.find({
      where,
      relations: [
        'idAreaComun',
        'idTipoIncidencia',
        'reportadoPorUsuario',
        'asignadoATrabajador'
      ],
      order: {
        fechaCreacion: 'DESC'
      }
    });
  }
}
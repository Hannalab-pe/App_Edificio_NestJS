import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { ICronogramaService } from '../../interfaces/cronograma.interface';
import { Cronograma } from '../../../entities/Cronograma';
import { CreateCronogramaDto, UpdateCronogramaDto } from '../../../dtos';

@Injectable()
export class CronogramaService implements ICronogramaService {
  constructor(
    @InjectRepository(Cronograma)
    private readonly cronogramaRepository: Repository<Cronograma>,
  ) {}

  async create(createCronogramaDto: CreateCronogramaDto): Promise<Cronograma> {
    // Validar que la fecha de fin sea posterior a la fecha de inicio
    if (createCronogramaDto.fechaFin <= createCronogramaDto.fechaInicio) {
      throw new BadRequestException('La fecha de fin debe ser posterior a la fecha de inicio');
    }

    const cronograma = this.cronogramaRepository.create({
      titulo: createCronogramaDto.titulo,
      descripcion: createCronogramaDto.descripcion,
      fechaInicio: createCronogramaDto.fechaInicio,
      fechaFin: createCronogramaDto.fechaFin,
      idResidente: createCronogramaDto.idResidente ? { idResidente: createCronogramaDto.idResidente } as any : null,
      idTipoCronograma: { idTipoCronograma: createCronogramaDto.idTipoCronograma } as any,
      idTrabajador: createCronogramaDto.idTrabajador ? { idTrabajador: createCronogramaDto.idTrabajador } as any : null,
    });

    return await this.cronogramaRepository.save(cronograma);
  }

  async findAll(): Promise<Cronograma[]> {
    return await this.cronogramaRepository.find({
      relations: ['idResidente', 'idTipoCronograma', 'idTrabajador'],
      order: {
        fechaInicio: 'ASC'
      }
    });
  }

  async findOne(id: string): Promise<Cronograma> {
    const cronograma = await this.cronogramaRepository.findOne({
      where: { idCronograma: id },
      relations: ['idResidente', 'idTipoCronograma', 'idTrabajador'],
    });

    if (!cronograma) {
      throw new NotFoundException(`Cronograma con ID ${id} no encontrado`);
    }

    return cronograma;
  }

  async update(id: string, updateCronogramaDto: UpdateCronogramaDto): Promise<Cronograma> {
    await this.findOne(id);

    // Validar fechas si se están actualizando
    if (updateCronogramaDto.fechaInicio && updateCronogramaDto.fechaFin) {
      if (updateCronogramaDto.fechaFin <= updateCronogramaDto.fechaInicio) {
        throw new BadRequestException('La fecha de fin debe ser posterior a la fecha de inicio');
      }
    }

    const updateData: any = {};

    if (updateCronogramaDto.titulo !== undefined) {
      updateData.titulo = updateCronogramaDto.titulo;
    }
    if (updateCronogramaDto.descripcion !== undefined) {
      updateData.descripcion = updateCronogramaDto.descripcion;
    }
    if (updateCronogramaDto.fechaInicio !== undefined) {
      updateData.fechaInicio = updateCronogramaDto.fechaInicio;
    }
    if (updateCronogramaDto.fechaFin !== undefined) {
      updateData.fechaFin = updateCronogramaDto.fechaFin;
    }
    if (updateCronogramaDto.idResidente !== undefined) {
      updateData.idResidente = updateCronogramaDto.idResidente ? { idResidente: updateCronogramaDto.idResidente } as any : null;
    }
    if (updateCronogramaDto.idTipoCronograma !== undefined) {
      updateData.idTipoCronograma = { idTipoCronograma: updateCronogramaDto.idTipoCronograma } as any;
    }
    if (updateCronogramaDto.idTrabajador !== undefined) {
      updateData.idTrabajador = updateCronogramaDto.idTrabajador ? { idTrabajador: updateCronogramaDto.idTrabajador } as any : null;
    }

    await this.cronogramaRepository.update(id, updateData);
    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.cronogramaRepository.delete(id);
  }

  async findByTipo(idTipoCronograma: string): Promise<Cronograma[]> {
    return await this.cronogramaRepository.find({
      where: { idTipoCronograma: { idTipoCronograma } as any },
      relations: ['idResidente', 'idTrabajador'],
      order: {
        fechaInicio: 'ASC'
      }
    });
  }

  async findByResidente(idResidente: string): Promise<Cronograma[]> {
    return await this.cronogramaRepository.find({
      where: { idResidente: { idResidente } as any },
      relations: ['idTipoCronograma', 'idTrabajador'],
      order: {
        fechaInicio: 'ASC'
      }
    });
  }

  async findByTrabajador(idTrabajador: string): Promise<Cronograma[]> {
    return await this.cronogramaRepository.find({
      where: { idTrabajador: { idTrabajador } as any },
      relations: ['idResidente', 'idTipoCronograma'],
      order: {
        fechaInicio: 'ASC'
      }
    });
  }

  async findByFechaRange(fechaInicio: string, fechaFin: string): Promise<Cronograma[]> {
    return await this.cronogramaRepository.find({
      where: {
        fechaInicio: Between(fechaInicio, fechaFin)
      },
      relations: ['idResidente', 'idTipoCronograma', 'idTrabajador'],
      order: {
        fechaInicio: 'ASC'
      }
    });
  }

  async findActive(): Promise<Cronograma[]> {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

    return await this.cronogramaRepository.find({
      where: {
        fechaFin: Between(today, '2099-12-31') // Cronogramas que no han terminado
      },
      relations: ['idResidente', 'idTipoCronograma', 'idTrabajador'],
      order: {
        fechaInicio: 'ASC'
      }
    });
  }
}

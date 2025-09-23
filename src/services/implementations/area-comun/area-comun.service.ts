import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IAreaComunService } from '../../interfaces/area-comun.interface';
import { AreaComun } from '../../../entities/AreaComun';
import { CreateAreaComunDto, UpdateAreaComunDto } from '../../../dtos';

@Injectable()
export class AreaComunService implements IAreaComunService {
  constructor(
    @InjectRepository(AreaComun)
    private readonly areaComunRepository: Repository<AreaComun>,
  ) {}

  async create(createAreaComunDto: CreateAreaComunDto): Promise<AreaComun> {
    // Validar que el horario de apertura sea anterior al de cierre
    if (createAreaComunDto.horarioApertura >= createAreaComunDto.horarioCierre) {
      throw new BadRequestException('El horario de apertura debe ser anterior al horario de cierre');
    }

    // Validar que el tiempo mínimo sea menor al máximo
    if (createAreaComunDto.tiempoMinimoReserva >= createAreaComunDto.tiempoMaximoReserva) {
      throw new BadRequestException('El tiempo mínimo de reserva debe ser menor al tiempo máximo');
    }

    const areaComun = this.areaComunRepository.create({
      ...createAreaComunDto,
      estaActivo: true,
    });

    const result = await this.areaComunRepository.save(areaComun);
    return Array.isArray(result) ? result[0] : result;
  }

  async findAll(): Promise<AreaComun[]> {
    return await this.areaComunRepository.find({
      relations: ['incidencias', 'mantenimientos', 'reservas'],
      order: {
        nombre: 'ASC'
      }
    });
  }

  async findOne(id: string): Promise<AreaComun> {
    const areaComun = await this.areaComunRepository.findOne({
      where: { idAreaComun: id },
      relations: ['incidencias', 'mantenimientos', 'reservas'],
    });

    if (!areaComun) {
      throw new NotFoundException(`Área común con ID ${id} no encontrada`);
    }

    return areaComun;
  }

  async update(id: string, updateAreaComunDto: UpdateAreaComunDto): Promise<AreaComun> {
    await this.findOne(id);

    // Validaciones si se actualizan horarios
    if (updateAreaComunDto.horarioApertura && updateAreaComunDto.horarioCierre) {
      if (updateAreaComunDto.horarioApertura >= updateAreaComunDto.horarioCierre) {
        throw new BadRequestException('El horario de apertura debe ser anterior al horario de cierre');
      }
    }

    // Validaciones si se actualizan tiempos de reserva
    if (updateAreaComunDto.tiempoMinimoReserva && updateAreaComunDto.tiempoMaximoReserva) {
      if (updateAreaComunDto.tiempoMinimoReserva >= updateAreaComunDto.tiempoMaximoReserva) {
        throw new BadRequestException('El tiempo mínimo de reserva debe ser menor al tiempo máximo');
      }
    }

    await this.areaComunRepository.update(id, updateAreaComunDto);
    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const areaComun = await this.findOne(id);

    // Eliminación lógica: marcar como inactivo
    await this.areaComunRepository.update(id, { estaActivo: false });
  }

  async findByEstado(estado: boolean): Promise<AreaComun[]> {
    return await this.areaComunRepository.find({
      where: { estaActivo: estado },
      relations: ['incidencias', 'mantenimientos', 'reservas'],
      order: {
        nombre: 'ASC'
      }
    });
  }

  async findAvailable(): Promise<AreaComun[]> {
    return await this.areaComunRepository.find({
      where: { estaActivo: true },
      relations: ['reservas'],
      order: {
        nombre: 'ASC'
      }
    });
  }

  async findByCapacidad(capacidadMinima: number): Promise<AreaComun[]> {
    return await this.areaComunRepository.find({
      where: {
        capacidadMaxima: require('typeorm').MoreThanOrEqual(capacidadMinima),
        estaActivo: true
      },
      relations: ['reservas'],
      order: {
        capacidadMaxima: 'ASC'
      }
    });
  }

  async findByPrecio(precioMaximo: number): Promise<AreaComun[]> {
    return await this.areaComunRepository.find({
      where: {
        precioReserva: require('typeorm').LessThanOrEqual(precioMaximo),
        estaActivo: true
      },
      relations: ['reservas'],
      order: {
        precioReserva: 'ASC'
      }
    });
  }
}
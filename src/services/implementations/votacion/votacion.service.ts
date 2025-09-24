import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IVotacionService } from '../../interfaces/votacion.interface';
import { CreateVotacionDto, UpdateVotacionDto } from '../../../dtos';
import { Votacion } from '../../../entities/Votacion';
import { JuntaPropietarios } from '../../../entities/JuntaPropietarios';
import { Usuario } from '../../../entities/Usuario';

@Injectable()
export class VotacionService implements IVotacionService {
  constructor(
    @InjectRepository(Votacion)
    private readonly votacionRepository: Repository<Votacion>,

    @InjectRepository(JuntaPropietarios)
    private readonly juntaPropietariosRepository: Repository<JuntaPropietarios>,

    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async create(createVotacionDto: CreateVotacionDto): Promise<Votacion> {
    // Validar que el usuario creador existe
    const usuarioCreador = await this.usuarioRepository.findOne({
      where: { idUsuario: createVotacionDto.creadoPorUsuario },
    });

    if (!usuarioCreador) {
      throw new NotFoundException(
        `Usuario con ID ${createVotacionDto.creadoPorUsuario} no encontrado`,
      );
    }

    // Validar que la fecha de fin sea posterior a la fecha de inicio
    const fechaInicio = new Date(createVotacionDto.fechaInicio);
    const fechaFin = new Date(createVotacionDto.fechaFin);

    if (fechaFin <= fechaInicio) {
      throw new BadRequestException(
        'La fecha de fin debe ser posterior a la fecha de inicio',
      );
    }

    // Crear la votación
    const votacion = this.votacionRepository.create({
      titulo: createVotacionDto.titulo,
      descripcion: createVotacionDto.descripcion,
      fechaInicio: createVotacionDto.fechaInicio,
      fechaFin: createVotacionDto.fechaFin,
      estado: createVotacionDto.estado,
      tipo: createVotacionDto.tipo,
      requiereQuorum: createVotacionDto.requiereQuorum || false,
      quorumMinimo: createVotacionDto.quorumMinimo || null,
      creadoPorUsuario: usuarioCreador,
    });

    return await this.votacionRepository.save(votacion);
  }

  async findAll(): Promise<Votacion[]> {
    return await this.votacionRepository.find({
      relations: ['creadoPorUsuario'],
      order: { fechaCreacion: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Votacion> {
    const votacion = await this.votacionRepository.findOne({
      where: { idVotacion: id },
      relations: ['creadoPorUsuario', 'opcionVotos'],
    });

    if (!votacion) {
      throw new NotFoundException(`Votación con ID ${id} no encontrada`);
    }

    return votacion;
  }

  async update(
    id: string,
    updateVotacionDto: UpdateVotacionDto,
  ): Promise<Votacion> {
    const votacion = await this.findOne(id);

    // Validar fechas si se proporcionan ambas
    if (updateVotacionDto.fechaInicio && updateVotacionDto.fechaFin) {
      const fechaInicio = new Date(updateVotacionDto.fechaInicio);
      const fechaFin = new Date(updateVotacionDto.fechaFin);

      if (fechaFin <= fechaInicio) {
        throw new BadRequestException(
          'La fecha de fin debe ser posterior a la fecha de inicio',
        );
      }
    }

    // Actualizar campos
    Object.assign(votacion, updateVotacionDto);
    return await this.votacionRepository.save(votacion);
  }

  async remove(id: string): Promise<void> {
    const votacion = await this.findOne(id);
    await this.votacionRepository.remove(votacion);
  }

  async findByEstado(estado: string): Promise<Votacion[]> {
    return await this.votacionRepository.find({
      where: { estado },
      relations: ['creadoPorUsuario'],
      order: { fechaCreacion: 'DESC' },
    });
  }

  async findActive(): Promise<Votacion[]> {
    const now = new Date();
    return await this.votacionRepository
      .createQueryBuilder('votacion')
      .leftJoinAndSelect('votacion.creadoPorUsuario', 'usuario')
      .where('votacion.estado = :estado', { estado: 'Activa' })
      .andWhere('votacion.fechaInicio <= :now', { now })
      .andWhere('votacion.fechaFin >= :now', { now })
      .orderBy('votacion.fechaCreacion', 'DESC')
      .getMany();
  }

  async findByJuntaPropietarios(juntaId: string): Promise<Votacion[]> {
    // Validar que la junta existe
    const junta = await this.juntaPropietariosRepository.findOne({
      where: { idJunta: juntaId },
    });

    if (!junta) {
      throw new NotFoundException(
        `Junta de propietarios con ID ${juntaId} no encontrada`,
      );
    }

    return await this.votacionRepository.find({
      relations: ['creadoPorUsuario'],
      order: { fechaCreacion: 'DESC' },
    });
  }
}

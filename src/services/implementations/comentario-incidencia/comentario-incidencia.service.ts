import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IComentarioIncidenciaService } from '../../interfaces/comentario-incidencia.interface';
import { ComentarioIncidencia } from '../../../entities/ComentarioIncidencia';
import { CreateComentarioIncidenciaDto, UpdateComentarioIncidenciaDto } from '../../../dtos';

@Injectable()
export class ComentarioIncidenciaService implements IComentarioIncidenciaService {
  constructor(
    @InjectRepository(ComentarioIncidencia)
    private readonly comentarioIncidenciaRepository: Repository<ComentarioIncidencia>,
  ) {}

  async create(createComentarioIncidenciaDto: CreateComentarioIncidenciaDto): Promise<ComentarioIncidencia> {
    const comentarioIncidencia = this.comentarioIncidenciaRepository.create({
      comentario: createComentarioIncidenciaDto.comentario,
      archivoAdjuntoUrl: createComentarioIncidenciaDto.archivoAdjuntoUrl,
      idIncidencia: { idIncidencia: createComentarioIncidenciaDto.idIncidencia } as any,
      idUsuario: { idUsuario: createComentarioIncidenciaDto.idUsuario } as any,
    });

    return await this.comentarioIncidenciaRepository.save(comentarioIncidencia);
  }

  async findAll(): Promise<ComentarioIncidencia[]> {
    return await this.comentarioIncidenciaRepository.find({
      relations: ['idIncidencia', 'idUsuario'],
      order: {
        fechaComentario: 'DESC'
      }
    });
  }

  async findOne(id: string): Promise<ComentarioIncidencia> {
    const comentarioIncidencia = await this.comentarioIncidenciaRepository.findOne({
      where: { idComentario: id },
      relations: ['idIncidencia', 'idUsuario'],
    });

    if (!comentarioIncidencia) {
      throw new NotFoundException(`Comentario de incidencia con ID ${id} no encontrado`);
    }

    return comentarioIncidencia;
  }

  async update(id: string, updateComentarioIncidenciaDto: UpdateComentarioIncidenciaDto): Promise<ComentarioIncidencia> {
    await this.findOne(id);

    const updateData: any = {};
    if (updateComentarioIncidenciaDto.comentario !== undefined) {
      updateData.comentario = updateComentarioIncidenciaDto.comentario;
    }
    if (updateComentarioIncidenciaDto.archivoAdjuntoUrl !== undefined) {
      updateData.archivoAdjuntoUrl = updateComentarioIncidenciaDto.archivoAdjuntoUrl;
    }

    await this.comentarioIncidenciaRepository.update(id, updateData);
    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.comentarioIncidenciaRepository.delete(id);
  }

  async findByIncidencia(idIncidencia: string): Promise<ComentarioIncidencia[]> {
    return await this.comentarioIncidenciaRepository.find({
      where: { idIncidencia: { idIncidencia } as any },
      relations: ['idUsuario'],
      order: {
        fechaComentario: 'ASC'
      }
    });
  }

  async findByUsuario(idUsuario: string): Promise<ComentarioIncidencia[]> {
    return await this.comentarioIncidenciaRepository.find({
      where: { idUsuario: { idUsuario } as any },
      relations: ['idIncidencia'],
      order: {
        fechaComentario: 'DESC'
      }
    });
  }
}

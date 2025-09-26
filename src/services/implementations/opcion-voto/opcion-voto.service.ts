import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IOpcionVotoService } from '../../interfaces/opcion-voto.interface';
import { 
  CreateOpcionVotoDto, 
  UpdateOpcionVotoDto,
  OpcionVotoResponseDto,
  CreateOpcionVotoResponseDto,
  GetOpcionVotoResponseDto,
  GetOpcionesVotoResponseDto,
  UpdateOpcionVotoResponseDto,
  DeleteOpcionVotoResponseDto,
} from '../../../dtos';
import { BaseResponseDto } from '../../../dtos/baseResponse/baseResponse.dto';
import { OpcionVoto } from '../../../entities/OpcionVoto';
import { Votacion } from '../../../entities/Votacion';

@Injectable()
export class OpcionVotoService implements IOpcionVotoService {
  constructor(
    @InjectRepository(OpcionVoto)
    private readonly opcionVotoRepository: Repository<OpcionVoto>,

    @InjectRepository(Votacion)
    private readonly votacionRepository: Repository<Votacion>,
  ) {}

  /**
   * Crear una nueva opción de voto
   */
  async create(createOpcionVotoDto: CreateOpcionVotoDto): Promise<CreateOpcionVotoResponseDto> {
    try {
      // Validar que la votación existe
      const votacion = await this.votacionRepository.findOne({
        where: { idVotacion: createOpcionVotoDto.idVotacion },
      });

      if (!votacion) {
        throw new NotFoundException(
          `Votación con ID ${createOpcionVotoDto.idVotacion} no encontrada`,
        );
      }

      // Validar que la votación no esté finalizada
      if (votacion.estado === 'FINALIZADA' || votacion.estado === 'CANCELADA') {
        throw new BadRequestException(
          'No se pueden agregar opciones a una votación finalizada o cancelada',
        );
      }

      // Verificar que no existe una opción con el mismo texto en esta votación
      const opcionExistente = await this.opcionVotoRepository
        .createQueryBuilder('opcion')
        .where('opcion.opcion = :texto', { texto: createOpcionVotoDto.opcion })
        .andWhere('opcion.idVotacion = :votacionId', { votacionId: createOpcionVotoDto.idVotacion })
        .getOne();

      if (opcionExistente) {
        throw new ConflictException(
          `Ya existe una opción con el texto "${createOpcionVotoDto.opcion}" en esta votación`,
        );
      }

      // Verificar que el orden de presentación no esté ocupado
      const ordenExistente = await this.opcionVotoRepository
        .createQueryBuilder('opcion')
        .where('opcion.ordenPresentacion = :orden', { orden: createOpcionVotoDto.ordenPresentacion })
        .andWhere('opcion.idVotacion = :votacionId', { votacionId: createOpcionVotoDto.idVotacion })
        .getOne();

      if (ordenExistente) {
        throw new ConflictException(
          `Ya existe una opción con el orden ${createOpcionVotoDto.ordenPresentacion} en esta votación`,
        );
      }

      // Crear la nueva opción de voto
      const nuevaOpcion = this.opcionVotoRepository.create({
        ...createOpcionVotoDto,
        idVotacion: votacion,
      });

      const opcionGuardada = await this.opcionVotoRepository.save(nuevaOpcion);

      // Cargar la opción completa con relaciones
      const opcionCompleta = await this.opcionVotoRepository.findOne({
        where: { idOpcionVoto: opcionGuardada.idOpcionVoto },
        relations: ['idVotacion', 'votos'],
      });

      if (!opcionCompleta) {
        throw new BadRequestException('Error al recuperar la opción de voto creada');
      }

      const responseDto: OpcionVotoResponseDto = {
        idOpcionVoto: opcionCompleta.idOpcionVoto,
        opcion: opcionCompleta.opcion,
        descripcion: opcionCompleta.descripcion,
        ordenPresentacion: opcionCompleta.ordenPresentacion,
        idVotacion: opcionCompleta.idVotacion.idVotacion,
        cantidadVotos: opcionCompleta.votos ? opcionCompleta.votos.length : 0,
      };

      return BaseResponseDto.success(
        responseDto,
        'Opción de voto creada exitosamente',
        201,
      );
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException || error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException(`Error al crear la opción de voto: ${error.message}`);
    }
  }

  /**
   * Obtener todas las opciones de voto
   */
  async findAll(): Promise<GetOpcionesVotoResponseDto> {
    try {
      const opciones = await this.opcionVotoRepository.find({
        relations: ['idVotacion', 'votos'],
        order: { ordenPresentacion: 'ASC' },
      });

      const opcionesDto: OpcionVotoResponseDto[] = opciones.map(opcion => ({
        idOpcionVoto: opcion.idOpcionVoto,
        opcion: opcion.opcion,
        descripcion: opcion.descripcion,
        ordenPresentacion: opcion.ordenPresentacion,
        idVotacion: opcion.idVotacion.idVotacion,
        cantidadVotos: opcion.votos ? opcion.votos.length : 0,
      }));

      return BaseResponseDto.success(
        opcionesDto,
        'Lista de opciones de voto obtenida exitosamente',
        200,
      );
    } catch (error) {
      throw new BadRequestException(`Error al obtener las opciones de voto: ${error.message}`);
    }
  }

  /**
   * Obtener una opción de voto por ID
   */
  async findOne(id: string): Promise<GetOpcionVotoResponseDto> {
    try {
      const opcion = await this.opcionVotoRepository.findOne({
        where: { idOpcionVoto: id },
        relations: ['idVotacion', 'votos'],
      });

      if (!opcion) {
        throw new NotFoundException(`Opción de voto con ID ${id} no encontrada`);
      }

      const opcionDto: OpcionVotoResponseDto = {
        idOpcionVoto: opcion.idOpcionVoto,
        opcion: opcion.opcion,
        descripcion: opcion.descripcion,
        ordenPresentacion: opcion.ordenPresentacion,
        idVotacion: opcion.idVotacion.idVotacion,
        cantidadVotos: opcion.votos ? opcion.votos.length : 0,
      };

      return BaseResponseDto.success(
        opcionDto,
        'Opción de voto obtenida exitosamente',
        200,
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Error al obtener la opción de voto: ${error.message}`);
    }
  }

  /**
   * Actualizar una opción de voto
   */
  async update(id: string, updateOpcionVotoDto: UpdateOpcionVotoDto): Promise<UpdateOpcionVotoResponseDto> {
    try {
      const opcion = await this.opcionVotoRepository.findOne({
        where: { idOpcionVoto: id },
        relations: ['idVotacion', 'votos'],
      });

      if (!opcion) {
        throw new NotFoundException(`Opción de voto con ID ${id} no encontrada`);
      }

      // Validar que la votación no esté finalizada
      if (opcion.idVotacion.estado === 'FINALIZADA' || opcion.idVotacion.estado === 'CANCELADA') {
        throw new BadRequestException(
          'No se pueden modificar opciones de una votación finalizada o cancelada',
        );
      }

      // Si ya hay votos registrados, no permitir cambios críticos
      if (opcion.votos && opcion.votos.length > 0) {
        if (updateOpcionVotoDto.opcion && updateOpcionVotoDto.opcion !== opcion.opcion) {
          throw new BadRequestException(
            'No se puede cambiar el texto de una opción que ya tiene votos registrados',
          );
        }
      }

      // Validar conflictos si se están actualizando campos únicos
      if (updateOpcionVotoDto.opcion && updateOpcionVotoDto.opcion !== opcion.opcion) {
        const opcionExistente = await this.opcionVotoRepository
          .createQueryBuilder('opcion')
          .where('opcion.opcion = :texto', { texto: updateOpcionVotoDto.opcion })
          .andWhere('opcion.idVotacion = :votacionId', { votacionId: opcion.idVotacion.idVotacion })
          .getOne();

        if (opcionExistente && opcionExistente.idOpcionVoto !== id) {
          throw new ConflictException(
            `Ya existe una opción con el texto "${updateOpcionVotoDto.opcion}" en esta votación`,
          );
        }
      }

      if (updateOpcionVotoDto.ordenPresentacion && updateOpcionVotoDto.ordenPresentacion !== opcion.ordenPresentacion) {
        const ordenExistente = await this.opcionVotoRepository
          .createQueryBuilder('opcion')
          .where('opcion.ordenPresentacion = :orden', { orden: updateOpcionVotoDto.ordenPresentacion })
          .andWhere('opcion.idVotacion = :votacionId', { votacionId: opcion.idVotacion.idVotacion })
          .getOne();

        if (ordenExistente && ordenExistente.idOpcionVoto !== id) {
          throw new ConflictException(
            `Ya existe una opción con el orden ${updateOpcionVotoDto.ordenPresentacion} en esta votación`,
          );
        }
      }

      // Actualizar la opción
      Object.assign(opcion, updateOpcionVotoDto);
      const opcionActualizada = await this.opcionVotoRepository.save(opcion);

      // Recargar con relaciones actualizadas
      const opcionCompleta = await this.opcionVotoRepository.findOne({
        where: { idOpcionVoto: opcionActualizada.idOpcionVoto },
        relations: ['idVotacion', 'votos'],
      });

      if (!opcionCompleta) {
        throw new BadRequestException('Error al recuperar la opción de voto actualizada');
      }

      const responseDto: OpcionVotoResponseDto = {
        idOpcionVoto: opcionCompleta.idOpcionVoto,
        opcion: opcionCompleta.opcion,
        descripcion: opcionCompleta.descripcion,
        ordenPresentacion: opcionCompleta.ordenPresentacion,
        idVotacion: opcionCompleta.idVotacion.idVotacion,
        cantidadVotos: opcionCompleta.votos ? opcionCompleta.votos.length : 0,
      };

      return BaseResponseDto.success(
        responseDto,
        'Opción de voto actualizada exitosamente',
        200,
      );
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException || error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException(`Error al actualizar la opción de voto: ${error.message}`);
    }
  }

  /**
   * Eliminar una opción de voto
   */
  async remove(id: string): Promise<DeleteOpcionVotoResponseDto> {
    try {
      const opcion = await this.opcionVotoRepository.findOne({
        where: { idOpcionVoto: id },
        relations: ['idVotacion', 'votos'],
      });

      if (!opcion) {
        throw new NotFoundException(`Opción de voto con ID ${id} no encontrada`);
      }

      // Validar que la votación no esté finalizada
      if (opcion.idVotacion.estado === 'FINALIZADA') {
        throw new BadRequestException(
          'No se pueden eliminar opciones de una votación finalizada',
        );
      }

      // Validar que no haya votos registrados
      if (opcion.votos && opcion.votos.length > 0) {
        throw new BadRequestException(
          'No se puede eliminar una opción que ya tiene votos registrados',
        );
      }

      await this.opcionVotoRepository.remove(opcion);

      return BaseResponseDto.success(
        null,
        'Opción de voto eliminada exitosamente',
        200,
      );
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Error al eliminar la opción de voto: ${error.message}`);
    }
  }

  /**
   * Obtener opciones de voto por ID de votación
   */
  async findByVotacion(votacionId: string): Promise<GetOpcionesVotoResponseDto> {
    try {
      const opciones = await this.opcionVotoRepository
        .createQueryBuilder('opcion')
        .leftJoinAndSelect('opcion.idVotacion', 'votacion')
        .leftJoinAndSelect('opcion.votos', 'votos')
        .where('opcion.idVotacion = :votacionId', { votacionId })
        .orderBy('opcion.ordenPresentacion', 'ASC')
        .getMany();

      const opcionesDto: OpcionVotoResponseDto[] = opciones.map(opcion => ({
        idOpcionVoto: opcion.idOpcionVoto,
        opcion: opcion.opcion,
        descripcion: opcion.descripcion,
        ordenPresentacion: opcion.ordenPresentacion,
        idVotacion: opcion.idVotacion.idVotacion,
        cantidadVotos: opcion.votos ? opcion.votos.length : 0,
      }));

      return BaseResponseDto.success(
        opcionesDto,
        `Opciones de voto para la votación ${votacionId} obtenidas exitosamente`,
        200,
      );
    } catch (error) {
      throw new BadRequestException(`Error al obtener las opciones de la votación: ${error.message}`);
    }
  }

}

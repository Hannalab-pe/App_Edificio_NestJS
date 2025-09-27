import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IVotacionService } from '../../interfaces/votacion.interface';
import {
  CreateVotacionDto,
  UpdateVotacionDto,
  VotacionSingleResponseDto,
  VotacionArrayResponseDto,
  VotacionResponseDto,
  UsuarioCreadorResponseDto,
  OpcionVotoVotacionResponseDto,
  VotoResponseDto,
  EstadisticasVotacionDto,
} from '../../../dtos';
import { Votacion } from '../../../entities/Votacion';
import { JuntaPropietarios } from '../../../entities/JuntaPropietarios';
import { Usuario } from '../../../entities/Usuario';
import { OpcionVoto } from '../../../entities/OpcionVoto';
import { Voto } from '../../../entities/Voto';

@Injectable()
export class VotacionService implements IVotacionService {
  private readonly logger = new Logger(VotacionService.name);

  constructor(
    @InjectRepository(Votacion)
    private readonly votacionRepository: Repository<Votacion>,

    @InjectRepository(JuntaPropietarios)
    private readonly juntaPropietariosRepository: Repository<JuntaPropietarios>,

    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,

    @InjectRepository(OpcionVoto)
    private readonly opcionVotoRepository: Repository<OpcionVoto>,

    @InjectRepository(Voto)
    private readonly votoRepository: Repository<Voto>,
  ) {}

  async create(createVotacionDto: CreateVotacionDto): Promise<Votacion> {
    // Validar que el usuario creador existe y cargar su rol
    const usuarioCreador = await this.usuarioRepository.findOne({
      where: {
        idUsuario: createVotacionDto.creadoPorUsuario,
        estaActivo: true,
      },
      relations: ['idRol'],
    });

    if (!usuarioCreador) {
      throw new NotFoundException(
        `Usuario con ID ${createVotacionDto.creadoPorUsuario} no encontrado o inactivo`,
      );
    }

    // Validar que el usuario tiene rol de administrador
    if (
      !usuarioCreador.idRol ||
      usuarioCreador.idRol.nombre !== 'Administrador'
    ) {
      throw new BadRequestException(
        'Solo los usuarios con rol de Administrador pueden crear votaciones',
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

  // ========================================
  // MÉTODOS CON BASERESPONSEDTO
  // ========================================

  /**
   * Helper para mapear entidad Votación a DTO de respuesta
   */
  private async mapToResponseDto(
    votacion: Votacion,
  ): Promise<VotacionResponseDto> {
    // Cargar relaciones si no están cargadas
    if (!votacion.creadoPorUsuario) {
      const votacionCompleta = await this.votacionRepository.findOne({
        where: { idVotacion: votacion.idVotacion },
        relations: ['creadoPorUsuario', 'opcionVotos', 'votos'],
      });
      if (votacionCompleta) {
        votacion = votacionCompleta;
      }
    }

    // Mapear usuario creador
    const creadoPor: UsuarioCreadorResponseDto = {
      idUsuario: votacion.creadoPorUsuario.idUsuario,
      nombreCompleto: votacion.creadoPorUsuario.correo.split('@')[0], // Usar parte del email como nombre
      email: votacion.creadoPorUsuario.correo,
      rol: votacion.creadoPorUsuario.idRol?.nombre || 'Sin rol',
    };

    // Calcular estadísticas
    const totalVotos = await this.votoRepository.count({
      where: { idVotacion: votacion.idVotacion },
    });

    const totalElegibles = await this.usuarioRepository.count({
      where: { estaActivo: true },
    });

    // Mapear opciones de voto con estadísticas
    const opciones: OpcionVotoVotacionResponseDto[] = await Promise.all(
      (votacion.opcionVotos || []).map(async (opcion) => {
        const votosOpcion = await this.votoRepository.count({
          where: { idOpcionVoto: { idOpcionVoto: opcion.idOpcionVoto } },
        });

        return {
          idOpcionVoto: opcion.idOpcionVoto,
          opcion: opcion.opcion,
          descripcion: opcion.descripcion || undefined,
          ordenPresentacion: opcion.ordenPresentacion,
          totalVotos: votosOpcion,
          porcentajeVotos:
            totalVotos > 0 ? (votosOpcion / totalVotos) * 100 : 0,
        };
      }),
    );

    // Estadísticas de la votación
    const estadisticas: EstadisticasVotacionDto = {
      totalVotos,
      totalElegibles,
      participacion:
        totalElegibles > 0 ? (totalVotos / totalElegibles) * 100 : 0,
      quorumAlcanzado: votacion.requiereQuorum
        ? totalVotos >= (votacion.quorumMinimo || 0)
        : true,
      quorumMinimo: votacion.quorumMinimo || undefined,
      estado: votacion.estado,
      tiempoRestante: this.calcularTiempoRestante(votacion.fechaFin),
    };

    // Verificar si la votación acepta votos
    const ahora = new Date();
    const aceptaVotos =
      votacion.estado === 'Activa' &&
      new Date(votacion.fechaInicio) <= ahora &&
      new Date(votacion.fechaFin) >= ahora;

    return {
      idVotacion: votacion.idVotacion,
      titulo: votacion.titulo,
      descripcion: votacion.descripcion,
      fechaInicio: votacion.fechaInicio.toISOString(),
      fechaFin: votacion.fechaFin.toISOString(),
      estado: votacion.estado,
      tipo: votacion.tipo,
      requiereQuorum: votacion.requiereQuorum,
      quorumMinimo: votacion.quorumMinimo || undefined,
      fechaCreacion:
        votacion.fechaCreacion?.toISOString() || new Date().toISOString(),
      creadoPor,
      opciones,
      estadisticas,
      aceptaVotos,
      urlVotacion: `${process.env.APP_URL || 'https://app.edificio.com'}/votacion/${votacion.idVotacion}`,
    };
  }

  /**
   * Calcula el tiempo restante en minutos para cerrar la votación
   */
  private calcularTiempoRestante(fechaFin: Date): number | undefined {
    const ahora = new Date();
    const fin = new Date(fechaFin);

    if (fin <= ahora) {
      return 0;
    }

    return Math.floor((fin.getTime() - ahora.getTime()) / (1000 * 60));
  }

  /**
   * Crear votación con BaseResponseDto
   */
  async createWithResponse(
    createVotacionDto: CreateVotacionDto,
  ): Promise<VotacionSingleResponseDto> {
    this.logger.log(`Creando nueva votación: ${createVotacionDto.titulo}`);

    try {
      const votacion = await this.create(createVotacionDto);
      const votacionResponse = await this.mapToResponseDto(votacion);

      return {
        success: true,
        message: 'Votación creada exitosamente',
        data: votacionResponse,
        votacionUrl: `${process.env.APP_URL || 'https://app.edificio.com'}/votacion/${votacion.idVotacion}`,
        accionesDisponibles: ['ver_detalles', 'editar', 'agregar_opciones'],
        informacionEstado: `Votación creada en estado: ${votacion.estado}`,
      };
    } catch (error) {
      this.logger.error(
        `Error al crear votación: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Obtener todas las votaciones con paginación y BaseResponseDto
   */
  async findAllWithResponse(
    page: number = 1,
    limit: number = 10,
  ): Promise<VotacionArrayResponseDto> {
    this.logger.log(
      `Obteniendo votaciones - Página: ${page}, Límite: ${limit}`,
    );

    try {
      const skip = (page - 1) * limit;

      const [votaciones, total] = await this.votacionRepository.findAndCount({
        relations: ['creadoPorUsuario', 'opcionVotos'],
        order: { fechaCreacion: 'DESC' },
        skip,
        take: limit,
      });

      const votacionesResponse = await Promise.all(
        votaciones.map((votacion) => this.mapToResponseDto(votacion)),
      );

      // Calcular estadísticas generales
      const votacionesActivas = await this.votacionRepository.count({
        where: { estado: 'Activa' },
      });

      const inicioMes = new Date();
      inicioMes.setDate(1);
      inicioMes.setHours(0, 0, 0, 0);

      const votacionesFinalizadasMes = await this.votacionRepository.count({
        where: {
          estado: 'Finalizada',
          fechaCreacion: { $gte: inicioMes } as any,
        },
      });

      const estadisticasGenerales = {
        votacionesActivas,
        votacionesFinalizadasMes,
        promedioParticipacion: 0, // Calcular en consulta más compleja
        votosEmitidosMes: 0, // Calcular en consulta más compleja
        votacionesPendientes: await this.votacionRepository.count({
          where: { estado: 'Borrador' },
        }),
        quorumPromedioAlcanzado: 0, // Calcular en consulta más compleja
      };

      return {
        success: true,
        message: `${total} votaciones encontradas`,
        data: votacionesResponse,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNextPage: skip + limit < total,
          hasPrevPage: page > 1,
        },
        estadisticasGenerales,
      };
    } catch (error) {
      this.logger.error(
        `Error al obtener votaciones: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Obtener votación por ID con BaseResponseDto
   */
  async findOneWithResponse(id: string): Promise<VotacionSingleResponseDto> {
    this.logger.log(`Buscando votación por ID: ${id}`);

    try {
      const votacion = await this.findOne(id);
      const votacionResponse = await this.mapToResponseDto(votacion);

      const accionesDisponibles: string[] = [];
      if (votacion.estado === 'Borrador') {
        accionesDisponibles.push('editar', 'activar', 'eliminar');
      } else if (votacion.estado === 'Activa') {
        accionesDisponibles.push('ver_resultados', 'cerrar');
      } else {
        accionesDisponibles.push('ver_resultados');
      }

      return {
        success: true,
        message: 'Votación encontrada exitosamente',
        data: votacionResponse,
        accionesDisponibles,
        informacionEstado: this.obtenerInformacionEstado(votacion),
      };
    } catch (error) {
      this.logger.error(
        `Error al buscar votación: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Actualizar votación con BaseResponseDto
   */
  async updateWithResponse(
    id: string,
    updateVotacionDto: UpdateVotacionDto,
  ): Promise<VotacionSingleResponseDto> {
    this.logger.log(`Actualizando votación ID: ${id}`);

    try {
      const votacion = await this.update(id, updateVotacionDto);
      const votacionResponse = await this.mapToResponseDto(votacion);

      return {
        success: true,
        message: 'Votación actualizada exitosamente',
        data: votacionResponse,
        informacionEstado: `Votación actualizada - Estado: ${votacion.estado}`,
      };
    } catch (error) {
      this.logger.error(
        `Error al actualizar votación: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Eliminar votación con BaseResponseDto
   */
  async removeWithResponse(id: string): Promise<VotacionSingleResponseDto> {
    this.logger.log(`Eliminando votación ID: ${id}`);

    try {
      const votacion = await this.findOne(id);
      const votacionResponse = await this.mapToResponseDto(votacion);

      await this.remove(id);

      return {
        success: true,
        message: 'Votación eliminada exitosamente',
        data: votacionResponse,
        informacionEstado: 'La votación ha sido eliminada del sistema',
      };
    } catch (error) {
      this.logger.error(
        `Error al eliminar votación: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Buscar votaciones por estado con BaseResponseDto
   */
  async findByEstadoWithResponse(
    estado: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<VotacionArrayResponseDto> {
    this.logger.log(`Buscando votaciones por estado: ${estado}`);

    try {
      const skip = (page - 1) * limit;

      const [votaciones, total] = await this.votacionRepository.findAndCount({
        where: { estado },
        relations: ['creadoPorUsuario', 'opcionVotos'],
        order: { fechaCreacion: 'DESC' },
        skip,
        take: limit,
      });

      const votacionesResponse = await Promise.all(
        votaciones.map((votacion) => this.mapToResponseDto(votacion)),
      );

      return {
        success: true,
        message: `${total} votaciones con estado ${estado} encontradas`,
        data: votacionesResponse,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNextPage: skip + limit < total,
          hasPrevPage: page > 1,
        },
        filtrosAplicados: { estado },
      };
    } catch (error) {
      this.logger.error(
        `Error al buscar votaciones por estado: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Buscar votaciones activas con BaseResponseDto
   */
  async findActiveWithResponse(
    page: number = 1,
    limit: number = 10,
  ): Promise<VotacionArrayResponseDto> {
    this.logger.log('Buscando votaciones activas');

    try {
      const skip = (page - 1) * limit;
      const now = new Date();

      const queryBuilder = this.votacionRepository
        .createQueryBuilder('votacion')
        .leftJoinAndSelect('votacion.creadoPorUsuario', 'usuario')
        .leftJoinAndSelect('votacion.opcionVotos', 'opciones')
        .where('votacion.estado = :estado', { estado: 'Activa' })
        .andWhere('votacion.fechaInicio <= :now', { now })
        .andWhere('votacion.fechaFin >= :now', { now })
        .orderBy('votacion.fechaCreacion', 'DESC')
        .skip(skip)
        .take(limit);

      const [votaciones, total] = await Promise.all([
        queryBuilder.getMany(),
        queryBuilder.getCount(),
      ]);

      const votacionesResponse = await Promise.all(
        votaciones.map((votacion) => this.mapToResponseDto(votacion)),
      );

      return {
        success: true,
        message: `${total} votaciones activas encontradas`,
        data: votacionesResponse,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNextPage: skip + limit < total,
          hasPrevPage: page > 1,
        },
        filtrosAplicados: { estado: 'Activa' },
      };
    } catch (error) {
      this.logger.error(
        `Error al buscar votaciones activas: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  // Implementaciones básicas de los métodos faltantes
  async findByJuntaPropietariosWithResponse(
    juntaId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<VotacionArrayResponseDto> {
    const votaciones = await this.findByJuntaPropietarios(juntaId);
    const paginatedVotaciones = votaciones.slice(
      (page - 1) * limit,
      page * limit,
    );

    const votacionesResponse = await Promise.all(
      paginatedVotaciones.map((votacion) => this.mapToResponseDto(votacion)),
    );

    return {
      success: true,
      message: `Votaciones para junta ${juntaId} encontradas`,
      data: votacionesResponse,
    };
  }

  async findByDateRangeWithResponse(
    fechaInicio: Date,
    fechaFin: Date,
    page: number = 1,
    limit: number = 10,
  ): Promise<VotacionArrayResponseDto> {
    // Implementación básica
    return {
      success: true,
      message: 'Búsqueda por rango de fechas',
      data: [],
    };
  }

  async findByCreadorWithResponse(
    creadorId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<VotacionArrayResponseDto> {
    // Implementación básica
    return {
      success: true,
      message: 'Búsqueda por creador',
      data: [],
    };
  }

  async getEstadisticasGeneralesWithResponse(): Promise<VotacionArrayResponseDto> {
    // Implementación básica
    return {
      success: true,
      message: 'Estadísticas generales',
      data: [],
    };
  }

  async cerrarVotacionWithResponse(
    id: string,
  ): Promise<VotacionSingleResponseDto> {
    const votacion = await this.update(id, { estado: 'Finalizada' as any });
    const votacionResponse = await this.mapToResponseDto(votacion);

    return {
      success: true,
      message: 'Votación cerrada exitosamente',
      data: votacionResponse,
    };
  }

  async activarVotacionWithResponse(
    id: string,
  ): Promise<VotacionSingleResponseDto> {
    const votacion = await this.update(id, { estado: 'Activa' as any });
    const votacionResponse = await this.mapToResponseDto(votacion);

    return {
      success: true,
      message: 'Votación activada exitosamente',
      data: votacionResponse,
    };
  }

  async cancelarVotacionWithResponse(
    id: string,
  ): Promise<VotacionSingleResponseDto> {
    const votacion = await this.update(id, { estado: 'Cancelada' as any });
    const votacionResponse = await this.mapToResponseDto(votacion);

    return {
      success: true,
      message: 'Votación cancelada exitosamente',
      data: votacionResponse,
    };
  }

  /**
   * Helper para obtener información del estado de la votación
   */
  private obtenerInformacionEstado(votacion: Votacion): string {
    switch (votacion.estado) {
      case 'Borrador':
        return 'La votación está en modo borrador y puede ser editada';
      case 'Activa':
        return `La votación está activa hasta el ${votacion.fechaFin.toLocaleDateString()}`;
      case 'Finalizada':
        return 'La votación ha finalizado y ya no acepta votos';
      case 'Cancelada':
        return 'La votación ha sido cancelada';
      default:
        return 'Estado de votación desconocido';
    }
  }
}

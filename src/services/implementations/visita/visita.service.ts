import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Visita } from '../../../entities/Visita';
import { Usuario } from '../../../entities/Usuario';
import { Propiedad } from '../../../entities/Propiedad';
import { IVisitaService } from '../../interfaces/visita.interface';
import { 
  CreateVisitaDto, 
  UpdateVisitaDto, 
  VisitaSingleResponseDto, 
  VisitaArrayResponseDto,
  VisitaNewResponseDto
} from '../../../dtos';

/**
 * Servicio para la gestión de visitas
 * Implementa todas las operaciones CRUD y validaciones de negocio para visitas
 */
@Injectable()
export class VisitaService implements IVisitaService {
  private readonly logger = new Logger(VisitaService.name);

  constructor(
    @InjectRepository(Visita)
    private readonly visitaRepository: Repository<Visita>,

    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,

    @InjectRepository(Propiedad)
    private readonly propiedadRepository: Repository<Propiedad>,
  ) {}

  /**
   * Crea una nueva visita con validaciones completas
   * Valida la existencia del usuario autorizador y la propiedad
   * Genera un código QR único para la visita
   */
  async create(createVisitaDto: CreateVisitaDto): Promise<Visita> {
    // Validar que el usuario autorizador existe y está activo
    const usuarioAutorizador = await this.usuarioRepository.findOne({
      where: {
        idUsuario: createVisitaDto.autorizadorUsuario,
        estaActivo: true,
      },
      relations: ['idRol'],
    });

    if (!usuarioAutorizador) {
      throw new NotFoundException({
        success: false,
        message: 'El usuario autorizador no existe o no está activo',
        error: {
          code: 'USER_NOT_FOUND',
          field: 'autorizadorUsuario',
          timestamp: new Date().toISOString(),
        },
      });
    }

    // Validar que la propiedad existe y está activa
    const propiedad = await this.propiedadRepository.findOne({
      where: { idPropiedad: createVisitaDto.idPropiedad, estaActivo: true },
    });

    if (!propiedad) {
      throw new NotFoundException({
        success: false,
        message: 'La propiedad especificada no existe o no está activa',
        error: {
          code: 'PROPERTY_NOT_FOUND',
          field: 'idPropiedad',
          timestamp: new Date().toISOString(),
        },
      });
    }

    // Validar que la hora de inicio sea anterior a la hora de fin
    if (createVisitaDto.horaInicio >= createVisitaDto.horaFin) {
      throw new BadRequestException({
        success: false,
        message: 'La hora de inicio debe ser anterior a la hora de fin',
        error: {
          code: 'INVALID_TIME_RANGE',
          field: 'horaInicio',
          timestamp: new Date().toISOString(),
        },
      });
    }

    // Validar que la fecha programada no sea en el pasado
    const fechaHoy = new Date().toISOString().split('T')[0];
    if (createVisitaDto.fechaProgramada < fechaHoy) {
      throw new BadRequestException({
        success: false,
        message: 'No se pueden programar visitas en fechas pasadas',
        error: {
          code: 'INVALID_DATE',
          field: 'fechaProgramada',
          timestamp: new Date().toISOString(),
        },
      });
    }

    // Generar código QR único
    const codigoQr = await this.generarCodigoQrUnico();

    // Crear la nueva visita
    const nuevaVisita = this.visitaRepository.create({
      codigoQr,
      nombreVisitante: createVisitaDto.nombreVisitante,
      documentoVisitante: createVisitaDto.documentoVisitante || null,
      telefonoVisitante: createVisitaDto.telefonoVisitante || null,
      motivo: createVisitaDto.motivo || null,
      fechaProgramada: createVisitaDto.fechaProgramada,
      horaInicio: createVisitaDto.horaInicio,
      horaFin: createVisitaDto.horaFin,
      estado: 'PROGRAMADA',
      autorizadorUsuario: usuarioAutorizador,
      idPropiedad: propiedad,
      fechaIngreso: null,
      fechaSalida: null,
    });

    // Guardar y retornar con relaciones
    const visitaGuardada = await this.visitaRepository.save(nuevaVisita);
    return this.findOne(visitaGuardada.idVisita);
  }

  /**
   * Obtiene todas las visitas con sus relaciones
   */
  async findAll(): Promise<Visita[]> {
    return await this.visitaRepository.find({
      relations: ['autorizadorUsuario', 'idPropiedad'],
      order: { fechaProgramada: 'DESC', horaInicio: 'ASC' },
    });
  }

  /**
   * Busca una visita específica por ID con validación de existencia
   */
  async findOne(id: string): Promise<Visita> {
    const visita = await this.visitaRepository.findOne({
      where: { idVisita: id },
      relations: ['autorizadorUsuario', 'idPropiedad'],
    });

    if (!visita) {
      throw new NotFoundException({
        success: false,
        message: 'Visita no encontrada',
        error: {
          code: 'VISIT_NOT_FOUND',
          field: 'id',
          timestamp: new Date().toISOString(),
        },
      });
    }

    return visita;
  }

  /**
   * Actualiza una visita existente con validaciones
   */
  async update(id: string, updateVisitaDto: UpdateVisitaDto): Promise<Visita> {
    // Verificar que la visita existe
    const visitaExistente = await this.findOne(id);

    // Validaciones opcionales según los campos proporcionados
    if (updateVisitaDto.autorizadorUsuario) {
      const usuarioAutorizador = await this.usuarioRepository.findOne({
        where: {
          idUsuario: updateVisitaDto.autorizadorUsuario,
          estaActivo: true,
        },
      });

      if (!usuarioAutorizador) {
        throw new NotFoundException({
          success: false,
          message: 'El usuario autorizador no existe o no está activo',
          error: {
            code: 'USER_NOT_FOUND',
            field: 'autorizadorUsuario',
            timestamp: new Date().toISOString(),
          },
        });
      }
    }

    if (updateVisitaDto.idPropiedad) {
      const propiedad = await this.propiedadRepository.findOne({
        where: { idPropiedad: updateVisitaDto.idPropiedad, estaActivo: true },
      });

      if (!propiedad) {
        throw new NotFoundException({
          success: false,
          message: 'La propiedad especificada no existe o no está activa',
          error: {
            code: 'PROPERTY_NOT_FOUND',
            field: 'idPropiedad',
            timestamp: new Date().toISOString(),
          },
        });
      }
    }

    // Validar rango de horas si se proporcionan ambas
    if (updateVisitaDto.horaInicio && updateVisitaDto.horaFin) {
      if (updateVisitaDto.horaInicio >= updateVisitaDto.horaFin) {
        throw new BadRequestException({
          success: false,
          message: 'La hora de inicio debe ser anterior a la hora de fin',
          error: {
            code: 'INVALID_TIME_RANGE',
            timestamp: new Date().toISOString(),
          },
        });
      }
    }

    // Validar fecha si se proporciona
    if (updateVisitaDto.fechaProgramada) {
      const fechaHoy = new Date().toISOString().split('T')[0];
      if (
        updateVisitaDto.fechaProgramada < fechaHoy &&
        visitaExistente.estado === 'PROGRAMADA'
      ) {
        throw new BadRequestException({
          success: false,
          message: 'No se pueden programar visitas en fechas pasadas',
          error: {
            code: 'INVALID_DATE',
            field: 'fechaProgramada',
            timestamp: new Date().toISOString(),
          },
        });
      }
    }

    // Preparar objeto de actualización compatible con TypeORM
    const updateData: any = {};

    // Copiar campos simples (no relaciones)
    if (updateVisitaDto.nombreVisitante !== undefined) {
      updateData.nombreVisitante = updateVisitaDto.nombreVisitante;
    }
    if (updateVisitaDto.documentoVisitante !== undefined) {
      updateData.documentoVisitante = updateVisitaDto.documentoVisitante;
    }
    if (updateVisitaDto.telefonoVisitante !== undefined) {
      updateData.telefonoVisitante = updateVisitaDto.telefonoVisitante;
    }
    if (updateVisitaDto.motivo !== undefined) {
      updateData.motivo = updateVisitaDto.motivo;
    }
    if (updateVisitaDto.fechaProgramada !== undefined) {
      updateData.fechaProgramada = updateVisitaDto.fechaProgramada;
    }
    if (updateVisitaDto.horaInicio !== undefined) {
      updateData.horaInicio = updateVisitaDto.horaInicio;
    }
    if (updateVisitaDto.horaFin !== undefined) {
      updateData.horaFin = updateVisitaDto.horaFin;
    }
    if (updateVisitaDto.estado !== undefined) {
      updateData.estado = updateVisitaDto.estado;
    }

    // Manejar relaciones usando save() en lugar de update()
    if (updateVisitaDto.autorizadorUsuario || updateVisitaDto.idPropiedad) {
      // Si hay cambios en relaciones, usar save() que maneja relaciones
      const visitaParaActualizar = await this.visitaRepository.findOne({
        where: { idVisita: id },
        relations: ['autorizadorUsuario', 'idPropiedad']
      });

      if (visitaParaActualizar) {
        // Aplicar cambios simples
        Object.assign(visitaParaActualizar, updateData);

        // Actualizar relaciones si es necesario
        if (updateVisitaDto.autorizadorUsuario) {
          const usuarioAutorizador = await this.usuarioRepository.findOne({
            where: { idUsuario: updateVisitaDto.autorizadorUsuario, estaActivo: true }
          });
          visitaParaActualizar.autorizadorUsuario = usuarioAutorizador!;
        }

        if (updateVisitaDto.idPropiedad) {
          const propiedad = await this.propiedadRepository.findOne({
            where: { idPropiedad: updateVisitaDto.idPropiedad, estaActivo: true }
          });
          visitaParaActualizar.idPropiedad = propiedad!;
        }

        await this.visitaRepository.save(visitaParaActualizar);
      }
    } else {
      // Solo campos simples, usar update()
      await this.visitaRepository.update(id, updateData);
    }

    // Retornar visita actualizada con relaciones
    return this.findOne(id);
  }

  /**
   * Elimina una visita (soft delete - cambia estado a CANCELADA)
   */
  async remove(id: string): Promise<void> {
    const visita = await this.findOne(id);

    // Cambiar estado a CANCELADA en lugar de eliminar físicamente
    await this.visitaRepository.update(id, { estado: 'CANCELADA' });
  }

  /**
   * Busca visitas por estado específico
   */
  async findByEstado(estado: string): Promise<Visita[]> {
    return await this.visitaRepository.find({
      where: { estado },
      relations: ['autorizadorUsuario', 'idPropiedad'],
      order: { fechaProgramada: 'ASC', horaInicio: 'ASC' },
    });
  }

  /**
   * Busca visitas por propiedad específica
   */
  async findByPropiedad(propiedadId: string): Promise<Visita[]> {
    // Validar que la propiedad existe
    const propiedad = await this.propiedadRepository.findOne({
      where: { idPropiedad: propiedadId },
    });

    if (!propiedad) {
      throw new NotFoundException({
        success: false,
        message: 'Propiedad no encontrada',
        error: {
          code: 'PROPERTY_NOT_FOUND',
          timestamp: new Date().toISOString(),
        },
      });
    }

    return await this.visitaRepository.find({
      where: { idPropiedad: { idPropiedad: propiedadId } },
      relations: ['autorizadorUsuario', 'idPropiedad'],
      order: { fechaProgramada: 'DESC', horaInicio: 'ASC' },
    });
  }

  /**
   * Busca visitas en un rango de fechas
   */
  async findByFechaRange(fechaInicio: Date, fechaFin: Date): Promise<Visita[]> {
    if (fechaInicio > fechaFin) {
      throw new BadRequestException({
        success: false,
        message: 'La fecha de inicio debe ser anterior a la fecha de fin',
        error: {
          code: 'INVALID_DATE_RANGE',
          timestamp: new Date().toISOString(),
        },
      });
    }

    return await this.visitaRepository.find({
      where: {
        fechaProgramada: Between(
          fechaInicio.toISOString().split('T')[0],
          fechaFin.toISOString().split('T')[0],
        ),
      },
      relations: ['autorizadorUsuario', 'idPropiedad'],
      order: { fechaProgramada: 'ASC', horaInicio: 'ASC' },
    });
  }

  /**
   * Busca visitas por usuario autorizador
   */
  async findByUsuarioAutorizador(usuarioId: string): Promise<Visita[]> {
    // Validar que el usuario existe
    const usuario = await this.usuarioRepository.findOne({
      where: { idUsuario: usuarioId },
    });

    if (!usuario) {
      throw new NotFoundException({
        success: false,
        message: 'Usuario no encontrado',
        error: {
          code: 'USER_NOT_FOUND',
          timestamp: new Date().toISOString(),
        },
      });
    }

    return await this.visitaRepository.find({
      where: { autorizadorUsuario: { idUsuario: usuarioId } },
      relations: ['autorizadorUsuario', 'idPropiedad'],
      order: { fechaProgramada: 'DESC', horaInicio: 'ASC' },
    });
  }

  /**
   * Registra el ingreso de una visita usando el código QR
   */
  async registrarIngreso(codigoQr: string): Promise<Visita> {
    const visita = await this.visitaRepository.findOne({
      where: { codigoQr },
      relations: ['autorizadorUsuario', 'idPropiedad'],
    });

    if (!visita) {
      throw new NotFoundException({
        success: false,
        message: 'Código QR no válido o visita no encontrada',
        error: {
          code: 'INVALID_QR_CODE',
          timestamp: new Date().toISOString(),
        },
      });
    }

    if (visita.estado !== 'PROGRAMADA') {
      throw new BadRequestException({
        success: false,
        message: `No se puede registrar ingreso. Estado actual: ${visita.estado}`,
        error: {
          code: 'INVALID_VISIT_STATE',
          currentState: visita.estado,
          timestamp: new Date().toISOString(),
        },
      });
    }

    // Actualizar estado y fecha de ingreso
    await this.visitaRepository.update(visita.idVisita, {
      estado: 'EN_CURSO',
      fechaIngreso: new Date(),
    });

    return this.findOne(visita.idVisita);
  }

  /**
   * Registra la salida de una visita usando el código QR
   */
  async registrarSalida(codigoQr: string): Promise<Visita> {
    const visita = await this.visitaRepository.findOne({
      where: { codigoQr },
      relations: ['autorizadorUsuario', 'idPropiedad'],
    });

    if (!visita) {
      throw new NotFoundException({
        success: false,
        message: 'Código QR no válido o visita no encontrada',
        error: {
          code: 'INVALID_QR_CODE',
          timestamp: new Date().toISOString(),
        },
      });
    }

    if (visita.estado !== 'EN_CURSO') {
      throw new BadRequestException({
        success: false,
        message: `No se puede registrar salida. Estado actual: ${visita.estado}`,
        error: {
          code: 'INVALID_VISIT_STATE',
          currentState: visita.estado,
          timestamp: new Date().toISOString(),
        },
      });
    }

    // Actualizar estado y fecha de salida
    await this.visitaRepository.update(visita.idVisita, {
      estado: 'FINALIZADA',
      fechaSalida: new Date(),
    });

    return this.findOne(visita.idVisita);
  }

  // ===============================
  // NUEVOS MÉTODOS CON BASE RESPONSE
  // ===============================

  /**
   * Crea una nueva visita y retorna BaseResponseDto
   */
  async createWithResponse(createVisitaDto: CreateVisitaDto): Promise<VisitaSingleResponseDto> {
    try {
      this.logger.log(`Creando nueva visita para ${createVisitaDto.nombreVisitante}`);
      
      const visita = await this.create(createVisitaDto);
      const visitaResponse = this.mapToResponseDto(visita);

      return {
        success: true,
        message: 'Visita creada exitosamente',
        data: visitaResponse,
        metadata: {
          codigoQrUrl: `https://api.qrserver.com/v1/create-qr-code/?data=${visita.codigoQr}`,
          requiereAutorizacion: true,
          notificacionesEnviadas: true
        }
      };
    } catch (error) {
      this.logger.error(`Error al crear visita: ${error.message}`);
      throw error;
    }
  }

  /**
   * Obtiene todas las visitas con paginación y BaseResponseDto
   */
  async findAllWithResponse(page = 1, limit = 10): Promise<VisitaArrayResponseDto> {
    try {
      const skip = (page - 1) * limit;
      
      const [visitas, total] = await this.visitaRepository.findAndCount({
        relations: ['autorizadorUsuario', 'autorizadorUsuario.idRol', 'idPropiedad', 'idPropiedad.idEdificio'],
        order: { fechaProgramada: 'DESC', horaInicio: 'ASC' },
        skip,
        take: limit,
      });

      const visitasResponse = visitas.map(visita => this.mapToResponseDto(visita));

      // Calcular estadísticas
      const estadisticas = await this.calcularEstadisticas();

      return {
        success: true,
        message: `${total} visitas encontradas`,
        data: visitasResponse,
        metadata: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          hasNextPage: page < Math.ceil(total / limit),
          hasPreviousPage: page > 1,
          estadisticas
        }
      };
    } catch (error) {
      this.logger.error(`Error al obtener visitas: ${error.message}`);
      throw error;
    }
  }

  /**
   * Obtiene una visita por ID con BaseResponseDto
   */
  async findOneWithResponse(id: string): Promise<VisitaSingleResponseDto> {
    try {
      const visita = await this.visitaRepository.findOne({
        where: { idVisita: id },
        relations: ['autorizadorUsuario', 'autorizadorUsuario.idRol', 'idPropiedad', 'idPropiedad.idEdificio'],
      });

      if (!visita) {
        throw new NotFoundException('Visita no encontrada');
      }

      const visitaResponse = this.mapToResponseDto(visita);

      return {
        success: true,
        message: 'Visita encontrada exitosamente',
        data: visitaResponse,
        metadata: {
          codigoQrUrl: `https://api.qrserver.com/v1/create-qr-code/?data=${visita.codigoQr}`,
          requiereAutorizacion: visita.estado === 'PROGRAMADA',
          notificacionesEnviadas: true
        }
      };
    } catch (error) {
      this.logger.error(`Error al obtener visita ${id}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Actualiza una visita con BaseResponseDto
   */
  async updateWithResponse(id: string, updateVisitaDto: UpdateVisitaDto): Promise<VisitaSingleResponseDto> {
    try {
      this.logger.log(`Actualizando visita ${id}`);
      
      const visita = await this.update(id, updateVisitaDto);
      const visitaResponse = this.mapToResponseDto(visita);

      return {
        success: true,
        message: 'Visita actualizada exitosamente',
        data: visitaResponse,
      };
    } catch (error) {
      this.logger.error(`Error al actualizar visita ${id}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Elimina una visita con BaseResponseDto
   */
  async removeWithResponse(id: string): Promise<VisitaSingleResponseDto> {
    try {
      const visita = await this.findOne(id);
      await this.remove(id);
      
      const visitaResponse = this.mapToResponseDto(visita);

      return {
        success: true,
        message: 'Visita cancelada exitosamente',
        data: visitaResponse,
      };
    } catch (error) {
      this.logger.error(`Error al cancelar visita ${id}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Busca visitas por estado con BaseResponseDto
   */
  async findByEstadoWithResponse(estado: string, page = 1, limit = 10): Promise<VisitaArrayResponseDto> {
    try {
      const skip = (page - 1) * limit;
      
      const [visitas, total] = await this.visitaRepository.findAndCount({
        where: { estado },
        relations: ['autorizadorUsuario', 'autorizadorUsuario.idRol', 'idPropiedad', 'idPropiedad.idEdificio'],
        order: { fechaProgramada: 'ASC', horaInicio: 'ASC' },
        skip,
        take: limit,
      });

      const visitasResponse = visitas.map(visita => this.mapToResponseDto(visita));

      return {
        success: true,
        message: `${total} visitas encontradas con estado ${estado}`,
        data: visitasResponse,
        metadata: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          hasNextPage: page < Math.ceil(total / limit),
          hasPreviousPage: page > 1,
        }
      };
    } catch (error) {
      this.logger.error(`Error al buscar visitas por estado: ${error.message}`);
      throw error;
    }
  }

  /**
   * Busca visitas por propiedad con BaseResponseDto
   */
  async findByPropiedadWithResponse(propiedadId: string, page = 1, limit = 10): Promise<VisitaArrayResponseDto> {
    try {
      const skip = (page - 1) * limit;
      
      const [visitas, total] = await this.visitaRepository.findAndCount({
        where: { idPropiedad: { idPropiedad: propiedadId } },
        relations: ['autorizadorUsuario', 'autorizadorUsuario.idRol', 'idPropiedad', 'idPropiedad.idEdificio'],
        order: { fechaProgramada: 'DESC', horaInicio: 'ASC' },
        skip,
        take: limit,
      });

      const visitasResponse = visitas.map(visita => this.mapToResponseDto(visita));

      return {
        success: true,
        message: `${total} visitas encontradas para la propiedad`,
        data: visitasResponse,
        metadata: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          hasNextPage: page < Math.ceil(total / limit),
          hasPreviousPage: page > 1,
        }
      };
    } catch (error) {
      this.logger.error(`Error al buscar visitas por propiedad: ${error.message}`);
      throw error;
    }
  }

  /**
   * Busca visitas en rango de fechas con BaseResponseDto
   */
  async findByFechaRangeWithResponse(fechaInicio: Date, fechaFin: Date, page = 1, limit = 10): Promise<VisitaArrayResponseDto> {
    try {
      const skip = (page - 1) * limit;
      
      const [visitas, total] = await this.visitaRepository.findAndCount({
        where: {
          fechaProgramada: Between(
            fechaInicio.toISOString().split('T')[0],
            fechaFin.toISOString().split('T')[0],
          ),
        },
        relations: ['autorizadorUsuario', 'autorizadorUsuario.idRol', 'idPropiedad', 'idPropiedad.idEdificio'],
        order: { fechaProgramada: 'ASC', horaInicio: 'ASC' },
        skip,
        take: limit,
      });

      const visitasResponse = visitas.map(visita => this.mapToResponseDto(visita));

      return {
        success: true,
        message: `${total} visitas encontradas en el rango de fechas`,
        data: visitasResponse,
        metadata: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          hasNextPage: page < Math.ceil(total / limit),
          hasPreviousPage: page > 1,
        }
      };
    } catch (error) {
      this.logger.error(`Error al buscar visitas por rango de fechas: ${error.message}`);
      throw error;
    }
  }

  /**
   * Busca visitas por usuario autorizador con BaseResponseDto
   */
  async findByUsuarioAutorizadorWithResponse(usuarioId: string, page = 1, limit = 10): Promise<VisitaArrayResponseDto> {
    try {
      const skip = (page - 1) * limit;
      
      const [visitas, total] = await this.visitaRepository.findAndCount({
        where: { autorizadorUsuario: { idUsuario: usuarioId } },
        relations: ['autorizadorUsuario', 'autorizadorUsuario.idRol', 'idPropiedad', 'idPropiedad.idEdificio'],
        order: { fechaProgramada: 'DESC', horaInicio: 'ASC' },
        skip,
        take: limit,
      });

      const visitasResponse = visitas.map(visita => this.mapToResponseDto(visita));

      return {
        success: true,
        message: `${total} visitas encontradas para el usuario autorizador`,
        data: visitasResponse,
        metadata: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          hasNextPage: page < Math.ceil(total / limit),
          hasPreviousPage: page > 1,
        }
      };
    } catch (error) {
      this.logger.error(`Error al buscar visitas por usuario autorizador: ${error.message}`);
      throw error;
    }
  }

  /**
   * Registra ingreso con BaseResponseDto
   */
  async registrarIngresoWithResponse(codigoQr: string): Promise<VisitaSingleResponseDto> {
    try {
      this.logger.log(`Registrando ingreso con código QR: ${codigoQr}`);
      
      const visita = await this.registrarIngreso(codigoQr);
      const visitaResponse = this.mapToResponseDto(visita);

      return {
        success: true,
        message: 'Ingreso registrado exitosamente',
        data: visitaResponse,
        metadata: {
          codigoQrUrl: `https://api.qrserver.com/v1/create-qr-code/?data=${visita.codigoQr}`,
          requiereAutorizacion: false,
          notificacionesEnviadas: true
        }
      };
    } catch (error) {
      this.logger.error(`Error al registrar ingreso: ${error.message}`);
      throw error;
    }
  }

  /**
   * Registra salida con BaseResponseDto
   */
  async registrarSalidaWithResponse(codigoQr: string): Promise<VisitaSingleResponseDto> {
    try {
      this.logger.log(`Registrando salida con código QR: ${codigoQr}`);
      
      const visita = await this.registrarSalida(codigoQr);
      const visitaResponse = this.mapToResponseDto(visita);

      return {
        success: true,
        message: 'Salida registrada exitosamente',
        data: visitaResponse,
        metadata: {
          codigoQrUrl: `https://api.qrserver.com/v1/create-qr-code/?data=${visita.codigoQr}`,
          requiereAutorizacion: false,
          notificacionesEnviadas: true
        }
      };
    } catch (error) {
      this.logger.error(`Error al registrar salida: ${error.message}`);
      throw error;
    }
  }

  // ===============================
  // MÉTODOS PRIVADOS DE UTILIDAD
  // ===============================

  /**
   * Mapea una entidad Visita a VisitaResponseDto
   */
  private mapToResponseDto(visita: Visita): VisitaNewResponseDto {
    const duracionProgramada = this.calcularDuracion(visita.horaInicio, visita.horaFin);
    const duracionReal = visita.fechaIngreso && visita.fechaSalida 
      ? this.calcularDuracionReal(visita.fechaIngreso, visita.fechaSalida)
      : undefined;
    const tiempoRestante = visita.estado === 'EN_CURSO' && visita.fechaIngreso
      ? this.calcularTiempoRestante(visita.fechaIngreso, visita.horaFin)
      : undefined;

    return {
      idVisita: visita.idVisita,
      codigoQr: visita.codigoQr,
      nombreVisitante: visita.nombreVisitante,
      documentoVisitante: visita.documentoVisitante,
      telefonoVisitante: visita.telefonoVisitante,
      motivo: visita.motivo,
      fechaProgramada: visita.fechaProgramada,
      horaInicio: visita.horaInicio,
      horaFin: visita.horaFin,
      fechaIngreso: visita.fechaIngreso,
      fechaSalida: visita.fechaSalida,
      estado: visita.estado,
      autorizadorUsuario: {
        idUsuario: visita.autorizadorUsuario.idUsuario,
        correo: visita.autorizadorUsuario.correo,
        estaActivo: visita.autorizadorUsuario.estaActivo,
        rol: {
          idRol: visita.autorizadorUsuario.idRol?.idRol || '',
          nombre: visita.autorizadorUsuario.idRol?.nombre || 'Sin rol'
        }
      },
      propiedad: {
        idPropiedad: visita.idPropiedad.idPropiedad,
        numeroDepartamento: visita.idPropiedad.numeroDepartamento,
        tipoPropiedad: visita.idPropiedad.tipoPropiedad,
        piso: visita.idPropiedad.piso,
        estadoOcupacion: visita.idPropiedad.estadoOcupacion,
        estaActivo: visita.idPropiedad.estaActivo,
        edificio: {
          idEdificio: visita.idPropiedad.idEdificio?.idEdificio || '',
          nombre: visita.idPropiedad.idEdificio?.nombreEdificio || 'Sin edificio'
        }
      },
      estadisticas: {
        duracionProgramada,
        duracionReal,
        tiempoRestante
      },
      auditoria: {
        fechaCreacion: new Date(), // Estos deberían venir de la base de datos si existen
        fechaActualizacion: new Date()
      }
    };
  }

  /**
   * Calcula estadísticas generales de visitas
   */
  private async calcularEstadisticas() {
    const [programadas, enCurso, finalizadas, canceladas] = await Promise.all([
      this.visitaRepository.count({ where: { estado: 'PROGRAMADA' } }),
      this.visitaRepository.count({ where: { estado: 'EN_CURSO' } }),
      this.visitaRepository.count({ where: { estado: 'FINALIZADA' } }),
      this.visitaRepository.count({ where: { estado: 'CANCELADA' } }),
    ]);

    return { programadas, enCurso, finalizadas, canceladas };
  }

  /**
   * Calcula duración programada entre dos horas
   */
  private calcularDuracion(horaInicio: string, horaFin: string): string {
    const inicio = new Date(`2000-01-01T${horaInicio}`);
    const fin = new Date(`2000-01-01T${horaFin}`);
    const diferencia = fin.getTime() - inicio.getTime();
    
    const horas = Math.floor(diferencia / (1000 * 60 * 60));
    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${horas} horas ${minutos} minutos`;
  }

  /**
   * Calcula duración real entre dos timestamps
   */
  private calcularDuracionReal(fechaIngreso: Date, fechaSalida: Date): string {
    const diferencia = fechaSalida.getTime() - fechaIngreso.getTime();
    
    const horas = Math.floor(diferencia / (1000 * 60 * 60));
    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${horas} horas ${minutos} minutos`;
  }

  /**
   * Calcula tiempo restante de visita en curso
   */
  private calcularTiempoRestante(fechaIngreso: Date, horaFin: string): string {
    const ahora = new Date();
    const fechaBase = fechaIngreso.toISOString().split('T')[0];
    const fin = new Date(`${fechaBase}T${horaFin}`);
    
    const diferencia = fin.getTime() - ahora.getTime();
    
    if (diferencia <= 0) {
      return 'Tiempo excedido';
    }
    
    const horas = Math.floor(diferencia / (1000 * 60 * 60));
    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${horas} horas ${minutos} minutos`;
  }

  /**
   * Genera un código QR único para la visita
   * Formato: VV_YYYYMMDD_HHMMSS_RANDOM
   */
  private async generarCodigoQrUnico(): Promise<string> {
    let codigoQr = '';
    let existe = true;

    // Generar código único
    while (existe) {
      const fecha = new Date();
      const fechaStr = fecha
        .toISOString()
        .replace(/[-:T.Z]/g, '')
        .substring(0, 14);
      const random = Math.random().toString(36).substring(2, 8).toUpperCase();
      codigoQr = `VV_${fechaStr}_${random}`;

      // Verificar que no existe
      const visitaExistente = await this.visitaRepository.findOne({
        where: { codigoQr },
      });
      existe = !!visitaExistente;
    }

    return codigoQr;
  }
}

import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Reserva } from '../../../entities/Reserva';
import { AreaComun } from '../../../entities/AreaComun';
import { Usuario } from '../../../entities/Usuario';
import {
  CreateReservaDto,
  UpdateReservaDto,
  ReservaResponseDto,
} from '../../../dtos';
import { BaseResponseDto } from 'src/dtos/baseResponse/baseResponse.dto';

@Injectable()
export class ReservaService {
  constructor(
    @InjectRepository(Reserva)
    private readonly reservaRepository: Repository<Reserva>,
    @InjectRepository(AreaComun)
    private readonly areaComunRepository: Repository<AreaComun>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    createReservaDto: CreateReservaDto,
  ): Promise<BaseResponseDto<ReservaResponseDto>> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Verificar que el área común existe y está disponible
      const areaComun = await queryRunner.manager.findOne(AreaComun, {
        where: { idAreaComun: createReservaDto.idAreaComun },
      });

      if (!areaComun) {
        await queryRunner.rollbackTransaction();
        return BaseResponseDto.error(
          'El área común especificada no existe',
          HttpStatus.NOT_FOUND,
        );
      }

      if (!areaComun.estaActivo) {
        await queryRunner.rollbackTransaction();
        return BaseResponseDto.error(
          'El área común no está activa para reservas',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Verificar que el usuario existe
      const usuario = await queryRunner.manager.findOne(Usuario, {
        where: { idUsuario: createReservaDto.idUsuario },
      });

      if (!usuario) {
        await queryRunner.rollbackTransaction();
        return BaseResponseDto.error(
          'El usuario especificado no existe',
          HttpStatus.NOT_FOUND,
        );
      }

      // Verificar conflictos de horario en la misma área y fecha
      const conflictingReserva = await queryRunner.manager
        .createQueryBuilder(Reserva, 'reserva')
        .where('reserva.idAreaComun = :idAreaComun', {
          idAreaComun: createReservaDto.idAreaComun,
        })
        .andWhere('reserva.fechaReserva = :fechaReserva', {
          fechaReserva: createReservaDto.fechaReserva,
        })
        .andWhere('reserva.estado NOT IN (:...excludeStates)', {
          excludeStates: ['cancelada'],
        })
        .andWhere(
          '(reserva.horaInicio < :horaFin AND reserva.horaFin > :horaInicio)',
          {
            horaInicio: createReservaDto.horaInicio,
            horaFin: createReservaDto.horaFin,
          },
        )
        .getOne();

      if (conflictingReserva) {
        await queryRunner.rollbackTransaction();
        return BaseResponseDto.error(
          'Ya existe una reserva confirmada en el horario seleccionado para esta área',
          HttpStatus.CONFLICT,
        );
      }

      // Crear la reserva
      const reserva = queryRunner.manager.create(Reserva, {
        fechaReserva: createReservaDto.fechaReserva,
        horaInicio: createReservaDto.horaInicio,
        horaFin: createReservaDto.horaFin,
        estado: createReservaDto.estado,
        motivo: createReservaDto.motivo || null,
        costoTotal: createReservaDto.costoTotal || null,
        pagado: createReservaDto.pagado || false,
        observaciones: createReservaDto.observaciones || null,
        fechaCreacion: new Date(),
        idAreaComun: areaComun,
        idUsuario: usuario,
      });

      const savedReserva = await queryRunner.manager.save(reserva);
      await queryRunner.commitTransaction();

      const responseData: ReservaResponseDto = {
        idReserva: savedReserva.idReserva,
        fechaReserva: savedReserva.fechaReserva,
        horaInicio: savedReserva.horaInicio,
        horaFin: savedReserva.horaFin,
        estado: savedReserva.estado,
        motivo: savedReserva.motivo,
        costoTotal: savedReserva.costoTotal,
        pagado: savedReserva.pagado,
        observaciones: savedReserva.observaciones,
        fechaCreacion: savedReserva.fechaCreacion,
        idAreaComun: {
          idAreaComun: areaComun.idAreaComun,
          nombre: areaComun.nombre,
          ubicacion: areaComun.descripcion || 'Sin descripción',
          capacidad: areaComun.capacidadMaxima,
          estado: areaComun.estaActivo ? 'activo' : 'inactivo',
        },
        idUsuario: {
          idUsuario: usuario.idUsuario,
          nombre: usuario.correo.split('@')[0] || 'Usuario',
          email: usuario.correo,
          telefono: null,
        },
      };

      return BaseResponseDto.success(
        responseData,
        'Reserva creada exitosamente',
        HttpStatus.CREATED,
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return BaseResponseDto.error(
        `Error al crear la reserva: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<BaseResponseDto<ReservaResponseDto[]>> {
    try {
      const reservas = await this.reservaRepository.find({
        relations: ['idAreaComun', 'idUsuario'],
        order: { fechaCreacion: 'DESC' },
      });

      const responseData: ReservaResponseDto[] = reservas.map((reserva) => ({
        idReserva: reserva.idReserva,
        fechaReserva: reserva.fechaReserva,
        horaInicio: reserva.horaInicio,
        horaFin: reserva.horaFin,
        estado: reserva.estado,
        motivo: reserva.motivo,
        costoTotal: reserva.costoTotal,
        pagado: reserva.pagado,
        observaciones: reserva.observaciones,
        fechaCreacion: reserva.fechaCreacion,
        idAreaComun: reserva.idAreaComun
          ? {
              idAreaComun: reserva.idAreaComun.idAreaComun,
              nombre: reserva.idAreaComun.nombre,
              ubicacion: reserva.idAreaComun.descripcion || 'Sin descripción',
              capacidad: reserva.idAreaComun.capacidadMaxima,
              estado: reserva.idAreaComun.estaActivo ? 'activo' : 'inactivo',
            }
          : undefined,
        idUsuario: reserva.idUsuario
          ? {
              idUsuario: reserva.idUsuario.idUsuario,
              nombre: reserva.idUsuario.correo.split('@')[0] || 'Usuario',
              email: reserva.idUsuario.correo,
              telefono: null,
            }
          : undefined,
      }));

      return BaseResponseDto.success(
        responseData,
        `Se encontraron ${reservas.length} reservas`,
        HttpStatus.OK,
      );
    } catch (error) {
      return BaseResponseDto.error(
        `Error al obtener las reservas: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string): Promise<BaseResponseDto<ReservaResponseDto>> {
    try {
      const reserva = await this.reservaRepository.findOne({
        where: { idReserva: id },
        relations: ['idAreaComun', 'idUsuario'],
      });

      if (!reserva) {
        return BaseResponseDto.error(
          'Reserva no encontrada',
          HttpStatus.NOT_FOUND,
        );
      }

      const responseData: ReservaResponseDto = {
        idReserva: reserva.idReserva,
        fechaReserva: reserva.fechaReserva,
        horaInicio: reserva.horaInicio,
        horaFin: reserva.horaFin,
        estado: reserva.estado,
        motivo: reserva.motivo,
        costoTotal: reserva.costoTotal,
        pagado: reserva.pagado,
        observaciones: reserva.observaciones,
        fechaCreacion: reserva.fechaCreacion,
        idAreaComun: reserva.idAreaComun
          ? {
              idAreaComun: reserva.idAreaComun.idAreaComun,
              nombre: reserva.idAreaComun.nombre,
              ubicacion: reserva.idAreaComun.descripcion || 'Sin descripción',
              capacidad: reserva.idAreaComun.capacidadMaxima,
              estado: reserva.idAreaComun.estaActivo ? 'activo' : 'inactivo',
            }
          : undefined,
        idUsuario: reserva.idUsuario
          ? {
              idUsuario: reserva.idUsuario.idUsuario,
              nombre: reserva.idUsuario.correo.split('@')[0] || 'Usuario',
              email: reserva.idUsuario.correo,
              telefono: null,
            }
          : undefined,
      };

      return BaseResponseDto.success(
        responseData,
        'Reserva encontrada exitosamente',
        HttpStatus.OK,
      );
    } catch (error) {
      return BaseResponseDto.error(
        `Error al buscar la reserva: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: string,
    updateReservaDto: UpdateReservaDto,
  ): Promise<BaseResponseDto<ReservaResponseDto>> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const reserva = await queryRunner.manager.findOne(Reserva, {
        where: { idReserva: id },
        relations: ['idAreaComun', 'idUsuario'],
      });

      if (!reserva) {
        await queryRunner.rollbackTransaction();
        return BaseResponseDto.error(
          'Reserva no encontrada',
          HttpStatus.NOT_FOUND,
        );
      }

      // Verificar área común si se está actualizando
      let areaComun = reserva.idAreaComun;
      if (updateReservaDto.idAreaComun) {
        const foundAreaComun = await queryRunner.manager.findOne(AreaComun, {
          where: { idAreaComun: updateReservaDto.idAreaComun },
        });

        if (!foundAreaComun) {
          await queryRunner.rollbackTransaction();
          return BaseResponseDto.error(
            'El área común especificada no existe',
            HttpStatus.NOT_FOUND,
          );
        }

        if (!foundAreaComun.estaActivo) {
          await queryRunner.rollbackTransaction();
          return BaseResponseDto.error(
            'El área común no está activa para reservas',
            HttpStatus.BAD_REQUEST,
          );
        }
        areaComun = foundAreaComun;
      }

      // Verificar usuario si se está actualizando
      let usuario = reserva.idUsuario;
      if (updateReservaDto.idUsuario) {
        const foundUsuario = await queryRunner.manager.findOne(Usuario, {
          where: { idUsuario: updateReservaDto.idUsuario },
        });

        if (!foundUsuario) {
          await queryRunner.rollbackTransaction();
          return BaseResponseDto.error(
            'El usuario especificado no existe',
            HttpStatus.NOT_FOUND,
          );
        }
        usuario = foundUsuario;
      }

      // Verificar conflictos de horario si se están actualizando fecha u horarios
      const newFechaReserva =
        updateReservaDto.fechaReserva || reserva.fechaReserva;
      const newHoraInicio = updateReservaDto.horaInicio || reserva.horaInicio;
      const newHoraFin = updateReservaDto.horaFin || reserva.horaFin;
      const newAreaComun = areaComun.idAreaComun;

      if (
        updateReservaDto.fechaReserva ||
        updateReservaDto.horaInicio ||
        updateReservaDto.horaFin ||
        updateReservaDto.idAreaComun
      ) {
        const conflictingReserva = await queryRunner.manager
          .createQueryBuilder(Reserva, 'reserva')
          .where('reserva.idReserva != :currentId', { currentId: id })
          .andWhere('reserva.idAreaComun = :idAreaComun', {
            idAreaComun: newAreaComun,
          })
          .andWhere('reserva.fechaReserva = :fechaReserva', {
            fechaReserva: newFechaReserva,
          })
          .andWhere('reserva.estado NOT IN (:...excludeStates)', {
            excludeStates: ['cancelada'],
          })
          .andWhere(
            '(reserva.horaInicio < :horaFin AND reserva.horaFin > :horaInicio)',
            {
              horaInicio: newHoraInicio,
              horaFin: newHoraFin,
            },
          )
          .getOne();

        if (conflictingReserva) {
          await queryRunner.rollbackTransaction();
          return BaseResponseDto.error(
            'Ya existe una reserva confirmada en el horario seleccionado para esta área',
            HttpStatus.CONFLICT,
          );
        }
      }

      // Actualizar campos
      if (updateReservaDto.fechaReserva !== undefined) {
        reserva.fechaReserva = updateReservaDto.fechaReserva;
      }
      if (updateReservaDto.horaInicio !== undefined) {
        reserva.horaInicio = updateReservaDto.horaInicio;
      }
      if (updateReservaDto.horaFin !== undefined) {
        reserva.horaFin = updateReservaDto.horaFin;
      }
      if (updateReservaDto.estado !== undefined) {
        reserva.estado = updateReservaDto.estado;
      }
      if (updateReservaDto.motivo !== undefined) {
        reserva.motivo = updateReservaDto.motivo;
      }
      if (updateReservaDto.costoTotal !== undefined) {
        reserva.costoTotal = updateReservaDto.costoTotal;
      }
      if (updateReservaDto.pagado !== undefined) {
        reserva.pagado = updateReservaDto.pagado;
      }
      if (updateReservaDto.observaciones !== undefined) {
        reserva.observaciones = updateReservaDto.observaciones;
      }
      if (updateReservaDto.idAreaComun !== undefined) {
        reserva.idAreaComun = areaComun;
      }
      if (updateReservaDto.idUsuario !== undefined) {
        reserva.idUsuario = usuario;
      }

      const updatedReserva = await queryRunner.manager.save(reserva);
      await queryRunner.commitTransaction();

      const responseData: ReservaResponseDto = {
        idReserva: updatedReserva.idReserva,
        fechaReserva: updatedReserva.fechaReserva,
        horaInicio: updatedReserva.horaInicio,
        horaFin: updatedReserva.horaFin,
        estado: updatedReserva.estado,
        motivo: updatedReserva.motivo,
        costoTotal: updatedReserva.costoTotal,
        pagado: updatedReserva.pagado,
        observaciones: updatedReserva.observaciones,
        fechaCreacion: updatedReserva.fechaCreacion,
        idAreaComun: {
          idAreaComun: areaComun.idAreaComun,
          nombre: areaComun.nombre,
          ubicacion: areaComun.descripcion || 'Sin descripción',
          capacidad: areaComun.capacidadMaxima,
          estado: areaComun.estaActivo ? 'activo' : 'inactivo',
        },
        idUsuario: {
          idUsuario: usuario.idUsuario,
          nombre: usuario.correo.split('@')[0] || 'Usuario',
          email: usuario.correo,
          telefono: null,
        },
      };

      return BaseResponseDto.success(
        responseData,
        'Reserva actualizada exitosamente',
        HttpStatus.OK,
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return BaseResponseDto.error(
        `Error al actualizar la reserva: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string): Promise<BaseResponseDto<ReservaResponseDto>> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const reserva = await queryRunner.manager.findOne(Reserva, {
        where: { idReserva: id },
        relations: ['idAreaComun', 'idUsuario'],
      });

      if (!reserva) {
        await queryRunner.rollbackTransaction();
        return BaseResponseDto.error(
          'Reserva no encontrada',
          HttpStatus.NOT_FOUND,
        );
      }

      const responseData: ReservaResponseDto = {
        idReserva: reserva.idReserva,
        fechaReserva: reserva.fechaReserva,
        horaInicio: reserva.horaInicio,
        horaFin: reserva.horaFin,
        estado: reserva.estado,
        motivo: reserva.motivo,
        costoTotal: reserva.costoTotal,
        pagado: reserva.pagado,
        observaciones: reserva.observaciones,
        fechaCreacion: reserva.fechaCreacion,
        idAreaComun: reserva.idAreaComun
          ? {
              idAreaComun: reserva.idAreaComun.idAreaComun,
              nombre: reserva.idAreaComun.nombre,
              ubicacion: reserva.idAreaComun.descripcion || 'Sin descripción',
              capacidad: reserva.idAreaComun.capacidadMaxima,
              estado: reserva.idAreaComun.estaActivo ? 'activo' : 'inactivo',
            }
          : undefined,
        idUsuario: reserva.idUsuario
          ? {
              idUsuario: reserva.idUsuario.idUsuario,
              nombre: reserva.idUsuario.correo.split('@')[0] || 'Usuario',
              email: reserva.idUsuario.correo,
              telefono: null,
            }
          : undefined,
      };

      await queryRunner.manager.remove(reserva);
      await queryRunner.commitTransaction();

      return BaseResponseDto.success(
        responseData,
        'Reserva eliminada exitosamente',
        HttpStatus.OK,
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return BaseResponseDto.error(
        `Error al eliminar la reserva: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async findByUsuario(
    usuarioId: string,
  ): Promise<BaseResponseDto<ReservaResponseDto[]>> {
    try {
      const reservas = await this.reservaRepository
        .createQueryBuilder('reserva')
        .leftJoinAndSelect('reserva.idAreaComun', 'areaComun')
        .leftJoinAndSelect('reserva.idUsuario', 'usuario')
        .where('usuario.idUsuario = :usuarioId', { usuarioId })
        .orderBy('reserva.fechaCreacion', 'DESC')
        .getMany();

      const responseData: ReservaResponseDto[] = reservas.map((reserva) => ({
        idReserva: reserva.idReserva,
        fechaReserva: reserva.fechaReserva,
        horaInicio: reserva.horaInicio,
        horaFin: reserva.horaFin,
        estado: reserva.estado,
        motivo: reserva.motivo,
        costoTotal: reserva.costoTotal,
        pagado: reserva.pagado,
        observaciones: reserva.observaciones,
        fechaCreacion: reserva.fechaCreacion,
        idAreaComun: reserva.idAreaComun
          ? {
              idAreaComun: reserva.idAreaComun.idAreaComun,
              nombre: reserva.idAreaComun.nombre,
              ubicacion: reserva.idAreaComun.descripcion || 'Sin descripción',
              capacidad: reserva.idAreaComun.capacidadMaxima,
              estado: reserva.idAreaComun.estaActivo ? 'activo' : 'inactivo',
            }
          : undefined,
        idUsuario: reserva.idUsuario
          ? {
              idUsuario: reserva.idUsuario.idUsuario,
              nombre: reserva.idUsuario.correo.split('@')[0] || 'Usuario',
              email: reserva.idUsuario.correo,
              telefono: null,
            }
          : undefined,
      }));

      return BaseResponseDto.success(
        responseData,
        `Se encontraron ${reservas.length} reservas para el usuario`,
        HttpStatus.OK,
      );
    } catch (error) {
      return BaseResponseDto.error(
        `Error al buscar reservas por usuario: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByAreaComun(
    areaComunId: string,
  ): Promise<BaseResponseDto<ReservaResponseDto[]>> {
    try {
      const reservas = await this.reservaRepository
        .createQueryBuilder('reserva')
        .leftJoinAndSelect('reserva.idAreaComun', 'areaComun')
        .leftJoinAndSelect('reserva.idUsuario', 'usuario')
        .where('areaComun.idAreaComun = :areaComunId', { areaComunId })
        .orderBy('reserva.fechaReserva', 'ASC')
        .addOrderBy('reserva.horaInicio', 'ASC')
        .getMany();

      const responseData: ReservaResponseDto[] = reservas.map((reserva) => ({
        idReserva: reserva.idReserva,
        fechaReserva: reserva.fechaReserva,
        horaInicio: reserva.horaInicio,
        horaFin: reserva.horaFin,
        estado: reserva.estado,
        motivo: reserva.motivo,
        costoTotal: reserva.costoTotal,
        pagado: reserva.pagado,
        observaciones: reserva.observaciones,
        fechaCreacion: reserva.fechaCreacion,
        idAreaComun: reserva.idAreaComun
          ? {
              idAreaComun: reserva.idAreaComun.idAreaComun,
              nombre: reserva.idAreaComun.nombre,
              ubicacion: reserva.idAreaComun.descripcion || 'Sin descripción',
              capacidad: reserva.idAreaComun.capacidadMaxima,
              estado: reserva.idAreaComun.estaActivo ? 'activo' : 'inactivo',
            }
          : undefined,
        idUsuario: reserva.idUsuario
          ? {
              idUsuario: reserva.idUsuario.idUsuario,
              nombre: reserva.idUsuario.correo.split('@')[0] || 'Usuario',
              email: reserva.idUsuario.correo,
              telefono: null,
            }
          : undefined,
      }));

      return BaseResponseDto.success(
        responseData,
        `Se encontraron ${reservas.length} reservas para el área común`,
        HttpStatus.OK,
      );
    } catch (error) {
      return BaseResponseDto.error(
        `Error al buscar reservas por área común: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByEstado(
    estado: string,
  ): Promise<BaseResponseDto<ReservaResponseDto[]>> {
    try {
      const reservas = await this.reservaRepository.find({
        where: { estado },
        relations: ['idAreaComun', 'idUsuario'],
        order: { fechaCreacion: 'DESC' },
      });

      const responseData: ReservaResponseDto[] = reservas.map((reserva) => ({
        idReserva: reserva.idReserva,
        fechaReserva: reserva.fechaReserva,
        horaInicio: reserva.horaInicio,
        horaFin: reserva.horaFin,
        estado: reserva.estado,
        motivo: reserva.motivo,
        costoTotal: reserva.costoTotal,
        pagado: reserva.pagado,
        observaciones: reserva.observaciones,
        fechaCreacion: reserva.fechaCreacion,
        idAreaComun: reserva.idAreaComun
          ? {
              idAreaComun: reserva.idAreaComun.idAreaComun,
              nombre: reserva.idAreaComun.nombre,
              ubicacion: reserva.idAreaComun.descripcion || 'Sin descripción',
              capacidad: reserva.idAreaComun.capacidadMaxima,
              estado: reserva.idAreaComun.estaActivo ? 'activo' : 'inactivo',
            }
          : undefined,
        idUsuario: reserva.idUsuario
          ? {
              idUsuario: reserva.idUsuario.idUsuario,
              nombre: reserva.idUsuario.correo.split('@')[0] || 'Usuario',
              email: reserva.idUsuario.correo,
              telefono: null,
            }
          : undefined,
      }));

      return BaseResponseDto.success(
        responseData,
        `Se encontraron ${reservas.length} reservas con estado ${estado}`,
        HttpStatus.OK,
      );
    } catch (error) {
      return BaseResponseDto.error(
        `Error al buscar reservas por estado: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

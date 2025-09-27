import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, QueryRunner } from 'typeorm';
import {
  CreateResidenciaDto,
  UpdateResidenciaDto,
  ResidenciaResponseDto,
} from 'src/dtos';
import { BaseResponseDto } from 'src/dtos/baseResponse/baseResponse.dto';
import { Residencia } from 'src/entities/Residencia';
import { Propiedad } from 'src/entities/Propiedad';
import { Propietario } from 'src/entities/Propietario';
import { Residente } from 'src/entities/Residente';

@Injectable()
export class ResidenciaService {
  private readonly logger = new Logger(ResidenciaService.name);

  constructor(
    @InjectRepository(Residencia)
    private readonly residenciaRepository: Repository<Residencia>,
    @InjectRepository(Propiedad)
    private readonly propiedadRepository: Repository<Propiedad>,
    @InjectRepository(Propietario)
    private readonly propietarioRepository: Repository<Propietario>,
    @InjectRepository(Residente)
    private readonly residenteRepository: Repository<Residente>,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    createResidenciaDto: CreateResidenciaDto,
  ): Promise<BaseResponseDto<ResidenciaResponseDto>> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      this.logger.log(
        `Creando nueva residencia para propiedad: ${createResidenciaDto.idPropiedad}`,
      );

      // Verificar que la propiedad existe
      const propiedad = await this.propiedadRepository.findOne({
        where: { idPropiedad: createResidenciaDto.idPropiedad },
      });
      if (!propiedad) {
        return BaseResponseDto.error('Propiedad no encontrada', 404);
      }

      // Verificar que el propietario existe
      const propietario = await this.propietarioRepository.findOne({
        where: { idPropietario: createResidenciaDto.idPropietario },
      });
      if (!propietario) {
        return BaseResponseDto.error('Propietario no encontrado', 404);
      }

      // Verificar que el residente existe
      const residente = await this.residenteRepository.findOne({
        where: { idResidente: createResidenciaDto.idResidente },
      });
      if (!residente) {
        return BaseResponseDto.error('Residente no encontrado', 404);
      }

      // Verificar si existe una residencia activa para la misma propiedad
      const residenciaExistente = await this.residenciaRepository.findOne({
        where: {
          idPropiedad: { idPropiedad: createResidenciaDto.idPropiedad },
          estado: 'activa',
        },
      });
      if (residenciaExistente) {
        return BaseResponseDto.error(
          'Ya existe una residencia activa para esta propiedad',
          409,
        );
      }

      // Crear nueva residencia
      const nuevaResidencia = this.residenciaRepository.create({
        fechaInicio: createResidenciaDto.fechaInicio,
        fechaFin: createResidenciaDto.fechaFin || null,
        montoAlquiler: createResidenciaDto.montoAlquiler?.toString() || null,
        deposito: createResidenciaDto.deposito?.toString() || null,
        tipoOcupacion: createResidenciaDto.tipoOcupacion,
        estado: createResidenciaDto.estado,
        contratoUrl: createResidenciaDto.contratoUrl || null,
        idPropiedad: propiedad,
        idPropietario: propietario,
        idResidente: residente,
      });

      const residenciaGuardada =
        await queryRunner.manager.save(nuevaResidencia);
      await queryRunner.commitTransaction();

      // Preparar respuesta
      const responseData: ResidenciaResponseDto = {
        idResidencia: residenciaGuardada.idResidencia,
        fechaInicio: residenciaGuardada.fechaInicio,
        fechaFin: residenciaGuardada.fechaFin,
        montoAlquiler: residenciaGuardada.montoAlquiler,
        deposito: residenciaGuardada.deposito,
        tipoOcupacion: residenciaGuardada.tipoOcupacion,
        estado: residenciaGuardada.estado,
        contratoUrl: residenciaGuardada.contratoUrl,
        propiedad: {
          idPropiedad: propiedad.idPropiedad,
          numeroPiso: propiedad.piso.toString(),
          numeroUnidad: propiedad.numeroDepartamento,
          area: propiedad.areaM2?.toString() || '0',
        },
        propietario: {
          idPropietario: propietario.idPropietario,
          nombres: propietario.nombre,
          apellidos: propietario.apellido,
        },
        residente: {
          idResidente: residente.idResidente,
          nombres: residente.nombre,
          apellidos: residente.apellido,
        },
      };

      this.logger.log(
        `Residencia creada exitosamente con ID: ${residenciaGuardada.idResidencia}`,
      );
      return BaseResponseDto.success(
        responseData,
        'Residencia creada exitosamente',
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(
        `Error al crear residencia: ${error.message}`,
        error.stack,
      );
      return BaseResponseDto.error(
        'Error interno del servidor al crear la residencia',
        500,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<BaseResponseDto<ResidenciaResponseDto[]>> {
    try {
      this.logger.log('Obteniendo todas las residencias');

      const residencias = await this.residenciaRepository.find({
        relations: ['idPropiedad', 'idPropietario', 'idResidente'],
        order: { fechaInicio: 'DESC' },
      });

      const responseData: ResidenciaResponseDto[] = residencias.map(
        (residencia) => ({
          idResidencia: residencia.idResidencia,
          fechaInicio: residencia.fechaInicio,
          fechaFin: residencia.fechaFin,
          montoAlquiler: residencia.montoAlquiler,
          deposito: residencia.deposito,
          tipoOcupacion: residencia.tipoOcupacion,
          estado: residencia.estado,
          contratoUrl: residencia.contratoUrl,
          propiedad: {
            idPropiedad: residencia.idPropiedad.idPropiedad,
            numeroPiso: residencia.idPropiedad.piso.toString(),
            numeroUnidad: residencia.idPropiedad.numeroDepartamento,
            area: residencia.idPropiedad.areaM2?.toString() || '0',
          },
          propietario: {
            idPropietario: residencia.idPropietario.idPropietario,
            nombres: residencia.idPropietario.nombre,
            apellidos: residencia.idPropietario.apellido,
          },
          residente: {
            idResidente: residencia.idResidente.idResidente,
            nombres: residencia.idResidente.nombre,
            apellidos: residencia.idResidente.apellido,
          },
        }),
      );

      this.logger.log(`Se encontraron ${residencias.length} residencias`);
      return BaseResponseDto.success(
        responseData,
        'Residencias obtenidas exitosamente',
      );
    } catch (error) {
      this.logger.error(
        `Error al obtener residencias: ${error.message}`,
        error.stack,
      );
      return BaseResponseDto.error(
        'Error interno del servidor al obtener las residencias',
        500,
      );
    }
  }

  async findOne(id: string): Promise<BaseResponseDto<ResidenciaResponseDto>> {
    try {
      this.logger.log(`Buscando residencia con ID: ${id}`);

      const residencia = await this.residenciaRepository.findOne({
        where: { idResidencia: id },
        relations: ['idPropiedad', 'idPropietario', 'idResidente'],
      });

      if (!residencia) {
        return BaseResponseDto.error('Residencia no encontrada', 404);
      }

      const responseData: ResidenciaResponseDto = {
        idResidencia: residencia.idResidencia,
        fechaInicio: residencia.fechaInicio,
        fechaFin: residencia.fechaFin,
        montoAlquiler: residencia.montoAlquiler,
        deposito: residencia.deposito,
        tipoOcupacion: residencia.tipoOcupacion,
        estado: residencia.estado,
        contratoUrl: residencia.contratoUrl,
        propiedad: {
          idPropiedad: residencia.idPropiedad.idPropiedad,
          numeroPiso: residencia.idPropiedad.piso.toString(),
          numeroUnidad: residencia.idPropiedad.numeroDepartamento,
          area: residencia.idPropiedad.areaM2?.toString() || '0',
        },
        propietario: {
          idPropietario: residencia.idPropietario.idPropietario,
          nombres: residencia.idPropietario.nombre,
          apellidos: residencia.idPropietario.apellido,
        },
        residente: {
          idResidente: residencia.idResidente.idResidente,
          nombres: residencia.idResidente.nombre,
          apellidos: residencia.idResidente.apellido,
        },
      };

      this.logger.log(`Residencia encontrada: ${id}`);
      return BaseResponseDto.success(
        responseData,
        'Residencia encontrada exitosamente',
      );
    } catch (error) {
      this.logger.error(
        `Error al buscar residencia ${id}: ${error.message}`,
        error.stack,
      );
      return BaseResponseDto.error(
        'Error interno del servidor al buscar la residencia',
        500,
      );
    }
  }

  async update(
    id: string,
    updateResidenciaDto: UpdateResidenciaDto,
  ): Promise<BaseResponseDto<ResidenciaResponseDto>> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      this.logger.log(`Actualizando residencia con ID: ${id}`);

      // Verificar que la residencia existe
      const residenciaExistente = await this.residenciaRepository.findOne({
        where: { idResidencia: id },
        relations: ['idPropiedad', 'idPropietario', 'idResidente'],
      });

      if (!residenciaExistente) {
        return BaseResponseDto.error('Residencia no encontrada', 404);
      }

      // Validar relaciones si se proporcionan nuevas
      if (updateResidenciaDto.idPropiedad) {
        const propiedad = await this.propiedadRepository.findOne({
          where: { idPropiedad: updateResidenciaDto.idPropiedad },
        });
        if (!propiedad) {
          return BaseResponseDto.error('Propiedad no encontrada', 404);
        }

        // Verificar conflicto de propiedad activa (solo si se cambia la propiedad)
        if (
          updateResidenciaDto.idPropiedad !==
          residenciaExistente.idPropiedad.idPropiedad
        ) {
          const residenciaActiva = await this.residenciaRepository.findOne({
            where: {
              idPropiedad: { idPropiedad: updateResidenciaDto.idPropiedad },
              estado: 'activa',
            },
          });
          if (residenciaActiva && residenciaActiva.idResidencia !== id) {
            return BaseResponseDto.error(
              'Ya existe una residencia activa para esta propiedad',
              409,
            );
          }
        }
        residenciaExistente.idPropiedad = propiedad;
      }

      if (updateResidenciaDto.idPropietario) {
        const propietario = await this.propietarioRepository.findOne({
          where: { idPropietario: updateResidenciaDto.idPropietario },
        });
        if (!propietario) {
          return BaseResponseDto.error('Propietario no encontrado', 404);
        }
        residenciaExistente.idPropietario = propietario;
      }

      if (updateResidenciaDto.idResidente) {
        const residente = await this.residenteRepository.findOne({
          where: { idResidente: updateResidenciaDto.idResidente },
        });
        if (!residente) {
          return BaseResponseDto.error('Residente no encontrado', 404);
        }
        residenciaExistente.idResidente = residente;
      }

      // Actualizar otros campos
      if (updateResidenciaDto.fechaInicio !== undefined) {
        residenciaExistente.fechaInicio = updateResidenciaDto.fechaInicio;
      }
      if (updateResidenciaDto.fechaFin !== undefined) {
        residenciaExistente.fechaFin = updateResidenciaDto.fechaFin || null;
      }
      if (updateResidenciaDto.montoAlquiler !== undefined) {
        residenciaExistente.montoAlquiler =
          updateResidenciaDto.montoAlquiler?.toString() || null;
      }
      if (updateResidenciaDto.deposito !== undefined) {
        residenciaExistente.deposito =
          updateResidenciaDto.deposito?.toString() || null;
      }
      if (updateResidenciaDto.tipoOcupacion !== undefined) {
        residenciaExistente.tipoOcupacion = updateResidenciaDto.tipoOcupacion;
      }
      if (updateResidenciaDto.estado !== undefined) {
        residenciaExistente.estado = updateResidenciaDto.estado;
      }
      if (updateResidenciaDto.contratoUrl !== undefined) {
        residenciaExistente.contratoUrl =
          updateResidenciaDto.contratoUrl || null;
      }

      const residenciaActualizada =
        await queryRunner.manager.save(residenciaExistente);
      await queryRunner.commitTransaction();

      // Preparar respuesta
      const responseData: ResidenciaResponseDto = {
        idResidencia: residenciaActualizada.idResidencia,
        fechaInicio: residenciaActualizada.fechaInicio,
        fechaFin: residenciaActualizada.fechaFin,
        montoAlquiler: residenciaActualizada.montoAlquiler,
        deposito: residenciaActualizada.deposito,
        tipoOcupacion: residenciaActualizada.tipoOcupacion,
        estado: residenciaActualizada.estado,
        contratoUrl: residenciaActualizada.contratoUrl,
        propiedad: {
          idPropiedad: residenciaActualizada.idPropiedad.idPropiedad,
          numeroPiso: residenciaActualizada.idPropiedad.piso.toString(),
          numeroUnidad: residenciaActualizada.idPropiedad.numeroDepartamento,
          area: residenciaActualizada.idPropiedad.areaM2?.toString() || '0',
        },
        propietario: {
          idPropietario: residenciaActualizada.idPropietario.idPropietario,
          nombres: residenciaActualizada.idPropietario.nombre,
          apellidos: residenciaActualizada.idPropietario.apellido,
        },
        residente: {
          idResidente: residenciaActualizada.idResidente.idResidente,
          nombres: residenciaActualizada.idResidente.nombre,
          apellidos: residenciaActualizada.idResidente.apellido,
        },
      };

      this.logger.log(`Residencia actualizada exitosamente: ${id}`);
      return BaseResponseDto.success(
        responseData,
        'Residencia actualizada exitosamente',
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(
        `Error al actualizar residencia ${id}: ${error.message}`,
        error.stack,
      );
      return BaseResponseDto.error(
        'Error interno del servidor al actualizar la residencia',
        500,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string): Promise<BaseResponseDto<ResidenciaResponseDto>> {
    try {
      this.logger.log(`Eliminando residencia con ID: ${id}`);

      const residencia = await this.residenciaRepository.findOne({
        where: { idResidencia: id },
        relations: ['idPropiedad', 'idPropietario', 'idResidente'],
      });

      if (!residencia) {
        return BaseResponseDto.error('Residencia no encontrada', 404);
      }

      // Preparar datos de respuesta antes de eliminar
      const responseData: ResidenciaResponseDto = {
        idResidencia: residencia.idResidencia,
        fechaInicio: residencia.fechaInicio,
        fechaFin: residencia.fechaFin,
        montoAlquiler: residencia.montoAlquiler,
        deposito: residencia.deposito,
        tipoOcupacion: residencia.tipoOcupacion,
        estado: residencia.estado,
        contratoUrl: residencia.contratoUrl,
        propiedad: {
          idPropiedad: residencia.idPropiedad.idPropiedad,
          numeroPiso: residencia.idPropiedad.piso.toString(),
          numeroUnidad: residencia.idPropiedad.numeroDepartamento,
          area: residencia.idPropiedad.areaM2?.toString() || '0',
        },
        propietario: {
          idPropietario: residencia.idPropietario.idPropietario,
          nombres: residencia.idPropietario.nombre,
          apellidos: residencia.idPropietario.apellido,
        },
        residente: {
          idResidente: residencia.idResidente.idResidente,
          nombres: residencia.idResidente.nombre,
          apellidos: residencia.idResidente.apellido,
        },
      };

      await this.residenciaRepository.remove(residencia);

      this.logger.log(`Residencia eliminada exitosamente: ${id}`);
      return BaseResponseDto.success(
        responseData,
        'Residencia eliminada exitosamente',
      );
    } catch (error) {
      this.logger.error(
        `Error al eliminar residencia ${id}: ${error.message}`,
        error.stack,
      );
      return BaseResponseDto.error(
        'Error interno del servidor al eliminar la residencia',
        500,
      );
    }
  }

  async findByPropiedad(
    propiedadId: string,
  ): Promise<BaseResponseDto<ResidenciaResponseDto[]>> {
    try {
      this.logger.log(`Buscando residencias para propiedad: ${propiedadId}`);

      const residencias = await this.residenciaRepository.find({
        where: { idPropiedad: { idPropiedad: propiedadId } },
        relations: ['idPropiedad', 'idPropietario', 'idResidente'],
        order: { fechaInicio: 'DESC' },
      });

      const responseData: ResidenciaResponseDto[] = residencias.map(
        (residencia) => ({
          idResidencia: residencia.idResidencia,
          fechaInicio: residencia.fechaInicio,
          fechaFin: residencia.fechaFin,
          montoAlquiler: residencia.montoAlquiler,
          deposito: residencia.deposito,
          tipoOcupacion: residencia.tipoOcupacion,
          estado: residencia.estado,
          contratoUrl: residencia.contratoUrl,
          propiedad: {
            idPropiedad: residencia.idPropiedad.idPropiedad,
            numeroPiso: residencia.idPropiedad.piso.toString(),
            numeroUnidad: residencia.idPropiedad.numeroDepartamento,
            area: residencia.idPropiedad.areaM2?.toString() || '0',
          },
          propietario: {
            idPropietario: residencia.idPropietario.idPropietario,
            nombres: residencia.idPropietario.nombre,
            apellidos: residencia.idPropietario.apellido,
          },
          residente: {
            idResidente: residencia.idResidente.idResidente,
            nombres: residencia.idResidente.nombre,
            apellidos: residencia.idResidente.apellido,
          },
        }),
      );

      this.logger.log(
        `Se encontraron ${residencias.length} residencias para la propiedad: ${propiedadId}`,
      );
      return BaseResponseDto.success(
        responseData,
        'Residencias encontradas exitosamente',
      );
    } catch (error) {
      this.logger.error(
        `Error al buscar residencias por propiedad ${propiedadId}: ${error.message}`,
        error.stack,
      );
      return BaseResponseDto.error(
        'Error interno del servidor al buscar residencias por propiedad',
        500,
      );
    }
  }

  async findByResidente(
    residenteId: string,
  ): Promise<BaseResponseDto<ResidenciaResponseDto[]>> {
    try {
      this.logger.log(`Buscando residencias para residente: ${residenteId}`);

      const residencias = await this.residenciaRepository.find({
        where: { idResidente: { idResidente: residenteId } },
        relations: ['idPropiedad', 'idPropietario', 'idResidente'],
        order: { fechaInicio: 'DESC' },
      });

      const responseData: ResidenciaResponseDto[] = residencias.map(
        (residencia) => ({
          idResidencia: residencia.idResidencia,
          fechaInicio: residencia.fechaInicio,
          fechaFin: residencia.fechaFin,
          montoAlquiler: residencia.montoAlquiler,
          deposito: residencia.deposito,
          tipoOcupacion: residencia.tipoOcupacion,
          estado: residencia.estado,
          contratoUrl: residencia.contratoUrl,
          propiedad: {
            idPropiedad: residencia.idPropiedad.idPropiedad,
            numeroPiso: residencia.idPropiedad.piso.toString(),
            numeroUnidad: residencia.idPropiedad.numeroDepartamento,
            area: residencia.idPropiedad.areaM2?.toString() || '0',
          },
          propietario: {
            idPropietario: residencia.idPropietario.idPropietario,
            nombres: residencia.idPropietario.nombre,
            apellidos: residencia.idPropietario.apellido,
          },
          residente: {
            idResidente: residencia.idResidente.idResidente,
            nombres: residencia.idResidente.nombre,
            apellidos: residencia.idResidente.apellido,
          },
        }),
      );

      this.logger.log(
        `Se encontraron ${residencias.length} residencias para el residente: ${residenteId}`,
      );
      return BaseResponseDto.success(
        responseData,
        'Residencias encontradas exitosamente',
      );
    } catch (error) {
      this.logger.error(
        `Error al buscar residencias por residente ${residenteId}: ${error.message}`,
        error.stack,
      );
      return BaseResponseDto.error(
        'Error interno del servidor al buscar residencias por residente',
        500,
      );
    }
  }

  async findByEstado(
    estado: string,
  ): Promise<BaseResponseDto<ResidenciaResponseDto[]>> {
    try {
      this.logger.log(`Buscando residencias por estado: ${estado}`);

      const residencias = await this.residenciaRepository.find({
        where: { estado },
        relations: ['idPropiedad', 'idPropietario', 'idResidente'],
        order: { fechaInicio: 'DESC' },
      });

      const responseData: ResidenciaResponseDto[] = residencias.map(
        (residencia) => ({
          idResidencia: residencia.idResidencia,
          fechaInicio: residencia.fechaInicio,
          fechaFin: residencia.fechaFin,
          montoAlquiler: residencia.montoAlquiler,
          deposito: residencia.deposito,
          tipoOcupacion: residencia.tipoOcupacion,
          estado: residencia.estado,
          contratoUrl: residencia.contratoUrl,
          propiedad: {
            idPropiedad: residencia.idPropiedad.idPropiedad,
            numeroPiso: residencia.idPropiedad.piso.toString(),
            numeroUnidad: residencia.idPropiedad.numeroDepartamento,
            area: residencia.idPropiedad.areaM2?.toString() || '0',
          },
          propietario: {
            idPropietario: residencia.idPropietario.idPropietario,
            nombres: residencia.idPropietario.nombre,
            apellidos: residencia.idPropietario.apellido,
          },
          residente: {
            idResidente: residencia.idResidente.idResidente,
            nombres: residencia.idResidente.nombre,
            apellidos: residencia.idResidente.apellido,
          },
        }),
      );

      this.logger.log(
        `Se encontraron ${residencias.length} residencias con estado: ${estado}`,
      );
      return BaseResponseDto.success(
        responseData,
        'Residencias encontradas exitosamente',
      );
    } catch (error) {
      this.logger.error(
        `Error al buscar residencias por estado ${estado}: ${error.message}`,
        error.stack,
      );
      return BaseResponseDto.error(
        'Error interno del servidor al buscar residencias por estado',
        500,
      );
    }
  }
}

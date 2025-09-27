import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ITipoIncidenciaService } from '../../interfaces/tipo-incidencia.interface';
import { TipoIncidencia } from '../../../entities/TipoIncidencia';
import {
  CreateTipoIncidenciaDto,
  UpdateTipoIncidenciaDto,
  TipoIncidenciaResponseDto,
  TipoIncidenciaSingleResponseDto,
  TipoIncidenciaArrayResponseDto,
} from '../../../dtos';
import { BaseResponseDto } from '../../../dtos/baseResponse/baseResponse.dto';

@Injectable()
export class TipoIncidenciaService implements ITipoIncidenciaService {
  private readonly logger = new Logger(TipoIncidenciaService.name);

  constructor(
    @InjectRepository(TipoIncidencia)
    private readonly tipoIncidenciaRepository: Repository<TipoIncidencia>,
  ) {}

  async create(
    createTipoIncidenciaDto: CreateTipoIncidenciaDto,
  ): Promise<TipoIncidencia> {
    // Verificar si ya existe un tipo de incidencia con el mismo nombre
    const existingTipo = await this.tipoIncidenciaRepository.findOne({
      where: { nombre: createTipoIncidenciaDto.nombre },
    });

    if (existingTipo) {
      throw new ConflictException(
        'Ya existe un tipo de incidencia con este nombre',
      );
    }

    const tipoIncidencia = this.tipoIncidenciaRepository.create({
      ...createTipoIncidenciaDto,
      estaActivo: createTipoIncidenciaDto.estaActivo ?? true,
    });

    const result = await this.tipoIncidenciaRepository.save(tipoIncidencia);
    return Array.isArray(result) ? result[0] : result;
  }

  async findAll(): Promise<TipoIncidencia[]> {
    return await this.tipoIncidenciaRepository.find({
      relations: ['incidencias'],
      order: {
        nombre: 'ASC',
      },
    });
  }

  async findOne(id: string): Promise<TipoIncidencia> {
    const tipoIncidencia = await this.tipoIncidenciaRepository.findOne({
      where: { idTipoIncidencia: id },
      relations: ['incidencias'],
    });

    if (!tipoIncidencia) {
      throw new NotFoundException(
        `Tipo de incidencia con ID ${id} no encontrado`,
      );
    }

    return tipoIncidencia;
  }

  async update(
    id: string,
    updateTipoIncidenciaDto: UpdateTipoIncidenciaDto,
  ): Promise<TipoIncidencia> {
    await this.findOne(id);

    // Si se actualiza el nombre, verificar que no exista otro con el mismo nombre
    if (updateTipoIncidenciaDto.nombre) {
      const existingTipo = await this.tipoIncidenciaRepository.findOne({
        where: {
          nombre: updateTipoIncidenciaDto.nombre,
          idTipoIncidencia: require('typeorm').Not(id),
        },
      });

      if (existingTipo) {
        throw new ConflictException(
          'Ya existe otro tipo de incidencia con este nombre',
        );
      }
    }

    await this.tipoIncidenciaRepository.update(id, updateTipoIncidenciaDto);
    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const tipoIncidencia = await this.findOne(id);

    // Verificar si tiene incidencias asociadas activas
    const incidenciasActivas = await this.tipoIncidenciaRepository
      .createQueryBuilder('tipo')
      .leftJoin('tipo.incidencias', 'incidencia')
      .where('tipo.idTipoIncidencia = :id', { id })
      .andWhere('incidencia.estado != :estado', { estado: 'Resuelto' })
      .getCount();

    if (incidenciasActivas > 0) {
      throw new BadRequestException(
        'No se puede eliminar un tipo de incidencia que tiene incidencias activas asociadas',
      );
    }

    // Eliminación lógica: marcar como inactivo
    await this.tipoIncidenciaRepository.update(id, { estaActivo: false });
  }

  async findByNombre(nombre: string): Promise<TipoIncidencia> {
    const tipoIncidencia = await this.tipoIncidenciaRepository.findOne({
      where: {
        nombre,
        estaActivo: true,
      },
      relations: ['incidencias'],
    });

    if (!tipoIncidencia) {
      throw new NotFoundException(
        `Tipo de incidencia con nombre '${nombre}' no encontrado`,
      );
    }

    return tipoIncidencia;
  }

  async findByPrioridad(prioridad: string): Promise<TipoIncidencia[]> {
    return await this.tipoIncidenciaRepository.find({
      where: {
        prioridad,
        estaActivo: true,
      },
      relations: ['incidencias'],
      order: {
        nombre: 'ASC',
      },
    });
  }

  async findActivos(): Promise<TipoIncidencia[]> {
    return await this.tipoIncidenciaRepository.find({
      where: { estaActivo: true },
      relations: ['incidencias'],
      order: {
        nombre: 'ASC',
      },
    });
  }

  // ============================================================================
  // MÉTODOS CON BASE RESPONSE DTO
  // ============================================================================

  private mapToResponseDto(tipoIncidencia: TipoIncidencia): TipoIncidenciaResponseDto {
    return {
      idTipoIncidencia: tipoIncidencia.idTipoIncidencia,
      nombre: tipoIncidencia.nombre,
      descripcion: tipoIncidencia.descripcion,
      prioridad: tipoIncidencia.prioridad as any,
      colorHex: tipoIncidencia.colorHex,
      estaActivo: tipoIncidencia.estaActivo,
    };
  }

  async createWithBaseResponse(
    createTipoIncidenciaDto: CreateTipoIncidenciaDto,
  ): Promise<TipoIncidenciaSingleResponseDto> {
    try {
      this.logger.log(`Creando nuevo tipo de incidencia: ${createTipoIncidenciaDto.nombre}`);
      
      // Verificar si ya existe un tipo de incidencia con el mismo nombre
      const existingTipo = await this.tipoIncidenciaRepository.findOne({
        where: { nombre: createTipoIncidenciaDto.nombre },
      });

      if (existingTipo) {
        this.logger.warn(`Intento de crear tipo de incidencia duplicado: ${createTipoIncidenciaDto.nombre}`);
        return {
          success: false,
          statusCode: 409,
          message: 'Ya existe un tipo de incidencia con este nombre',
          data: null,
          error: { message: 'Conflicto de duplicidad' }
        };
      }

      const tipoIncidencia = this.tipoIncidenciaRepository.create({
        ...createTipoIncidenciaDto,
        estaActivo: createTipoIncidenciaDto.estaActivo ?? true,
      });

      const result = await this.tipoIncidenciaRepository.save(tipoIncidencia);
      const savedEntity = Array.isArray(result) ? result[0] : result;
      
      this.logger.log(`Tipo de incidencia creado exitosamente con ID: ${savedEntity.idTipoIncidencia}`);
      
      return {
        success: true,
        statusCode: 201,
        message: 'Tipo de incidencia creado exitosamente',
        data: this.mapToResponseDto(savedEntity),
        error: null
      };
    } catch (error) {
      this.logger.error(`Error al crear tipo de incidencia: ${error.message}`, error.stack);
      return {
        success: false,
        statusCode: 500,
        message: 'Error interno al crear el tipo de incidencia',
        data: null,
        error: { message: error.message }
      };
    }
  }

  async findAllWithBaseResponse(): Promise<TipoIncidenciaArrayResponseDto> {
    try {
      this.logger.log('Obteniendo todos los tipos de incidencia');
      
      const tiposIncidencia = await this.tipoIncidenciaRepository.find({
        order: { nombre: 'ASC' },
      });

      const mappedData = tiposIncidencia.map(tipo => this.mapToResponseDto(tipo));
      
      this.logger.log(`Se encontraron ${tiposIncidencia.length} tipos de incidencia`);
      
      return {
        success: true,
        statusCode: 200,
        message: `Se encontraron ${tiposIncidencia.length} tipos de incidencia`,
        data: mappedData,
        error: null
      };
    } catch (error) {
      this.logger.error(`Error al obtener tipos de incidencia: ${error.message}`, error.stack);
      return {
        success: false,
        statusCode: 500,
        message: 'Error interno al obtener los tipos de incidencia',
        data: null,
        error: { message: error.message }
      };
    }
  }

  async findOneWithBaseResponse(id: string): Promise<TipoIncidenciaSingleResponseDto> {
    try {
      this.logger.log(`Buscando tipo de incidencia con ID: ${id}`);
      
      const tipoIncidencia = await this.tipoIncidenciaRepository.findOne({
        where: { idTipoIncidencia: id },
      });

      if (!tipoIncidencia) {
        this.logger.warn(`Tipo de incidencia con ID ${id} no encontrado`);
        return {
          success: false,
          statusCode: 404,
          message: `Tipo de incidencia con ID ${id} no encontrado`,
          data: null,
          error: { message: 'Recurso no encontrado' }
        };
      }

      this.logger.log(`Tipo de incidencia encontrado: ${tipoIncidencia.nombre}`);
      
      return {
        success: true,
        statusCode: 200,
        message: 'Tipo de incidencia encontrado exitosamente',
        data: this.mapToResponseDto(tipoIncidencia),
        error: null
      };
    } catch (error) {
      this.logger.error(`Error al buscar tipo de incidencia: ${error.message}`, error.stack);
      return {
        success: false,
        statusCode: 500,
        message: 'Error interno al buscar el tipo de incidencia',
        data: null,
        error: { message: error.message }
      };
    }
  }

  async updateWithBaseResponse(
    id: string,
    updateTipoIncidenciaDto: UpdateTipoIncidenciaDto,
  ): Promise<TipoIncidenciaSingleResponseDto> {
    try {
      this.logger.log(`Actualizando tipo de incidencia con ID: ${id}`);
      
      const existingTipo = await this.tipoIncidenciaRepository.findOne({
        where: { idTipoIncidencia: id },
      });

      if (!existingTipo) {
        this.logger.warn(`Tipo de incidencia con ID ${id} no encontrado para actualizar`);
        return {
          success: false,
          statusCode: 404,
          message: `Tipo de incidencia con ID ${id} no encontrado`,
          data: null,
          error: { message: 'Recurso no encontrado' }
        };
      }

      // Si se actualiza el nombre, verificar que no exista otro con el mismo nombre
      if (updateTipoIncidenciaDto.nombre && updateTipoIncidenciaDto.nombre !== existingTipo.nombre) {
        const duplicateTipo = await this.tipoIncidenciaRepository.findOne({
          where: { nombre: updateTipoIncidenciaDto.nombre },
        });

        if (duplicateTipo && duplicateTipo.idTipoIncidencia !== id) {
          this.logger.warn(`Intento de actualizar con nombre duplicado: ${updateTipoIncidenciaDto.nombre}`);
          return {
            success: false,
            statusCode: 409,
            message: 'Ya existe otro tipo de incidencia con este nombre',
            data: null,
            error: { message: 'Conflicto de duplicidad' }
          };
        }
      }

      await this.tipoIncidenciaRepository.update(id, updateTipoIncidenciaDto);
      
      const updatedTipo = await this.tipoIncidenciaRepository.findOne({
        where: { idTipoIncidencia: id },
      });

      if (!updatedTipo) {
        return {
          success: false,
          statusCode: 500,
          message: 'Error interno: No se pudo recuperar el tipo de incidencia actualizado',
          data: null,
          error: { message: 'Error de consistencia de datos' }
        };
      }
      
      this.logger.log(`Tipo de incidencia actualizado exitosamente: ${updatedTipo.nombre}`);
      
      return {
        success: true,
        statusCode: 200,
        message: 'Tipo de incidencia actualizado exitosamente',
        data: this.mapToResponseDto(updatedTipo),
        error: null
      };
    } catch (error) {
      this.logger.error(`Error al actualizar tipo de incidencia: ${error.message}`, error.stack);
      return {
        success: false,
        statusCode: 500,
        message: 'Error interno al actualizar el tipo de incidencia',
        data: null,
        error: { message: error.message }
      };
    }
  }

  async removeWithBaseResponse(id: string): Promise<BaseResponseDto<undefined>> {
    try {
      this.logger.log(`Eliminando tipo de incidencia con ID: ${id}`);
      
      const tipoIncidencia = await this.tipoIncidenciaRepository.findOne({
        where: { idTipoIncidencia: id },
        relations: ['incidencias'],
      });

      if (!tipoIncidencia) {
        this.logger.warn(`Tipo de incidencia con ID ${id} no encontrado para eliminar`);
        return {
          success: false,
          statusCode: 404,
          message: `Tipo de incidencia con ID ${id} no encontrado`,
          data: undefined,
          error: { message: 'Recurso no encontrado' }
        };
      }

      // Verificar si tiene incidencias asociadas activas
      const incidenciasActivas = await this.tipoIncidenciaRepository
        .createQueryBuilder('tipo')
        .leftJoin('tipo.incidencias', 'incidencia')
        .where('tipo.idTipoIncidencia = :id', { id })
        .andWhere('incidencia.estado != :estado', { estado: 'Resuelto' })
        .getCount();

      if (incidenciasActivas > 0) {
        this.logger.warn(`Intento de eliminar tipo de incidencia en uso con ID: ${id}`);
        return {
          success: false,
          statusCode: 409,
          message: 'No se puede eliminar un tipo de incidencia que tiene incidencias activas asociadas',
          data: undefined,
          error: { message: 'Tipo de incidencia en uso' }
        };
      }

      // Eliminación lógica: marcar como inactivo
      await this.tipoIncidenciaRepository.update(id, { estaActivo: false });
      
      this.logger.log(`Tipo de incidencia eliminado (lógicamente) exitosamente con ID: ${id}`);
      
      return {
        success: true,
        statusCode: 200,
        message: 'Tipo de incidencia eliminado exitosamente',
        data: undefined,
        error: null
      };
    } catch (error) {
      this.logger.error(`Error al eliminar tipo de incidencia: ${error.message}`, error.stack);
      return {
        success: false,
        statusCode: 500,
        message: 'Error interno al eliminar el tipo de incidencia',
        data: undefined,
        error: { message: error.message }
      };
    }
  }

  async findByNombreWithBaseResponse(nombre: string): Promise<TipoIncidenciaSingleResponseDto> {
    try {
      this.logger.log(`Buscando tipo de incidencia por nombre: ${nombre}`);
      
      const tipoIncidencia = await this.tipoIncidenciaRepository.findOne({
        where: { nombre, estaActivo: true },
      });

      if (!tipoIncidencia) {
        this.logger.warn(`Tipo de incidencia con nombre '${nombre}' no encontrado`);
        return {
          success: false,
          statusCode: 404,
          message: `Tipo de incidencia con nombre '${nombre}' no encontrado`,
          data: null,
          error: { message: 'Recurso no encontrado' }
        };
      }

      this.logger.log(`Tipo de incidencia encontrado por nombre: ${tipoIncidencia.nombre}`);
      
      return {
        success: true,
        statusCode: 200,
        message: 'Tipo de incidencia encontrado exitosamente',
        data: this.mapToResponseDto(tipoIncidencia),
        error: null
      };
    } catch (error) {
      this.logger.error(`Error al buscar tipo de incidencia por nombre: ${error.message}`, error.stack);
      return {
        success: false,
        statusCode: 500,
        message: 'Error interno al buscar el tipo de incidencia',
        data: null,
        error: { message: error.message }
      };
    }
  }

  async findByPrioridadWithBaseResponse(prioridad: string): Promise<TipoIncidenciaArrayResponseDto> {
    try {
      this.logger.log(`Buscando tipos de incidencia por prioridad: ${prioridad}`);
      
      const tiposIncidencia = await this.tipoIncidenciaRepository.find({
        where: { prioridad, estaActivo: true },
        order: { nombre: 'ASC' },
      });

      const mappedData = tiposIncidencia.map(tipo => this.mapToResponseDto(tipo));
      
      this.logger.log(`Se encontraron ${tiposIncidencia.length} tipos de incidencia con prioridad ${prioridad}`);
      
      return {
        success: true,
        statusCode: 200,
        message: `Se encontraron ${tiposIncidencia.length} tipos de incidencia con prioridad ${prioridad}`,
        data: mappedData,
        error: null
      };
    } catch (error) {
      this.logger.error(`Error al buscar tipos de incidencia por prioridad: ${error.message}`, error.stack);
      return {
        success: false,
        statusCode: 500,
        message: 'Error interno al buscar tipos de incidencia por prioridad',
        data: null,
        error: { message: error.message }
      };
    }
  }

  async findActivosWithBaseResponse(): Promise<TipoIncidenciaArrayResponseDto> {
    try {
      this.logger.log('Obteniendo tipos de incidencia activos');
      
      const tiposIncidencia = await this.tipoIncidenciaRepository.find({
        where: { estaActivo: true },
        order: { nombre: 'ASC' },
      });

      const mappedData = tiposIncidencia.map(tipo => this.mapToResponseDto(tipo));
      
      this.logger.log(`Se encontraron ${tiposIncidencia.length} tipos de incidencia activos`);
      
      return {
        success: true,
        statusCode: 200,
        message: `Se encontraron ${tiposIncidencia.length} tipos de incidencia activos`,
        data: mappedData,
        error: null
      };
    } catch (error) {
      this.logger.error(`Error al obtener tipos de incidencia activos: ${error.message}`, error.stack);
      return {
        success: false,
        statusCode: 500,
        message: 'Error interno al obtener los tipos de incidencia activos',
        data: null,
        error: { message: error.message }
      };
    }
  }
}

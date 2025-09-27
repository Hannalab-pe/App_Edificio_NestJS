import { Injectable, Logger, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { TipoContrato } from '../../../entities/TipoContrato';
import { 
  CreateTipoContratoDto, 
  UpdateTipoContratoDto,
  TipoContratoSingleResponseDto,
  TipoContratoArrayResponseDto
} from '../../../dtos';
import { BaseResponseDto } from '../../../dtos/baseResponse/baseResponse.dto';
import { ITipoContratoService } from '../../interfaces/tipo-contrato.interface';

@Injectable()
export class TipoContratoService implements ITipoContratoService {
  private readonly logger = new Logger(TipoContratoService.name);

  constructor(
    @InjectRepository(TipoContrato)
    private readonly tipoContratoRepository: Repository<TipoContrato>,
  ) {}

  async create(
    createTipoContratoDto: CreateTipoContratoDto,
  ): Promise<BaseResponseDto<TipoContrato>> {
    try {
      // Verificar si ya existe un tipo de contrato con el mismo nombre
      const tipoContratoExistente = await this.tipoContratoRepository.findOne({
        where: { nombre: createTipoContratoDto.nombre },
      });

      if (tipoContratoExistente) {
        return {
          success: false,
          message: 'Ya existe un tipo de contrato con este nombre',
          data: null,
          error: { message: 'Nombre de tipo de contrato duplicado' },
        };
      }

      const nuevoTipoContrato = this.tipoContratoRepository.create(
        createTipoContratoDto,
      );
      const tipoContratoGuardado =
        await this.tipoContratoRepository.save(nuevoTipoContrato);

      return {
        success: true,
        message: 'Tipo de contrato creado exitosamente',
        data: tipoContratoGuardado,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al crear el tipo de contrato',
        data: null,
        error: { message: error.message },
      };
    }
  }

  async findAll(): Promise<BaseResponseDto<TipoContrato[]>> {
    try {
      const tiposContrato = await this.tipoContratoRepository.find({
        order: { nombre: 'ASC' },
      });

      return {
        success: true,
        message:
          tiposContrato.length > 0
            ? 'Tipos de contrato encontrados'
            : 'No se encontraron tipos de contrato',
        data: tiposContrato,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al obtener los tipos de contrato',
        data: [],
        error: { message: error.message },
      };
    }
  }

  async findOne(id: string): Promise<BaseResponseDto<TipoContrato>> {
    try {
      const tipoContrato = await this.tipoContratoRepository.findOne({
        where: { idTipoContrato: id },
      });

      if (!tipoContrato) {
        return {
          success: false,
          message: 'Tipo de contrato no encontrado',
          data: null,
          error: {
            message: 'No existe un tipo de contrato con el ID proporcionado',
          },
        };
      }

      return {
        success: true,
        message: 'Tipo de contrato encontrado',
        data: tipoContrato,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al buscar el tipo de contrato',
        data: null,
        error: { message: error.message },
      };
    }
  }

  async update(
    id: string,
    updateTipoContratoDto: UpdateTipoContratoDto,
  ): Promise<BaseResponseDto<TipoContrato>> {
    try {
      const tipoContrato = await this.tipoContratoRepository.findOne({
        where: { idTipoContrato: id },
      });

      if (!tipoContrato) {
        return {
          success: false,
          message: 'Tipo de contrato no encontrado',
          data: null,
          error: {
            message: 'No existe un tipo de contrato con el ID proporcionado',
          },
        };
      }

      // Verificar si se está cambiando el nombre y ya existe otro con ese nombre
      if (
        updateTipoContratoDto.nombre &&
        updateTipoContratoDto.nombre !== tipoContrato.nombre
      ) {
        const tipoContratoExistente = await this.tipoContratoRepository.findOne(
          {
            where: { nombre: updateTipoContratoDto.nombre },
          },
        );

        if (tipoContratoExistente) {
          return {
            success: false,
            message: 'Ya existe un tipo de contrato con este nombre',
            data: null,
            error: { message: 'Nombre de tipo de contrato duplicado' },
          };
        }
      }

      const tipoContratoActualizado = await this.tipoContratoRepository.save({
        ...tipoContrato,
        ...updateTipoContratoDto,
      });

      return {
        success: true,
        message: 'Tipo de contrato actualizado exitosamente',
        data: tipoContratoActualizado,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al actualizar el tipo de contrato',
        data: null,
        error: { message: error.message },
      };
    }
  }

  async remove(id: string): Promise<BaseResponseDto<undefined>> {
    try {
      const tipoContrato = await this.tipoContratoRepository.findOne({
        where: { idTipoContrato: id },
        relations: ['contactos', 'contratoes'],
      });

      if (!tipoContrato) {
        return {
          success: false,
          message: 'Tipo de contrato no encontrado',
          data: undefined,
          error: {
            message: 'No existe un tipo de contrato con el ID proporcionado',
          },
        };
      }

      // Verificar si hay contactos o contratos asociados
      const tieneContactos =
        tipoContrato.contactos && tipoContrato.contactos.length > 0;
      const tieneContratos =
        tipoContrato.contratoes && tipoContrato.contratoes.length > 0;

      if (tieneContactos || tieneContratos) {
        return {
          success: false,
          message:
            'No se puede eliminar el tipo de contrato porque tiene registros asociados',
          data: undefined,
          error: { message: 'Tipo de contrato en uso' },
        };
      }

      // Eliminación física
      await this.tipoContratoRepository.remove(tipoContrato);

      return {
        success: true,
        message: 'Tipo de contrato eliminado exitosamente',
        data: undefined,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al eliminar el tipo de contrato',
        data: undefined,
        error: { message: error.message },
      };
    }
  }

  async findByNombre(nombre: string): Promise<BaseResponseDto<TipoContrato>> {
    try {
      const tipoContrato = await this.tipoContratoRepository.findOne({
        where: { nombre: nombre },
      });

      if (!tipoContrato) {
        return {
          success: false,
          message: 'Tipo de contrato no encontrado',
          data: null,
          error: {
            message: `No existe un tipo de contrato con el nombre ${nombre}`,
          },
        };
      }

      return {
        success: true,
        message: 'Tipo de contrato encontrado',
        data: tipoContrato,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al buscar el tipo de contrato por nombre',
        data: null,
        error: { message: error.message },
      };
    }
  }

  // ================================
  // MÉTODOS MODERNIZADOS CON BaseResponseDto
  // ================================

  /**
   * Mapea una entidad TipoContrato a TipoContratoResponseDto
   */
  private mapToResponseDto(tipoContrato: TipoContrato): any {
    return {
      idTipoContrato: tipoContrato.idTipoContrato,
      nombre: tipoContrato.nombre,
      descripcion: tipoContrato.descripcion,
    };
  }

  /**
   * Crear un nuevo tipo de contrato con BaseResponseDto
   */
  async createWithBaseResponse(createTipoContratoDto: CreateTipoContratoDto): Promise<TipoContratoSingleResponseDto> {
    this.logger.log(`Creando tipo de contrato: ${createTipoContratoDto.nombre}`);
    
    try {
      // Verificar si ya existe un tipo de contrato con el mismo nombre
      const tipoContratoExistente = await this.tipoContratoRepository.findOne({
        where: { nombre: createTipoContratoDto.nombre },
      });

      if (tipoContratoExistente) {
        this.logger.warn(`Intento de crear tipo de contrato con nombre duplicado: ${createTipoContratoDto.nombre}`);
        throw new ConflictException('Ya existe un tipo de contrato con este nombre');
      }

      const nuevoTipoContrato = this.tipoContratoRepository.create(createTipoContratoDto);
      const tipoContratoGuardado = await this.tipoContratoRepository.save(nuevoTipoContrato);

      this.logger.log(`Tipo de contrato creado exitosamente con ID: ${tipoContratoGuardado.idTipoContrato}`);

      const responseData = this.mapToResponseDto(tipoContratoGuardado);
      return BaseResponseDto.success(responseData, 'Tipo de contrato creado exitosamente') as TipoContratoSingleResponseDto;
    } catch (error) {
      this.logger.error(`Error al crear tipo de contrato: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Obtener todos los tipos de contrato con BaseResponseDto
   */
  async findAllWithBaseResponse(): Promise<TipoContratoArrayResponseDto> {
    this.logger.log('Obteniendo todos los tipos de contrato');
    
    try {
      const tiposContrato = await this.tipoContratoRepository.find({
        order: { nombre: 'ASC' },
      });

      if (tiposContrato.length === 0) {
        this.logger.log('No se encontraron tipos de contrato');
        throw new NotFoundException('No se encontraron tipos de contrato');
      }

      this.logger.log(`${tiposContrato.length} tipos de contrato encontrados`);

      const responseData = tiposContrato.map(tc => this.mapToResponseDto(tc));
      return BaseResponseDto.success(responseData, `${tiposContrato.length} tipos de contrato obtenidos exitosamente`) as TipoContratoArrayResponseDto;
    } catch (error) {
      this.logger.error(`Error al obtener tipos de contrato: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Obtener un tipo de contrato por ID con BaseResponseDto
   */
  async findOneWithBaseResponse(id: string): Promise<TipoContratoSingleResponseDto> {
    this.logger.log(`Buscando tipo de contrato con ID: ${id}`);
    
    try {
      const tipoContrato = await this.tipoContratoRepository.findOne({
        where: { idTipoContrato: id },
      });

      if (!tipoContrato) {
        this.logger.warn(`Tipo de contrato no encontrado con ID: ${id}`);
        throw new NotFoundException('Tipo de contrato no encontrado');
      }

      this.logger.log(`Tipo de contrato encontrado: ${tipoContrato.nombre}`);

      const responseData = this.mapToResponseDto(tipoContrato);
      return BaseResponseDto.success(responseData, 'Tipo de contrato obtenido exitosamente') as TipoContratoSingleResponseDto;
    } catch (error) {
      this.logger.error(`Error al buscar tipo de contrato: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Actualizar un tipo de contrato con BaseResponseDto
   */
  async updateWithBaseResponse(id: string, updateTipoContratoDto: UpdateTipoContratoDto): Promise<TipoContratoSingleResponseDto> {
    this.logger.log(`Actualizando tipo de contrato con ID: ${id}`);
    
    try {
      const tipoContrato = await this.tipoContratoRepository.findOne({
        where: { idTipoContrato: id },
      });

      if (!tipoContrato) {
        this.logger.warn(`Tipo de contrato no encontrado con ID: ${id}`);
        throw new NotFoundException('Tipo de contrato no encontrado');
      }

      // Verificar duplicado de nombre si se está actualizando
      if (updateTipoContratoDto.nombre && updateTipoContratoDto.nombre !== tipoContrato.nombre) {
        const tipoContratoExistente = await this.tipoContratoRepository.findOne({
          where: { nombre: updateTipoContratoDto.nombre },
        });

        if (tipoContratoExistente) {
          this.logger.warn(`Intento de actualizar con nombre duplicado: ${updateTipoContratoDto.nombre}`);
          throw new ConflictException('Ya existe otro tipo de contrato con este nombre');
        }
      }

      const tipoContratoActualizado = await this.tipoContratoRepository.save({
        ...tipoContrato,
        ...updateTipoContratoDto,
      });

      this.logger.log(`Tipo de contrato actualizado exitosamente: ${tipoContratoActualizado.nombre}`);

      const responseData = this.mapToResponseDto(tipoContratoActualizado);
      return BaseResponseDto.success(responseData, 'Tipo de contrato actualizado exitosamente') as TipoContratoSingleResponseDto;
    } catch (error) {
      this.logger.error(`Error al actualizar tipo de contrato: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Eliminar un tipo de contrato con BaseResponseDto
   */
  async removeWithBaseResponse(id: string): Promise<BaseResponseDto<undefined>> {
    this.logger.log(`Eliminando tipo de contrato con ID: ${id}`);
    
    try {
      const tipoContrato = await this.tipoContratoRepository.findOne({
        where: { idTipoContrato: id },
        relations: ['contactos', 'contratoes'],
      });

      if (!tipoContrato) {
        this.logger.warn(`Tipo de contrato no encontrado con ID: ${id}`);
        throw new NotFoundException('Tipo de contrato no encontrado');
      }

      // Verificar si hay relaciones que impidan la eliminación
      const tieneContactos = tipoContrato.contactos && tipoContrato.contactos.length > 0;
      const tieneContratos = tipoContrato.contratoes && tipoContrato.contratoes.length > 0;

      if (tieneContactos || tieneContratos) {
        this.logger.warn(`Intento de eliminar tipo de contrato en uso: ${tipoContrato.nombre}`);
        throw new ConflictException('No se puede eliminar el tipo de contrato porque está en uso por registros existentes');
      }

      await this.tipoContratoRepository.remove(tipoContrato);
      this.logger.log(`Tipo de contrato eliminado exitosamente: ${tipoContrato.nombre}`);

      return BaseResponseDto.success(undefined, 'Tipo de contrato eliminado exitosamente');
    } catch (error) {
      this.logger.error(`Error al eliminar tipo de contrato: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Buscar tipo de contrato por nombre con BaseResponseDto
   */
  async findByNombreWithBaseResponse(nombre: string): Promise<TipoContratoSingleResponseDto> {
    this.logger.log(`Buscando tipo de contrato con nombre: ${nombre}`);
    
    try {
      const tipoContrato = await this.tipoContratoRepository.findOne({
        where: { nombre: ILike(`%${nombre}%`) },
      });

      if (!tipoContrato) {
        this.logger.warn(`Tipo de contrato no encontrado con nombre: ${nombre}`);
        throw new NotFoundException('No se encontró tipo de contrato con el nombre especificado');
      }

      this.logger.log(`Tipo de contrato encontrado: ${tipoContrato.nombre}`);

      const responseData = this.mapToResponseDto(tipoContrato);
      return BaseResponseDto.success(responseData, 'Tipo de contrato encontrado exitosamente') as TipoContratoSingleResponseDto;
    } catch (error) {
      this.logger.error(`Error al buscar tipo de contrato por nombre: ${error.message}`, error.stack);
      throw error;
    }
  }
}

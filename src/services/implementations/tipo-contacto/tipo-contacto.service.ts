import { Injectable, Logger, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { TipoContacto } from '../../../entities/TipoContacto';
import { 
  CreateTipoContactoDto, 
  UpdateTipoContactoDto,
  TipoContactoSingleResponseDto,
  TipoContactoArrayResponseDto
} from '../../../dtos';
import { BaseResponseDto } from '../../../dtos/baseResponse/baseResponse.dto';
import { ITipoContactoService } from '../../interfaces/tipo-contacto.interface';

@Injectable()
export class TipoContactoService implements ITipoContactoService {
  private readonly logger = new Logger(TipoContactoService.name);

  constructor(
    @InjectRepository(TipoContacto)
    private readonly tipoContactoRepository: Repository<TipoContacto>,
  ) {}

  async create(
    createTipoContactoDto: CreateTipoContactoDto,
  ): Promise<BaseResponseDto<TipoContacto>> {
    try {
      // Verificar si ya existe un tipo de contacto con el mismo nombre
      const tipoContactoExistente = await this.tipoContactoRepository.findOne({
        where: { nombre: createTipoContactoDto.nombre },
      });

      if (tipoContactoExistente) {
        return {
          success: false,
          message: 'Ya existe un tipo de contacto con este nombre',
          data: null,
          error: { message: 'Nombre de tipo de contacto duplicado' },
        };
      }

      const nuevoTipoContacto = this.tipoContactoRepository.create(
        createTipoContactoDto,
      );
      const tipoContactoGuardado =
        await this.tipoContactoRepository.save(nuevoTipoContacto);

      return {
        success: true,
        message: 'Tipo de contacto creado exitosamente',
        data: tipoContactoGuardado,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al crear el tipo de contacto',
        data: null,
        error: { message: error.message },
      };
    }
  }

  // ==================== MÉTODOS CON BaseResponseDto MODERNIZADOS ====================

  /**
   * Crear tipo de contacto con respuesta estandarizada
   */
  async createWithBaseResponse(createTipoContactoDto: CreateTipoContactoDto): Promise<TipoContactoSingleResponseDto> {
    try {
      this.logger.log(`Intentando crear tipo de contacto: ${createTipoContactoDto.nombre}`);

      // Verificar si ya existe un tipo de contacto con el mismo nombre
      const existingTipoContacto = await this.tipoContactoRepository.findOne({
        where: { nombre: createTipoContactoDto.nombre },
      });

      if (existingTipoContacto) {
        throw new ConflictException(`Ya existe un tipo de contacto con el nombre '${createTipoContactoDto.nombre}'`);
      }

      const tipoContacto = this.tipoContactoRepository.create(createTipoContactoDto);
      const savedTipoContacto = await this.tipoContactoRepository.save(tipoContacto);
      
      const responseData = this.mapToResponseDto(savedTipoContacto);
      this.logger.log(`✅ Tipo de contacto creado exitosamente: ${savedTipoContacto.idTipoContacto}`);
      
      return BaseResponseDto.success(responseData, 'Tipo de contacto creado exitosamente') as TipoContactoSingleResponseDto;
    } catch (error) {
      this.logger.error(`❌ Error al crear tipo de contacto: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(): Promise<BaseResponseDto<TipoContacto[]>> {
    try {
      const tiposContacto = await this.tipoContactoRepository.find({
        order: { nombre: 'ASC' },
      });

      return {
        success: true,
        message:
          tiposContacto.length > 0
            ? 'Tipos de contacto encontrados'
            : 'No se encontraron tipos de contacto',
        data: tiposContacto,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al obtener los tipos de contacto',
        data: [],
        error: { message: error.message },
      };
    }
  }

  async findOne(id: string): Promise<BaseResponseDto<TipoContacto>> {
    try {
      const tipoContacto = await this.tipoContactoRepository.findOne({
        where: { idTipoContacto: id },
      });

      if (!tipoContacto) {
        return {
          success: false,
          message: 'Tipo de contacto no encontrado',
          data: null,
          error: {
            message: 'No existe un tipo de contacto con el ID proporcionado',
          },
        };
      }

      return {
        success: true,
        message: 'Tipo de contacto encontrado',
        data: tipoContacto,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al buscar el tipo de contacto',
        data: null,
        error: { message: error.message },
      };
    }
  }

  async update(
    id: string,
    updateTipoContactoDto: UpdateTipoContactoDto,
  ): Promise<BaseResponseDto<TipoContacto>> {
    try {
      const tipoContacto = await this.tipoContactoRepository.findOne({
        where: { idTipoContacto: id },
      });

      if (!tipoContacto) {
        return {
          success: false,
          message: 'Tipo de contacto no encontrado',
          data: null,
          error: {
            message: 'No existe un tipo de contacto con el ID proporcionado',
          },
        };
      }

      // Verificar si se está cambiando el nombre y ya existe otro con ese nombre
      if (
        updateTipoContactoDto.nombre &&
        updateTipoContactoDto.nombre !== tipoContacto.nombre
      ) {
        const tipoContactoExistente = await this.tipoContactoRepository.findOne(
          {
            where: { nombre: updateTipoContactoDto.nombre },
          },
        );

        if (tipoContactoExistente) {
          return {
            success: false,
            message: 'Ya existe un tipo de contacto con este nombre',
            data: null,
            error: { message: 'Nombre de tipo de contacto duplicado' },
          };
        }
      }

      const tipoContactoActualizado = await this.tipoContactoRepository.save({
        ...tipoContacto,
        ...updateTipoContactoDto,
      });

      return {
        success: true,
        message: 'Tipo de contacto actualizado exitosamente',
        data: tipoContactoActualizado,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al actualizar el tipo de contacto',
        data: null,
        error: { message: error.message },
      };
    }
  }

  async remove(id: string): Promise<BaseResponseDto<undefined>> {
    try {
      const tipoContacto = await this.tipoContactoRepository.findOne({
        where: { idTipoContacto: id },
        relations: ['contactos'],
      });

      if (!tipoContacto) {
        return {
          success: false,
          message: 'Tipo de contacto no encontrado',
          data: undefined,
          error: {
            message: 'No existe un tipo de contacto con el ID proporcionado',
          },
        };
      }

      // Verificar si hay contactos asociados
      if (tipoContacto.contactos && tipoContacto.contactos.length > 0) {
        return {
          success: false,
          message:
            'No se puede eliminar el tipo de contacto porque tiene contactos asociados',
          data: undefined,
          error: { message: 'Tipo de contacto en uso' },
        };
      }

      // Eliminación física
      await this.tipoContactoRepository.remove(tipoContacto);

      return {
        success: true,
        message: 'Tipo de contacto eliminado exitosamente',
        data: undefined,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al eliminar el tipo de contacto',
        data: undefined,
        error: { message: error.message },
      };
    }
  }

  async findByNombre(nombre: string): Promise<BaseResponseDto<TipoContacto>> {
    try {
      const tipoContacto = await this.tipoContactoRepository.findOne({
        where: { nombre: nombre },
      });

      if (!tipoContacto) {
        return {
          success: false,
          message: 'Tipo de contacto no encontrado',
          data: null,
          error: {
            message: `No existe un tipo de contacto con el nombre ${nombre}`,
          },
        };
      }

      return {
        success: true,
        message: 'Tipo de contacto encontrado',
        data: tipoContacto,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al buscar el tipo de contacto por nombre',
        data: null,
        error: { message: error.message },
      };
    }
  }

  /**
   * Obtener todos los tipos de contacto con respuesta estandarizada
   */
  async findAllWithBaseResponse(): Promise<TipoContactoArrayResponseDto> {
    try {
      this.logger.log('Obteniendo todos los tipos de contacto');
      
      const tiposContacto = await this.tipoContactoRepository.find({
        relations: ['contactos'],
        order: { nombre: 'ASC' },
      });

      const responseData = tiposContacto.map(tipoContacto => this.mapToResponseDto(tipoContacto));
      this.logger.log(`✅ ${tiposContacto.length} tipos de contacto obtenidos exitosamente`);
      
      return BaseResponseDto.success(responseData, `${tiposContacto.length} tipos de contacto obtenidos exitosamente`) as TipoContactoArrayResponseDto;
    } catch (error) {
      this.logger.error(`❌ Error al obtener tipos de contacto: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Obtener tipo de contacto por ID con respuesta estandarizada
   */
  async findOneWithBaseResponse(id: string): Promise<TipoContactoSingleResponseDto> {
    try {
      this.logger.log(`Buscando tipo de contacto por ID: ${id}`);
      
      const tipoContacto = await this.tipoContactoRepository.findOne({
        where: { idTipoContacto: id },
        relations: ['contactos'],
      });

      if (!tipoContacto) {
        throw new NotFoundException(`Tipo de contacto con ID ${id} no encontrado`);
      }

      const responseData = this.mapToResponseDto(tipoContacto);
      this.logger.log(`✅ Tipo de contacto encontrado: ${tipoContacto.idTipoContacto}`);
      
      return BaseResponseDto.success(responseData, 'Tipo de contacto obtenido exitosamente') as TipoContactoSingleResponseDto;
    } catch (error) {
      this.logger.error(`❌ Error al buscar tipo de contacto: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Actualizar tipo de contacto con respuesta estandarizada
   */
  async updateWithBaseResponse(id: string, updateTipoContactoDto: UpdateTipoContactoDto): Promise<TipoContactoSingleResponseDto> {
    try {
      this.logger.log(`Actualizando tipo de contacto: ${id}`);

      // Verificar que el tipo de contacto existe
      const existingTipoContacto = await this.tipoContactoRepository.findOne({
        where: { idTipoContacto: id },
        relations: ['contactos'],
      });

      if (!existingTipoContacto) {
        throw new NotFoundException(`Tipo de contacto con ID ${id} no encontrado`);
      }

      // Verificar conflicto de nombre si se está actualizando
      if (updateTipoContactoDto.nombre && updateTipoContactoDto.nombre !== existingTipoContacto.nombre) {
        const tipoContactoWithSameName = await this.tipoContactoRepository.findOne({
          where: { nombre: updateTipoContactoDto.nombre },
        });

        if (tipoContactoWithSameName) {
          throw new ConflictException(`Ya existe un tipo de contacto con el nombre '${updateTipoContactoDto.nombre}'`);
        }
      }

      // Actualizar el tipo de contacto
      await this.tipoContactoRepository.update(id, updateTipoContactoDto);
      
      // Obtener el tipo de contacto actualizado
      const updatedTipoContacto = await this.tipoContactoRepository.findOne({
        where: { idTipoContacto: id },
        relations: ['contactos'],
      });

      const responseData = this.mapToResponseDto(updatedTipoContacto);
      this.logger.log(`✅ Tipo de contacto actualizado exitosamente: ${id}`);
      
      return BaseResponseDto.success(responseData, 'Tipo de contacto actualizado exitosamente') as TipoContactoSingleResponseDto;
    } catch (error) {
      this.logger.error(`❌ Error al actualizar tipo de contacto: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Eliminar tipo de contacto con respuesta estandarizada
   */
  async removeWithBaseResponse(id: string): Promise<BaseResponseDto<null>> {
    try {
      this.logger.log(`Eliminando tipo de contacto: ${id}`);

      // Verificar que el tipo de contacto existe
      const tipoContacto = await this.tipoContactoRepository.findOne({
        where: { idTipoContacto: id },
        relations: ['contactos'],
      });

      if (!tipoContacto) {
        throw new NotFoundException(`Tipo de contacto con ID ${id} no encontrado`);
      }

      // Verificar si hay contactos asociados
      if (tipoContacto.contactos && tipoContacto.contactos.length > 0) {
        throw new ConflictException(`No se puede eliminar el tipo de contacto porque tiene ${tipoContacto.contactos.length} contacto(s) asociado(s)`);
      }

      // Eliminar el tipo de contacto
      await this.tipoContactoRepository.delete(id);
      this.logger.log(`✅ Tipo de contacto eliminado exitosamente: ${id}`);
      
      return BaseResponseDto.success(null, 'Tipo de contacto eliminado exitosamente');
    } catch (error) {
      this.logger.error(`❌ Error al eliminar tipo de contacto: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Buscar tipo de contacto por nombre con respuesta estandarizada
   */
  async findByNombreWithBaseResponse(nombre: string): Promise<TipoContactoArrayResponseDto> {
    try {
      this.logger.log(`Buscando tipo de contacto por nombre: ${nombre}`);
      
      const tipoContacto = await this.tipoContactoRepository.findOne({
        where: { nombre: nombre },
        relations: ['contactos'],
      });

      if (!tipoContacto) {
        throw new NotFoundException(`Tipo de contacto con nombre '${nombre}' no encontrado`);
      }

      const responseData = this.mapToResponseDto(tipoContacto);
      this.logger.log(`✅ Tipo de contacto encontrado por nombre: ${tipoContacto.idTipoContacto}`);
      
      return BaseResponseDto.success(responseData, 'Tipos de contacto encontrados exitosamente') as TipoContactoArrayResponseDto;
    } catch (error) {
      this.logger.error(`❌ Error al buscar tipo de contacto por nombre: ${error.message}`, error.stack);
      throw error;
    }
  }

  // ==================== MÉTODO HELPER ====================

  /**
   * Mapear entidad TipoContacto a DTO de respuesta
   */
  private mapToResponseDto(tipoContacto: any): any {
    if (!tipoContacto) return null;

    return {
      idTipoContacto: tipoContacto.idTipoContacto,
      nombre: tipoContacto.nombre,
      descripcion: tipoContacto.descripcion,
      contactos: tipoContacto.contactos?.map(contacto => ({
        idContacto: contacto.idContacto,
        valor: contacto.valor,
        esPrincipal: contacto.esPrincipal,
        estaActivo: contacto.estaActivo,
      })) || [],
    };
  }
}

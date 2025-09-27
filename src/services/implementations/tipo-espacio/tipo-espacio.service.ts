import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateTipoEspacioDto,
  UpdateTipoEspacioDto,
  TipoEspacioResponseDto,
  TipoEspacioSingleResponseDto,
  TipoEspacioArrayResponseDto,
} from 'src/dtos';
import { BaseResponseDto } from 'src/dtos/baseResponse/baseResponse.dto';
import { TipoEspacio } from 'src/entities/TipoEspacio';
import { ITipoEspacioService } from 'src/services/interfaces';
import { Repository } from 'typeorm';

@Injectable()
export class TipoEspacioService implements ITipoEspacioService {
  constructor(
    @InjectRepository(TipoEspacio)
    private readonly tipoEspacioRepository: Repository<TipoEspacio>,
  ) {}

  async create(
    createTipoEspacioDto: CreateTipoEspacioDto,
  ): Promise<BaseResponseDto<TipoEspacio>> {
    if (!createTipoEspacioDto) {
      return {
        success: false,
        message: 'Datos no válidos',
        data: null,
        error: {
          message: 'Ingrese datos válidos, Intente de Nuevo.',
          statusCode: 400,
        },
      };
    }

    try {
      const tipoEspacio =
        this.tipoEspacioRepository.create(createTipoEspacioDto);
      const tipoEspacioGuardado =
        await this.tipoEspacioRepository.save(tipoEspacio);
      return {
        success: true,
        message: 'Tipo de espacio creado exitosamente.',
        data: tipoEspacioGuardado,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al crear el tipo de espacio',
        data: null,
        error: {
          message: 'Error al crear el tipo de espacio: ' + error.message,
          statusCode: 400,
        },
      };
    }
  }

  async findAll(): Promise<BaseResponseDto<TipoEspacio[]>> {
    try {
      const tiposEspacio = await this.tipoEspacioRepository.find();
      return {
        success: true,
        message:
          tiposEspacio.length > 0
            ? 'Tipos de espacio obtenidos exitosamente.'
            : 'No se encontraron tipos de espacio.',
        data: tiposEspacio,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al obtener tipos de espacio',
        data: [],
        error: {
          message: 'Error al obtener tipos de espacio: ' + error.message,
          statusCode: 400,
        },
      };
    }
  }

  async findOne(id: string): Promise<BaseResponseDto<TipoEspacio>> {
    if (!id) {
      return {
        success: false,
        message: 'ID no válido',
        data: null,
        error: {
          message: 'Ingrese un ID válido, Intente de Nuevo.',
          statusCode: 400,
        },
      };
    }

    try {
      const tipoEspacio = await this.tipoEspacioRepository.findOne({
        where: { idTipoEspacio: id },
      });
      if (!tipoEspacio) {
        return {
          success: false,
          message: 'Tipo de espacio no encontrado',
          data: null,
          error: {
            message: 'Tipo de espacio no encontrado.',
            statusCode: 404,
          },
        };
      }
      return {
        success: true,
        message: 'Tipo de espacio obtenido exitosamente.',
        data: tipoEspacio,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al obtener el tipo de espacio',
        data: null,
        error: {
          message: 'Error al obtener el tipo de espacio: ' + error.message,
          statusCode: 400,
        },
      };
    }
  }

  async update(
    id: string,
    updateTipoEspacioDto: UpdateTipoEspacioDto,
  ): Promise<BaseResponseDto<TipoEspacio>> {
    if (!id || !updateTipoEspacioDto) {
      return {
        success: false,
        message: 'Datos no válidos',
        data: null,
        error: {
          message: 'Ingrese datos válidos, Intente de Nuevo.',
          statusCode: 400,
        },
      };
    }

    try {
      const tipoEspacio = await this.tipoEspacioRepository.findOne({
        where: { idTipoEspacio: id },
      });
      if (!tipoEspacio) {
        return {
          success: false,
          message: 'Tipo de espacio no encontrado',
          data: null,
          error: {
            message: 'Tipo de espacio no encontrado.',
            statusCode: 404,
          },
        };
      }

      const updateData: any = { ...updateTipoEspacioDto };
      this.tipoEspacioRepository.merge(tipoEspacio, updateData);
      const tipoEspacioActualizado =
        await this.tipoEspacioRepository.save(tipoEspacio);
      return {
        success: true,
        message: 'Tipo de espacio actualizado exitosamente.',
        data: tipoEspacioActualizado,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al actualizar el tipo de espacio',
        data: null,
        error: {
          message: 'Error al actualizar el tipo de espacio: ' + error.message,
          statusCode: 400,
        },
      };
    }
  }

  async remove(id: string): Promise<BaseResponseDto<void>> {
    if (!id) {
      return {
        success: false,
        message: 'ID no válido',
        data: undefined,
        error: {
          message: 'Ingrese un ID válido, Intente de Nuevo.',
          statusCode: 400,
        },
      };
    }

    try {
      const tipoEspacio = await this.tipoEspacioRepository.findOne({
        where: { idTipoEspacio: id },
      });
      if (!tipoEspacio) {
        return {
          success: false,
          message: 'Tipo de espacio no encontrado',
          data: undefined,
          error: {
            message: 'Tipo de espacio no encontrado.',
            statusCode: 404,
          },
        };
      }

      // Eliminación física ya que no tiene campo estaActivo
      await this.tipoEspacioRepository.remove(tipoEspacio);

      return {
        success: true,
        message: 'Tipo de espacio eliminado exitosamente.',
        data: undefined,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al eliminar el tipo de espacio',
        data: undefined,
        error: {
          message: 'Error al eliminar el tipo de espacio: ' + error.message,
          statusCode: 400,
        },
      };
    }
  }

  async findByNombre(nombre: string): Promise<BaseResponseDto<TipoEspacio>> {
    if (!nombre) {
      return {
        success: false,
        message: 'Nombre no válido',
        data: null,
        error: {
          message: 'Ingrese un nombre válido, Intente de Nuevo.',
          statusCode: 400,
        },
      };
    }

    try {
      const tipoEspacio = await this.tipoEspacioRepository.findOne({
        where: { nombre },
      });
      if (!tipoEspacio) {
        return {
          success: false,
          message: 'Tipo de espacio no encontrado con ese nombre',
          data: null,
          error: {
            message: 'Tipo de espacio no encontrado con ese nombre.',
            statusCode: 404,
          },
        };
      }
      return {
        success: true,
        message: 'Tipo de espacio encontrado exitosamente.',
        data: tipoEspacio,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al buscar el tipo de espacio por nombre',
        data: null,
        error: {
          message:
            'Error al buscar el tipo de espacio por nombre: ' + error.message,
          statusCode: 400,
        },
      };
    }
  }

  // =================== MÉTODOS CON BaseResponse DTOs ESPECÍFICOS ===================

  /**
   * Crear tipo de espacio con respuesta tipada específica
   */
  async createWithBaseResponse(
    createTipoEspacioDto: CreateTipoEspacioDto,
  ): Promise<TipoEspacioSingleResponseDto> {
    try {
      // Verificar si ya existe un tipo de espacio con el mismo nombre
      const tipoEspacioExistente = await this.tipoEspacioRepository.findOne({
        where: { nombre: createTipoEspacioDto.nombre },
      });

      if (tipoEspacioExistente) {
        return {
          success: false,
          statusCode: 409,
          message: 'Ya existe un tipo de espacio con este nombre',
          data: null,
          error: { message: 'Tipo de espacio duplicado' },
        };
      }

      const nuevoTipoEspacio = this.tipoEspacioRepository.create(
        createTipoEspacioDto,
      );
      const tipoEspacioGuardado =
        await this.tipoEspacioRepository.save(nuevoTipoEspacio);

      return {
        success: true,
        statusCode: 201,
        message: 'Tipo de espacio creado exitosamente',
        data: tipoEspacioGuardado,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        message: 'Error al crear el tipo de espacio',
        data: null,
        error: { message: error.message },
      };
    }
  }

  /**
   * Obtener todos los tipos de espacio con respuesta tipada específica
   */
  async findAllWithBaseResponse(): Promise<TipoEspacioArrayResponseDto> {
    try {
      const tiposEspacio = await this.tipoEspacioRepository.find({
        order: { nombre: 'ASC' },
      });

      return {
        success: true,
        statusCode: 200,
        message:
          tiposEspacio.length > 0
            ? 'Tipos de espacio encontrados'
            : 'No se encontraron tipos de espacio',
        data: tiposEspacio,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        message: 'Error al obtener los tipos de espacio',
        data: [],
        error: { message: error.message },
      };
    }
  }

  /**
   * Obtener tipo de espacio por ID con respuesta tipada específica
   */
  async findOneWithBaseResponse(
    id: string,
  ): Promise<TipoEspacioSingleResponseDto> {
    try {
      const tipoEspacio = await this.tipoEspacioRepository.findOne({
        where: { idTipoEspacio: id },
      });

      if (!tipoEspacio) {
        return {
          success: false,
          statusCode: 404,
          message: 'Tipo de espacio no encontrado',
          data: null,
          error: {
            message: 'No existe un tipo de espacio con el ID proporcionado',
          },
        };
      }

      return {
        success: true,
        statusCode: 200,
        message: 'Tipo de espacio encontrado',
        data: tipoEspacio,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        message: 'Error al buscar el tipo de espacio',
        data: null,
        error: { message: error.message },
      };
    }
  }

  /**
   * Actualizar tipo de espacio con respuesta tipada específica
   */
  async updateWithBaseResponse(
    id: string,
    updateTipoEspacioDto: UpdateTipoEspacioDto,
  ): Promise<TipoEspacioSingleResponseDto> {
    try {
      const tipoEspacio = await this.tipoEspacioRepository.findOne({
        where: { idTipoEspacio: id },
      });

      if (!tipoEspacio) {
        return {
          success: false,
          statusCode: 404,
          message: 'Tipo de espacio no encontrado',
          data: null,
          error: {
            message: 'No existe un tipo de espacio con el ID proporcionado',
          },
        };
      }

      // Verificar si se está cambiando el nombre y ya existe otro con ese nombre
      if (
        updateTipoEspacioDto.nombre &&
        updateTipoEspacioDto.nombre !== tipoEspacio.nombre
      ) {
        const tipoEspacioExistente = await this.tipoEspacioRepository.findOne({
          where: { nombre: updateTipoEspacioDto.nombre },
        });

        if (tipoEspacioExistente) {
          return {
            success: false,
            statusCode: 409,
            message: 'Ya existe un tipo de espacio con este nombre',
            data: null,
            error: { message: 'Tipo de espacio duplicado' },
          };
        }
      }

      const tipoEspacioActualizado = await this.tipoEspacioRepository.save({
        ...tipoEspacio,
        ...updateTipoEspacioDto,
      });

      return {
        success: true,
        statusCode: 200,
        message: 'Tipo de espacio actualizado exitosamente',
        data: tipoEspacioActualizado,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        message: 'Error al actualizar el tipo de espacio',
        data: null,
        error: { message: error.message },
      };
    }
  }

  /**
   * Eliminar tipo de espacio con validación de relaciones
   */
  async removeWithBaseResponse(id: string): Promise<BaseResponseDto<undefined>> {
    try {
      const tipoEspacio = await this.tipoEspacioRepository.findOne({
        where: { idTipoEspacio: id },
        relations: ['espacioArrendables'],
      });

      if (!tipoEspacio) {
        return {
          success: false,
          message: 'Tipo de espacio no encontrado',
          data: undefined,
          error: {
            message: 'No existe un tipo de espacio con el ID proporcionado',
          },
        };
      }

      // Verificar si hay espacios arrendables asociados
      if (tipoEspacio.espacioArrendables && tipoEspacio.espacioArrendables.length > 0) {
        return {
          success: false,
          message:
            'No se puede eliminar el tipo de espacio porque tiene espacios arrendables asociados',
          data: undefined,
          error: { message: 'Tipo de espacio en uso' },
        };
      }

      // Eliminación física
      await this.tipoEspacioRepository.remove(tipoEspacio);

      return {
        success: true,
        message: 'Tipo de espacio eliminado exitosamente',
        data: undefined,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al eliminar el tipo de espacio',
        data: undefined,
        error: { message: error.message },
      };
    }
  }

  /**
   * Buscar tipo de espacio por nombre con respuesta tipada específica
   */
  async findByNombreWithBaseResponse(
    nombre: string,
  ): Promise<TipoEspacioSingleResponseDto> {
    try {
      const tipoEspacioEncontrado = await this.tipoEspacioRepository.findOne({
        where: { nombre: nombre },
      });

      if (!tipoEspacioEncontrado) {
        return {
          success: false,
          statusCode: 404,
          message: 'Tipo de espacio no encontrado',
          data: null,
          error: {
            message: `No existe un tipo de espacio con el nombre ${nombre}`,
          },
        };
      }

      return {
        success: true,
        statusCode: 200,
        message: 'Tipo de espacio encontrado',
        data: tipoEspacioEncontrado,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        message: 'Error al buscar el tipo de espacio por nombre',
        data: null,
        error: { message: error.message },
      };
    }
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoCronograma } from '../../../entities/TipoCronograma';
import {
  CreateTipoCronogramaDto,
  UpdateTipoCronogramaDto,
  TipoCronogramaResponseDto,
  TipoCronogramaSingleResponseDto,
  TipoCronogramaArrayResponseDto,
} from '../../../dtos';
import { BaseResponseDto } from '../../../dtos/baseResponse/baseResponse.dto';
import { ITipoCronogramaService } from '../../interfaces/tipo-cronograma.interface';

@Injectable()
export class TipoCronogramaService implements ITipoCronogramaService {
  constructor(
    @InjectRepository(TipoCronograma)
    private readonly tipoCronogramaRepository: Repository<TipoCronograma>,
  ) {}

  async create(
    createTipoCronogramaDto: CreateTipoCronogramaDto,
  ): Promise<BaseResponseDto<TipoCronograma>> {
    try {
      // Verificar si ya existe un tipo de cronograma con el mismo tipo
      const tipoCronogramaExistente =
        await this.tipoCronogramaRepository.findOne({
          where: { tipoCronograma: createTipoCronogramaDto.tipoCronograma },
        });

      if (tipoCronogramaExistente) {
        return {
          success: false,
          message: 'Ya existe un tipo de cronograma con este nombre',
          data: null,
          error: { message: 'Tipo de cronograma duplicado' },
        };
      }

      const nuevoTipoCronograma = this.tipoCronogramaRepository.create(
        createTipoCronogramaDto,
      );
      const tipoCronogramaGuardado =
        await this.tipoCronogramaRepository.save(nuevoTipoCronograma);

      return {
        success: true,
        message: 'Tipo de cronograma creado exitosamente',
        data: tipoCronogramaGuardado,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al crear el tipo de cronograma',
        data: null,
        error: { message: error.message },
      };
    }
  }

  async findAll(): Promise<BaseResponseDto<TipoCronograma[]>> {
    try {
      const tiposCronograma = await this.tipoCronogramaRepository.find({
        order: { tipoCronograma: 'ASC' },
      });

      return {
        success: true,
        message:
          tiposCronograma.length > 0
            ? 'Tipos de cronograma encontrados'
            : 'No se encontraron tipos de cronograma',
        data: tiposCronograma,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al obtener los tipos de cronograma',
        data: [],
        error: { message: error.message },
      };
    }
  }

  async findOne(id: string): Promise<BaseResponseDto<TipoCronograma>> {
    try {
      const tipoCronograma = await this.tipoCronogramaRepository.findOne({
        where: { idTipoCronograma: id },
      });

      if (!tipoCronograma) {
        return {
          success: false,
          message: 'Tipo de cronograma no encontrado',
          data: null,
          error: {
            message: 'No existe un tipo de cronograma con el ID proporcionado',
          },
        };
      }

      return {
        success: true,
        message: 'Tipo de cronograma encontrado',
        data: tipoCronograma,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al buscar el tipo de cronograma',
        data: null,
        error: { message: error.message },
      };
    }
  }

  async update(
    id: string,
    updateTipoCronogramaDto: UpdateTipoCronogramaDto,
  ): Promise<BaseResponseDto<TipoCronograma>> {
    try {
      const tipoCronograma = await this.tipoCronogramaRepository.findOne({
        where: { idTipoCronograma: id },
      });

      if (!tipoCronograma) {
        return {
          success: false,
          message: 'Tipo de cronograma no encontrado',
          data: null,
          error: {
            message: 'No existe un tipo de cronograma con el ID proporcionado',
          },
        };
      }

      // Verificar si se está cambiando el tipo y ya existe otro con ese tipo
      if (
        updateTipoCronogramaDto.tipoCronograma &&
        updateTipoCronogramaDto.tipoCronograma !== tipoCronograma.tipoCronograma
      ) {
        const tipoCronogramaExistente =
          await this.tipoCronogramaRepository.findOne({
            where: { tipoCronograma: updateTipoCronogramaDto.tipoCronograma },
          });

        if (tipoCronogramaExistente) {
          return {
            success: false,
            message: 'Ya existe un tipo de cronograma con este nombre',
            data: null,
            error: { message: 'Tipo de cronograma duplicado' },
          };
        }
      }

      const tipoCronogramaActualizado =
        await this.tipoCronogramaRepository.save({
          ...tipoCronograma,
          ...updateTipoCronogramaDto,
        });

      return {
        success: true,
        message: 'Tipo de cronograma actualizado exitosamente',
        data: tipoCronogramaActualizado,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al actualizar el tipo de cronograma',
        data: null,
        error: { message: error.message },
      };
    }
  }

  async remove(id: string): Promise<BaseResponseDto<undefined>> {
    try {
      const tipoCronograma = await this.tipoCronogramaRepository.findOne({
        where: { idTipoCronograma: id },
        relations: ['cronogramas'],
      });

      if (!tipoCronograma) {
        return {
          success: false,
          message: 'Tipo de cronograma no encontrado',
          data: undefined,
          error: {
            message: 'No existe un tipo de cronograma con el ID proporcionado',
          },
        };
      }

      // Verificar si hay cronogramas asociados
      if (tipoCronograma.cronogramas && tipoCronograma.cronogramas.length > 0) {
        return {
          success: false,
          message:
            'No se puede eliminar el tipo de cronograma porque tiene cronogramas asociados',
          data: undefined,
          error: { message: 'Tipo de cronograma en uso' },
        };
      }

      // Eliminación física
      await this.tipoCronogramaRepository.remove(tipoCronograma);

      return {
        success: true,
        message: 'Tipo de cronograma eliminado exitosamente',
        data: undefined,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al eliminar el tipo de cronograma',
        data: undefined,
        error: { message: error.message },
      };
    }
  }

  async findByTipo(
    tipoCronograma: string,
  ): Promise<BaseResponseDto<TipoCronograma>> {
    try {
      const tipoCronogramaEncontrado =
        await this.tipoCronogramaRepository.findOne({
          where: { tipoCronograma: tipoCronograma },
        });

      if (!tipoCronogramaEncontrado) {
        return {
          success: false,
          message: 'Tipo de cronograma no encontrado',
          data: null,
          error: {
            message: `No existe un tipo de cronograma con el tipo ${tipoCronograma}`,
          },
        };
      }

      return {
        success: true,
        message: 'Tipo de cronograma encontrado',
        data: tipoCronogramaEncontrado,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al buscar el tipo de cronograma por tipo',
        data: null,
        error: { message: error.message },
      };
    }
  }

  // =================== MÉTODOS CON BaseResponse DTOs ESPECÍFICOS ===================
  
  /**
   * Crear tipo de cronograma con respuesta tipada específica
   */
  async createWithBaseResponse(
    createTipoCronogramaDto: CreateTipoCronogramaDto,
  ): Promise<TipoCronogramaSingleResponseDto> {
    try {
      // Verificar si ya existe un tipo de cronograma con el mismo tipo
      const tipoCronogramaExistente =
        await this.tipoCronogramaRepository.findOne({
          where: { tipoCronograma: createTipoCronogramaDto.tipoCronograma },
        });

      if (tipoCronogramaExistente) {
        return {
          success: false,
          statusCode: 409,
          message: 'Ya existe un tipo de cronograma con este nombre',
          data: null,
          error: { message: 'Tipo de cronograma duplicado' },
        };
      }

      const nuevoTipoCronograma = this.tipoCronogramaRepository.create(
        createTipoCronogramaDto,
      );
      const tipoCronogramaGuardado =
        await this.tipoCronogramaRepository.save(nuevoTipoCronograma);

      return {
        success: true,
        statusCode: 201,
        message: 'Tipo de cronograma creado exitosamente',
        data: tipoCronogramaGuardado,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        message: 'Error al crear el tipo de cronograma',
        data: null,
        error: { message: error.message },
      };
    }
  }

  /**
   * Obtener todos los tipos de cronograma con respuesta tipada específica
   */
  async findAllWithBaseResponse(): Promise<TipoCronogramaArrayResponseDto> {
    try {
      const tiposCronograma = await this.tipoCronogramaRepository.find({
        order: { tipoCronograma: 'ASC' },
      });

      return {
        success: true,
        statusCode: 200,
        message:
          tiposCronograma.length > 0
            ? 'Tipos de cronograma encontrados'
            : 'No se encontraron tipos de cronograma',
        data: tiposCronograma,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        message: 'Error al obtener los tipos de cronograma',
        data: [],
        error: { message: error.message },
      };
    }
  }

  /**
   * Obtener tipo de cronograma por ID con respuesta tipada específica
   */
  async findOneWithBaseResponse(
    id: string,
  ): Promise<TipoCronogramaSingleResponseDto> {
    try {
      const tipoCronograma = await this.tipoCronogramaRepository.findOne({
        where: { idTipoCronograma: id },
      });

      if (!tipoCronograma) {
        return {
          success: false,
          statusCode: 404,
          message: 'Tipo de cronograma no encontrado',
          data: null,
          error: {
            message: 'No existe un tipo de cronograma con el ID proporcionado',
          },
        };
      }

      return {
        success: true,
        statusCode: 200,
        message: 'Tipo de cronograma encontrado',
        data: tipoCronograma,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        message: 'Error al buscar el tipo de cronograma',
        data: null,
        error: { message: error.message },
      };
    }
  }

  /**
   * Actualizar tipo de cronograma con respuesta tipada específica
   */
  async updateWithBaseResponse(
    id: string,
    updateTipoCronogramaDto: UpdateTipoCronogramaDto,
  ): Promise<TipoCronogramaSingleResponseDto> {
    try {
      const tipoCronograma = await this.tipoCronogramaRepository.findOne({
        where: { idTipoCronograma: id },
      });

      if (!tipoCronograma) {
        return {
          success: false,
          statusCode: 404,
          message: 'Tipo de cronograma no encontrado',
          data: null,
          error: {
            message: 'No existe un tipo de cronograma con el ID proporcionado',
          },
        };
      }

      // Verificar si se está cambiando el tipo y ya existe otro con ese tipo
      if (
        updateTipoCronogramaDto.tipoCronograma &&
        updateTipoCronogramaDto.tipoCronograma !== tipoCronograma.tipoCronograma
      ) {
        const tipoCronogramaExistente =
          await this.tipoCronogramaRepository.findOne({
            where: { tipoCronograma: updateTipoCronogramaDto.tipoCronograma },
          });

        if (tipoCronogramaExistente) {
          return {
            success: false,
            statusCode: 409,
            message: 'Ya existe un tipo de cronograma con este nombre',
            data: null,
            error: { message: 'Tipo de cronograma duplicado' },
          };
        }
      }

      const tipoCronogramaActualizado =
        await this.tipoCronogramaRepository.save({
          ...tipoCronograma,
          ...updateTipoCronogramaDto,
        });

      return {
        success: true,
        statusCode: 200,
        message: 'Tipo de cronograma actualizado exitosamente',
        data: tipoCronogramaActualizado,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        message: 'Error al actualizar el tipo de cronograma',
        data: null,
        error: { message: error.message },
      };
    }
  }

  /**
   * Eliminar tipo de cronograma con validación de relaciones
   */
  async removeWithBaseResponse(id: string): Promise<BaseResponseDto<undefined>> {
    try {
      const tipoCronograma = await this.tipoCronogramaRepository.findOne({
        where: { idTipoCronograma: id },
        relations: ['cronogramas'],
      });

      if (!tipoCronograma) {
        return {
          success: false,
          message: 'Tipo de cronograma no encontrado',
          data: undefined,
          error: {
            message: 'No existe un tipo de cronograma con el ID proporcionado',
          },
        };
      }

      // Verificar si hay cronogramas asociados
      if (tipoCronograma.cronogramas && tipoCronograma.cronogramas.length > 0) {
        return {
          success: false,
          message:
            'No se puede eliminar el tipo de cronograma porque tiene cronogramas asociados',
          data: undefined,
          error: { message: 'Tipo de cronograma en uso' },
        };
      }

      // Eliminación física
      await this.tipoCronogramaRepository.remove(tipoCronograma);

      return {
        success: true,
        message: 'Tipo de cronograma eliminado exitosamente',
        data: undefined,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al eliminar el tipo de cronograma',
        data: undefined,
        error: { message: error.message },
      };
    }
  }

  /**
   * Buscar tipo de cronograma por tipo con respuesta tipada específica
   */
  async findByTipoWithBaseResponse(
    tipoCronograma: string,
  ): Promise<TipoCronogramaSingleResponseDto> {
    try {
      const tipoCronogramaEncontrado =
        await this.tipoCronogramaRepository.findOne({
          where: { tipoCronograma: tipoCronograma },
        });

      if (!tipoCronogramaEncontrado) {
        return {
          success: false,
          statusCode: 404,
          message: 'Tipo de cronograma no encontrado',
          data: null,
          error: {
            message: `No existe un tipo de cronograma con el tipo ${tipoCronograma}`,
          },
        };
      }

      return {
        success: true,
        statusCode: 200,
        message: 'Tipo de cronograma encontrado',
        data: tipoCronogramaEncontrado,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        message: 'Error al buscar el tipo de cronograma por tipo',
        data: null,
        error: { message: error.message },
      };
    }
  }
}

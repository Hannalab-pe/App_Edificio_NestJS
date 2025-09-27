import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoDocumento } from '../../../entities/TipoDocumento';
import { Documento } from '../../../entities/Documento';
import { BaseResponseDto } from '../../../dtos/baseResponse/baseResponse.dto';
import { ITipoDocumentoService } from '../../interfaces/tipo-documento.interface';
import {
  CreateTipoDocumentoDto,
  UpdateTipoDocumentoDto,
  TipoDocumentoResponseDto,
  TipoDocumentoSingleResponseDto,
  TipoDocumentoArrayResponseDto,
} from 'src/dtos';

@Injectable()
export class TipoDocumentoService implements ITipoDocumentoService {
  constructor(
    @InjectRepository(TipoDocumento)
    private readonly tipoDocumentoRepository: Repository<TipoDocumento>,
    @InjectRepository(Documento)
    private readonly documentoRepository: Repository<Documento>,
  ) {}

  async create(
    createTipoDocumentoDto: CreateTipoDocumentoDto,
  ): Promise<BaseResponseDto<TipoDocumento>> {
    try {
      // Verificar si ya existe un tipo de documento con el mismo nombre
      const existingTipoDocumento = await this.tipoDocumentoRepository.findOne({
        where: { tipoDocumento: createTipoDocumentoDto.tipoDocumento },
      });

      if (existingTipoDocumento) {
        throw new ConflictException(
          'Ya existe un tipo de documento con ese nombre',
        );
      }

      const tipoDocumento = this.tipoDocumentoRepository.create(
        createTipoDocumentoDto,
      );
      const savedTipoDocumento =
        await this.tipoDocumentoRepository.save(tipoDocumento);

      const responseDto: any = {
        idTipoDocumento: savedTipoDocumento.idTipoDocumento,
        tipoDocumento: savedTipoDocumento.tipoDocumento,
        descripcion: savedTipoDocumento.descripcion,
      };

      return {
        success: true,
        message: 'Tipo de documento creado exitosamente',
        data: responseDto,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new Error(`Error al crear el tipo de documento: ${error.message}`);
    }
  }

  async findAll(): Promise<BaseResponseDto<TipoDocumento[]>> {
    try {
      const tiposDocumento = await this.tipoDocumentoRepository.find({
        order: { tipoDocumento: 'ASC' },
      });

      const responseDtos: any[] = tiposDocumento.map((tipo) => ({
        idTipoDocumento: tipo.idTipoDocumento,
        tipoDocumento: tipo.tipoDocumento,
        descripcion: tipo.descripcion,
      }));

      return {
        success: true,
        message: 'Tipos de documento obtenidos exitosamente',
        data: responseDtos,
      };
    } catch (error) {
      throw new Error(
        `Error al obtener los tipos de documento: ${error.message}`,
      );
    }
  }

  async findOne(id: string): Promise<BaseResponseDto<TipoDocumento>> {
    try {
      const tipoDocumento = await this.tipoDocumentoRepository.findOne({
        where: { idTipoDocumento: id },
      });

      if (!tipoDocumento) {
        throw new NotFoundException('Tipo de documento no encontrado');
      }

      const responseDto: any = {
        idTipoDocumento: tipoDocumento.idTipoDocumento,
        tipoDocumento: tipoDocumento.tipoDocumento,
        descripcion: tipoDocumento.descripcion,
      };

      return {
        success: true,
        message: 'Tipo de documento encontrado exitosamente',
        data: responseDto,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Error al buscar el tipo de documento: ${error.message}`);
    }
  }

  async update(
    id: string,
    updateTipoDocumentoDto: UpdateTipoDocumentoDto,
  ): Promise<BaseResponseDto<TipoDocumento>> {
    try {
      const tipoDocumento = await this.tipoDocumentoRepository.findOne({
        where: { idTipoDocumento: id },
      });

      if (!tipoDocumento) {
        throw new NotFoundException('Tipo de documento no encontrado');
      }

      // Verificar si ya existe otro tipo de documento con el mismo nombre (si se está actualizando el nombre)
      if (
        updateTipoDocumentoDto.tipoDocumento &&
        updateTipoDocumentoDto.tipoDocumento !== tipoDocumento.tipoDocumento
      ) {
        const existingTipoDocumento =
          await this.tipoDocumentoRepository.findOne({
            where: { tipoDocumento: updateTipoDocumentoDto.tipoDocumento },
          });

        if (existingTipoDocumento) {
          throw new ConflictException(
            'Ya existe otro tipo de documento con ese nombre',
          );
        }
      }

      // Actualizar los campos
      Object.assign(tipoDocumento, updateTipoDocumentoDto);
      const updatedTipoDocumento =
        await this.tipoDocumentoRepository.save(tipoDocumento);

      const responseDto: any = {
        idTipoDocumento: updatedTipoDocumento.idTipoDocumento,
        tipoDocumento: updatedTipoDocumento.tipoDocumento,
        descripcion: updatedTipoDocumento.descripcion,
      };

      return {
        success: true,
        message: 'Tipo de documento actualizado exitosamente',
        data: responseDto,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new Error(
        `Error al actualizar el tipo de documento: ${error.message}`,
      );
    }
  }

  async remove(id: string): Promise<BaseResponseDto<void>> {
    try {
      const tipoDocumento = await this.tipoDocumentoRepository.findOne({
        where: { idTipoDocumento: id },
      });

      if (!tipoDocumento) {
        throw new NotFoundException('Tipo de documento no encontrado');
      }

      // Verificar si hay documentos asociados
      const documentosRelacionados = await this.documentoRepository.count({
        where: { idTipoDocumento: { idTipoDocumento: id } },
      });

      if (documentosRelacionados > 0) {
        throw new ConflictException(
          'No se puede eliminar el tipo de documento porque tiene documentos asociados',
        );
      }

      await this.tipoDocumentoRepository.remove(tipoDocumento);

      return {
        success: true,
        message: 'Tipo de documento eliminado exitosamente',
        data: undefined,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new Error(
        `Error al eliminar el tipo de documento: ${error.message}`,
      );
    }
  }

  async findByTipoDocumento(
    tipoDocumento: string,
  ): Promise<BaseResponseDto<TipoDocumento>> {
    try {
      const tipoDocumentoEntity = await this.tipoDocumentoRepository.findOne({
        where: { tipoDocumento: tipoDocumento },
      });

      if (!tipoDocumentoEntity) {
        throw new NotFoundException(
          `No se encontró un tipo de documento con el nombre: ${tipoDocumento}`,
        );
      }

      const responseDto: any = {
        idTipoDocumento: tipoDocumentoEntity.idTipoDocumento,
        tipoDocumento: tipoDocumentoEntity.tipoDocumento,
        descripcion: tipoDocumentoEntity.descripcion,
      };

      return {
        success: true,
        message: 'Tipo de documento encontrado por nombre exitosamente',
        data: responseDto,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(
        `Error al buscar el tipo de documento por nombre: ${error.message}`,
      );
    }
  }

  // =================== MÉTODOS CON BaseResponse DTOs ESPECÍFICOS ===================

  /**
   * Crear tipo de documento con respuesta tipada específica
   */
  async createWithBaseResponse(
    createTipoDocumentoDto: CreateTipoDocumentoDto,
  ): Promise<TipoDocumentoSingleResponseDto> {
    try {
      // Verificar si ya existe un tipo de documento con el mismo nombre
      const existingTipoDocumento = await this.tipoDocumentoRepository.findOne({
        where: { tipoDocumento: createTipoDocumentoDto.tipoDocumento },
      });

      if (existingTipoDocumento) {
        return {
          success: false,
          statusCode: 409,
          message: 'Ya existe un tipo de documento con este nombre',
          data: null,
          error: { message: 'Tipo de documento duplicado' },
        };
      }

      const nuevoTipoDocumento = this.tipoDocumentoRepository.create(
        createTipoDocumentoDto,
      );
      const tipoDocumentoGuardado =
        await this.tipoDocumentoRepository.save(nuevoTipoDocumento);

      return {
        success: true,
        statusCode: 201,
        message: 'Tipo de documento creado exitosamente',
        data: tipoDocumentoGuardado,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        message: 'Error al crear el tipo de documento',
        data: null,
        error: { message: error.message },
      };
    }
  }

  /**
   * Obtener todos los tipos de documento con respuesta tipada específica
   */
  async findAllWithBaseResponse(): Promise<TipoDocumentoArrayResponseDto> {
    try {
      const tiposDocumento = await this.tipoDocumentoRepository.find({
        order: { tipoDocumento: 'ASC' },
      });

      return {
        success: true,
        statusCode: 200,
        message:
          tiposDocumento.length > 0
            ? 'Tipos de documento encontrados'
            : 'No se encontraron tipos de documento',
        data: tiposDocumento,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        message: 'Error al obtener los tipos de documento',
        data: [],
        error: { message: error.message },
      };
    }
  }

  /**
   * Obtener tipo de documento por ID con respuesta tipada específica
   */
  async findOneWithBaseResponse(
    id: string,
  ): Promise<TipoDocumentoSingleResponseDto> {
    try {
      const tipoDocumento = await this.tipoDocumentoRepository.findOne({
        where: { idTipoDocumento: id },
      });

      if (!tipoDocumento) {
        return {
          success: false,
          statusCode: 404,
          message: 'Tipo de documento no encontrado',
          data: null,
          error: {
            message: 'No existe un tipo de documento con el ID proporcionado',
          },
        };
      }

      return {
        success: true,
        statusCode: 200,
        message: 'Tipo de documento encontrado',
        data: tipoDocumento,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        message: 'Error al buscar el tipo de documento',
        data: null,
        error: { message: error.message },
      };
    }
  }

  /**
   * Actualizar tipo de documento con respuesta tipada específica
   */
  async updateWithBaseResponse(
    id: string,
    updateTipoDocumentoDto: UpdateTipoDocumentoDto,
  ): Promise<TipoDocumentoSingleResponseDto> {
    try {
      const tipoDocumento = await this.tipoDocumentoRepository.findOne({
        where: { idTipoDocumento: id },
      });

      if (!tipoDocumento) {
        return {
          success: false,
          statusCode: 404,
          message: 'Tipo de documento no encontrado',
          data: null,
          error: {
            message: 'No existe un tipo de documento con el ID proporcionado',
          },
        };
      }

      // Verificar si se está cambiando el nombre y ya existe otro con ese nombre
      if (
        updateTipoDocumentoDto.tipoDocumento &&
        updateTipoDocumentoDto.tipoDocumento !== tipoDocumento.tipoDocumento
      ) {
        const tipoDocumentoExistente =
          await this.tipoDocumentoRepository.findOne({
            where: { tipoDocumento: updateTipoDocumentoDto.tipoDocumento },
          });

        if (tipoDocumentoExistente) {
          return {
            success: false,
            statusCode: 409,
            message: 'Ya existe un tipo de documento con este nombre',
            data: null,
            error: { message: 'Tipo de documento duplicado' },
          };
        }
      }

      const tipoDocumentoActualizado =
        await this.tipoDocumentoRepository.save({
          ...tipoDocumento,
          ...updateTipoDocumentoDto,
        });

      return {
        success: true,
        statusCode: 200,
        message: 'Tipo de documento actualizado exitosamente',
        data: tipoDocumentoActualizado,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        message: 'Error al actualizar el tipo de documento',
        data: null,
        error: { message: error.message },
      };
    }
  }

  /**
   * Eliminar tipo de documento con validación de relaciones
   */
  async removeWithBaseResponse(id: string): Promise<BaseResponseDto<undefined>> {
    try {
      const tipoDocumento = await this.tipoDocumentoRepository.findOne({
        where: { idTipoDocumento: id },
        relations: ['documentos'],
      });

      if (!tipoDocumento) {
        return {
          success: false,
          message: 'Tipo de documento no encontrado',
          data: undefined,
          error: {
            message: 'No existe un tipo de documento con el ID proporcionado',
          },
        };
      }

      // Verificar si hay documentos asociados
      if (tipoDocumento.documentos && tipoDocumento.documentos.length > 0) {
        return {
          success: false,
          message:
            'No se puede eliminar el tipo de documento porque tiene documentos asociados',
          data: undefined,
          error: { message: 'Tipo de documento en uso' },
        };
      }

      // Eliminación física
      await this.tipoDocumentoRepository.remove(tipoDocumento);

      return {
        success: true,
        message: 'Tipo de documento eliminado exitosamente',
        data: undefined,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al eliminar el tipo de documento',
        data: undefined,
        error: { message: error.message },
      };
    }
  }

  /**
   * Buscar tipo de documento por nombre con respuesta tipada específica
   */
  async findByTipoWithBaseResponse(
    tipoDocumento: string,
  ): Promise<TipoDocumentoSingleResponseDto> {
    try {
      const tipoDocumentoEncontrado =
        await this.tipoDocumentoRepository.findOne({
          where: { tipoDocumento: tipoDocumento },
        });

      if (!tipoDocumentoEncontrado) {
        return {
          success: false,
          statusCode: 404,
          message: 'Tipo de documento no encontrado',
          data: null,
          error: {
            message: `No existe un tipo de documento con el nombre ${tipoDocumento}`,
          },
        };
      }

      return {
        success: true,
        statusCode: 200,
        message: 'Tipo de documento encontrado',
        data: tipoDocumentoEncontrado,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        message: 'Error al buscar el tipo de documento por nombre',
        data: null,
        error: { message: error.message },
      };
    }
  }
}

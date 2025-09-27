import {
  CreateTipoDocumentoDto,
  UpdateTipoDocumentoDto,
  TipoDocumentoSingleResponseDto,
  TipoDocumentoArrayResponseDto,
} from 'src/dtos';
import { BaseResponseDto } from '../../dtos/baseResponse/baseResponse.dto';
import { TipoDocumento } from 'src/entities/TipoDocumento';

export interface ITipoDocumentoService {
  create(
    createTipoDocumentoDto: CreateTipoDocumentoDto,
  ): Promise<BaseResponseDto<TipoDocumento>>;
  findAll(): Promise<BaseResponseDto<TipoDocumento[]>>;
  findOne(id: string): Promise<BaseResponseDto<TipoDocumento>>;
  update(
    id: string,
    updateTipoDocumentoDto: UpdateTipoDocumentoDto,
  ): Promise<BaseResponseDto<TipoDocumento>>;
  remove(id: string): Promise<BaseResponseDto<void>>;
  findByTipoDocumento(
    tipoDocumento: string,
  ): Promise<BaseResponseDto<TipoDocumento>>;

  // =================== MÉTODOS CON BaseResponse DTOs ESPECÍFICOS ===================

  /**
   * Crear tipo de documento con respuesta tipada específica
   */
  createWithBaseResponse(
    createTipoDocumentoDto: CreateTipoDocumentoDto,
  ): Promise<TipoDocumentoSingleResponseDto>;

  /**
   * Obtener todos los tipos de documento con respuesta tipada específica
   */
  findAllWithBaseResponse(): Promise<TipoDocumentoArrayResponseDto>;

  /**
   * Obtener tipo de documento por ID con respuesta tipada específica
   */
  findOneWithBaseResponse(id: string): Promise<TipoDocumentoSingleResponseDto>;

  /**
   * Actualizar tipo de documento con respuesta tipada específica
   */
  updateWithBaseResponse(
    id: string,
    updateTipoDocumentoDto: UpdateTipoDocumentoDto,
  ): Promise<TipoDocumentoSingleResponseDto>;

  /**
   * Eliminar tipo de documento con validación de relaciones
   */
  removeWithBaseResponse(id: string): Promise<BaseResponseDto<undefined>>;

  /**
   * Buscar tipo de documento por nombre con respuesta tipada específica
   */
  findByTipoWithBaseResponse(
    tipoDocumento: string,
  ): Promise<TipoDocumentoSingleResponseDto>;
}

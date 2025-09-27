import { BaseResponseDto } from 'src/dtos/baseResponse/baseResponse.dto';
import {
  CreateTipoEspacioDto,
  UpdateTipoEspacioDto,
  TipoEspacioSingleResponseDto,
  TipoEspacioArrayResponseDto,
} from 'src/dtos';
import { TipoEspacio } from '../../entities/TipoEspacio';

export interface ITipoEspacioService {
  create(
    createTipoEspacioDto: CreateTipoEspacioDto,
  ): Promise<BaseResponseDto<TipoEspacio>>;
  findAll(): Promise<BaseResponseDto<TipoEspacio[]>>;
  findOne(id: string): Promise<BaseResponseDto<TipoEspacio>>;
  update(
    id: string,
    updateTipoEspacioDto: UpdateTipoEspacioDto,
  ): Promise<BaseResponseDto<TipoEspacio>>;
  remove(id: string): Promise<BaseResponseDto<void>>;
  findByNombre(nombre: string): Promise<BaseResponseDto<TipoEspacio>>;

  // =================== MÉTODOS CON BaseResponse DTOs ESPECÍFICOS ===================

  /**
   * Crear tipo de espacio con respuesta tipada específica
   */
  createWithBaseResponse(
    createTipoEspacioDto: CreateTipoEspacioDto,
  ): Promise<TipoEspacioSingleResponseDto>;

  /**
   * Obtener todos los tipos de espacio con respuesta tipada específica
   */
  findAllWithBaseResponse(): Promise<TipoEspacioArrayResponseDto>;

  /**
   * Obtener tipo de espacio por ID con respuesta tipada específica
   */
  findOneWithBaseResponse(id: string): Promise<TipoEspacioSingleResponseDto>;

  /**
   * Actualizar tipo de espacio con respuesta tipada específica
   */
  updateWithBaseResponse(
    id: string,
    updateTipoEspacioDto: UpdateTipoEspacioDto,
  ): Promise<TipoEspacioSingleResponseDto>;

  /**
   * Eliminar tipo de espacio con validación de relaciones
   */
  removeWithBaseResponse(id: string): Promise<BaseResponseDto<undefined>>;

  /**
   * Buscar tipo de espacio por nombre con respuesta tipada específica
   */
  findByNombreWithBaseResponse(
    nombre: string,
  ): Promise<TipoEspacioSingleResponseDto>;
}

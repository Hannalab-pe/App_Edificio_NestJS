import { BaseResponseDto } from 'src/dtos/baseResponse/baseResponse.dto';
import {
  CreateTipoContratoDto,
  UpdateTipoContratoDto,
  TipoContratoSingleResponseDto,
  TipoContratoArrayResponseDto,
} from 'src/dtos';
import { TipoContrato } from '../../entities/TipoContrato';

export interface ITipoContratoService {
  // Métodos legacy para mantener compatibilidad
  create(
    createTipoContratoDto: CreateTipoContratoDto,
  ): Promise<BaseResponseDto<TipoContrato>>;
  findAll(): Promise<BaseResponseDto<TipoContrato[]>>;
  findOne(id: string): Promise<BaseResponseDto<TipoContrato>>;
  update(
    id: string,
    updateTipoContratoDto: UpdateTipoContratoDto,
  ): Promise<BaseResponseDto<TipoContrato>>;
  remove(id: string): Promise<BaseResponseDto<undefined>>;
  findByNombre(nombre: string): Promise<BaseResponseDto<TipoContrato>>;

  // Nuevos métodos modernizados con BaseResponseDto
  createWithBaseResponse(
    createTipoContratoDto: CreateTipoContratoDto,
  ): Promise<TipoContratoSingleResponseDto>;
  findAllWithBaseResponse(): Promise<TipoContratoArrayResponseDto>;
  findOneWithBaseResponse(id: string): Promise<TipoContratoSingleResponseDto>;
  updateWithBaseResponse(
    id: string,
    updateTipoContratoDto: UpdateTipoContratoDto,
  ): Promise<TipoContratoSingleResponseDto>;
  removeWithBaseResponse(id: string): Promise<BaseResponseDto<undefined>>;
  findByNombreWithBaseResponse(
    nombre: string,
  ): Promise<TipoContratoSingleResponseDto>;
}

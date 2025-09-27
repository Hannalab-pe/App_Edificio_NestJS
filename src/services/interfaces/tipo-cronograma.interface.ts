import { BaseResponseDto } from 'src/dtos/baseResponse/baseResponse.dto';
import {
  CreateTipoCronogramaDto,
  UpdateTipoCronogramaDto,
  TipoCronogramaSingleResponseDto,
  TipoCronogramaArrayResponseDto,
} from 'src/dtos';
import { TipoCronograma } from '../../entities/TipoCronograma';

export interface ITipoCronogramaService {
  // Métodos originales con BaseResponseDto genérico
  create(
    createTipoCronogramaDto: CreateTipoCronogramaDto,
  ): Promise<BaseResponseDto<TipoCronograma>>;
  findAll(): Promise<BaseResponseDto<TipoCronograma[]>>;
  findOne(id: string): Promise<BaseResponseDto<TipoCronograma>>;
  update(
    id: string,
    updateTipoCronogramaDto: UpdateTipoCronogramaDto,
  ): Promise<BaseResponseDto<TipoCronograma>>;
  remove(id: string): Promise<BaseResponseDto<undefined>>;
  findByTipo(tipoCronograma: string): Promise<BaseResponseDto<TipoCronograma>>;

  // Nuevos métodos con DTOs específicos
  createWithBaseResponse(
    createTipoCronogramaDto: CreateTipoCronogramaDto,
  ): Promise<TipoCronogramaSingleResponseDto>;
  findAllWithBaseResponse(): Promise<TipoCronogramaArrayResponseDto>;
  findOneWithBaseResponse(id: string): Promise<TipoCronogramaSingleResponseDto>;
  updateWithBaseResponse(
    id: string,
    updateTipoCronogramaDto: UpdateTipoCronogramaDto,
  ): Promise<TipoCronogramaSingleResponseDto>;
  removeWithBaseResponse(id: string): Promise<BaseResponseDto<undefined>>;
  findByTipoWithBaseResponse(
    tipoCronograma: string,
  ): Promise<TipoCronogramaSingleResponseDto>;
}

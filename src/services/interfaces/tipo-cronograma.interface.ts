import { BaseResponseDto } from 'src/dtos/baseResponse/baseResponse.dto';
import { CreateTipoCronogramaDto, UpdateTipoCronogramaDto } from 'src/dtos';
import { TipoCronograma } from '../../entities/TipoCronograma';

export interface ITipoCronogramaService {
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
}

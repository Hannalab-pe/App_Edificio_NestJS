import { BaseResponseDto } from 'src/dtos/baseResponse/baseResponse.dto';
import { CreateTipoContratoDto, UpdateTipoContratoDto } from 'src/dtos';
import { TipoContrato } from '../../entities/TipoContrato';

export interface ITipoContratoService {
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
}

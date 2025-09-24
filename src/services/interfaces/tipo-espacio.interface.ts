import { BaseResponseDto } from 'src/dtos/baseResponse/baseResponse.dto';
import { CreateTipoEspacioDto, UpdateTipoEspacioDto } from 'src/dtos';
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
}

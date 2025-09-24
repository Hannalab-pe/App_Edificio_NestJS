import { BaseResponseDto } from 'src/dtos/baseResponse/baseResponse.dto';
import { TipoContacto } from '../../entities/TipoContacto';
import { CreateTipoContactoDto, UpdateTipoContactoDto } from 'src/dtos';

export interface ITipoContactoService {
  create(
    createTipoContactoDto: CreateTipoContactoDto,
  ): Promise<BaseResponseDto<TipoContacto>>;
  findAll(): Promise<BaseResponseDto<TipoContacto[]>>;
  findOne(id: string): Promise<BaseResponseDto<TipoContacto>>;
  update(
    id: string,
    updateTipoContactoDto: UpdateTipoContactoDto,
  ): Promise<BaseResponseDto<TipoContacto>>;
  remove(id: string): Promise<BaseResponseDto<undefined>>;
  findByNombre(nombre: string): Promise<BaseResponseDto<TipoContacto>>;
}

import { BaseResponseDto } from 'src/dtos/baseResponse/baseResponse.dto';
import { TipoContacto } from '../../entities/TipoContacto';
import { 
  CreateTipoContactoDto, 
  UpdateTipoContactoDto,
  TipoContactoSingleResponseDto,
  TipoContactoArrayResponseDto 
} from 'src/dtos';

export interface ITipoContactoService {
  // Métodos legacy para mantener compatibilidad
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

  // Nuevos métodos modernizados con BaseResponseDto
  createWithBaseResponse(
    createTipoContactoDto: CreateTipoContactoDto,
  ): Promise<TipoContactoSingleResponseDto>;
  findAllWithBaseResponse(): Promise<TipoContactoArrayResponseDto>;
  findOneWithBaseResponse(id: string): Promise<TipoContactoSingleResponseDto>;
  updateWithBaseResponse(
    id: string,
    updateTipoContactoDto: UpdateTipoContactoDto,
  ): Promise<TipoContactoSingleResponseDto>;
  removeWithBaseResponse(id: string): Promise<BaseResponseDto<undefined>>;
  findByNombreWithBaseResponse(nombre: string): Promise<TipoContactoArrayResponseDto>;
}

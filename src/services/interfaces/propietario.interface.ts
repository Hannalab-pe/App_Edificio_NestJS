import { BaseResponseDto } from 'src/dtos/baseResponse/baseResponse.dto';
import { CreatePropietarioDto, UpdatePropietarioDto } from '../../dtos';
import { Propietario } from '../../entities/Propietario';

export interface IPropietarioService {
  createPropietario(
    createPropietarioDto: CreatePropietarioDto,
  ): Promise<BaseResponseDto<Propietario>>;
  findAll(): Promise<BaseResponseDto<Propietario[]>>;
  findOne(id: string): Promise<BaseResponseDto<Propietario>>;
  update(
    id: string,
    updatePropietarioDto: UpdatePropietarioDto,
  ): Promise<BaseResponseDto<Propietario>>;
  remove(id: string): Promise<BaseResponseDto<void>>;
  findByNumeroDocumento(
    numeroDocumento: string,
  ): Promise<BaseResponseDto<Propietario>>;
  findWithPropiedades(id: string): Promise<BaseResponseDto<Propietario>>;
}

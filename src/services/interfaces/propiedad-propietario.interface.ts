import { BaseResponseDto } from 'src/dtos/baseResponse/baseResponse.dto';
import { PropiedadPropietario } from '../../entities/PropiedadPropietario';
import { CreatePropiedadPropietarioDto } from 'src/dtos/propiedad-propietario/create-propiedad-propietario.dto';
import { UpdatePropiedadPropietarioDto } from 'src/dtos/propiedad-propietario/update-propiedad-propietario.dto';

export interface IPropiedadPropietarioService {
    create(createPropiedadPropietarioDto: CreatePropiedadPropietarioDto): Promise<BaseResponseDto<PropiedadPropietario>>;
    findAll(): Promise<BaseResponseDto<PropiedadPropietario[]>>;
    findOne(id: string): Promise<BaseResponseDto<PropiedadPropietario>>;
    update(id: string, updatePropiedadPropietarioDto: UpdatePropiedadPropietarioDto): Promise<BaseResponseDto<PropiedadPropietario>>;
    remove(id: string): Promise<BaseResponseDto<void>>;
    findByPropiedad(propiedadId: string): Promise<BaseResponseDto<PropiedadPropietario[]>>;
    findByPropietario(propietarioId: string): Promise<BaseResponseDto<PropiedadPropietario[]>>;
}
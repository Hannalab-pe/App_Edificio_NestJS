import { BaseResponseDto } from 'src/dtos/baseResponse/baseResponse.dto';
import { CreatePropiedadDto, UpdatePropiedadDto } from 'src/dtos';
import { Propiedad } from '../../entities/Propiedad';

export interface IPropiedadService {
    create(createPropiedadDto: CreatePropiedadDto): Promise<BaseResponseDto<Propiedad>>;
    findAll(): Promise<BaseResponseDto<Propiedad[]>>;
    findOne(id: string): Promise<BaseResponseDto<Propiedad>>;
    update(id: string, updatePropiedadDto: UpdatePropiedadDto): Promise<BaseResponseDto<Propiedad>>;
    remove(id: string): Promise<BaseResponseDto<undefined>>;
    findByTipoPropiedad(tipoPropiedad: string): Promise<BaseResponseDto<Propiedad[]>>;
    findByPiso(piso: number): Promise<BaseResponseDto<Propiedad[]>>;
    findByEstadoOcupacion(estadoOcupacion: string): Promise<BaseResponseDto<Propiedad[]>>;
    findByNumeroDepartamento(numeroDepartamento: string): Promise<BaseResponseDto<Propiedad>>;
}
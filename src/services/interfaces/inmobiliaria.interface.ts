import { BaseResponseDto } from 'src/dtos/baseResponse/baseResponse.dto';
import { CreateInmobiliariaDto, UpdateInmobiliariaDto } from 'src/dtos';
import { Inmobiliaria } from '../../entities/Inmobiliaria';

export interface IInmobiliariaService {
    create(
        createInmobiliariaDto: CreateInmobiliariaDto,
    ): Promise<BaseResponseDto<Inmobiliaria>>;
    findAll(): Promise<BaseResponseDto<Inmobiliaria[]>>;
    findOne(id: string): Promise<BaseResponseDto<Inmobiliaria>>;
    update(
        id: string,
        updateInmobiliariaDto: UpdateInmobiliariaDto,
    ): Promise<BaseResponseDto<Inmobiliaria>>;
    remove(id: string): Promise<BaseResponseDto<void>>;
    findByNombre(nombre: string): Promise<BaseResponseDto<Inmobiliaria>>;
    findByCorreo(correo: string): Promise<BaseResponseDto<Inmobiliaria>>;
}
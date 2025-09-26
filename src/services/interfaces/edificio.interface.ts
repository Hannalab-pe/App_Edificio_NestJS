import { BaseResponseDto } from 'src/dtos/baseResponse/baseResponse.dto';
import { CreateEdificioDto, UpdateEdificioDto } from 'src/dtos';
import { Edificio } from '../../entities/Edificio';

export interface IEdificioService {
    create(
        createEdificioDto: CreateEdificioDto,
    ): Promise<BaseResponseDto<Edificio>>;
    findAll(): Promise<BaseResponseDto<Edificio[]>>;
    findOne(id: string): Promise<BaseResponseDto<Edificio>>;
    update(
        id: string,
        updateEdificioDto: UpdateEdificioDto,
    ): Promise<BaseResponseDto<Edificio>>;
    remove(id: string): Promise<BaseResponseDto<void>>;
    findByNombre(nombre: string): Promise<BaseResponseDto<Edificio>>;
    findByDistrito(distrito: string): Promise<BaseResponseDto<Edificio[]>>;
    findByInmobiliaria(idInmobiliaria: string): Promise<BaseResponseDto<Edificio[]>>;
    findActivos(): Promise<BaseResponseDto<Edificio[]>>;
}
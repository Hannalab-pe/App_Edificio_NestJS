import { BaseResponseDto } from 'src/dtos/baseResponse/baseResponse.dto';
import { CreateAreaComunDto, UpdateAreaComunDto } from '../../dtos';
import { AreaComun } from '../../entities/AreaComun';

export interface IAreaComunService {
    createAreaComun(createAreaComunDto: CreateAreaComunDto): Promise<BaseResponseDto<AreaComun>>;
    findAll(): Promise<BaseResponseDto<AreaComun[]>>;
    findOne(id: string): Promise<BaseResponseDto<AreaComun>>;
    updateAreaComun(id: string, updateAreaComunDto: UpdateAreaComunDto): Promise<BaseResponseDto<AreaComun>>;
    eliminacionLogica(id: string): Promise<BaseResponseDto<void>>;
    findByEstado(estado: boolean): Promise<BaseResponseDto<AreaComun[]>>;
    findAvailable(): Promise<BaseResponseDto<AreaComun[]>>;
}
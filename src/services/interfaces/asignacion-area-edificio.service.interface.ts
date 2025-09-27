import { BaseResponseDto } from '../../dtos/baseResponse/baseResponse.dto';
import { CreateAsignacionAreaEdificioDto, UpdateAsignacionAreaEdificioDto, AsignacionAreaEdificioResponseDto, CreateMultipleAsignacionAreaEdificioDto } from '../../dtos/asignacion-area-edificio';

export interface IAsignacionAreaEdificioService {
    create(createAsignacionDto: CreateAsignacionAreaEdificioDto): Promise<BaseResponseDto<AsignacionAreaEdificioResponseDto>>;
    createMultiple(createMultipleDto: CreateMultipleAsignacionAreaEdificioDto): Promise<BaseResponseDto<AsignacionAreaEdificioResponseDto[]>>;
    findAll(): Promise<BaseResponseDto<AsignacionAreaEdificioResponseDto[]>>;
    findOne(id: string): Promise<BaseResponseDto<AsignacionAreaEdificioResponseDto>>;
    findByEdificio(idEdificio: string): Promise<BaseResponseDto<AsignacionAreaEdificioResponseDto[]>>;
    findByAreaComun(idAreaComun: string): Promise<BaseResponseDto<AsignacionAreaEdificioResponseDto[]>>;
    update(id: string, updateAsignacionDto: UpdateAsignacionAreaEdificioDto): Promise<BaseResponseDto<AsignacionAreaEdificioResponseDto>>;
    remove(id: string): Promise<BaseResponseDto<string>>;
    toggleStatus(id: string): Promise<BaseResponseDto<AsignacionAreaEdificioResponseDto>>;
}

import { CreateTipoDocumentoDto, UpdateTipoDocumentoDto } from 'src/dtos';
import { BaseResponseDto } from '../../dtos/baseResponse/baseResponse.dto';
import { TipoDocumento } from 'src/entities/TipoDocumento';

export interface ITipoDocumentoService {
    create(createTipoDocumentoDto: CreateTipoDocumentoDto): Promise<BaseResponseDto<TipoDocumento>>;
    findAll(): Promise<BaseResponseDto<TipoDocumento[]>>;
    findOne(id: string): Promise<BaseResponseDto<TipoDocumento>>;
    update(id: string, updateTipoDocumentoDto: UpdateTipoDocumentoDto): Promise<BaseResponseDto<TipoDocumento>>;
    remove(id: string): Promise<BaseResponseDto<void>>;
    findByTipoDocumento(tipoDocumento: string): Promise<BaseResponseDto<TipoDocumento>>;
}
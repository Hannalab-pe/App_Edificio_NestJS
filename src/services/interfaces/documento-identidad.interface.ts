import { BaseResponseDto } from 'src/dtos/baseResponse/baseResponse.dto';
import { CreateDocumentoIdentidadDto, UpdateDocumentoIdentidadDto } from '../../dtos';
import { DocumentoIdentidad } from '../../entities/DocumentoIdentidad';

export interface IDocumentoIdentidadService {
    create(createDocumentoIdentidadDto: CreateDocumentoIdentidadDto): Promise<BaseResponseDto<DocumentoIdentidad>>;
    findAll(): Promise<BaseResponseDto<DocumentoIdentidad[]>>;
    findOne(id: string): Promise<BaseResponseDto<DocumentoIdentidad>>;
    update(id: string, updateDocumentoIdentidadDto: UpdateDocumentoIdentidadDto): Promise<BaseResponseDto<DocumentoIdentidad>>;
    remove(id: string): Promise<BaseResponseDto<void>>;
    findByTipo(tipo: string): Promise<BaseResponseDto<DocumentoIdentidad[]>>;
    findByNumero(numero: number): Promise<BaseResponseDto<DocumentoIdentidad>>;
}
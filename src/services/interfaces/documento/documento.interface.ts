import { BaseResponseDto } from 'src/dtos/baseResponse/baseResponse.dto';
import { CreateDocumentoDto, UpdateDocumentoDto, DocumentoResponseDto } from 'src/dtos/index';

export interface IDocumentoService {
    create(createDocumentoDto: CreateDocumentoDto): Promise<BaseResponseDto<DocumentoResponseDto>>;
    findAll(): Promise<BaseResponseDto<DocumentoResponseDto[]>>;
    findOne(id: string): Promise<BaseResponseDto<DocumentoResponseDto>>;
    update(id: string, updateDocumentoDto: UpdateDocumentoDto): Promise<BaseResponseDto<DocumentoResponseDto>>;
    remove(id: string): Promise<BaseResponseDto<void>>;

    findByTipoDocumento(idTipoDocumento: string): Promise<BaseResponseDto<DocumentoResponseDto[]>>;
    findByTrabajador(idTrabajador: string): Promise<BaseResponseDto<DocumentoResponseDto[]>>;
    findByDescripcion(descripcion: string): Promise<BaseResponseDto<DocumentoResponseDto[]>>;
}
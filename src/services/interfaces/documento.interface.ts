import { CreateDocumentoDto, UpdateDocumentoDto } from '../../dtos';
import { Documento } from '../../entities/Documento';

export interface IDocumentoService {
    create(createDocumentoDto: CreateDocumentoDto): Promise<Documento>;
    findAll(): Promise<Documento[]>;
    findOne(id: string): Promise<Documento>;
    update(id: string, updateDocumentoDto: UpdateDocumentoDto): Promise<Documento>;
    remove(id: string): Promise<void>;
    findByTipo(tipoId: string): Promise<Documento[]>;
    findByUsuario(usuarioId: string): Promise<Documento[]>;
    findByFechaRange(fechaInicio: Date, fechaFin: Date): Promise<Documento[]>;
}
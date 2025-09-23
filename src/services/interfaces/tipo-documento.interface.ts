import { TipoDocumento } from '../../entities/TipoDocumento';

export interface ITipoDocumentoService {
    create(createTipoDocumentoDto: any): Promise<TipoDocumento>;
    findAll(): Promise<TipoDocumento[]>;
    findOne(id: string): Promise<TipoDocumento>;
    update(id: string, updateTipoDocumentoDto: any): Promise<TipoDocumento>;
    remove(id: string): Promise<void>;
    findByNombre(nombre: string): Promise<TipoDocumento>;
}
import { TipoContrato } from '../../entities/TipoContrato';

export interface ITipoContratoService {
    create(createTipoContratoDto: any): Promise<TipoContrato>;
    findAll(): Promise<TipoContrato[]>;
    findOne(id: string): Promise<TipoContrato>;
    update(id: string, updateTipoContratoDto: any): Promise<TipoContrato>;
    remove(id: string): Promise<void>;
    findByNombre(nombre: string): Promise<TipoContrato>;
}
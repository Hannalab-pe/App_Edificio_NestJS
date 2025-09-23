import { TipoContacto } from '../../entities/TipoContacto';

export interface ITipoContactoService {
    create(createTipoContactoDto: any): Promise<TipoContacto>;
    findAll(): Promise<TipoContacto[]>;
    findOne(id: string): Promise<TipoContacto>;
    update(id: string, updateTipoContactoDto: any): Promise<TipoContacto>;
    remove(id: string): Promise<void>;
    findByNombre(nombre: string): Promise<TipoContacto>;
}
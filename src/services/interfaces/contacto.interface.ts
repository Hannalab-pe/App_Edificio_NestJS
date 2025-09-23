import { Contacto } from '../../entities/Contacto';

export interface IContactoService {
    create(createContactoDto: any): Promise<Contacto>;
    findAll(): Promise<Contacto[]>;
    findOne(id: string): Promise<Contacto>;
    update(id: string, updateContactoDto: any): Promise<Contacto>;
    remove(id: string): Promise<void>;
    findByTipo(tipoId: string): Promise<Contacto[]>;
    findByUsuario(usuarioId: string): Promise<Contacto[]>;
}
import { TipoEspacio } from '../../entities/TipoEspacio';

export interface ITipoEspacioService {
    create(createTipoEspacioDto: any): Promise<TipoEspacio>;
    findAll(): Promise<TipoEspacio[]>;
    findOne(id: string): Promise<TipoEspacio>;
    update(id: string, updateTipoEspacioDto: any): Promise<TipoEspacio>;
    remove(id: string): Promise<void>;
    findByNombre(nombre: string): Promise<TipoEspacio>;
}
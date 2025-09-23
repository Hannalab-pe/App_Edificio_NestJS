import { TipoIncidencia } from '../../entities/TipoIncidencia';

export interface ITipoIncidenciaService {
    create(createTipoIncidenciaDto: any): Promise<TipoIncidencia>;
    findAll(): Promise<TipoIncidencia[]>;
    findOne(id: string): Promise<TipoIncidencia>;
    update(id: string, updateTipoIncidenciaDto: any): Promise<TipoIncidencia>;
    remove(id: string): Promise<void>;
    findByNombre(nombre: string): Promise<TipoIncidencia>;
}
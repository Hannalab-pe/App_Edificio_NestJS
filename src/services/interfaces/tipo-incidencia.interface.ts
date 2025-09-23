import { CreateTipoIncidenciaDto, UpdateTipoIncidenciaDto } from '../../dtos';
import { TipoIncidencia } from '../../entities/TipoIncidencia';

export interface ITipoIncidenciaService {
    create(createTipoIncidenciaDto: CreateTipoIncidenciaDto): Promise<TipoIncidencia>;
    findAll(): Promise<TipoIncidencia[]>;
    findOne(id: string): Promise<TipoIncidencia>;
    update(id: string, updateTipoIncidenciaDto: UpdateTipoIncidenciaDto): Promise<TipoIncidencia>;
    remove(id: string): Promise<void>;
    findByNombre(nombre: string): Promise<TipoIncidencia>;
    findByPrioridad(prioridad: string): Promise<TipoIncidencia[]>;
    findActivos(): Promise<TipoIncidencia[]>;
}
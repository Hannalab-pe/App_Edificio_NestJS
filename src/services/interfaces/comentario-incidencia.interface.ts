import { ComentarioIncidencia } from '../../entities/ComentarioIncidencia';

export interface IComentarioIncidenciaService {
    create(createComentarioIncidenciaDto: any): Promise<ComentarioIncidencia>;
    findAll(): Promise<ComentarioIncidencia[]>;
    findOne(id: string): Promise<ComentarioIncidencia>;
    update(id: string, updateComentarioIncidenciaDto: any): Promise<ComentarioIncidencia>;
    remove(id: string): Promise<void>;
    findByIncidencia(incidenciaId: string): Promise<ComentarioIncidencia[]>;
    findByUsuario(usuarioId: string): Promise<ComentarioIncidencia[]>;
}
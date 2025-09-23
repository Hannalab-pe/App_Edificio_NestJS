import { CreateComentarioIncidenciaDto, UpdateComentarioIncidenciaDto } from '../../dtos';
import { ComentarioIncidencia } from '../../entities/ComentarioIncidencia';

export interface IComentarioIncidenciaService {
    create(createComentarioIncidenciaDto: CreateComentarioIncidenciaDto): Promise<ComentarioIncidencia>;
    findAll(): Promise<ComentarioIncidencia[]>;
    findOne(id: string): Promise<ComentarioIncidencia>;
    update(id: string, updateComentarioIncidenciaDto: UpdateComentarioIncidenciaDto): Promise<ComentarioIncidencia>;
    remove(id: string): Promise<void>;
    findByIncidencia(idIncidencia: string): Promise<ComentarioIncidencia[]>;
    findByUsuario(idUsuario: string): Promise<ComentarioIncidencia[]>;
}
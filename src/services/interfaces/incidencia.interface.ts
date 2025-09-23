import { CreateIncidenciaDto, UpdateIncidenciaDto } from '../../dtos';
import { Incidencia } from '../../entities/Incidencia';

export interface IIncidenciaService {
    create(createIncidenciaDto: CreateIncidenciaDto): Promise<Incidencia>;
    findAll(): Promise<Incidencia[]>;
    findOne(id: string): Promise<Incidencia>;
    update(id: string, updateIncidenciaDto: UpdateIncidenciaDto): Promise<Incidencia>;
    remove(id: string): Promise<void>;
    findByEstado(estado: string): Promise<Incidencia[]>;
    findByPrioridad(prioridad: string): Promise<Incidencia[]>;
    findByTipo(tipoId: string): Promise<Incidencia[]>;
    findByUsuario(usuarioId: string): Promise<Incidencia[]>;
    findByTrabajador(trabajadorId: string): Promise<Incidencia[]>;
    resolve(id: string): Promise<Incidencia>;
    asignarTrabajador(incidenciaId: string, trabajadorId: string): Promise<Incidencia>;
    findWithFilters(estado?: string, prioridad?: string): Promise<Incidencia[]>;
}
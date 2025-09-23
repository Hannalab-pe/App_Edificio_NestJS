import { Residencia } from '../../entities/Residencia';

export interface IResidenciaService {
    create(createResidenciaDto: any): Promise<Residencia>;
    findAll(): Promise<Residencia[]>;
    findOne(id: string): Promise<Residencia>;
    update(id: string, updateResidenciaDto: any): Promise<Residencia>;
    remove(id: string): Promise<void>;
    findByNombre(nombre: string): Promise<Residencia>;
    findByEstado(estado: string): Promise<Residencia[]>;
}
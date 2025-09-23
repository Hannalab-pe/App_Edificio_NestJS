import { Cronograma } from '../../entities/Cronograma';

export interface ICronogramaService {
    create(createCronogramaDto: any): Promise<Cronograma>;
    findAll(): Promise<Cronograma[]>;
    findOne(id: string): Promise<Cronograma>;
    update(id: string, updateCronogramaDto: any): Promise<Cronograma>;
    remove(id: string): Promise<void>;
    findByTipo(tipoId: string): Promise<Cronograma[]>;
    findByFechaRange(fechaInicio: Date, fechaFin: Date): Promise<Cronograma[]>;
    findActive(): Promise<Cronograma[]>;
}
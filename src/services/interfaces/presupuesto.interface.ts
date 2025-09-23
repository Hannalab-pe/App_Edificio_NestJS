import { Presupuesto } from '../../entities/Presupuesto';

export interface IPresupuestoService {
    create(createPresupuestoDto: any): Promise<Presupuesto>;
    findAll(): Promise<Presupuesto[]>;
    findOne(id: string): Promise<Presupuesto>;
    update(id: string, updatePresupuestoDto: any): Promise<Presupuesto>;
    remove(id: string): Promise<void>;
    findByEstado(estado: string): Promise<Presupuesto[]>;
    findByFechaRange(fechaInicio: Date, fechaFin: Date): Promise<Presupuesto[]>;
    findByAnio(anio: number): Promise<Presupuesto[]>;
}
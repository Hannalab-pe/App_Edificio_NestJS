import { Trabajador } from '../../entities/Trabajador';

export interface ITrabajadorService {
    create(createTrabajadorDto: any): Promise<Trabajador>;
    findAll(): Promise<Trabajador[]>;
    findOne(id: string): Promise<Trabajador>;
    update(id: string, updateTrabajadorDto: any): Promise<Trabajador>;
    remove(id: string): Promise<void>;
    findByNumeroDocumento(numeroDocumento: string): Promise<Trabajador>;
    findByCargo(cargo: string): Promise<Trabajador[]>;
}
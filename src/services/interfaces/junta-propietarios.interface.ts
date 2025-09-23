import { JuntaPropietarios } from '../../entities/JuntaPropietarios';

export interface IJuntaPropietariosService {
    create(createJuntaPropietariosDto: any): Promise<JuntaPropietarios>;
    findAll(): Promise<JuntaPropietarios[]>;
    findOne(id: string): Promise<JuntaPropietarios>;
    update(id: string, updateJuntaPropietariosDto: any): Promise<JuntaPropietarios>;
    remove(id: string): Promise<void>;
    findByEstado(estado: string): Promise<JuntaPropietarios[]>;
    findByFechaRange(fechaInicio: Date, fechaFin: Date): Promise<JuntaPropietarios[]>;
}
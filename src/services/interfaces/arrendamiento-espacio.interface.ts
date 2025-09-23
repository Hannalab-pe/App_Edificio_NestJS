import { ArrendamientoEspacio } from '../../entities/ArrendamientoEspacio';

export interface IArrendamientoEspacioService {
    create(createArrendamientoEspacioDto: any): Promise<ArrendamientoEspacio>;
    findAll(): Promise<ArrendamientoEspacio[]>;
    findOne(id: string): Promise<ArrendamientoEspacio>;
    update(id: string, updateArrendamientoEspacioDto: any): Promise<ArrendamientoEspacio>;
    remove(id: string): Promise<void>;
    findByEstado(estado: string): Promise<ArrendamientoEspacio[]>;
    findByEspacio(espacioId: string): Promise<ArrendamientoEspacio[]>;
    findByArrendatario(arrendatarioId: string): Promise<ArrendamientoEspacio[]>;
    findActive(): Promise<ArrendamientoEspacio[]>;
}
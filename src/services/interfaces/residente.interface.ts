import { Residente } from '../../entities/Residente';

export interface IResidenteService {
    create(createResidenteDto: any): Promise<Residente>;
    findAll(): Promise<Residente[]>;
    findOne(id: string): Promise<Residente>;
    update(id: string, updateResidenteDto: any): Promise<Residente>;
    remove(id: string): Promise<void>;
    findByPropiedad(propiedadId: string): Promise<Residente[]>;
    findByNumeroDocumento(numeroDocumento: string): Promise<Residente>;
}
import { Contrato } from '../../entities/Contrato';

export interface IContratoService {
    create(createContratoDto: any): Promise<Contrato>;
    findAll(): Promise<Contrato[]>;
    findOne(id: string): Promise<Contrato>;
    update(id: string, updateContratoDto: any): Promise<Contrato>;
    remove(id: string): Promise<void>;
    findByEstado(estado: string): Promise<Contrato[]>;
    findByTipo(tipoId: string): Promise<Contrato[]>;
    findByPropietario(propietarioId: string): Promise<Contrato[]>;
    findActive(): Promise<Contrato[]>;
}
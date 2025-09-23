import { ConceptoPago } from '../../entities/ConceptoPago';

export interface IConceptoPagoService {
    create(createConceptoPagoDto: any): Promise<ConceptoPago>;
    findAll(): Promise<ConceptoPago[]>;
    findOne(id: string): Promise<ConceptoPago>;
    update(id: string, updateConceptoPagoDto: any): Promise<ConceptoPago>;
    remove(id: string): Promise<void>;
    findByNombre(nombre: string): Promise<ConceptoPago>;
    findByTipo(tipo: string): Promise<ConceptoPago[]>;
}
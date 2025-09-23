import { TipoCronograma } from '../../entities/TipoCronograma';

export interface ITipoCronogramaService {
    create(createTipoCronogramaDto: any): Promise<TipoCronograma>;
    findAll(): Promise<TipoCronograma[]>;
    findOne(id: string): Promise<TipoCronograma>;
    update(id: string, updateTipoCronogramaDto: any): Promise<TipoCronograma>;
    remove(id: string): Promise<void>;
    findByNombre(nombre: string): Promise<TipoCronograma>;
}
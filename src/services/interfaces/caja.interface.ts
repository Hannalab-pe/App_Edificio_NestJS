import { Caja } from '../../entities/Caja';

export interface ICajaService {
  create(createCajaDto: any): Promise<Caja>;
  findAll(): Promise<Caja[]>;
  findOne(id: string): Promise<Caja>;
  update(id: string, updateCajaDto: any): Promise<Caja>;
  remove(id: string): Promise<void>;
  findByEstado(estado: string): Promise<Caja[]>;
  findActive(): Promise<Caja>;
  getSaldoActual(): Promise<number>;
}

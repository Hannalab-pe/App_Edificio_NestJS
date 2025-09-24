import { Recibo } from '../../entities/Recibo';

export interface IReciboService {
  create(createReciboDto: any): Promise<Recibo>;
  findAll(): Promise<Recibo[]>;
  findOne(id: string): Promise<Recibo>;
  update(id: string, updateReciboDto: any): Promise<Recibo>;
  remove(id: string): Promise<void>;
  findByPago(pagoId: string): Promise<Recibo[]>;
  findByFechaRange(fechaInicio: Date, fechaFin: Date): Promise<Recibo[]>;
  findByPropietario(propietarioId: string): Promise<Recibo[]>;
}

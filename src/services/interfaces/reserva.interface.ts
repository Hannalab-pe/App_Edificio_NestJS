import { Reserva } from '../../entities/Reserva';

export interface IReservaService {
  create(createReservaDto: any): Promise<Reserva>;
  findAll(): Promise<Reserva[]>;
  findOne(id: string): Promise<Reserva>;
  update(id: string, updateReservaDto: any): Promise<Reserva>;
  remove(id: string): Promise<void>;
  findByEstado(estado: string): Promise<Reserva[]>;
  findByAreaComun(areaComunId: string): Promise<Reserva[]>;
  findByUsuario(usuarioId: string): Promise<Reserva[]>;
  findByFechaRange(fechaInicio: Date, fechaFin: Date): Promise<Reserva[]>;
}

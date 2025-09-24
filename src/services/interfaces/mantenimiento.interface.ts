import { Mantenimiento } from '../../entities/Mantenimiento';

export interface IMantenimientoService {
  create(createMantenimientoDto: any): Promise<Mantenimiento>;
  findAll(): Promise<Mantenimiento[]>;
  findOne(id: string): Promise<Mantenimiento>;
  update(id: string, updateMantenimientoDto: any): Promise<Mantenimiento>;
  remove(id: string): Promise<void>;
  findByEstado(estado: string): Promise<Mantenimiento[]>;
  findByTipo(tipo: string): Promise<Mantenimiento[]>;
  findByAreaComun(areaComunId: string): Promise<Mantenimiento[]>;
}

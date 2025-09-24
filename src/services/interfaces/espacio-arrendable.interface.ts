import { EspacioArrendable } from '../../entities/EspacioArrendable';

export interface IEspacioArrendableService {
  create(createEspacioArrendableDto: any): Promise<EspacioArrendable>;
  findAll(): Promise<EspacioArrendable[]>;
  findOne(id: string): Promise<EspacioArrendable>;
  update(
    id: string,
    updateEspacioArrendableDto: any,
  ): Promise<EspacioArrendable>;
  remove(id: string): Promise<void>;
  findByEstado(estado: string): Promise<EspacioArrendable[]>;
  findAvailable(): Promise<EspacioArrendable[]>;
  findByTipo(tipoId: string): Promise<EspacioArrendable[]>;
}

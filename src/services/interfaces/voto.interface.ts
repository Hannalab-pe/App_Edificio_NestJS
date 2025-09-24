import { Voto } from '../../entities/Voto';

export interface IVotoService {
  create(createVotoDto: any): Promise<Voto>;
  findAll(): Promise<Voto[]>;
  findOne(id: string): Promise<Voto>;
  update(id: string, updateVotoDto: any): Promise<Voto>;
  remove(id: string): Promise<void>;
  findByVotacion(votacionId: string): Promise<Voto[]>;
  findByPropietario(propietarioId: string): Promise<Voto[]>;
  countByOpcion(opcionId: string): Promise<number>;
}

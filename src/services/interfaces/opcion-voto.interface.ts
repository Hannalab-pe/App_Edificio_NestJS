import { OpcionVoto } from '../../entities/OpcionVoto';

export interface IOpcionVotoService {
  create(createOpcionVotoDto: any): Promise<OpcionVoto>;
  findAll(): Promise<OpcionVoto[]>;
  findOne(id: string): Promise<OpcionVoto>;
  update(id: string, updateOpcionVotoDto: any): Promise<OpcionVoto>;
  remove(id: string): Promise<void>;
  findByVotacion(votacionId: string): Promise<OpcionVoto[]>;
}

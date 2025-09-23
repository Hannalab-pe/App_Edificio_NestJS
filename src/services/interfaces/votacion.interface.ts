import { CreateVotacionDto, UpdateVotacionDto } from '../../dtos';
import { Votacion } from '../../entities/Votacion';

export interface IVotacionService {
    create(createVotacionDto: CreateVotacionDto): Promise<Votacion>;
    findAll(): Promise<Votacion[]>;
    findOne(id: string): Promise<Votacion>;
    update(id: string, updateVotacionDto: UpdateVotacionDto): Promise<Votacion>;
    remove(id: string): Promise<void>;
    findByEstado(estado: string): Promise<Votacion[]>;
    findActive(): Promise<Votacion[]>;
    findByJuntaPropietarios(juntaId: string): Promise<Votacion[]>;
}
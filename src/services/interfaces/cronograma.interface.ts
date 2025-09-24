import { CreateCronogramaDto, UpdateCronogramaDto, CronogramaRegisterResponseDto } from '../../dtos';
import { Cronograma } from '../../entities/Cronograma';

export interface ICronogramaService {
    create(createCronogramaDto: CreateCronogramaDto): Promise<CronogramaRegisterResponseDto>;
    findAll(): Promise<Cronograma[]>;
    findOne(id: string): Promise<Cronograma>;
    update(id: string, updateCronogramaDto: UpdateCronogramaDto): Promise<Cronograma>;
    remove(id: string): Promise<void>;
    findByTipo(idTipoCronograma: string): Promise<Cronograma[]>;
    findByResidente(idResidente: string): Promise<Cronograma[]>;
    findByTrabajador(idTrabajador: string): Promise<Cronograma[]>;
    findByFechaRange(fechaInicio: string, fechaFin: string): Promise<Cronograma[]>;
    findActive(): Promise<Cronograma[]>;
}

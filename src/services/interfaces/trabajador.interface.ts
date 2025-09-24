import { Trabajador } from '../../entities/Trabajador';
import { CreateTrabajadorDto, TrabajadorRegisterResponseDto } from '../../dtos';

export interface ITrabajadorService {
  create(createTrabajadorDto: any): Promise<Trabajador>;
  register(
    createTrabajadorDto: CreateTrabajadorDto,
  ): Promise<TrabajadorRegisterResponseDto>;
  findAll(): Promise<Trabajador[]>;
  findOne(id: string): Promise<Trabajador>;
  update(id: string, updateTrabajadorDto: any): Promise<Trabajador>;
  remove(id: string): Promise<void>;
  findByNumeroDocumento(numeroDocumento: string): Promise<Trabajador>;
  findByCargo(cargo: string): Promise<Trabajador[]>;
}

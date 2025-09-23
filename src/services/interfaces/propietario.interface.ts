import { CreatePropietarioDto, UpdatePropietarioDto } from '../../dtos';
import { Propietario } from '../../entities/Propietario';

export interface IPropietarioService {
    create(createPropietarioDto: CreatePropietarioDto): Promise<Propietario>;
    findAll(): Promise<Propietario[]>;
    findOne(id: string): Promise<Propietario>;
    update(id: string, updatePropietarioDto: UpdatePropietarioDto): Promise<Propietario>;
    remove(id: string): Promise<void>;
    findByNumeroDocumento(numeroDocumento: string): Promise<Propietario>;
    findWithPropiedades(id: string): Promise<Propietario>;
}
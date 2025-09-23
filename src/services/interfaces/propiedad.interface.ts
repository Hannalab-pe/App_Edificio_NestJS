import { CreatePropiedadDto, UpdatePropiedadDto } from '../../dtos';
import { Propiedad } from '../../entities/Propiedad';

export interface IPropiedadService {
    create(createPropiedadDto: CreatePropiedadDto): Promise<Propiedad>;
    findAll(): Promise<Propiedad[]>;
    findOne(id: string): Promise<Propiedad>;
    update(id: string, updatePropiedadDto: UpdatePropiedadDto): Promise<Propiedad>;
    remove(id: string): Promise<void>;
    findByNumero(numero: string): Promise<Propiedad>;
    findByTipo(tipo: string): Promise<Propiedad[]>;
    findByPropietario(propietarioId: string): Promise<Propiedad[]>;
    findWithPropietarios(id: string): Promise<Propiedad>;
}
import { PropiedadPropietario } from '../../entities/PropiedadPropietario';

export interface IPropiedadPropietarioService {
    create(createPropiedadPropietarioDto: any): Promise<PropiedadPropietario>;
    findAll(): Promise<PropiedadPropietario[]>;
    findOne(id: string): Promise<PropiedadPropietario>;
    update(id: string, updatePropiedadPropietarioDto: any): Promise<PropiedadPropietario>;
    remove(id: string): Promise<void>;
    findByPropiedad(propiedadId: string): Promise<PropiedadPropietario[]>;
    findByPropietario(propietarioId: string): Promise<PropiedadPropietario[]>;
}
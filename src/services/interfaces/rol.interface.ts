import { CreateRolDto, UpdateRolDto } from '../../dtos';
import { Rol } from '../../entities/Rol';

export interface IRolService {
    create(createRolDto: CreateRolDto): Promise<Rol>;
    findAll(): Promise<Rol[]>;
    findOne(id: string): Promise<Rol>;
    update(id: string, updateRolDto: UpdateRolDto): Promise<Rol>;
    remove(id: string): Promise<void>;
    findByNombre(nombre: string): Promise<Rol>;
}
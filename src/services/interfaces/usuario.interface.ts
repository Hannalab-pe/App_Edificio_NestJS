import { CreateUsuarioDto, UpdateUsuarioDto } from '../../dtos';
import { Usuario } from '../../entities/Usuario';

export interface IUsuarioService {
  create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario>;
  findAll(): Promise<Usuario[]>;
  findOne(id: string): Promise<Usuario>;
  update(id: string, updateUsuarioDto: UpdateUsuarioDto): Promise<Usuario>;
  remove(id: string): Promise<void>;
  findByEmail(email: string): Promise<Usuario>;
  findActiveUsers(): Promise<Usuario[]>;
  emailExists(email: string): Promise<boolean>;
}

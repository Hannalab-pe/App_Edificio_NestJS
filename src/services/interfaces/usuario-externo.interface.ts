import { UsuarioExterno } from '../../entities/UsuarioExterno';

export interface IUsuarioExternoService {
  create(createUsuarioExternoDto: any): Promise<UsuarioExterno>;
  findAll(): Promise<UsuarioExterno[]>;
  findOne(id: string): Promise<UsuarioExterno>;
  update(id: string, updateUsuarioExternoDto: any): Promise<UsuarioExterno>;
  remove(id: string): Promise<void>;
  findByEmail(email: string): Promise<UsuarioExterno>;
  findByNumeroDocumento(numeroDocumento: string): Promise<UsuarioExterno>;
}

import { Usuario } from '../../entities/Usuario';
import { RegisterDto } from '../../dtos/auth/register.dto';

export interface LoginResult {
  access_token: string;
  user: Usuario;
}

export interface RegisterResult {
  access_token: string;
  user: Usuario;
}

export interface IAuthService {
  validateUser(correo: string, contrasena: string): Promise<Usuario | null>;
  login(usuario: Usuario): Promise<LoginResult>;
  register(registerDto: RegisterDto): Promise<RegisterResult>;
  hashPassword(password: string): Promise<string>;
  comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean>;
}
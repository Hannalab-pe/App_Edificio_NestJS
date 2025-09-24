import {
  Injectable,
  UnauthorizedException,
  Inject,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import {
  IAuthService,
  LoginResult,
  RegisterResult,
} from '../../interfaces/auth.interface';
import { IUsuarioService } from '../../interfaces/usuario.interface';
import { IRolService } from '../../interfaces/rol.interface';
import { Usuario } from '../../../entities/Usuario';
import { RegisterDto } from '../../../dtos/auth/register.dto';
import { CreateUsuarioDto } from '../../../dtos';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject('IUsuarioService')
    private readonly usuarioService: IUsuarioService,
    @Inject('IRolService')
    private readonly rolService: IRolService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    correo: string,
    contrasena: string,
  ): Promise<Usuario | null> {
    try {
      const usuario = await this.usuarioService.findByEmail(correo);

      if (!usuario) {
        return null;
      }

      if (!usuario.estaActivo) {
        throw new UnauthorizedException('Usuario inactivo');
      }

      const isPasswordValid = await this.comparePasswords(
        contrasena,
        usuario.contrasena,
      );

      if (!isPasswordValid) {
        return null;
      }

      return usuario;
    } catch (error) {
      return null;
    }
  }

  async login(usuario: Usuario): Promise<LoginResult> {
    const payload = {
      sub: usuario.idUsuario,
      correo: usuario.correo,
      rol: usuario.idRol,
    };

    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: usuario,
    };
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  async comparePasswords(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Registrar un nuevo usuario
   * Valida datos, crea usuario con contraseña hasheada y retorna JWT
   */
  async register(registerDto: RegisterDto): Promise<RegisterResult> {
    // Validar que las contraseñas coincidan
    if (registerDto.contrasena !== registerDto.confirmarContrasena) {
      throw new BadRequestException('Las contraseñas no coinciden');
    }

    // Verificar si el correo ya está registrado
    const emailExists = await this.usuarioService.emailExists(
      registerDto.correo,
    );
    if (emailExists) {
      throw new ConflictException(
        'Ya existe un usuario con este correo electrónico',
      );
    }

    // Obtener rol por defecto si no se especifica
    let rolId = registerDto.idRol;
    if (!rolId) {
      try {
        // Buscar el rol "Propietario" como predeterminado
        const defaultRol = await this.rolService.findByNombre('Propietario');
        rolId = defaultRol.idRol;
      } catch (error) {
        // Si no existe el rol Propietario, usar el primer rol disponible
        const roles = await this.rolService.findAll();
        if (roles.length === 0) {
          throw new BadRequestException(
            'No hay roles disponibles en el sistema',
          );
        }
        rolId = roles[0].idRol;
      }
    }

    // Hashear la contraseña
    const hashedPassword = await this.hashPassword(registerDto.contrasena);

    // Crear el DTO para crear usuario
    const createUsuarioDto: CreateUsuarioDto = {
      correo: registerDto.correo,
      contrasena: hashedPassword,
      idRol: rolId,
    };

    // Crear el usuario en la base de datos
    const nuevoUsuario = await this.usuarioService.create(createUsuarioDto);

    // Generar JWT token para login automático
    const loginResult = await this.login(nuevoUsuario);

    return {
      access_token: loginResult.access_token,
      user: nuevoUsuario,
    };
  }
}

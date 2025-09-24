import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IUsuarioService } from '../../services/interfaces/usuario.interface';
import { Usuario } from '../../entities/Usuario';

// Interfaz para el payload que viene del JWT decodificado
export interface JwtPayload {
  sub: string; // ID del usuario (subject)
  correo: string; // Email del usuario
  rol: any; // Rol del usuario
  iat?: number; // Issued at (cuando se emitió el token)
  exp?: number; // Expiration time (cuando expira el token)
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    // Inyectamos el servicio de usuario para validar que el usuario sigue existiendo
    @Inject('IUsuarioService')
    private readonly usuarioService: IUsuarioService,
  ) {
    super({
      // Extraer el JWT del header Authorization como Bearer token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // No ignorar la expiración del token - si está expirado, falla la validación
      ignoreExpiration: false,

      // Secret para verificar la firma del JWT (debe coincidir con el usado para firmarlo)
      secretOrKey:
        configService.get<string>('JWT_SECRET') || 'your-super-secret-jwt-key',
    });
  }

  /**
   * Método que se ejecuta automáticamente cuando Passport valida un JWT
   * El payload ya viene decodificado y verificado por Passport
   * Aquí validamos que el usuario sigue existiendo y activo en la BD
   */
  async validate(payload: JwtPayload): Promise<Usuario> {
    try {
      // Extraemos el ID del usuario del payload (sub = subject)
      const userId = payload.sub;

      // Buscamos el usuario en la base de datos
      const usuario = await this.usuarioService.findOne(userId);

      // Si el usuario no existe, el token es inválido
      if (!usuario) {
        throw new UnauthorizedException(
          'Token inválido - usuario no encontrado',
        );
      }

      // Si el usuario está inactivo, no puede usar el sistema
      if (!usuario.estaActivo) {
        throw new UnauthorizedException('Usuario inactivo');
      }

      // Si todo está bien, retornamos el usuario completo
      // Este usuario estará disponible en req.user en los controladores
      return usuario;
    } catch (error) {
      // Si hay cualquier error, el token se considera inválido
      throw new UnauthorizedException('Token inválido');
    }
  }
}

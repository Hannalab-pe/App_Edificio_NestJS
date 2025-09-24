import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  /**
   * Determina si la petición actual puede proceder
   * Este guard se ejecuta antes de llegar al controlador
   */
  canActivate(context: ExecutionContext) {
    // Verificar si la ruta está marcada como pública
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(), // Método del controlador
      context.getClass(), // Clase del controlador
    ]);

    // Si la ruta es pública, permitir acceso sin autenticación
    if (isPublic) {
      return true;
    }

    // Si no es pública, ejecutar la validación JWT normal
    return super.canActivate(context);
  }
}

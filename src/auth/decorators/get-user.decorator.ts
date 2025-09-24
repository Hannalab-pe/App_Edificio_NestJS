import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Usuario } from '../../entities/Usuario';

/**
 * Decorator personalizado para obtener el usuario autenticado desde la request
 * Uso: @GetUser() user: Usuario en los parámetros del método
 *
 * Ejemplo:
 * @Get('profile')
 * async getProfile(@GetUser() user: Usuario) {
 *   return user;
 * }
 */
export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Usuario => {
    // Obtener el objeto request de la ejecución actual
    const request = ctx.switchToHttp().getRequest();

    // El usuario viene del JwtStrategy.validate() y se almacena en req.user
    return request.user;
  },
);

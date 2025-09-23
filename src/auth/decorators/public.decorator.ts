import { SetMetadata } from '@nestjs/common';

/**
 * Decorator para marcar rutas como públicas (sin autenticación requerida)
 * Uso: @Public() encima del método del controlador
 *
 * Ejemplo:
 * @Public()
 * @Post('login')
 * async login() { ... }
 */
export const Public = () => SetMetadata('isPublic', true);
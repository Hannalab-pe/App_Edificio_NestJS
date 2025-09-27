import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO de respuesta para información de rol
 */
export class RolResponseDto {
  @ApiProperty({
    description: 'ID único del rol',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  idRol: string;

  @ApiProperty({
    description: 'Nombre del rol',
    example: 'Administrador',
  })
  nombre: string;

  @ApiPropertyOptional({
    description: 'Descripción del rol',
    example: 'Rol con permisos completos de administración del sistema',
  })
  descripcion?: string;

  @ApiProperty({
    description: 'Lista de usuarios que tienen este rol',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        idUsuario: { type: 'string', format: 'uuid' },
        nombreUsuario: { type: 'string' },
        correo: { type: 'string' },
        estaActivo: { type: 'boolean' },
      },
    },
    required: false,
  })
  usuarios?: any[];

  @ApiProperty({
    description: 'Lista de notificaciones asociadas a este rol',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        idNotificacion: { type: 'string', format: 'uuid' },
        titulo: { type: 'string' },
        mensaje: { type: 'string' },
        fechaEnvio: { type: 'string', format: 'date-time' },
      },
    },
    required: false,
  })
  notificaciones?: any[];
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO de respuesta para información de tipo de contacto
 */
export class TipoContactoResponseDto {
  @ApiProperty({
    description: 'ID único del tipo de contacto',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  idTipoContacto: string;

  @ApiProperty({
    description: 'Nombre del tipo de contacto',
    example: 'Teléfono móvil',
  })
  nombre: string;

  @ApiPropertyOptional({
    description: 'Descripción del tipo de contacto',
    example: 'Número de teléfono móvil personal del contacto',
  })
  descripcion?: string;

  @ApiProperty({
    description: 'Lista de contactos que usan este tipo de contacto',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        idContacto: { type: 'string', format: 'uuid' },
        valor: { type: 'string' },
        esPrincipal: { type: 'boolean' },
        estaActivo: { type: 'boolean' },
      },
    },
    required: false,
  })
  contactos?: any[];
}
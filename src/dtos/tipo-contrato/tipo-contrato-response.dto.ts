import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO de respuesta para TipoContrato
 * Representa la estructura de datos de un tipo de contrato en las respuestas de la API
 */
export class TipoContratoResponseDto {
  @ApiProperty({
    description: 'ID único del tipo de contrato',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  idTipoContrato: string;

  @ApiProperty({
    description: 'Nombre del tipo de contrato',
    example: 'Contrato de Arrendamiento',
    minLength: 1,
    maxLength: 255,
  })
  nombre: string;

  @ApiPropertyOptional({
    description: 'Descripción detallada del tipo de contrato',
    example: 'Contrato utilizado para el arrendamiento de espacios comunes del edificio',
    nullable: true,
  })
  descripcion?: string | null;
}
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PrioridadIncidencia } from '../../Enums/inicidencias.enum';

/**
 * DTO para la respuesta de datos de tipo de incidencia
 */
export class TipoIncidenciaResponseDto {
  @ApiProperty({
    description: 'ID único del tipo de incidencia',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    type: String,
    format: 'uuid',
  })
  idTipoIncidencia: string;

  @ApiProperty({
    description: 'Nombre del tipo de incidencia',
    example: 'Problema Eléctrico',
    type: String,
    maxLength: 255,
  })
  nombre: string;

  @ApiPropertyOptional({
    description: 'Descripción detallada del tipo de incidencia',
    example: 'Problemas relacionados con el sistema eléctrico del edificio como cortes de luz, fallas en tomas de corriente, etc.',
    type: String,
    nullable: true,
  })
  descripcion: string | null;

  @ApiProperty({
    description: 'Nivel de prioridad por defecto para este tipo de incidencia',
    example: PrioridadIncidencia.ALTA,
    enum: PrioridadIncidencia,
    enumName: 'PrioridadIncidencia',
  })
  prioridad: PrioridadIncidencia;

  @ApiPropertyOptional({
    description: 'Color hexadecimal para identificar visualmente el tipo de incidencia en interfaces',
    example: '#FF5722',
    type: String,
    maxLength: 7,
    pattern: '^#[0-9A-Fa-f]{6}$',
    nullable: true,
  })
  colorHex: string | null;

  @ApiProperty({
    description: 'Indica si el tipo de incidencia está activo en el sistema',
    example: true,
    type: Boolean,
    default: true,
  })
  estaActivo: boolean;
}
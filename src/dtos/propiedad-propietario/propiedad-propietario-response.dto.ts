import { ApiProperty } from '@nestjs/swagger';

export class PropiedadPropietarioResponseDto {
  @ApiProperty({
    description: 'ID único de la relación propiedad-propietario',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  idPropiedadPropietario: string;

  @ApiProperty({
    description: 'ID de la propiedad',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  idPropiedad: string;

  @ApiProperty({
    description: 'ID del propietario',
    example: '123e4567-e89b-12d3-a456-426614174002',
  })
  idPropietario: string;

  @ApiProperty({
    description: 'Fecha de adquisición de la propiedad',
    example: '2024-01-15T10:30:00Z',
  })
  fechaAdquisicion: Date;

  @ApiProperty({
    description: 'Fecha de fin de la propiedad (si aplica)',
    example: '2025-01-15T10:30:00Z',
    nullable: true,
  })
  fechaFin?: Date;

  @ApiProperty({
    description: 'Indica si es el propietario actual',
    example: true,
  })
  esPropietarioActual: boolean;

  @ApiProperty({
    description: 'Porcentaje de propiedad',
    example: 100.0,
  })
  porcentajePropiedad: number;

  @ApiProperty({
    description: 'Estado activo de la relación',
    example: true,
  })
  estaActivo: boolean;

  @ApiProperty({
    description: 'Fecha de creación del registro',
    example: '2024-01-01T10:30:00Z',
  })
  fechaCreacion: Date;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2024-01-15T14:20:00Z',
  })
  fechaActualizacion: Date;
}

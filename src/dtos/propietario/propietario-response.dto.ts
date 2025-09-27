import { ApiProperty } from '@nestjs/swagger';

export class PropietarioResponseDto {
  @ApiProperty({
    description: 'ID único del propietario',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  idPropietario: string;

  @ApiProperty({
    description: 'Nombre del propietario',
    example: 'Juan',
  })
  nombre: string;

  @ApiProperty({
    description: 'Apellido del propietario',
    example: 'Pérez',
  })
  apellido: string;

  @ApiProperty({
    description: 'Correo electrónico del propietario',
    example: 'juan.perez@ejemplo.com',
  })
  correo: string;

  @ApiProperty({
    description: 'Teléfono del propietario',
    example: '+51987654321',
    nullable: true,
  })
  telefono?: string;

  @ApiProperty({
    description: 'Dirección del propietario',
    example: 'Av. Ejemplo 123, Lima',
    nullable: true,
  })
  direccion?: string;

  @ApiProperty({
    description: 'Estado del propietario (activo/inactivo)',
    example: true,
  })
  estaActivo: boolean;

  @ApiProperty({
    description: 'Fecha de registro del propietario',
    example: '2024-01-15T10:30:00Z',
  })
  fechaRegistro: Date;

  @ApiProperty({
    description: 'ID del documento de identidad',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  idDocumentoIdentidad: string;

  @ApiProperty({
    description: 'ID del usuario asociado',
    example: '123e4567-e89b-12d3-a456-426614174002',
  })
  idUsuario: string;
}
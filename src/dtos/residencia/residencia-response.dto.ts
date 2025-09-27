import { ApiProperty } from '@nestjs/swagger';

export class ResidenciaResponseDto {
  declare idResidencia: string;
  declare fechaInicio: string;
  declare fechaFin: string | null;
  declare montoAlquiler: string | null;
  declare deposito: string | null;
  declare tipoOcupacion: string;
  declare estado: string;
  declare contratoUrl: string | null;

  // Información de relaciones
  @ApiProperty({
    description: 'Información de la propiedad asociada',
    example: {
      idPropiedad: '123e4567-e89b-12d3-a456-426614174000',
      numeroPiso: '5',
      numeroUnidad: 'A',
      area: '85.50',
    },
  })
  propiedad?: {
    idPropiedad: string;
    numeroPiso: string;
    numeroUnidad: string;
    area: string;
  };

  @ApiProperty({
    description: 'Información del propietario asociado',
    example: {
      idPropietario: '123e4567-e89b-12d3-a456-426614174001',
      nombres: 'Juan Carlos',
      apellidos: 'Pérez López',
    },
  })
  propietario?: {
    idPropietario: string;
    nombres: string;
    apellidos: string;
  };

  @ApiProperty({
    description: 'Información del residente asociado',
    example: {
      idResidente: '123e4567-e89b-12d3-a456-426614174002',
      nombres: 'Ana María',
      apellidos: 'González Ruiz',
    },
  })
  residente?: {
    idResidente: string;
    nombres: string;
    apellidos: string;
  };
}

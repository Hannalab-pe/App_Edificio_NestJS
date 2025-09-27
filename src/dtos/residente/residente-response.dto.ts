import { ApiProperty } from '@nestjs/swagger';

export class ResidenteResponseDto {
  declare idResidente: string;
  declare nombre: string;
  declare apellido: string;
  declare correo: string;
  declare estaActivo: boolean;
  declare telefono: string | null;
  declare fechaNacimiento: string | null;
  declare fechaRegistro: Date | null;

  // Información de relaciones
  @ApiProperty({
    description: 'Información del usuario asociado',
    example: {
      idUsuario: '123e4567-e89b-12d3-a456-426614174000',
      correo: 'residente@viveconecta.com',
      estaActivo: true
    }
  })
  usuario?: {
    idUsuario: string;
    correo: string;
    estaActivo: boolean;
  };

  @ApiProperty({
    description: 'Información del documento de identidad asociado',
    example: {
      idDocumentoIdentidad: '123e4567-e89b-12d3-a456-426614174001',
      tipoDocumento: 'DNI',
      numero: '87654321'
    }
  })
  documentoIdentidad?: {
    idDocumentoIdentidad: string;
    tipoDocumento: string;
    numero: string;
  };

  @ApiProperty({
    description: 'Cantidad de residencias activas del residente',
    example: 2
  })
  cantidadResidencias?: number;

  @ApiProperty({
    description: 'Cantidad de cronogramas asignados al residente',
    example: 5
  })
  cantidadCronogramas?: number;
}
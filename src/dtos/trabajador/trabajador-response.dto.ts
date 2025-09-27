import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO para la respuesta de datos de trabajador
 */
export class TrabajadorResponseDto {
  @ApiProperty({
    description: 'ID único del trabajador',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    type: String,
    format: 'uuid',
  })
  idTrabajador: string;

  @ApiProperty({
    description: 'Nombre del trabajador',
    example: 'Juan Carlos',
    type: String,
    maxLength: 255,
  })
  nombre: string;

  @ApiProperty({
    description: 'Apellido del trabajador',
    example: 'Pérez García',
    type: String,
    maxLength: 255,
  })
  apellido: string;

  @ApiProperty({
    description: 'Correo electrónico del trabajador',
    example: 'trabajador@viveconecta.com',
    type: String,
    maxLength: 255,
  })
  correo: string;

  @ApiProperty({
    description: 'Indica si el trabajador está activo en el sistema',
    example: true,
    type: Boolean,
    default: true,
  })
  estaActivo: boolean;

  @ApiPropertyOptional({
    description: 'Número de teléfono del trabajador',
    example: '+51987654321',
    type: String,
    maxLength: 20,
    nullable: true,
  })
  telefono: string | null;

  @ApiPropertyOptional({
    description: 'Fecha de nacimiento del trabajador en formato ISO',
    example: '1990-05-15',
    type: String,
    format: 'date',
    nullable: true,
  })
  fechaNacimiento: string | null;

  @ApiPropertyOptional({
    description: 'Fecha de ingreso del trabajador a la empresa en formato ISO',
    example: '2024-01-15',
    type: String,
    format: 'date',
    nullable: true,
  })
  fechaIngreso: string | null;

  @ApiPropertyOptional({
    description: 'Salario actual del trabajador en formato decimal',
    example: '2500.00',
    type: String,
    pattern: '^[0-9]+\\.[0-9]{2}$',
    nullable: true,
  })
  salarioActual: string | null;

  @ApiPropertyOptional({
    description: 'Información del documento de identidad asociado',
    type: Object,
    example: {
      idDocumentoIdentidad: 'doc-uuid-123',
      tipo: 'DNI',
      numero: 12345678,
    },
    nullable: true,
  })
  documentoIdentidad: {
    idDocumentoIdentidad: string;
    tipo: string;
    numero: number;
  } | null;

  @ApiPropertyOptional({
    description: 'Información del usuario asociado al trabajador',
    type: Object,
    example: {
      idUsuario: 'user-uuid-123',
      nombreUsuario: 'jperez',
      rol: {
        idRol: 'rol-uuid-123',
        nombre: 'Trabajador',
      },
    },
    nullable: true,
  })
  usuario: {
    idUsuario: string;
    nombreUsuario: string;
    rol: {
      idRol: string;
      nombre: string;
    };
  } | null;
}

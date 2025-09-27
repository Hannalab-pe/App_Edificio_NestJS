import { ApiProperty } from '@nestjs/swagger';

// DTO para mostrar información básica del usuario autorizador
export class UsuarioAutorizadorResponseDto {
  @ApiProperty({
    description: 'ID del usuario autorizador',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  idUsuario: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'residente@viveconecta.com',
  })
  correo: string;

  @ApiProperty({
    description: 'Estado del usuario',
    example: true,
  })
  estaActivo: boolean;

  @ApiProperty({
    description: 'Información del rol del usuario',
    example: { idRol: 'uuid', nombre: 'Residente' },
  })
  rol: {
    idRol: string;
    nombre: string;
  };
}

// DTO para mostrar información de la propiedad visitada
export class PropiedadVisitaResponseDto {
  @ApiProperty({
    description: 'ID de la propiedad',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  idPropiedad: string;

  @ApiProperty({
    description: 'Número del departamento/propiedad',
    example: '301A',
  })
  numeroDepartamento: string;

  @ApiProperty({
    description: 'Tipo de propiedad',
    example: 'DEPARTAMENTO',
  })
  tipoPropiedad: string;

  @ApiProperty({
    description: 'Piso de la propiedad',
    example: 3,
  })
  piso: number;

  @ApiProperty({
    description: 'Estado de ocupación de la propiedad',
    example: 'OCUPADO',
  })
  estadoOcupacion: string;

  @ApiProperty({
    description: 'Estado activo de la propiedad',
    example: true,
  })
  estaActivo: boolean;

  @ApiProperty({
    description: 'Información del edificio',
    example: { idEdificio: 'uuid', nombre: 'Torres del Sol' },
  })
  edificio: {
    idEdificio: string;
    nombre: string;
  };
}

// DTO principal para respuesta de visita con BaseResponse
export class VisitaResponseDto {
  @ApiProperty({
    description: 'ID único de la visita',
    example: '123e4567-e89b-12d3-a456-426614174002',
  })
  idVisita: string;

  @ApiProperty({
    description: 'Código QR único para la visita',
    example: 'VV_20240315_143022_A1B2C3',
  })
  codigoQr: string;

  @ApiProperty({
    description: 'Nombre completo del visitante',
    example: 'Juan Carlos Pérez García',
  })
  nombreVisitante: string;

  @ApiProperty({
    description: 'Documento de identidad del visitante',
    example: '12345678',
    nullable: true,
  })
  documentoVisitante: string | null;

  @ApiProperty({
    description: 'Teléfono del visitante',
    example: '+51987654321',
    nullable: true,
  })
  telefonoVisitante: string | null;

  @ApiProperty({
    description: 'Motivo de la visita',
    example: 'Visita familiar - Cumpleaños',
    nullable: true,
  })
  motivo: string | null;

  @ApiProperty({
    description: 'Fecha programada para la visita (YYYY-MM-DD)',
    example: '2024-03-15',
  })
  fechaProgramada: string;

  @ApiProperty({
    description: 'Hora de inicio programada (HH:mm)',
    example: '14:30',
  })
  horaInicio: string;

  @ApiProperty({
    description: 'Hora de fin programada (HH:mm)',
    example: '18:00',
  })
  horaFin: string;

  @ApiProperty({
    description: 'Fecha y hora real de ingreso',
    example: '2024-03-15T14:35:00.000Z',
    nullable: true,
  })
  fechaIngreso: Date | null;

  @ApiProperty({
    description: 'Fecha y hora real de salida',
    example: '2024-03-15T17:45:00.000Z',
    nullable: true,
  })
  fechaSalida: Date | null;

  @ApiProperty({
    description: 'Estado actual de la visita',
    example: 'PROGRAMADA',
    enum: ['PROGRAMADA', 'EN_CURSO', 'FINALIZADA', 'CANCELADA'],
  })
  estado: string;

  @ApiProperty({
    description: 'Usuario que autorizó la visita',
    type: UsuarioAutorizadorResponseDto,
  })
  autorizadorUsuario: UsuarioAutorizadorResponseDto;

  @ApiProperty({
    description: 'Propiedad que será visitada',
    type: PropiedadVisitaResponseDto,
  })
  propiedad: PropiedadVisitaResponseDto;

  @ApiProperty({
    description: 'Estadísticas adicionales de la visita',
    example: {
      duracionProgramada: '3 horas 30 minutos',
      duracionReal: '3 horas 10 minutos',
      tiempoRestante: '20 minutos',
    },
  })
  estadisticas: {
    duracionProgramada: string;
    duracionReal?: string;
    tiempoRestante?: string;
  };

  @ApiProperty({
    description: 'Información de fechas del sistema',
    example: {
      fechaCreacion: '2024-03-10T10:00:00.000Z',
      fechaActualizacion: '2024-03-15T14:35:00.000Z',
    },
  })
  auditoria: {
    fechaCreacion: Date;
    fechaActualizacion: Date;
  };
}

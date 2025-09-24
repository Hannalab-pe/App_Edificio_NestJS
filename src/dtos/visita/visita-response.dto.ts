import { ApiProperty } from '@nestjs/swagger';

// DTO para mostrar información básica del usuario autorizador
export class UsuarioAutorizadorDto {
  @ApiProperty({
    description: 'ID del usuario',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  idUsuario: string;

  @ApiProperty({
    description: 'Correo del usuario',
    example: 'residente@viveconecta.com',
  })
  correo: string;
}

// DTO para mostrar información básica de la propiedad
export class PropiedadVisitaDto {
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

  @ApiProperty({ description: 'Tipo de propiedad', example: 'DEPARTAMENTO' })
  tipoPropiedad: string;

  @ApiProperty({ description: 'Piso de la propiedad', example: 3 })
  piso: number;
}

// DTO principal para la respuesta de visita
export class VisitaDto {
  @ApiProperty({
    description: 'ID único de la visita',
    example: '123e4567-e89b-12d3-a456-426614174002',
  })
  idVisita: string;

  @ApiProperty({
    description: 'Código QR único para la visita',
    example: 'QR_12345678',
  })
  codigoQr: string;

  @ApiProperty({
    description: 'Nombre completo del visitante',
    example: 'Juan Carlos Pérez',
  })
  nombreVisitante: string;

  @ApiProperty({
    description: 'Documento del visitante',
    example: '12345678',
    required: false,
  })
  documentoVisitante?: string;

  @ApiProperty({
    description: 'Teléfono del visitante',
    example: '987654321',
    required: false,
  })
  telefonoVisitante?: string;

  @ApiProperty({
    description: 'Motivo de la visita',
    example: 'Visita familiar',
    required: false,
  })
  motivo?: string;

  @ApiProperty({ description: 'Fecha programada', example: '2024-01-15' })
  fechaProgramada: string;

  @ApiProperty({ description: 'Hora de inicio', example: '14:30' })
  horaInicio: string;

  @ApiProperty({ description: 'Hora de fin', example: '18:00' })
  horaFin: string;

  @ApiProperty({
    description: 'Fecha y hora de ingreso real',
    example: '2024-01-15T14:35:00',
    required: false,
  })
  fechaIngreso?: Date;

  @ApiProperty({
    description: 'Fecha y hora de salida real',
    example: '2024-01-15T17:45:00',
    required: false,
  })
  fechaSalida?: Date;

  @ApiProperty({
    description: 'Estado actual de la visita',
    example: 'PROGRAMADA',
  })
  estado: string;

  @ApiProperty({
    description: 'Usuario que autorizó la visita',
    type: UsuarioAutorizadorDto,
  })
  autorizadorUsuario: UsuarioAutorizadorDto;

  @ApiProperty({ description: 'Propiedad a visitar', type: PropiedadVisitaDto })
  idPropiedad: PropiedadVisitaDto;
}

// DTO para respuestas exitosas
export class VisitaResponseDto {
  @ApiProperty({
    description: 'Indica si la operación fue exitosa',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Mensaje descriptivo',
    example: 'Visita creada exitosamente',
  })
  message: string;

  @ApiProperty({ description: 'Datos de la visita', type: VisitaDto })
  data: VisitaDto;
}

// DTO para listado de visitas
export class VisitaListResponseDto {
  @ApiProperty({
    description: 'Indica si la operación fue exitosa',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Mensaje descriptivo',
    example: 'Visitas obtenidas exitosamente',
  })
  message: string;

  @ApiProperty({ description: 'Lista de visitas', type: [VisitaDto] })
  data: VisitaDto[];

  @ApiProperty({ description: 'Información de paginación', required: false })
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

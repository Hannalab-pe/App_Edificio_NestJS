import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO de respuesta para información del usuario creador de la votación
 */
export class UsuarioCreadorResponseDto {
  @ApiProperty({
    description: 'ID único del usuario creador',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  idUsuario: string;

  @ApiProperty({
    description: 'Nombre completo del usuario creador',
    example: 'Juan Pérez',
  })
  nombreCompleto: string;

  @ApiProperty({
    description: 'Email del usuario creador',
    example: 'juan.perez@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Rol del usuario en el edificio',
    example: 'Administrador',
  })
  rol?: string;
}

/**
 * DTO de respuesta para las opciones de voto
 */
export class OpcionVotoResponseDto {
  @ApiProperty({
    description: 'ID único de la opción de voto',
    example: '456e7890-f12b-34c5-d678-901234567890',
  })
  idOpcionVoto: string;

  @ApiProperty({
    description: 'Texto de la opción de voto',
    example: 'Aprobar presupuesto',
  })
  opcion: string;

  @ApiProperty({
    description: 'Descripción detallada de la opción',
    example: 'Aprobar el presupuesto propuesto para mejoras en áreas comunes',
    required: false,
  })
  descripcion?: string;

  @ApiProperty({
    description: 'Orden de presentación de la opción',
    example: 1,
  })
  ordenPresentacion: number;

  @ApiProperty({
    description: 'Número total de votos recibidos para esta opción',
    example: 15,
  })
  totalVotos: number;

  @ApiProperty({
    description: 'Porcentaje de votos respecto al total',
    example: 65.22,
  })
  porcentajeVotos: number;
}

/**
 * DTO de respuesta para información de un voto individual
 */
export class VotoResponseDto {
  @ApiProperty({
    description: 'ID único del voto',
    example: '789e0123-g45h-67i8-j901-234567890123',
  })
  idVoto: string;

  @ApiProperty({
    description: 'ID del usuario que emitió el voto',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  idUsuario: string;

  @ApiProperty({
    description: 'Nombre del usuario que votó',
    example: 'Ana García',
  })
  nombreUsuario: string;

  @ApiProperty({
    description: 'Fecha y hora cuando se emitió el voto',
    example: '2025-09-27T15:30:00.000Z',
  })
  fechaVoto: string;

  @ApiProperty({
    description: 'Opción seleccionada',
    type: OpcionVotoResponseDto,
  })
  opcionSeleccionada: OpcionVotoResponseDto;
}

/**
 * DTO de respuesta para estadísticas de votación
 */
export class EstadisticasVotacionDto {
  @ApiProperty({
    description: 'Total de votos emitidos',
    example: 23,
  })
  totalVotos: number;

  @ApiProperty({
    description: 'Total de usuarios elegibles para votar',
    example: 35,
  })
  totalElegibles: number;

  @ApiProperty({
    description: 'Porcentaje de participación',
    example: 65.71,
  })
  participacion: number;

  @ApiProperty({
    description: 'Indica si se ha alcanzado el quorum mínimo',
    example: true,
  })
  quorumAlcanzado: boolean;

  @ApiProperty({
    description: 'Quorum mínimo requerido',
    example: 15,
    required: false,
  })
  quorumMinimo?: number;

  @ApiProperty({
    description: 'Estado actual de la votación',
    example: 'ACTIVA',
  })
  estado: string;

  @ApiProperty({
    description: 'Tiempo restante para cerrar la votación (en minutos)',
    example: 4320,
    required: false,
  })
  tiempoRestante?: number;
}

/**
 * DTO principal de respuesta para Votación
 */
export declare class VotacionResponseDto {
  @ApiProperty({
    description: 'ID único de la votación',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  idVotacion: string;

  @ApiProperty({
    description: 'Título de la votación',
    example: 'Votación para mejoras en áreas comunes',
  })
  titulo: string;

  @ApiProperty({
    description: 'Descripción detallada de la votación',
    example: 'Votación para decidir las mejoras prioritarias en las áreas comunes del edificio',
  })
  descripcion: string;

  @ApiProperty({
    description: 'Fecha y hora de inicio de la votación',
    example: '2025-10-01T08:00:00.000Z',
  })
  fechaInicio: string;

  @ApiProperty({
    description: 'Fecha y hora de fin de la votación',
    example: '2025-10-07T23:59:59.000Z',
  })
  fechaFin: string;

  @ApiProperty({
    description: 'Estado actual de la votación',
    example: 'ACTIVA',
  })
  estado: string;

  @ApiProperty({
    description: 'Tipo de votación',
    example: 'SIMPLE',
  })
  tipo: string;

  @ApiProperty({
    description: 'Indica si la votación requiere quorum mínimo',
    example: true,
  })
  requiereQuorum: boolean;

  @ApiProperty({
    description: 'Número mínimo de votos requeridos para el quorum',
    example: 15,
    required: false,
  })
  quorumMinimo?: number;

  @ApiProperty({
    description: 'Fecha de creación de la votación',
    example: '2025-09-25T10:00:00.000Z',
  })
  fechaCreacion: string;

  @ApiProperty({
    description: 'Información del usuario que creó la votación',
    type: UsuarioCreadorResponseDto,
  })
  creadoPor: UsuarioCreadorResponseDto;

  @ApiProperty({
    description: 'Lista de opciones disponibles para votar',
    type: [OpcionVotoResponseDto],
  })
  opciones: OpcionVotoResponseDto[];

  @ApiProperty({
    description: 'Estadísticas generales de la votación',
    type: EstadisticasVotacionDto,
  })
  estadisticas: EstadisticasVotacionDto;

  @ApiProperty({
    description: 'Lista de todos los votos emitidos (solo para votaciones públicas)',
    type: [VotoResponseDto],
    required: false,
  })
  votos?: VotoResponseDto[];

  // Metadatos adicionales para la aplicación
  @ApiProperty({
    description: 'Indica si el usuario actual ya ha votado en esta votación',
    example: false,
    required: false,
  })
  yaVoto?: boolean;

  @ApiProperty({
    description: 'Indica si la votación puede ser modificada por el usuario actual',
    example: true,
    required: false,
  })
  puedeModificar?: boolean;

  @ApiProperty({
    description: 'Indica si la votación está activa y acepta votos',
    example: true,
  })
  aceptaVotos: boolean;

  @ApiProperty({
    description: 'URL para participar en la votación (si aplicable)',
    example: 'https://app.edificio.com/votacion/123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  urlVotacion?: string;
}
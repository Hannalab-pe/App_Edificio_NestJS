import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../baseResponse/baseResponse.dto';
import { VotacionResponseDto } from './votacion-response.dto';

/**
 * DTO de respuesta única para Votación con BaseResponseDto
 */
export declare class VotacionSingleResponseDto extends BaseResponseDto<VotacionResponseDto> {
  @ApiProperty({
    description: 'Datos de la votación',
    type: VotacionResponseDto,
  })
  data: VotacionResponseDto;

  // Metadatos específicos para votación individual
  @ApiProperty({
    description: 'URL directa para acceder a la votación',
    example:
      'https://app.edificio.com/votacion/123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  votacionUrl?: string;

  @ApiProperty({
    description: 'Acciones disponibles para la votación actual',
    example: ['votar', 'ver_resultados', 'editar'],
    required: false,
  })
  accionesDisponibles?: string[];

  @ApiProperty({
    description: 'Información adicional sobre el estado de la votación',
    example: 'La votación está activa y acepta votos hasta el 07/10/2025',
    required: false,
  })
  informacionEstado?: string;
}

/**
 * Metadatos de paginación para listas de votaciones
 */
export declare class VotacionPaginationDto {
  @ApiProperty({ description: 'Página actual', example: 1 })
  page: number;

  @ApiProperty({ description: 'Elementos por página', example: 10 })
  limit: number;

  @ApiProperty({ description: 'Total de votaciones', example: 45 })
  total: number;

  @ApiProperty({ description: 'Total de páginas', example: 5 })
  totalPages: number;

  @ApiProperty({ description: 'Tiene página siguiente', example: true })
  hasNextPage: boolean;

  @ApiProperty({ description: 'Tiene página anterior', example: false })
  hasPrevPage: boolean;
}

/**
 * Estadísticas generales de votaciones
 */
export declare class EstadisticasGeneralesVotacionDto {
  @ApiProperty({ description: 'Total de votaciones activas', example: 3 })
  votacionesActivas: number;

  @ApiProperty({
    description: 'Total de votaciones finalizadas este mes',
    example: 12,
  })
  votacionesFinalizadasMes: number;

  @ApiProperty({ description: 'Promedio de participación', example: 68.5 })
  promedioParticipacion: number;

  @ApiProperty({
    description: 'Total de votos emitidos este mes',
    example: 156,
  })
  votosEmitidosMes: number;

  @ApiProperty({ description: 'Votaciones pendientes de iniciar', example: 2 })
  votacionesPendientes: number;

  @ApiProperty({ description: 'Quorum promedio alcanzado (%)', example: 71.2 })
  quorumPromedioAlcanzado: number;
}

/**
 * Filtros aplicados en la consulta
 */
export declare class FiltrosVotacionDto {
  @ApiProperty({
    description: 'Filtro por estado',
    example: 'ACTIVA',
    required: false,
  })
  estado?: string;

  @ApiProperty({
    description: 'Filtro por tipo',
    example: 'SIMPLE',
    required: false,
  })
  tipo?: string;

  @ApiProperty({
    description: 'Filtro por fecha desde',
    example: '2025-09-01',
    required: false,
  })
  fechaDesde?: string;

  @ApiProperty({
    description: 'Filtro por fecha hasta',
    example: '2025-09-30',
    required: false,
  })
  fechaHasta?: string;

  @ApiProperty({
    description: 'Filtro por creador',
    example: 'Juan Pérez',
    required: false,
  })
  creador?: string;

  @ApiProperty({
    description: 'Búsqueda por título o descripción',
    example: 'presupuesto',
    required: false,
  })
  busqueda?: string;
}

/**
 * DTO de respuesta para arrays de Votación con BaseResponseDto
 */
export declare class VotacionArrayResponseDto extends BaseResponseDto<
  VotacionResponseDto[]
> {
  @ApiProperty({
    description: 'Lista de votaciones',
    type: [VotacionResponseDto],
  })
  data: VotacionResponseDto[];

  @ApiProperty({
    description: 'Información de paginación',
    type: VotacionPaginationDto,
    required: false,
  })
  pagination?: VotacionPaginationDto;

  @ApiProperty({
    description: 'Estadísticas generales de votaciones',
    type: EstadisticasGeneralesVotacionDto,
    required: false,
  })
  estadisticasGenerales?: EstadisticasGeneralesVotacionDto;

  @ApiProperty({
    description: 'Filtros aplicados en la consulta',
    type: FiltrosVotacionDto,
    required: false,
  })
  filtrosAplicados?: FiltrosVotacionDto;

  @ApiProperty({
    description: 'Resumen de estados de votaciones en los resultados',
    example: { ACTIVA: 3, FINALIZADA: 7, BORRADOR: 2 },
    required: false,
  })
  resumenEstados?: Record<string, number>;

  @ApiProperty({
    description: 'Total de votaciones por tipo en los resultados',
    example: { SIMPLE: 8, MULTIPLE: 3, SECRETA: 1 },
    required: false,
  })
  resumenTipos?: Record<string, number>;
}

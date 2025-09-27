import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../baseResponse/baseResponse.dto';
import { VisitaResponseDto } from './visitaResponse.dto';

// DTO para respuesta individual de visita
export class VisitaSingleResponseDto extends BaseResponseDto<VisitaResponseDto> {
  @ApiProperty({
    description: 'Datos de la visita',
    type: VisitaResponseDto,
  })
  declare data: VisitaResponseDto;

  @ApiProperty({
    description: 'Información adicional específica de visitas',
    example: {
      codigoQrUrl:
        'https://api.qrserver.com/v1/create-qr-code/?data=VV_20240315_143022_A1B2C3',
      requiereAutorizacion: true,
      notificacionesEnviadas: true,
    },
    required: false,
  })
  metadata?: {
    codigoQrUrl?: string;
    requiereAutorizacion?: boolean;
    notificacionesEnviadas?: boolean;
  };
}

// DTO para respuesta de array de visitas
export class VisitaArrayResponseDto extends BaseResponseDto<
  VisitaResponseDto[]
> {
  @ApiProperty({
    description: 'Lista de visitas',
    type: [VisitaResponseDto],
  })
  declare data: VisitaResponseDto[];

  @ApiProperty({
    description: 'Información de paginación y estadísticas',
    example: {
      total: 150,
      page: 1,
      limit: 10,
      totalPages: 15,
      hasNextPage: true,
      hasPreviousPage: false,
      estadisticas: {
        programadas: 45,
        enCurso: 12,
        finalizadas: 88,
        canceladas: 5,
      },
    },
    required: false,
  })
  metadata?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
    estadisticas?: {
      programadas: number;
      enCurso: number;
      finalizadas: number;
      canceladas: number;
    };
  };
}

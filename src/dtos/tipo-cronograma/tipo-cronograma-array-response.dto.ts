import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../baseResponse/baseResponse.dto';
import { TipoCronogramaResponseDto } from './tipo-cronograma-response.dto';

/**
 * DTO de respuesta para operaciones que retornan múltiples tipos de cronograma
 * Extiende BaseResponseDto para mantener consistencia en las respuestas de la API
 */
export declare class TipoCronogramaArrayResponseDto extends BaseResponseDto<
  TipoCronogramaResponseDto[]
> {
  @ApiProperty({
    description: 'Lista de tipos de cronograma',
    type: [TipoCronogramaResponseDto],
    isArray: true,
  })
  data: TipoCronogramaResponseDto[];

  @ApiProperty({
    description: 'Código de estado HTTP',
    example: 200,
  })
  statusCode: number;
}

import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../baseResponse/baseResponse.dto';
import { TipoCronogramaResponseDto } from './tipo-cronograma-response.dto';

/**
 * DTO de respuesta para operaciones que retornan un solo tipo de cronograma
 * Extiende BaseResponseDto para mantener consistencia en las respuestas de la API
 */
export declare class TipoCronogramaSingleResponseDto extends BaseResponseDto<TipoCronogramaResponseDto> {
  @ApiProperty({
    description: 'Datos del tipo de cronograma',
    type: TipoCronogramaResponseDto,
    nullable: true,
  })
  data: TipoCronogramaResponseDto | null;

  @ApiProperty({
    description: 'Código de estado HTTP',
    example: 200,
  })
  statusCode: number;
}
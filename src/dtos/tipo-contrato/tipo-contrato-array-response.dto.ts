import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../baseResponse/baseResponse.dto';
import { TipoContratoResponseDto } from './tipo-contrato-response.dto';

/**
 * DTO de respuesta para operaciones que retornan múltiples tipos de contrato
 * Extiende BaseResponseDto para mantener consistencia en las respuestas de la API
 */
export declare class TipoContratoArrayResponseDto extends BaseResponseDto<TipoContratoResponseDto[]> {
  @ApiProperty({
    description: 'Lista de tipos de contrato',
    type: [TipoContratoResponseDto],
    isArray: true,
  })
  data: TipoContratoResponseDto[];

  @ApiProperty({
    description: 'Código de estado HTTP',
    example: 200,
  })
  statusCode: number;
}
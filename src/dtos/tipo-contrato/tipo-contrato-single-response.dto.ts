import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../baseResponse/baseResponse.dto';
import { TipoContratoResponseDto } from './tipo-contrato-response.dto';

/**
 * DTO de respuesta para operaciones que retornan un solo tipo de contrato
 * Extiende BaseResponseDto para mantener consistencia en las respuestas de la API
 */
export declare class TipoContratoSingleResponseDto extends BaseResponseDto<TipoContratoResponseDto> {
  @ApiProperty({
    description: 'Datos del tipo de contrato',
    type: TipoContratoResponseDto,
    nullable: true,
  })
  data: TipoContratoResponseDto | null;

  @ApiProperty({
    description: 'Código de estado HTTP',
    example: 200,
  })
  statusCode: number;
}
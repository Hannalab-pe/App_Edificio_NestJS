import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../baseResponse/baseResponse.dto';
import { TipoIncidenciaResponseDto } from './tipo-incidencia-response.dto';

/**
 * DTO para respuestas que contienen un único tipo de incidencia
 * Utiliza BaseResponseDto como estructura base
 */
export declare class TipoIncidenciaSingleResponseDto extends BaseResponseDto<TipoIncidenciaResponseDto> {
  @ApiProperty({
    description: 'Datos del tipo de incidencia',
    type: TipoIncidenciaResponseDto,
    nullable: true,
    example: {
      idTipoIncidencia: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      nombre: 'Problema Eléctrico',
      descripcion: 'Problemas relacionados con el sistema eléctrico del edificio',
      prioridad: 'ALTA',
      colorHex: '#FF5722',
      estaActivo: true
    }
  })
  data: TipoIncidenciaResponseDto | null;
}
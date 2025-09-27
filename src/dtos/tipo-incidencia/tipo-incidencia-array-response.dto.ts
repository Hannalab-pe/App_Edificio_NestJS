import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../baseResponse/baseResponse.dto';
import { TipoIncidenciaResponseDto } from './tipo-incidencia-response.dto';

/**
 * DTO para respuestas que contienen una lista de tipos de incidencia
 * Utiliza BaseResponseDto como estructura base
 */
export declare class TipoIncidenciaArrayResponseDto extends BaseResponseDto<
  TipoIncidenciaResponseDto[]
> {
  @ApiProperty({
    description: 'Lista de tipos de incidencia',
    type: [TipoIncidenciaResponseDto],
    nullable: true,
    example: [
      {
        idTipoIncidencia: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        nombre: 'Problema Eléctrico',
        descripcion: 'Problemas relacionados con el sistema eléctrico',
        prioridad: 'ALTA',
        colorHex: '#FF5722',
        estaActivo: true,
      },
      {
        idTipoIncidencia: 'b2c3d4e5-f6g7-8901-bcde-f23456789012',
        nombre: 'Plomería',
        descripcion: 'Problemas con tuberías y suministro de agua',
        prioridad: 'MEDIA',
        colorHex: '#2196F3',
        estaActivo: true,
      },
    ],
  })
  data: TipoIncidenciaResponseDto[] | null;
}

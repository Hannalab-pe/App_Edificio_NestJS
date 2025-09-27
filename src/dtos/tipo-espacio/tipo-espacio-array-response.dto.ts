import { BaseResponseDto } from '../baseResponse/baseResponse.dto';
import { TipoEspacioResponseDto } from './tipo-espacio-response.dto';

/**
 * DTO de respuesta para múltiples TipoEspacio con BaseResponse
 * Extiende BaseResponseDto con array de datos específicos de TipoEspacio
 */
export declare class TipoEspacioArrayResponseDto extends BaseResponseDto<
  TipoEspacioResponseDto[]
> {
  /**
   * Código de estado HTTP de la respuesta
   * @example 200
   */
  statusCode: number;

  /**
   * Indica si la operación fue exitosa
   * @example true
   */
  success: boolean;

  /**
   * Mensaje descriptivo de la respuesta
   * @example "Tipos de espacio encontrados exitosamente"
   */
  message: string;

  /**
   * Array de tipos de espacio o array vacío en caso de error
   */
  data: TipoEspacioResponseDto[];

  /**
   * Información del error o null en caso de éxito
   */
  error: { message: string } | null;
}

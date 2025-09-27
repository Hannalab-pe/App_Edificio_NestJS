import { BaseResponseDto } from '../baseResponse/baseResponse.dto';
import { TipoEspacioResponseDto } from './tipo-espacio-response.dto';

/**
 * DTO de respuesta para un solo TipoEspacio con BaseResponse
 * Extiende BaseResponseDto con datos específicos de TipoEspacio
 */
export declare class TipoEspacioSingleResponseDto extends BaseResponseDto<TipoEspacioResponseDto> {
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
   * @example "Tipo de espacio encontrado exitosamente"
   */
  message: string;

  /**
   * Datos del tipo de espacio o null en caso de error
   */
  data: TipoEspacioResponseDto | null;

  /**
   * Información del error o null en caso de éxito
   */
  error: { message: string } | null;
}

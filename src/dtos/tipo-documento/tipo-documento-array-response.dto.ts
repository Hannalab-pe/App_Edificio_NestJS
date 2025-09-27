import { BaseResponseDto } from '../baseResponse/baseResponse.dto';
import { TipoDocumentoResponseDto } from './tipo-documento-response.dto';

/**
 * DTO de respuesta para múltiples TipoDocumento con BaseResponse
 * Extiende BaseResponseDto con array de datos específicos de TipoDocumento
 */
export declare class TipoDocumentoArrayResponseDto extends BaseResponseDto<TipoDocumentoResponseDto[]> {
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
   * @example "Tipos de documento encontrados exitosamente"
   */
  message: string;

  /**
   * Array de tipos de documento o array vacío en caso de error
   */
  data: TipoDocumentoResponseDto[];

  /**
   * Información del error o null en caso de éxito
   */
  error: { message: string } | null;
}
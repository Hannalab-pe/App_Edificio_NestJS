import { BaseResponseDto } from '../baseResponse/baseResponse.dto';
import { TipoDocumentoResponseDto } from './tipo-documento-response.dto';

/**
 * DTO de respuesta para un solo TipoDocumento con BaseResponse
 * Extiende BaseResponseDto con datos específicos de TipoDocumento
 */
export declare class TipoDocumentoSingleResponseDto extends BaseResponseDto<TipoDocumentoResponseDto> {
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
   * @example "Tipo de documento encontrado exitosamente"
   */
  message: string;

  /**
   * Datos del tipo de documento o null en caso de error
   */
  data: TipoDocumentoResponseDto | null;

  /**
   * Información del error o null en caso de éxito
   */
  error: { message: string } | null;
}
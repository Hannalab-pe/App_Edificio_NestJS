import { BaseResponseDto } from '../baseResponse/baseResponse.dto';
import { Propiedad } from '../../entities/Propiedad';

/**
 * DTO para respuesta individual de propiedad
 */
export class PropiedadResponseDto extends BaseResponseDto<Propiedad> {
  constructor(
    success: boolean,
    message: string,
    data?: Propiedad,
    error?: any,
  ) {
    super(success, message, data, error);
  }
}

/**
 * DTO para respuesta de lista de propiedades
 */
export class PropiedadListResponseDto extends BaseResponseDto<Propiedad[]> {
  constructor(
    success: boolean,
    message: string,
    data?: Propiedad[],
    error?: any,
  ) {
    super(success, message, data, error);
  }
}

/**
 * DTO para respuesta de eliminación de propiedad
 */
export class PropiedadDeleteResponseDto extends BaseResponseDto<{
  idPropiedad: string;
  mensaje: string;
}> {
  constructor(
    success: boolean,
    message: string,
    data?: { idPropiedad: string; mensaje: string },
    error?: any,
  ) {
    super(success, message, data, error);
  }
}

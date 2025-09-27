/**
 * DTO de respuesta para TipoEspacio
 * Representa la estructura de datos de un tipo de espacio en las respuestas de la API
 */
export declare class TipoEspacioResponseDto {
  /**
   * ID único del tipo de espacio
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  idTipoEspacio: string;

  /**
   * Nombre del tipo de espacio
   * @example "Salón de eventos"
   */
  nombre: string;

  /**
   * Descripción detallada del tipo de espacio
   * @example "Espacio amplio para reuniones y eventos sociales"
   */
  descripcion: string | null;

  /**
   * Indica si el tipo de espacio requiere contrato para su uso
   * @example true
   */
  requiereContrato: boolean | null;
}
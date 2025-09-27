/**
 * DTO de respuesta para TipoCronograma
 * Representa la estructura de datos de un tipo de cronograma en las respuestas de la API
 */
export declare class TipoCronogramaResponseDto {
  /**
   * ID único del tipo de cronograma
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  idTipoCronograma: string;

  /**
   * Tipo de cronograma
   * @example "Reunión ordinaria"
   */
  tipoCronograma: string;

  /**
   * Descripción detallada del tipo de cronograma
   * @example "Cronograma utilizado para reuniones ordinarias de la junta de propietarios"
   */
  descripcion: string;
}

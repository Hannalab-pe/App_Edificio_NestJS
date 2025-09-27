/**
 * DTO de respuesta para TipoDocumento
 * Representa la estructura de datos de un tipo de documento en las respuestas de la API
 */
export declare class TipoDocumentoResponseDto {
  /**
   * ID único del tipo de documento
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  idTipoDocumento: string;

  /**
   * Tipo de documento
   * @example "Contrato de Arrendamiento"
   */
  tipoDocumento: string;

  /**
   * Descripción detallada del tipo de documento
   * @example "Documentos relacionados con contratos de arrendamiento de espacios"
   */
  descripcion: string;
}

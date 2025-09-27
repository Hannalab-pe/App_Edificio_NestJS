/**
 * Enum para definir los tipos de acciones que se pueden registrar en el historial de contratos
 */
export enum TipoAccionHistorial {
    CREACION = 'CREACION',
    MODIFICACION = 'MODIFICACION',
    RENOVACION = 'RENOVACION',
    SUSPENSION = 'SUSPENSION',
    REACTIVACION = 'REACTIVACION',
    TERMINACION = 'TERMINACION',
    CAMBIO_SALARIO = 'CAMBIO_SALARIO',
    CAMBIO_ESTADO = 'CAMBIO_ESTADO',
    VENCIMIENTO = 'VENCIMIENTO'
}
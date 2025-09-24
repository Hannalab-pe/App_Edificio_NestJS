export enum EstadosGlobales {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO',
  SUSPENDIDO = 'SUSPENDIDO',
}

export enum FrecuenciaPago {
  MENSUAL = 'PAGO_MENSUAL',
  BIMESTRAL = 'PAGO_BIMESTRAL',
  TRIMESTRAL = 'PAGO_TRIMESTRAL',
  SEMESTRAL = 'PAGO_SEMESTRAL',
  ANUAL = 'PAGO_ANUAL',
  UNICO = 'PAGO_UNICO',
}

export enum EstadoPago {
  PENDIENTE = 'Pendiente',
  PAGADO = 'Pagado',
  VENCIDO = 'Vencido',
  PARCIAL = 'Parcial',
  ANULADO = 'Anulado',
}

export enum MetodoPago {
  EFECTIVO = 'Efectivo',
  TRANSFERENCIA = 'Transferencia',
  TARJETA = 'Tarjeta',
  CHEQUE = 'Cheque',
  DEPOSITO = 'Depósito',
}

export enum TipoNotificacion {
  INFORMATIVA = 'Informativa',
  ADVERTENCIA = 'Advertencia',
  URGENTE = 'Urgente',
  RECORDATORIO = 'Recordatorio',
}

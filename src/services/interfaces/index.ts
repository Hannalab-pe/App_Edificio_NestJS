// Interfaces principales
export { IUsuarioService } from './usuario.interface';
export { IAuthService, LoginResult, RegisterResult } from './auth.interface';
export { IRolService } from './rol.interface';
export { IPropietarioService } from './propietario.interface';
export { IPropiedadService } from './propiedad.interface';
export { IIncidenciaService } from './incidencia.interface';
export { INotificacionService } from './notificacion.interface';
export { IPagoService } from './pago.interface';
export { IDocumentoService } from './documento.interface';
export { IDocumentoIdentidadService } from './documento-identidad.interface';

// Interfaces de áreas y espacios
export { IAreaComunService } from './area-comun.interface';
export { IEspacioArrendableService } from './espacio-arrendable.interface';
export { IReservaService } from './reserva.interface';
export { IArrendamientoEspacioService } from './arrendamiento-espacio.interface';

// Interfaces de usuarios y roles
export { IResidenteService } from './residente.interface';
export { ITrabajadorService } from './trabajador.interface';
export { IUsuarioExternoService } from './usuario-externo.interface';
export { IVisitaService } from './visita.interface';

// Interfaces de finanzas
export { IConceptoPagoService } from './concepto-pago.interface';
export { IReciboService } from './recibo.interface';
export { IPresupuestoService } from './presupuesto.interface';
export { ICajaService } from './caja.interface';
export { IMovimientoCajaService } from './movimiento-caja.interface';

// Interfaces de gestión
export { IMantenimientoService } from './mantenimiento.interface';
export { IVotacionService } from './votacion.interface';
export { IVotoService } from './voto.interface';
export { IOpcionVotoService } from './opcion-voto.interface';
export { IJuntaPropietariosService } from './junta-propietarios.interface';

// Interfaces de comunicación
export { IMensajePrivadoService } from './mensaje-privado.interface';
export { IComentarioIncidenciaService } from './comentario-incidencia.interface';

// Interfaces de contratos
export { IContratoService } from './contrato.interface';
export { IHistorialContratoService } from './historial-contrato.interface';
export { ICronogramaService } from './cronograma.interface';

// Interfaces de tipos
export { ITipoDocumentoService } from './tipo-documento.interface';
export { ITipoIncidenciaService } from './tipo-incidencia.interface';
export { ITipoContratoService } from './tipo-contrato.interface';
export { ITipoCronogramaService } from './tipo-cronograma.interface';
export { ITipoEspacioService } from './tipo-espacio.interface';
export { ITipoContactoService } from './tipo-contacto.interface';

// Interfaces de relaciones
export { IContactoService } from './contacto.interface';
export { IPropiedadPropietarioService } from './propiedad-propietario.interface';
export { IResidenciaService } from './residencia.interface';
export { IEncomiendaService } from './encomienda.interface';
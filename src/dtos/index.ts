// Usuario DTOs
export { CreateUsuarioDto } from './usuario/create-usuario.dto';
export { UpdateUsuarioDto } from './usuario/update-usuario.dto';

// Rol DTOs
export { CreateRolDto } from './rol/create-rol.dto';
export { UpdateRolDto } from './rol/update-rol.dto';

// Propietario DTOs
export { CreatePropietarioDto } from './propietario/create-propietario.dto';
export { UpdatePropietarioDto } from './propietario/update-propietario.dto';

// Propiedad DTOs
export { CreatePropiedadDto } from './propiedad/create-propiedad.dto';
export { UpdatePropiedadDto } from './propiedad/update-propiedad.dto';

// Incidencia DTOs
export { CreateIncidenciaDto } from './incidencia/create-incidencia.dto';
export { UpdateIncidenciaDto } from './incidencia/update-incidencia.dto';

// Notificación DTOs
export { CreateNotificacionDto } from './notificacion/create-notificacion.dto';
export { UpdateNotificacionDto } from './notificacion/update-notificacion.dto';

// Pago DTOs
export { CreatePagoDto } from './pago/create-pago.dto';
export { UpdatePagoDto } from './pago/update-pago.dto';

// Documento DTOs
export { CreateDocumentoDto } from './documento/create-documento.dto';
export { UpdateDocumentoDto } from './documento/update-documento.dto';
export { DocumentoResponseDto, TipoDocumentoInfoDto, TrabajadorInfoDto } from './documento/documento-response.dto';

// Documento Identidad DTOs
export { CreateDocumentoIdentidadDto } from './documento-identidad/create-documento-identidad.dto';
export { UpdateDocumentoIdentidadDto } from './documento-identidad/update-documento-identidad.dto';

// Tipo Documento DTOs
export { CreateTipoDocumentoDto } from './tipo-documento/create-tipo-documento.dto';
export { UpdateTipoDocumentoDto } from './tipo-documento/update-tipo-documento.dto';

// Tipo Contrato DTOs
export { CreateTipoContratoDto } from './tipo-contrato/create-tipo-contrato.dto';
export { UpdateTipoContratoDto } from './tipo-contrato/update-tipo-contrato.dto';

// Tipo Contacto DTOs
export { CreateTipoContactoDto } from './tipo-contacto/create-tipo-contacto.dto';
export { UpdateTipoContactoDto } from './tipo-contacto/update-tipo-contacto.dto';

// Area Común DTOs
export { CreateAreaComunDto } from './area-comun/create-area-comun.dto';
export { UpdateAreaComunDto } from './area-comun/update-area-comun.dto';

// Concepto Pago DTOs
export { CreateConceptoPagoDto } from './concepto-pago/create-concepto-pago.dto';
export { UpdateConceptoPagoDto } from './concepto-pago/update-concepto-pago.dto';

// Tipo Espacio DTOs
export { CreateTipoEspacioDto } from './tipo-espacio/create-tipo-espacio.dto';
export { UpdateTipoEspacioDto } from './tipo-espacio/update-tipo-espacio.dto';

// Espacio Arrendable DTOs
export { CreateEspacioArrendableDto } from './espacio-arrendable/create-espacio-arrendable.dto';
export { UpdateEspacioArrendableDto } from './espacio-arrendable/update-espacio-arrendable.dto';
export { EspacioArrendableResponseDto } from './espacio-arrendable/espacio-arrendable-response.dto';

// Votación DTOs
export { CreateVotacionDto } from './votacion/create-votacion.dto';
export { UpdateVotacionDto } from './votacion/update-votacion.dto';

// Encomienda DTOs
export { CreateEncomiendaDto } from './encomienda/create-encomienda.dto';
export { UpdateEncomiendaDto } from './encomienda/update-encomienda.dto';
export { EncomiendaResponseDto, PropiedadInfoDto } from './encomienda/encomienda-response.dto';
export { TrabajadorInfoDto as TrabajadorEncomiendaInfoDto } from './encomienda/encomienda-response.dto';

// Trabajador DTOs
export { CreateTrabajadorDto } from './trabajador/create-trabajador.dto';
export { UpdateTrabajadorDto } from './trabajador/update-trabajador.dto';
export { TrabajadorRegisterResponseDto } from './trabajador/trabajador-register-response.dto';

// Presupuesto DTOs
export { CreatePresupuestoDto } from './presupuesto/create-presupuesto.dto';
export { UpdatePresupuestoDto } from './presupuesto/update-presupuesto.dto';

// Tipo Cronograma DTOs
export { CreateTipoCronogramaDto } from './tipo-cronograma/create-tipo-cronograma.dto';
export { UpdateTipoCronogramaDto } from './tipo-cronograma/update-tipo-cronograma.dto';

// Tipo Incidencia DTOs
export { CreateTipoIncidenciaDto } from './tipo-incidencia/create-tipo-incidencia.dto';
export { UpdateTipoIncidenciaDto } from './tipo-incidencia/update-tipo-incidencia.dto';

// Comentario Incidencia DTOs
export { CreateComentarioIncidenciaDto } from './comentario-incidencia/create-comentario-incidencia.dto';
export { UpdateComentarioIncidenciaDto } from './comentario-incidencia/update-comentario-incidencia.dto';

// Cronograma DTOs
export { CreateCronogramaDto } from './cronograma/create-cronograma.dto';
export { UpdateCronogramaDto } from './cronograma/update-cronograma.dto';
export { CronogramaRegisterResponseDto } from './cronograma/cronograma-register-response.dto';

// Residente DTOs
export { CreateResidenteDto } from './residente/create-residente.dto';
export { UpdateResidenteDto } from './residente/update-residente.dto';
export { ResidenteRegisterResponseDto } from './residente/residente-register-response.dto';

// Arrendatario DTOs
export { CreateArrendatarioDto } from './arrendatario/create-arrendatario.dto';
export { UpdateArrendatarioDto } from './arrendatario/update-arrendatario.dto';

// Arrendamiento Espacio DTOs
export { CreateArrendamientoEspacioDto } from './arrendamiento-espacio/create-arrendamiento-espacio.dto';
export { UpdateArrendamientoEspacioDto } from './arrendamiento-espacio/update-arrendamiento-espacio.dto';
export {
  CreateArrendamientoCompletoDto,
  ArrendatarioDataDto,
} from './arrendamiento-espacio/create-arrendamiento-completo.dto';

// Edificio DTOs
export { CreateEdificioDto } from './edificio/create-edificio.dto';
export { UpdateEdificioDto } from './edificio/update-edificio.dto';

// Inmobiliaria DTOs
export { CreateInmobiliariaDto } from './inmobiliaria/create-inmobiliaria.dto';
export { UpdateInmobiliariaDto } from './inmobiliaria/update-inmobiliaria.dto';

// Asignación Área Edificio DTOs
export { CreateAsignacionAreaEdificioDto } from './asignacion-area-edificio/create-asignacion-area-edificio.dto';
export { UpdateAsignacionAreaEdificioDto } from './asignacion-area-edificio/update-asignacion-area-edificio.dto';
export { AsignacionAreaEdificioResponseDto } from './asignacion-area-edificio/asignacion-area-edificio-response.dto';
export { CreateMultipleAsignacionAreaEdificioDto, AsignacionAreaDto } from './asignacion-area-edificio/create-multiple-asignacion-area-edificio.dto';

// Caja DTOs
export { CreateCajaDto } from './caja/create-caja.dto';
export { UpdateCajaDto } from './caja/update-caja.dto';
export { CajaResponseDto } from './caja/caja-response.dto';
export { AperturaCajaDto } from './caja/apertura-caja.dto';
export { CierreCajaDto } from './caja/cierre-caja.dto';

// Movimiento Caja DTOs
export { CreateMovimientoCajaDto } from './movimiento-caja/create-movimiento-caja.dto';
export { UpdateMovimientoCajaDto } from './movimiento-caja/update-movimiento-caja.dto';
export { MovimientoCajaResponseDto } from './movimiento-caja/movimiento-caja-response.dto';
export { TipoMovimiento } from './movimiento-caja/create-movimiento-caja.dto';

// Contacto DTOs
export { CreateContactoDto } from './contacto/create-contacto.dto';
export { UpdateContactoDto } from './contacto/update-contacto.dto';
export {
  ContactoResponseDto,
  TipoContactoInfoDto,
  TipoContratoInfoDto
} from './contacto/contacto-response.dto';

// Opción Voto DTOs
export { CreateOpcionVotoDto } from './opcion-voto/create-opcion-voto.dto';
export { UpdateOpcionVotoDto } from './opcion-voto/update-opcion-voto.dto';
export {
  OpcionVotoResponseDto,
  CreateOpcionVotoResponseDto,
  GetOpcionVotoResponseDto,
  GetOpcionesVotoResponseDto,
  UpdateOpcionVotoResponseDto,
  DeleteOpcionVotoResponseDto,
} from './opcion-voto/opcion-voto-response.dto';

// Historial Contrato DTOs
export { CreateHistorialContratoDto } from './historial-contrato/create-historial-contrato.dto';
export { UpdateHistorialContratoDto } from './historial-contrato/update-historial-contrato.dto';
export {
  HistorialContratoResponseDto,
  ContratoInfoDto,
  TrabajadorInfoHistorialDto
} from './historial-contrato/historial-contrato-response.dto';

// Junta Propietarios DTOs
export { CreateJuntaPropietariosDto } from './junta-propietarios/create-junta-propietarios.dto';
export { UpdateJuntaPropietariosDto } from './junta-propietarios/update-junta-propietarios.dto';
export { JuntaPropietariosResponseDto } from './junta-propietarios/junta-propietarios-response.dto';

// Mantenimiento DTOs
export { CreateMantenimientoDto } from './mantenimiento/create-mantenimiento.dto';
export { UpdateMantenimientoDto } from './mantenimiento/update-mantenimiento.dto';
export { MantenimientoResponseDto } from './mantenimiento/mantenimiento-response.dto';

// Mensaje Privado DTOs
export { CreateMensajePrivadoDto } from './mensaje-privado/create-mensaje-privado.dto';
export { UpdateMensajePrivadoDto } from './mensaje-privado/update-mensaje-privado.dto';
export { MensajePrivadoResponseDto } from './mensaje-privado/mensaje-privado-response.dto';

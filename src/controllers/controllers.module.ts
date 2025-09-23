import { Module } from '@nestjs/common';
import { UsuarioController } from './usuario/usuario.controller';
import { RolController } from './rol/rol.controller';
import { PropietarioController } from './propietario/propietario.controller';
import { PropiedadController } from './propiedad/propiedad.controller';
import { IncidenciaController } from './incidencia/incidencia.controller';
import { NotificacionController } from './notificacion/notificacion.controller';
import { PagoController } from './pago/pago.controller';
import { DocumentoController } from './documento/documento.controller';
import { AreaComunController } from './area-comun/area-comun.controller';
import { ReservaController } from './reserva/reserva.controller';
import { VotacionController } from './votacion/votacion.controller';
import { EncomiendaController } from './encomienda/encomienda.controller';
import { DocumentoIdentidadController } from './documento-identidad/documento-identidad.controller';
import { TipoDocumentoController } from './tipo-documento/tipo-documento.controller';
import { EspacioArrendableController } from './espacio-arrendable/espacio-arrendable.controller';
import { ResidenteController } from './residente/residente.controller';
import { VisitaController } from './visita/visita.controller';
import { TrabajadorController } from './trabajador/trabajador.controller';
import { MantenimientoController } from './mantenimiento/mantenimiento.controller';
import { ConceptoPagoController } from './concepto-pago/concepto-pago.controller';
import { ReciboController } from './recibo/recibo.controller';
import { PresupuestoController } from './presupuesto/presupuesto.controller';
import { CajaController } from './caja/caja.controller';
import { MovimientoCajaController } from './movimiento-caja/movimiento-caja.controller';
import { JuntaPropietariosController } from './junta-propietarios/junta-propietarios.controller';
import { VotoController } from './voto/voto.controller';
import { OpcionVotoController } from './opcion-voto/opcion-voto.controller';
import { MensajePrivadoController } from './mensaje-privado/mensaje-privado.controller';
import { ComentarioIncidenciaController } from './comentario-incidencia/comentario-incidencia.controller';
import { ContratoController } from './contrato/contrato.controller';
import { CronogramaController } from './cronograma/cronograma.controller';
import { ArrendamientoEspacioController } from './arrendamiento-espacio/arrendamiento-espacio.controller';
import { HistorialContratoController } from './historial-contrato/historial-contrato.controller';
import { TipoIncidenciaController } from './tipo-incidencia/tipo-incidencia.controller';
import { TipoContratoController } from './tipo-contrato/tipo-contrato.controller';
import { TipoCronogramaController } from './tipo-cronograma/tipo-cronograma.controller';
import { TipoEspacioController } from './tipo-espacio/tipo-espacio.controller';
import { TipoContactoController } from './tipo-contacto/tipo-contacto.controller';
import { ContactoController } from './contacto/contacto.controller';
import { PropiedadPropietarioController } from './propiedad-propietario/propiedad-propietario.controller';
import { ResidenciaController } from './residencia/residencia.controller';
import { UsuarioExternoController } from './usuario-externo/usuario-externo.controller';

@Module({
  controllers: [UsuarioController, RolController, PropietarioController, PropiedadController, IncidenciaController, NotificacionController, PagoController, DocumentoController, AreaComunController, ReservaController, VotacionController, EncomiendaController, DocumentoIdentidadController, TipoDocumentoController, EspacioArrendableController, ResidenteController, VisitaController, TrabajadorController, MantenimientoController, ConceptoPagoController, ReciboController, PresupuestoController, CajaController, MovimientoCajaController, JuntaPropietariosController, VotoController, OpcionVotoController, MensajePrivadoController, ComentarioIncidenciaController, ContratoController, CronogramaController, ArrendamientoEspacioController, HistorialContratoController, TipoIncidenciaController, TipoContratoController, TipoCronogramaController, TipoEspacioController, TipoContactoController, ContactoController, PropiedadPropietarioController, ResidenciaController, UsuarioExternoController]
})
export class ControllersModule {}

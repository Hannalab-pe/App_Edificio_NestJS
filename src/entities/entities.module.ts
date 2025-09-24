// entities/entities.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AreaComun } from './AreaComun';
import { ArrendamientoEspacio } from './ArrendamientoEspacio';
import { Caja } from './Caja';
import { ComentarioIncidencia } from './ComentarioIncidencia';
import { ConceptoPago } from './ConceptoPago';
import { Contacto } from './Contacto';
import { Contrato } from './Contrato';
import { Cronograma } from './Cronograma';
import { Documento } from './Documento';
import { DocumentoIdentidad } from './DocumentoIdentidad';
import { Encomienda } from './Encomienda';
import { EspacioArrendable } from './EspacioArrendable';
import { HistorialContrato } from './HistorialContrato';
import { Incidencia } from './Incidencia';
import { JuntaPropietarios } from './JuntaPropietarios';
import { Mantenimiento } from './Mantenimiento';
import { MensajePrivado } from './MensajePrivado';
import { MovimientoCaja } from './MovimientoCaja';
import { Notificacion } from './Notificacion';
import { OpcionVoto } from './OpcionVoto';
import { Pago } from './Pago';
import { Presupuesto } from './Presupuesto';
import { Propiedad } from './Propiedad';
import { PropiedadPropietario } from './PropiedadPropietario';
import { Propietario } from './Propietario';
import { Recibo } from './Recibo';
import { Reserva } from './Reserva';
import { Residencia } from './Residencia';
import { Residente } from './Residente';
import { Rol } from './Rol';
import { TipoContacto } from './TipoContacto';
import { TipoContrato } from './TipoContrato';
import { TipoCronograma } from './TipoCronograma';
import { TipoDocumento } from './TipoDocumento';
import { TipoEspacio } from './TipoEspacio';
import { TipoIncidencia } from './TipoIncidencia';
import { Trabajador } from './Trabajador';
import { Usuario } from './Usuario';
import { UsuarioExterno } from './UsuarioExterno';
import { Visita } from './Visita';
import { Votacion } from './Votacion';
import { Voto } from './Voto';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AreaComun,
      ArrendamientoEspacio,
      Caja,
      ComentarioIncidencia,
      ConceptoPago,
      Contacto,
      Contrato,
      Cronograma,
      Documento,
      DocumentoIdentidad,
      Encomienda,
      EspacioArrendable,
      HistorialContrato,
      Incidencia,
      JuntaPropietarios,
      Mantenimiento,
      MensajePrivado,
      MovimientoCaja,
      Notificacion,
      OpcionVoto,
      Pago,
      Presupuesto,
      Propiedad,
      PropiedadPropietario,
      Propietario,
      Recibo,
      Reserva,
      Residencia,
      Residente,
      Rol,
      TipoContacto,
      TipoContrato,
      TipoCronograma,
      TipoDocumento,
      TipoEspacio,
      TipoIncidencia,
      Trabajador,
      Usuario,
      UsuarioExterno,
      Visita,
      Votacion,
      Voto,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class EntitiesModule {}

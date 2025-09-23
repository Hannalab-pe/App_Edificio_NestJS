import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { ComentarioIncidencia } from "./ComentarioIncidencia";
import { Incidencia } from "./Incidencia";
import { JuntaPropietarios } from "./JuntaPropietarios";
import { MensajePrivado } from "./MensajePrivado";
import { Notificacion } from "./Notificacion";
import { Propietario } from "./Propietario";
import { Reserva } from "./Reserva";
import { Residente } from "./Residente";
import { Trabajador } from "./Trabajador";
import { Rol } from "./Rol";
import { Visita } from "./Visita";
import { Votacion } from "./Votacion";
import { Voto } from "./Voto";

@Index("idx_usuario_correo", ["correo"], {})
@Index("usuario_correo_key", ["correo"], { unique: true })
@Index("usuario_pkey", ["idUsuario"], { unique: true })
@Entity("usuario", { schema: "public" })
export class Usuario {
  @Column("uuid", {
    primary: true,
    name: "id_usuario",
    default: () => "uuid_generate_v4()",
  })
  idUsuario: string;

  @Column("character varying", { name: "correo", unique: true })
  correo: string;

  @Column("character varying", { name: "contrasena" })
  contrasena: string;

  @Column("boolean", { name: "esta_activo", default: () => "true" })
  estaActivo: boolean;

  @OneToMany(
    () => ComentarioIncidencia,
    (comentarioIncidencia) => comentarioIncidencia.idUsuario
  )
  comentarioIncidencias: ComentarioIncidencia[];

  @OneToMany(() => Incidencia, (incidencia) => incidencia.reportadoPorUsuario)
  incidencias: Incidencia[];

  @OneToMany(
    () => JuntaPropietarios,
    (juntaPropietarios) => juntaPropietarios.creadoPor
  )
  juntaPropietarios: JuntaPropietarios[];

  @OneToMany(
    () => MensajePrivado,
    (mensajePrivado) => mensajePrivado.emisorUsuario
  )
  mensajePrivados: MensajePrivado[];

  @OneToMany(
    () => MensajePrivado,
    (mensajePrivado) => mensajePrivado.receptorUsuario2
  )
  mensajePrivados2: MensajePrivado[];

  @OneToMany(
    () => Notificacion,
    (notificacion) => notificacion.destinatarioUsuario2
  )
  notificacions: Notificacion[];

  @OneToMany(() => Notificacion, (notificacion) => notificacion.emisorUsuario)
  notificacions2: Notificacion[];

  @OneToMany(() => Propietario, (propietario) => propietario.idUsuario)
  propietarios: Propietario[];

  @OneToMany(() => Reserva, (reserva) => reserva.idUsuario)
  reservas: Reserva[];

  @OneToMany(() => Residente, (residente) => residente.idUsuario)
  residentes: Residente[];

  @OneToMany(() => Trabajador, (trabajador) => trabajador.idUsuario)
  trabajadors: Trabajador[];

  @ManyToOne(() => Rol, (rol) => rol.usuarios)
  @JoinColumn([{ name: "id_rol", referencedColumnName: "idRol" }])
  idRol: Rol;

  @OneToMany(() => Visita, (visita) => visita.autorizadorUsuario)
  visitas: Visita[];

  @OneToMany(() => Votacion, (votacion) => votacion.creadoPorUsuario)
  votacions: Votacion[];

  @OneToMany(() => Voto, (voto) => voto.idUsuario2)
  votos: Voto[];
}

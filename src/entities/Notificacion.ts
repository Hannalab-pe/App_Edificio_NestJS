import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Rol } from "./Rol";
import { Usuario } from "./Usuario";

@Index("idx_notificacion_usuario", ["destinatarioUsuario"], {})
@Index("idx_notificacion_fecha", ["fechaEnvio"], {})
@Index("notificacion_pkey", ["idNotificacion"], { unique: true })
@Entity("notificacion", { schema: "public" })
export class Notificacion {
  @Column("uuid", {
    primary: true,
    name: "id_notificacion",
    default: () => "uuid_generate_v4()",
  })
  idNotificacion: string;

  @Column("character varying", { name: "titulo" })
  titulo: string;

  @Column("text", { name: "mensaje" })
  mensaje: string;

  @Column("character varying", { name: "tipo" })
  tipo: string;

  @Column("uuid", { name: "destinatario_usuario", nullable: true })
  destinatarioUsuario: string | null;

  @Column("boolean", { name: "leida", nullable: true, default: () => "false" })
  leida: boolean | null;

  @Column("timestamp without time zone", {
    name: "fecha_envio",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  fechaEnvio: Date | null;

  @Column("timestamp without time zone", {
    name: "fecha_lectura",
    nullable: true,
  })
  fechaLectura: Date | null;

  @ManyToOne(() => Rol, (rol) => rol.notificacions)
  @JoinColumn([{ name: "destinatario_rol", referencedColumnName: "idRol" }])
  destinatarioRol: Rol;

  @ManyToOne(() => Usuario, (usuario) => usuario.notificacions)
  @JoinColumn([
    { name: "destinatario_usuario", referencedColumnName: "idUsuario" },
  ])
  destinatarioUsuario2: Usuario;

  @ManyToOne(() => Usuario, (usuario) => usuario.notificacions2)
  @JoinColumn([{ name: "emisor_usuario", referencedColumnName: "idUsuario" }])
  emisorUsuario: Usuario;
}

import { Column, Entity, Index, OneToMany } from "typeorm";
import { Notificacion } from "./Notificacion";
import { Usuario } from "./Usuario";

@Index("rol_pkey", ["idRol"], { unique: true })
@Entity("rol", { schema: "public" })
export class Rol {
  @Column("uuid", {
    primary: true,
    name: "id_rol",
    default: () => "uuid_generate_v4()",
  })
  idRol: string;

  @Column("character varying", { name: "nombre" })
  nombre: string;

  @Column("text", { name: "descripcion", nullable: true })
  descripcion: string | null;

  @OneToMany(() => Notificacion, (notificacion) => notificacion.destinatarioRol)
  notificacions: Notificacion[];

  @OneToMany(() => Usuario, (usuario) => usuario.idRol)
  usuarios: Usuario[];
}

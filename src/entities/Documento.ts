import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { TipoDocumento } from "./TipoDocumento";
import { Trabajador } from "./Trabajador";
import { JuntaPropietarios } from "./JuntaPropietarios";

@Index("documento_pkey", ["idDocumento"], { unique: true })
@Entity("documento", { schema: "public" })
export class Documento {
  @Column("uuid", {
    primary: true,
    name: "id_documento",
    default: () => "uuid_generate_v4()",
  })
  idDocumento: string;

  @Column("text", { name: "url_documento" })
  urlDocumento: string;

  @Column("text", { name: "descripcion" })
  descripcion: string;

  @ManyToOne(() => TipoDocumento, (tipoDocumento) => tipoDocumento.documentos)
  @JoinColumn([
    { name: "id_tipo_documento", referencedColumnName: "idTipoDocumento" },
  ])
  idTipoDocumento: TipoDocumento;

  @ManyToOne(() => Trabajador, (trabajador) => trabajador.documentos)
  @JoinColumn([{ name: "id_trabajador", referencedColumnName: "idTrabajador" }])
  idTrabajador: Trabajador;

  @OneToMany(
    () => JuntaPropietarios,
    (juntaPropietarios) => juntaPropietarios.idDocumento
  )
  juntaPropietarios: JuntaPropietarios[];
}

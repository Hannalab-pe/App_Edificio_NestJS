import { Column, Entity, Index, OneToMany } from "typeorm";
import { Documento } from "./Documento";

@Index("tipo_documento_pkey", ["idTipoDocumento"], { unique: true })
@Entity("tipo_documento", { schema: "public" })
export class TipoDocumento {
  @Column("uuid", {
    primary: true,
    name: "id_tipo_documento",
    default: () => "uuid_generate_v4()",
  })
  idTipoDocumento: string;

  @Column("character varying", { name: "tipo_documento" })
  tipoDocumento: string;

  @Column("text", { name: "descripcion" })
  descripcion: string;

  @OneToMany(() => Documento, (documento) => documento.idTipoDocumento)
  documentos: Documento[];
}

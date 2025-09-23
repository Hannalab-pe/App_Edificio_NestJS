import { Column, Entity, Index, OneToMany } from "typeorm";
import { Propietario } from "./Propietario";
import { Residente } from "./Residente";
import { Trabajador } from "./Trabajador";
import { UsuarioExterno } from "./UsuarioExterno";

@Index("documento_identidad_pkey", ["idDocumentoIdentidad"], { unique: true })
@Index("documento_identidad_numero_key", ["numero"], { unique: true })
@Entity("documento_identidad", { schema: "public" })
export class DocumentoIdentidad {
  @Column("uuid", {
    primary: true,
    name: "id_documento_identidad",
    default: () => "uuid_generate_v4()",
  })
  idDocumentoIdentidad: string;

  @Column("character varying", { name: "tipo_documento" })
  tipoDocumento: string;

  @Column("integer", { name: "numero", unique: true })
  numero: number;

  @OneToMany(
    () => Propietario,
    (propietario) => propietario.idDocumentoIdentidad
  )
  propietarios: Propietario[];

  @OneToMany(() => Residente, (residente) => residente.idDocumentoIdentidad)
  residentes: Residente[];

  @OneToMany(() => Trabajador, (trabajador) => trabajador.idDocumentoIdentidad)
  trabajadors: Trabajador[];

  @OneToMany(
    () => UsuarioExterno,
    (usuarioExterno) => usuarioExterno.idDocumentoIdentidad
  )
  usuarioExternos: UsuarioExterno[];
}

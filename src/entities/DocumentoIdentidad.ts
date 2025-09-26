import { Column, Entity, Index, OneToMany } from "typeorm";
import { Arrendatario } from "./Arrendatario";
import { Propietario } from "./Propietario";
import { Residente } from "./Residente";
import { Trabajador } from "./Trabajador";

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
    () => Arrendatario,
    (arrendatario) => arrendatario.idDocumentoIdentidad
  )
  arrendatarios: Arrendatario[];

  @OneToMany(
    () => Propietario,
    (propietario) => propietario.idDocumentoIdentidad
  )
  propietarios: Propietario[];

  @OneToMany(() => Residente, (residente) => residente.idDocumentoIdentidad)
  residentes: Residente[];

  @OneToMany(() => Trabajador, (trabajador) => trabajador.idDocumentoIdentidad)
  trabajadors: Trabajador[];
}

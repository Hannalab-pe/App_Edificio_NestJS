import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Cronograma } from "./Cronograma";
import { Residencia } from "./Residencia";
import { DocumentoIdentidad } from "./DocumentoIdentidad";
import { Usuario } from "./Usuario";

@Index("idx_residente_correo", ["correo"], {})
@Index("residente_pkey", ["idResidente"], { unique: true })
@Entity("residente", { schema: "public" })
export class Residente {
  @Column("uuid", {
    primary: true,
    name: "id_residente",
    default: () => "uuid_generate_v4()",
  })
  idResidente: string;

  @Column("character varying", { name: "nombre" })
  nombre: string;

  @Column("character varying", { name: "apellido" })
  apellido: string;

  @Column("character varying", { name: "correo" })
  correo: string;

  @Column("boolean", { name: "esta_activo", default: () => "true" })
  estaActivo: boolean;

  @Column("character varying", { name: "telefono", nullable: true })
  telefono: string | null;

  @Column("date", { name: "fecha_nacimiento", nullable: true })
  fechaNacimiento: string | null;

  @Column("timestamp without time zone", {
    name: "fecha_registro",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  fechaRegistro: Date | null;

  @OneToMany(() => Cronograma, (cronograma) => cronograma.idResidente)
  cronogramas: Cronograma[];

  @OneToMany(() => Residencia, (residencia) => residencia.idResidente)
  residencias: Residencia[];

  @ManyToOne(
    () => DocumentoIdentidad,
    (documentoIdentidad) => documentoIdentidad.residentes
  )
  @JoinColumn([
    {
      name: "id_documento_identidad",
      referencedColumnName: "idDocumentoIdentidad",
    },
  ])
  idDocumentoIdentidad: DocumentoIdentidad;

  @ManyToOne(() => Usuario, (usuario) => usuario.residentes)
  @JoinColumn([{ name: "id_usuario", referencedColumnName: "idUsuario" }])
  idUsuario: Usuario;
}

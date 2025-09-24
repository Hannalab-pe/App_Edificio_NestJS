import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { PropiedadPropietario } from "./PropiedadPropietario";
import { DocumentoIdentidad } from "./DocumentoIdentidad";
import { Usuario } from "./Usuario";
import { Residencia } from "./Residencia";

@Index("idx_propietario_correo", ["correo"], {})
@Index("propietario_correo_key", ["correo"], { unique: true })
@Index("propietario_pkey", ["idPropietario"], { unique: true })
@Entity("propietario", { schema: "public" })
export class Propietario {
  @Column("uuid", {
    primary: true,
    name: "id_propietario",
    default: () => "uuid_generate_v4()",
  })
  idPropietario: string;

  @Column("character varying", { name: "nombre" })
  nombre: string;

  @Column("character varying", { name: "apellido" })
  apellido: string;

  @Column("character varying", { name: "correo", unique: true })
  correo: string;

  @Column("character varying", { name: "telefono", nullable: true })
  telefono: string | null;

  @Column("text", { name: "direccion", nullable: true })
  direccion: string | null;

  @Column("boolean", { name: "esta_activo", default: () => "true" })
  estaActivo: boolean;

  @Column("timestamp without time zone", {
    name: "fecha_registro",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  fechaRegistro: Date | null;

  @OneToMany(
    () => PropiedadPropietario,
    (propiedadPropietario) => propiedadPropietario.idPropietario
  )
  propiedadPropietarios: PropiedadPropietario[];

  @ManyToOne(
    () => DocumentoIdentidad,
    (documentoIdentidad) => documentoIdentidad.propietarios
  )
  @JoinColumn([
    {
      name: "id_documento_identidad",
      referencedColumnName: "idDocumentoIdentidad",
    },
  ])
  idDocumentoIdentidad: DocumentoIdentidad;

  @ManyToOne(() => Usuario, (usuario) => usuario.propietarios)
  @JoinColumn([{ name: "id_usuario", referencedColumnName: "idUsuario" }])
  
  idUsuario: Usuario;

  @OneToMany(() => Residencia, (residencia) => residencia.idPropietario)
  residencias: Residencia[];
}

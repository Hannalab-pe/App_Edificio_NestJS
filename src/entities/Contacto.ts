import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { TipoContacto } from "./TipoContacto";
import { TipoContrato } from "./TipoContrato";
import { Mantenimiento } from "./Mantenimiento";

@Index("contacto_correo_key", ["correo"], { unique: true })
@Index("contacto_pkey", ["idContacto"], { unique: true })
@Entity("contacto", { schema: "public" })
export class Contacto {
  @Column("uuid", {
    primary: true,
    name: "id_contacto",
    default: () => "uuid_generate_v4()",
  })
  idContacto: string;

  @Column("character varying", { name: "nombre" })
  nombre: string;

  @Column("text", { name: "descripcion", nullable: true })
  descripcion: string | null;

  @Column("character varying", { name: "correo", nullable: true, unique: true })
  correo: string | null;

  @Column("character varying", { name: "telefono", nullable: true })
  telefono: string | null;

  @Column("text", { name: "direccion", nullable: true })
  direccion: string | null;

  @Column("text", { name: "imagen_url", nullable: true })
  imagenUrl: string | null;

  @Column("boolean", { name: "esta_activo", default: () => "true" })
  estaActivo: boolean;

  @ManyToOne(() => TipoContacto, (tipoContacto) => tipoContacto.contactos)
  @JoinColumn([
    { name: "id_tipo_contacto", referencedColumnName: "idTipoContacto" },
  ])
  idTipoContacto: TipoContacto;

  @ManyToOne(() => TipoContrato, (tipoContrato) => tipoContrato.contactos)
  @JoinColumn([
    { name: "id_tipo_contrato", referencedColumnName: "idTipoContrato" },
  ])
  idTipoContrato: TipoContrato;

  @OneToMany(() => Mantenimiento, (mantenimiento) => mantenimiento.idContacto)
  mantenimientos: Mantenimiento[];
}

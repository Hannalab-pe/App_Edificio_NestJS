import { Column, Entity, Index, OneToMany } from "typeorm";
import { Edificio } from "./Edificio";

@Index("inmobiliaria_pkey", ["idInmobiliaria"], { unique: true })
@Entity("inmobiliaria", { schema: "public" })
export class Inmobiliaria {
  @Column("uuid", {
    primary: true,
    name: "id_inmobiliaria",
    default: () => "gen_random_uuid()",
  })
  idInmobiliaria: string;

  @Column("character varying", { name: "nom_inmobiliaria", length: 50 })
  nomInmobiliaria: string;

  @Column("character", { name: "telf_contacto", length: 9 })
  telfContacto: string;

  @Column("character varying", { name: "correo_contacto", length: 50 })
  correoContacto: string;

  @Column("character varying", { name: "direccion_inmobiliaria", length: 50 })
  direccionInmobiliaria: string;

  @OneToMany(() => Edificio, (edificio) => edificio.idInmobiliaria)
  edificios: Edificio[];
}

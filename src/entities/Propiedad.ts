import { Column, Entity, Index, OneToMany } from "typeorm";
import { Encomienda } from "./Encomienda";
import { PropiedadPropietario } from "./PropiedadPropietario";
import { Residencia } from "./Residencia";
import { Visita } from "./Visita";

@Index("propiedad_pkey", ["idPropiedad"], { unique: true })
@Index("propiedad_numero_departamento_key", ["numeroDepartamento"], {
  unique: true,
})
@Entity("propiedad", { schema: "public" })
export class Propiedad {
  @Column("uuid", {
    primary: true,
    name: "id_propiedad",
    default: () => "uuid_generate_v4()",
  })
  idPropiedad: string;

  @Column("character varying", { name: "numero_departamento", unique: true })
  numeroDepartamento: string;

  @Column("character varying", { name: "tipo_propiedad", length: 25 })
  tipoPropiedad: string;

  @Column("integer", { name: "piso" })
  piso: number;

  @Column("numeric", {
    name: "area_m2",
    nullable: true,
    precision: 8,
    scale: 2,
  })
  areaM2: string | null;

  @Column("integer", { name: "cuartos", nullable: true, default: () => "0" })
  cuartos: number | null;

  @Column("integer", { name: "banios", nullable: true, default: () => "0" })
  banios: number | null;

  @Column("integer", {
    name: "estacionamientos",
    nullable: true,
    default: () => "0",
  })
  estacionamientos: number | null;

  @Column("boolean", { name: "cuartos_servicio", default: () => "false" })
  cuartosServicio: boolean;

  @Column("character varying", { name: "estado_ocupacion", length: 25 })
  estadoOcupacion: string;

  @Column("numeric", {
    name: "valor_comercial",
    nullable: true,
    precision: 12,
    scale: 2,
  })
  valorComercial: string | null;

  @Column("text", { name: "descripcion", nullable: true })
  descripcion: string | null;

  @Column("boolean", { name: "esta_activo", default: () => "true" })
  estaActivo: boolean;

  @OneToMany(() => Encomienda, (encomienda) => encomienda.idPropiedad)
  encomiendas: Encomienda[];

  @OneToMany(
    () => PropiedadPropietario,
    (propiedadPropietario) => propiedadPropietario.idPropiedad
  )
  propiedadPropietarios: PropiedadPropietario[];

  @OneToMany(() => Residencia, (residencia) => residencia.idPropiedad)
  residencias: Residencia[];

  @OneToMany(() => Visita, (visita) => visita.idPropiedad)
  visitas: Visita[];
}

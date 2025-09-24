import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Trabajador } from "./Trabajador";
import { AreaComun } from "./AreaComun";
import { Inmobiliaria } from "./Inmobiliaria";
import { Propiedad } from "./Propiedad";

@Index("edificio_pkey", ["idEdificio"], { unique: true })
@Entity("edificio", { schema: "public" })
export class Edificio {
  @Column("uuid", {
    primary: true,
    name: "id_edificio",
    default: () => "gen_random_uuid()",
  })
  idEdificio: string;

  @Column("character varying", { name: "nombre_edificio", length: 50 })
  nombreEdificio: string;

  @Column("character varying", { name: "direccion", length: 100 })
  direccion: string;

  @Column("character varying", { name: "imagen_url", length: 300 })
  imagenUrl: string;

  @Column("integer", { name: "cantidad_departamentos" })
  cantidadDepartamentos: number;

  @Column("character varying", { name: "distrito", length: 50 })
  distrito: string;

  @Column("boolean", { name: "esta_activo" })
  estaActivo: boolean;

  @Column("integer", { name: "numero_pisos" })
  numeroPisos: number;

  @Column("timestamp without time zone", { name: "fecha_registro" })
  fechaRegistro: Date;

  @Column("integer", { name: "numero_sotanos" })
  numeroSotanos: number;

  @Column("integer", { name: "cant_almacenes" })
  cantAlmacenes: number;

  @Column("integer", { name: "numero_cocheras" })
  numeroCocheras: number;

  @Column("integer", { name: "numero_areas_comunes" })
  numeroAreasComunes: number;

  @Column("timestamp without time zone", {
    name: "fecha_actualizacion",
    nullable: true,
  })
  fechaActualizacion: Date | null;

  @ManyToOne(() => Trabajador, (trabajador) => trabajador.edificios)
  @JoinColumn([
    { name: "id_administrador_edificio", referencedColumnName: "idTrabajador" },
  ])
  idAdministradorEdificio: Trabajador;

  @ManyToOne(() => AreaComun, (areaComun) => areaComun.edificios)
  @JoinColumn([
    { name: "id_areas_comunes", referencedColumnName: "idAreaComun" },
  ])
  idAreasComunes: AreaComun;

  @ManyToOne(() => Inmobiliaria, (inmobiliaria) => inmobiliaria.edificios)
  @JoinColumn([
    { name: "id_inmobiliaria", referencedColumnName: "idInmobiliaria" },
  ])
  idInmobiliaria: Inmobiliaria;

  @OneToMany(() => Propiedad, (propiedad) => propiedad.idEdificio)
  propiedads: Propiedad[];
}

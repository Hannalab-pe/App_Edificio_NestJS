import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { ArrendamientoEspacio } from "./ArrendamientoEspacio";
import { TipoEspacio } from "./TipoEspacio";

@Index("espacio_arrendable_codigo_key", ["codigo"], { unique: true })
@Index("idx_espacio_codigo", ["codigo"], {})
@Index("espacio_arrendable_pkey", ["idEspacio"], { unique: true })
@Index("idx_espacio_tipo", ["idTipoEspacio"], {})
@Entity("espacio_arrendable", { schema: "public" })
export class EspacioArrendable {
  @Column("uuid", {
    primary: true,
    name: "id_espacio",
    default: () => "uuid_generate_v4()",
  })
  idEspacio: string;

  @Column("character varying", { name: "codigo", unique: true })
  codigo: string;

  @Column("text", { name: "descripcion", nullable: true })
  descripcion: string | null;

  @Column("character varying", { name: "ubicacion" })
  ubicacion: string;

  @Column("numeric", {
    name: "area_m2",
    nullable: true,
    precision: 8,
    scale: 2,
  })
  areaM2: number | null;

  @Column("character varying", { name: "estado" })
  estado: string;

  @Column("numeric", {
    name: "tarifa_mensual",
    nullable: true,
    precision: 10,
    scale: 2,
  })
  tarifaMensual: number | null;

  @Column("boolean", {
    name: "esta_activo",
    nullable: true,
    default: () => "true",
  })
  estaActivo: boolean | null;

  @Column("uuid", { name: "id_tipo_espacio" })
  idTipoEspacio: string;

  @OneToMany(
    () => ArrendamientoEspacio,
    (arrendamientoEspacio) => arrendamientoEspacio.idEspacio
  )
  arrendamientoEspacios: ArrendamientoEspacio[];

  @ManyToOne(() => TipoEspacio, (tipoEspacio) => tipoEspacio.espacioArrendables)
  @JoinColumn([
    { name: "id_tipo_espacio", referencedColumnName: "idTipoEspacio" },
  ])
  idTipoEspacio2: TipoEspacio;
}

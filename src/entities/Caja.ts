import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Trabajador } from "./Trabajador";
import { MovimientoCaja } from "./MovimientoCaja";

@Index("caja_pkey", ["idCaja"], { unique: true })
@Index("caja_numero_caja_key", ["numeroCaja"], { unique: true })
@Entity("caja", { schema: "public" })
export class Caja {
  @Column("uuid", {
    primary: true,
    name: "id_caja",
    default: () => "uuid_generate_v4()",
  })
  idCaja: string;

  @Column("numeric", { name: "monto_inicial" })
  montoInicial: string;

  @Column("numeric", { name: "monto_final" })
  montoFinal: string;

  @Column("date", { name: "fecha_inicio", nullable: true })
  fechaInicio: string | null;

  @Column("date", { name: "fecha_fin", nullable: true })
  fechaFin: string | null;

  @Column("boolean", { name: "estado", default: () => "true" })
  estado: boolean;

  @Column("text", { name: "descripcion", nullable: true })
  descripcion: string | null;

  @Column("character varying", {
    name: "numero_caja",
    nullable: true,
    unique: true,
  })
  numeroCaja: string | null;

  @ManyToOne(() => Trabajador, (trabajador) => trabajador.cajas)
  @JoinColumn([{ name: "id_trabajador", referencedColumnName: "idTrabajador" }])
  idTrabajador: Trabajador;

  @OneToMany(() => MovimientoCaja, (movimientoCaja) => movimientoCaja.idCaja)
  movimientoCajas: MovimientoCaja[];
}

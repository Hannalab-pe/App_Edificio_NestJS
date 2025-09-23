import { Column, Entity, Index } from "typeorm";

@Index("presupuesto_anio_mes_concepto_key", ["anio", "concepto", "mes"], {
  unique: true,
})
@Index("presupuesto_pkey", ["idPresupuesto"], { unique: true })
@Entity("presupuesto", { schema: "public" })
export class Presupuesto {
  @Column("uuid", {
    primary: true,
    name: "id_presupuesto",
    default: () => "uuid_generate_v4()",
  })
  idPresupuesto: string;

  @Column("integer", { name: "anio", unique: true })
  anio: number;

  @Column("integer", { name: "mes", unique: true })
  mes: number;

  @Column("character varying", { name: "concepto", unique: true })
  concepto: string;

  @Column("numeric", { name: "monto_presupuestado", precision: 12, scale: 2 })
  montoPresupuestado: string;

  @Column("numeric", {
    name: "monto_ejecutado",
    nullable: true,
    precision: 12,
    scale: 2,
    default: () => "0",
  })
  montoEjecutado: string | null;

  @Column("text", { name: "descripcion", nullable: true })
  descripcion: string | null;

  @Column("boolean", { name: "esta_activo", default: () => "true" })
  estaActivo: boolean;
}

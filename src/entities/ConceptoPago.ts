import { Column, Entity, Index, OneToMany } from "typeorm";
import { Pago } from "./Pago";

@Index("concepto_pago_pkey", ["idConceptoPago"], { unique: true })
@Entity("concepto_pago", { schema: "public" })
export class ConceptoPago {
  @Column("uuid", {
    primary: true,
    name: "id_concepto_pago",
    default: () => "uuid_generate_v4()",
  })
  idConceptoPago: string;

  @Column("character varying", { name: "nombre" })
  nombre: string;

  @Column("text", { name: "descripcion", nullable: true })
  descripcion: string | null;

  @Column("numeric", { name: "monto_base", precision: 10, scale: 2 })
  montoBase: string;

  @Column("boolean", { name: "es_variable", default: () => "false" })
  esVariable: boolean;

  @Column("character varying", { name: "frecuencia" })
  frecuencia: string;

  @Column("boolean", { name: "obligatorio", default: () => "true" })
  obligatorio: boolean;

  @Column("boolean", { name: "esta_activo", default: () => "true" })
  estaActivo: boolean;

  @OneToMany(() => Pago, (pago) => pago.idConceptoPago)
  pagos: Pago[];
}

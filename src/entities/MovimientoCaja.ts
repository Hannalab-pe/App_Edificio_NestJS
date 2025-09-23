import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Caja } from "./Caja";
import { Pago } from "./Pago";

@Index("movimiento_caja_pkey", ["idMovimiento"], { unique: true })
@Entity("movimiento_caja", { schema: "public" })
export class MovimientoCaja {
  @Column("uuid", {
    primary: true,
    name: "id_movimiento",
    default: () => "uuid_generate_v4()",
  })
  idMovimiento: string;

  @Column("character varying", { name: "tipo" })
  tipo: string;

  @Column("character varying", { name: "concepto" })
  concepto: string;

  @Column("numeric", { name: "monto", precision: 12, scale: 2 })
  monto: string;

  @Column("timestamp without time zone", {
    name: "fecha_movimiento",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  fechaMovimiento: Date | null;

  @Column("text", { name: "comprobante_url", nullable: true })
  comprobanteUrl: string | null;

  @Column("text", { name: "descripcion", nullable: true })
  descripcion: string | null;

  @ManyToOne(() => Caja, (caja) => caja.movimientoCajas)
  @JoinColumn([{ name: "id_caja", referencedColumnName: "idCaja" }])
  idCaja: Caja;

  @ManyToOne(() => Pago, (pago) => pago.movimientoCajas)
  @JoinColumn([{ name: "id_pago", referencedColumnName: "idPago" }])
  idPago: Pago;
}

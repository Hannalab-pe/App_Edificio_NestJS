import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Pago } from "./Pago";

@Index("recibo_pkey", ["idRecibo"], { unique: true })
@Index("recibo_numero_recibo_key", ["numeroRecibo"], { unique: true })
@Entity("recibo", { schema: "public" })
export class Recibo {
  @Column("uuid", {
    primary: true,
    name: "id_recibo",
    default: () => "uuid_generate_v4()",
  })
  idRecibo: string;

  @Column("character varying", { name: "numero_recibo", unique: true })
  numeroRecibo: string;

  @Column("text", { name: "archivo_pdf_url", nullable: true })
  archivoPdfUrl: string | null;

  @ManyToOne(() => Pago, (pago) => pago.recibos)
  @JoinColumn([{ name: "id_pago", referencedColumnName: "idPago" }])
  idPago: Pago;
}

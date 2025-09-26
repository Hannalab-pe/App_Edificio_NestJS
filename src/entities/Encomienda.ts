import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Propiedad } from "./Propiedad";
import { Trabajador } from "./Trabajador";

@Index("idx_encomienda_estado", ["estado"], {})
@Index("encomienda_pkey", ["idEncomienda"], { unique: true })
@Entity("encomienda", { schema: "public" })
export class Encomienda {
  @Column("uuid", {
    primary: true,
    name: "id_encomienda",
    default: () => "uuid_generate_v4()",
  })
  idEncomienda: string;

  @Column("character varying", { name: "codigo_seguimiento", nullable: true })
  codigoSeguimiento: string | null;

  @Column("character varying", { name: "remitente" })
  remitente: string;

  @Column("character varying", { name: "empresa_courier", nullable: true })
  empresaCourier: string | null;

  @Column("timestamp without time zone", {
    name: "fecha_llegada",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  fechaLlegada: Date | null;

  @Column("timestamp without time zone", {
    name: "fecha_entrega",
    nullable: true,
  })
  fechaEntrega: Date | null;

  @Column("character varying", { name: "estado" })
  estado: string;

  @Column("text", { name: "descripcion", nullable: true })
  descripcion: string | null;

  @Column("text", { name: "foto_evidencia_url", nullable: true })
  fotoEvidenciaUrl: string | null;

  @Column("text", { name: "observaciones", nullable: true })
  observaciones: string | null;

  @ManyToOne(() => Propiedad, (propiedad) => propiedad.encomiendas)
  @JoinColumn([{ name: "id_propiedad", referencedColumnName: "idPropiedad" }])
  idPropiedad: Propiedad;

  @ManyToOne(() => Trabajador, (trabajador) => trabajador.encomiendas)
  @JoinColumn([
    { name: "recibido_por_trabajador", referencedColumnName: "idTrabajador" },
  ])
  recibidoPorTrabajador: Trabajador;
}

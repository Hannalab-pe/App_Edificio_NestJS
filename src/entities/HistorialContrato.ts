import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Contrato } from "./Contrato";
import { TipoAccionHistorial } from "../Enums/TipoAccionHistorial";

@Index("historial_contrato_pkey", ["idHistorialContrato"], { unique: true })
@Entity("historial_contrato", { schema: "public" })
export class HistorialContrato {
  @Column("uuid", {
    primary: true,
    name: "id_historial_contrato",
    default: () => "uuid_generate_v4()",
  })
  idHistorialContrato: string;

  @Column("timestamp", {
    name: "fecha_registro",
    default: () => "CURRENT_TIMESTAMP",
  })
  fechaRegistro: Date;

  @Column({
    type: "enum",
    enum: TipoAccionHistorial,
    name: "tipo_accion",
  })
  tipoAccion: TipoAccionHistorial;

  @Column("text", {
    name: "descripcion_accion",
  })
  descripcionAccion: string;

  @Column("jsonb", {
    name: "estado_anterior",
    nullable: true,
  })
  estadoAnterior: any;

  @Column("jsonb", {
    name: "estado_nuevo",
    nullable: true,
  })
  estadoNuevo: any;

  @Column("text", {
    name: "observaciones",
    nullable: true,
  })
  observaciones: string | null;

  @Column("varchar", {
    name: "usuario_accion",
    length: 100,
    nullable: true,
  })
  usuarioAccion: string | null;

  @Column("varchar", {
    name: "ip_usuario",
    length: 45,
    nullable: true,
  })
  ipUsuario: string | null;

  @ManyToOne(() => Contrato, (contrato) => contrato.historialContratoes)
  @JoinColumn([{ name: "id_contrato", referencedColumnName: "idContrato" }])
  idContrato: Contrato;
}

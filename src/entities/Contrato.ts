import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { TipoContrato } from "./TipoContrato";
import { Trabajador } from "./Trabajador";
import { HistorialContrato } from "./HistorialContrato";

@Index("contrato_pkey", ["idContrato"], { unique: true })
@Entity("contrato", { schema: "public" })
export class Contrato {
  @Column("uuid", {
    primary: true,
    name: "id_contrato",
    default: () => "uuid_generate_v4()",
  })
  idContrato: string;

  @Column("text", { name: "documentourl" })
  documentourl: string;

  @Column("numeric", { name: "remuneracion", precision: 10, scale: 2 })
  remuneracion: string;

  @Column("date", { name: "fecha_inicio" })
  fechaInicio: string;

  @Column("date", { name: "fecha_fin" })
  fechaFin: string;

  @Column("date", { name: "fecha_renovacion" })
  fechaRenovacion: string;

  @Column("boolean", { name: "estado_renovacion", default: () => "false" })
  estadoRenovacion: boolean;

  @ManyToOne(() => TipoContrato, (tipoContrato) => tipoContrato.contratoes)
  @JoinColumn([
    { name: "id_tipo_contrato", referencedColumnName: "idTipoContrato" },
  ])
  idTipoContrato: TipoContrato;

  @ManyToOne(() => Trabajador, (trabajador) => trabajador.contratoes)
  @JoinColumn([{ name: "id_trabajador", referencedColumnName: "idTrabajador" }])
  idTrabajador: Trabajador;

  @OneToMany(
    () => HistorialContrato,
    (historialContrato) => historialContrato.idContrato
  )
  historialContratoes: HistorialContrato[];
}

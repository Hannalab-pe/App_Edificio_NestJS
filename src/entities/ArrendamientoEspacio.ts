import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { EspacioArrendable } from "./EspacioArrendable";
import { UsuarioExterno } from "./UsuarioExterno";
import { Pago } from "./Pago";

@Index("arrendamiento_espacio_pkey", ["idArrendamiento"], { unique: true })
@Index("idx_arrendamiento_externo", ["idUsuarioExterno"], {})
@Entity("arrendamiento_espacio", { schema: "public" })
export class ArrendamientoEspacio {
  @Column("uuid", {
    primary: true,
    name: "id_arrendamiento",
    default: () => "uuid_generate_v4()",
  })
  idArrendamiento: string;

  @Column("date", { name: "fecha_inicio" })
  fechaInicio: string;

  @Column("date", { name: "fecha_fin", nullable: true })
  fechaFin: string | null;

  @Column("numeric", { name: "monto_mensual", precision: 10, scale: 2 })
  montoMensual: string;

  @Column("numeric", {
    name: "deposito",
    nullable: true,
    precision: 10,
    scale: 2,
  })
  deposito: string | null;

  @Column("character varying", { name: "estado" })
  estado: string;

  @Column("text", { name: "observaciones", nullable: true })
  observaciones: string | null;

  @Column("timestamp without time zone", {
    name: "fecha_creacion",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  fechaCreacion: Date | null;

  @Column("uuid", { name: "id_usuario_externo" })
  idUsuarioExterno: string;

  @ManyToOne(
    () => EspacioArrendable,
    (espacioArrendable) => espacioArrendable.arrendamientoEspacios
  )
  @JoinColumn([{ name: "id_espacio", referencedColumnName: "idEspacio" }])
  idEspacio: EspacioArrendable;

  @ManyToOne(
    () => UsuarioExterno,
    (usuarioExterno) => usuarioExterno.arrendamientoEspacios
  )
  @JoinColumn([
    { name: "id_usuario_externo", referencedColumnName: "idUsuarioExterno" },
  ])
  idUsuarioExterno2: UsuarioExterno;

  @OneToMany(() => Pago, (pago) => pago.idArrendamiento)
  pagos: Pago[];
}

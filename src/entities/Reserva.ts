import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { AreaComun } from "./AreaComun";
import { Usuario } from "./Usuario";

@Index("idx_reserva_fecha_reserva", ["fechaReserva"], {})
@Index("reserva_pkey", ["idReserva"], { unique: true })
@Entity("reserva", { schema: "public" })
export class Reserva {
  @Column("uuid", {
    primary: true,
    name: "id_reserva",
    default: () => "uuid_generate_v4()",
  })
  idReserva: string;

  @Column("date", { name: "fecha_reserva" })
  fechaReserva: string;

  @Column("time without time zone", { name: "hora_inicio" })
  horaInicio: string;

  @Column("time without time zone", { name: "hora_fin" })
  horaFin: string;

  @Column("character varying", { name: "estado" })
  estado: string;

  @Column("text", { name: "motivo", nullable: true })
  motivo: string | null;

  @Column("numeric", {
    name: "costo_total",
    nullable: true,
    precision: 10,
    scale: 2,
  })
  costoTotal: string | null;

  @Column("boolean", { name: "pagado", default: () => "false" })
  pagado: boolean;

  @Column("text", { name: "observaciones", nullable: true })
  observaciones: string | null;

  @Column("timestamp without time zone", {
    name: "fecha_creacion",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  fechaCreacion: Date | null;

  @ManyToOne(() => AreaComun, (areaComun) => areaComun.reservas)
  @JoinColumn([{ name: "id_area_comun", referencedColumnName: "idAreaComun" }])
  idAreaComun: AreaComun;

  @ManyToOne(() => Usuario, (usuario) => usuario.reservas)
  @JoinColumn([{ name: "id_usuario", referencedColumnName: "idUsuario" }])
  idUsuario: Usuario;
}

import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Usuario } from "./Usuario";
import { Propiedad } from "./Propiedad";

@Index("idx_visita_codigo_qr", ["codigoQr"], {})
@Index("visita_codigo_qr_key", ["codigoQr"], { unique: true })
@Index("idx_visita_fecha", ["fechaProgramada"], {})
@Index("visita_pkey", ["idVisita"], { unique: true })
@Entity("visita", { schema: "public" })
export class Visita {
  @Column("uuid", {
    primary: true,
    name: "id_visita",
    default: () => "uuid_generate_v4()",
  })
  idVisita: string;

  @Column("character varying", { name: "codigo_qr", unique: true })
  codigoQr: string;

  @Column("character varying", { name: "nombre_visitante" })
  nombreVisitante: string;

  @Column("character varying", { name: "documento_visitante", nullable: true })
  documentoVisitante: string | null;

  @Column("character varying", { name: "telefono_visitante", nullable: true })
  telefonoVisitante: string | null;

  @Column("text", { name: "motivo", nullable: true })
  motivo: string | null;

  @Column("date", { name: "fecha_programada" })
  fechaProgramada: string;

  @Column("time without time zone", { name: "hora_inicio" })
  horaInicio: string;

  @Column("time without time zone", { name: "hora_fin" })
  horaFin: string;

  @Column("timestamp without time zone", {
    name: "fecha_ingreso",
    nullable: true,
  })
  fechaIngreso: Date | null;

  @Column("timestamp without time zone", {
    name: "fecha_salida",
    nullable: true,
  })
  fechaSalida: Date | null;

  @Column("character varying", { name: "estado" })
  estado: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.visitas)
  @JoinColumn([
    { name: "autorizador_usuario", referencedColumnName: "idUsuario" },
  ])
  autorizadorUsuario: Usuario;

  @ManyToOne(() => Propiedad, (propiedad) => propiedad.visitas)
  @JoinColumn([{ name: "id_propiedad", referencedColumnName: "idPropiedad" }])
  idPropiedad: Propiedad;
}

import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { OpcionVoto } from "./OpcionVoto";
import { Usuario } from "./Usuario";
import { Voto } from "./Voto";

@Index("idx_votacion_fecha_fin", ["fechaFin"], {})
@Index("idx_votacion_fecha_inicio", ["fechaInicio"], {})
@Index("votacion_pkey", ["idVotacion"], { unique: true })
@Entity("votacion", { schema: "public" })
export class Votacion {
  @Column("uuid", {
    primary: true,
    name: "id_votacion",
    default: () => "uuid_generate_v4()",
  })
  idVotacion: string;

  @Column("character varying", { name: "titulo" })
  titulo: string;

  @Column("text", { name: "descripcion" })
  descripcion: string;

  @Column("timestamp without time zone", { name: "fecha_inicio" })
  fechaInicio: Date;

  @Column("timestamp without time zone", { name: "fecha_fin" })
  fechaFin: Date;

  @Column("character varying", { name: "estado" })
  estado: string;

  @Column("character varying", { name: "tipo" })
  tipo: string;

  @Column("boolean", { name: "requiere_quorum", default: () => "false" })
  requiereQuorum: boolean;

  @Column("integer", { name: "quorum_minimo", nullable: true })
  quorumMinimo: number | null;

  @Column("timestamp without time zone", {
    name: "fecha_creacion",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  fechaCreacion: Date | null;

  @OneToMany(() => OpcionVoto, (opcionVoto) => opcionVoto.idVotacion)
  opcionVotos: OpcionVoto[];

  @ManyToOne(() => Usuario, (usuario) => usuario.votacions)
  @JoinColumn([
    { name: "creado_por_usuario", referencedColumnName: "idUsuario" },
  ])
  creadoPorUsuario: Usuario;

  @OneToMany(() => Voto, (voto) => voto.idVotacion2)
  votos: Voto[];
}

import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Votacion } from "./Votacion";
import { Voto } from "./Voto";

@Index("opcion_voto_pkey", ["idOpcionVoto"], { unique: true })
@Entity("opcion_voto", { schema: "public" })
export class OpcionVoto {
  @Column("uuid", {
    primary: true,
    name: "id_opcion_voto",
    default: () => "uuid_generate_v4()",
  })
  idOpcionVoto: string;

  @Column("character varying", { name: "opcion" })
  opcion: string;

  @Column("text", { name: "descripcion", nullable: true })
  descripcion: string | null;

  @Column("integer", { name: "orden_presentacion" })
  ordenPresentacion: number;

  @ManyToOne(() => Votacion, (votacion) => votacion.opcionVotos)
  @JoinColumn([{ name: "id_votacion", referencedColumnName: "idVotacion" }])
  idVotacion: Votacion;

  @OneToMany(() => Voto, (voto) => voto.idOpcionVoto)
  votos: Voto[];
}

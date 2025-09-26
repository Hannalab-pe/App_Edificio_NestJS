import { Column, Entity, Index, OneToMany } from "typeorm";
import { Cronograma } from "./Cronograma";

@Index("tipo_cronograma_pkey", ["idTipoCronograma"], { unique: true })
@Entity("tipo_cronograma", { schema: "public" })
export class TipoCronograma {
  @Column("uuid", {
    primary: true,
    name: "id_tipo_cronograma",
    default: () => "uuid_generate_v4()",
  })
  idTipoCronograma: string;

  @Column("character varying", { name: "tipo_cronograma" })
  tipoCronograma: string;

  @Column("text", { name: "descripcion" })
  descripcion: string;

  @OneToMany(() => Cronograma, (cronograma) => cronograma.idTipoCronograma)
  cronogramas: Cronograma[];
}

import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { AreaComun } from "./AreaComun";
import { Contacto } from "./Contacto";

@Index("mantenimiento_pkey", ["idMantenimiento"], { unique: true })
@Entity("mantenimiento", { schema: "public" })
export class Mantenimiento {
  @Column("uuid", {
    primary: true,
    name: "id_mantenimiento",
    default: () => "uuid_generate_v4()",
  })
  idMantenimiento: string;

  @Column("text", { name: "descripcion", nullable: true })
  descripcion: string | null;

  @Column("timestamp without time zone", { name: "fecha_inicio" })
  fechaInicio: Date;

  @Column("timestamp without time zone", { name: "fecha_fin" })
  fechaFin: Date;

  @Column("character varying", { name: "estado" })
  estado: string;

  @ManyToOne(() => AreaComun, (areaComun) => areaComun.mantenimientos)
  @JoinColumn([{ name: "id_area_comun", referencedColumnName: "idAreaComun" }])
  idAreaComun: AreaComun;

  @ManyToOne(() => Contacto, (contacto) => contacto.mantenimientos)
  @JoinColumn([{ name: "id_contacto", referencedColumnName: "idContacto" }])
  idContacto: Contacto;
}

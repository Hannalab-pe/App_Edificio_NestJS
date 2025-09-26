import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
} from "typeorm";
import { Edificio } from "./Edificio";
import { AreaComun } from "./AreaComun";

@Index("asignacion_area_edificio_pkey", ["idAsignacion"], { unique: true })
@Index("uk_edificio_area_comun", ["idEdificio", "idAreaComun"], { unique: true })
@Entity("asignacion_area_edificio", { schema: "public" })
export class AsignacionAreaEdificio {
    @Column("uuid", {
        primary: true,
        name: "id_asignacion",
        default: () => "uuid_generate_v4()",
    })
    idAsignacion: string;

    @Column("uuid", { name: "id_edificio" })
    idEdificioUuid: string;

    @Column("uuid", { name: "id_area_comun" })
    idAreaComunUuid: string;

    @Column("timestamp without time zone", {
        name: "fecha_asignacion",
        default: () => "CURRENT_TIMESTAMP",
    })
    fechaAsignacion: Date;

    @Column("boolean", { name: "esta_activo", default: () => "true" })
    estaActivo: boolean;

    @Column("text", { name: "observaciones", nullable: true })
    observaciones: string | null;

    @ManyToOne(() => Edificio, (edificio) => edificio.asignacionesArea, {
        onDelete: "CASCADE",
    })
    @JoinColumn([{ name: "id_edificio", referencedColumnName: "idEdificio" }])
    idEdificio: Edificio;

    @ManyToOne(() => AreaComun, (areaComun) => areaComun.asignacionesEdificio, {
        onDelete: "CASCADE",
    })
    @JoinColumn([{ name: "id_area_comun", referencedColumnName: "idAreaComun" }])
    idAreaComun: AreaComun;
}
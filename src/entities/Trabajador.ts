import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Caja } from "./Caja";
import { Contrato } from "./Contrato";
import { Cronograma } from "./Cronograma";
import { Documento } from "./Documento";
import { Edificio } from "./Edificio";
import { Encomienda } from "./Encomienda";
import { Incidencia } from "./Incidencia";
import { DocumentoIdentidad } from "./DocumentoIdentidad";
import { Usuario } from "./Usuario";

@Index("idx_trabajador_correo", ["correo"], {})
@Index("trabajador_pkey", ["idTrabajador"], { unique: true })
@Entity("trabajador", { schema: "public" })
export class Trabajador {
  @Column("uuid", {
    primary: true,
    name: "id_trabajador",
    default: () => "uuid_generate_v4()",
  })
  idTrabajador: string;

  @Column("character varying", { name: "nombre" })
  nombre: string;

  @Column("character varying", { name: "apellido" })
  apellido: string;

  @Column("character varying", { name: "correo" })
  correo: string;

  @Column("boolean", { name: "esta_activo", default: () => "true" })
  estaActivo: boolean;

  @Column("character varying", { name: "telefono", nullable: true })
  telefono: string | null;

  @Column("date", { name: "fecha_nacimiento", nullable: true })
  fechaNacimiento: string | null;

  @Column("date", { name: "fecha_ingreso", nullable: true })
  fechaIngreso: string | null;

  @Column("numeric", {
    name: "salario_actual",
    nullable: true,
    precision: 10,
    scale: 2,
  })
  salarioActual: string | null;

  @OneToMany(() => Caja, (caja) => caja.idTrabajador)
  cajas: Caja[];

  @OneToMany(() => Contrato, (contrato) => contrato.idTrabajador)
  contratoes: Contrato[];

  @OneToMany(() => Cronograma, (cronograma) => cronograma.idTrabajador)
  cronogramas: Cronograma[];

  @OneToMany(() => Documento, (documento) => documento.idTrabajador)
  documentos: Documento[];

  @OneToMany(() => Edificio, (edificio) => edificio.idAdministradorEdificio)
  edificios: Edificio[];

  @OneToMany(() => Encomienda, (encomienda) => encomienda.recibidoPorTrabajador)
  encomiendas: Encomienda[];

  @OneToMany(() => Incidencia, (incidencia) => incidencia.asignadoATrabajador)
  incidencias: Incidencia[];

  @ManyToOne(
    () => DocumentoIdentidad,
    (documentoIdentidad) => documentoIdentidad.trabajadors
  )
  @JoinColumn([
    {
      name: "id_documento_identidad",
      referencedColumnName: "idDocumentoIdentidad",
    },
  ])
  idDocumentoIdentidad: DocumentoIdentidad;

  @ManyToOne(() => Usuario, (usuario) => usuario.trabajadors)
  @JoinColumn([{ name: "id_usuario", referencedColumnName: "idUsuario" }])
  idUsuario: Usuario;
}

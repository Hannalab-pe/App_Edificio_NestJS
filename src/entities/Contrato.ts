/**
 * PROPUESTA DE MODIFICACIÓN PARA LA ENTIDAD CONTRATO
 * 
 * Para implementar la lógica mejorada de contratos y salarios,
 * necesitamos agregar un campo 'estado' a la entidad Contrato.
 * 
 * CAMBIOS SUGERIDOS EN LA ENTIDAD CONTRATO:
 */

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
import { EstadoContrato } from "../Enums/EstadoContrato";

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
  remuneracion: number;

  @Column("date", { name: "fecha_inicio" })
  fechaInicio: string;

  @Column("date", { name: "fecha_fin" })
  fechaFin: string;

  @Column("date", { name: "fecha_renovacion", nullable: true })
  fechaRenovacion: string | null;

  @Column("boolean", { name: "estado_renovacion", default: () => "false" })
  estadoRenovacion: boolean;

  // NUEVO CAMPO: Estado del contrato
  @Column({
    type: "enum",
    enum: EstadoContrato,
    name: "estado",
    default: EstadoContrato.ACTIVO,
  })
  estado: EstadoContrato;

  // NUEVOS CAMPOS OPCIONALES PARA MEJOR CONTROL
  @Column("text", { name: "motivo_terminacion", nullable: true })
  motivoTerminacion: string | null;

  @Column("date", { name: "fecha_creacion", default: () => "CURRENT_DATE" })
  fechaCreacion: string;

  @Column("date", { name: "fecha_actualizacion", default: () => "CURRENT_DATE" })
  fechaActualizacion: string;

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

/**
 * MIGRACIÓN SQL SUGERIDA:
 * 
 * -- Agregar campo estado
 * ALTER TABLE contrato 
 * ADD COLUMN estado VARCHAR(20) DEFAULT 'ACTIVO';
 * 
 * -- Agregar constraint para valores válidos
 * ALTER TABLE contrato 
 * ADD CONSTRAINT check_estado_contrato 
 * CHECK (estado IN ('ACTIVO', 'VENCIDO', 'RENOVADO', 'SUSPENDIDO', 'TERMINADO'));
 * 
 * -- Agregar campos opcionales
 * ALTER TABLE contrato 
 * ADD COLUMN motivo_terminacion TEXT,
 * ADD COLUMN fecha_creacion DATE DEFAULT CURRENT_DATE,
 * ADD COLUMN fecha_actualizacion DATE DEFAULT CURRENT_DATE;
 * 
 * -- Permitir que fecha_renovacion sea nullable
 * ALTER TABLE contrato 
 * ALTER COLUMN fecha_renovacion DROP NOT NULL;
 * 
 * -- Crear índice para mejorar consultas por estado
 * CREATE INDEX idx_contrato_estado ON contrato(estado);
 * 
 * -- Crear índice compuesto para consultas de contratos activos por trabajador
 * CREATE INDEX idx_contrato_trabajador_estado ON contrato(id_trabajador, estado);
 */
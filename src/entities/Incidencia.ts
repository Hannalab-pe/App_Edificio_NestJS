import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ComentarioIncidencia } from './ComentarioIncidencia';
import { Trabajador } from './Trabajador';
import { AreaComun } from './AreaComun';
import { TipoIncidencia } from './TipoIncidencia';
import { Usuario } from './Usuario';

@Index('idx_incidencia_estado', ['estado'], {})
@Index('idx_incidencia_fecha_creacion', ['fechaCreacion'], {})
@Index('incidencia_pkey', ['idIncidencia'], { unique: true })
@Entity('incidencia', { schema: 'public' })
export class Incidencia {
  @Column('uuid', {
    primary: true,
    name: 'id_incidencia',
    default: () => 'uuid_generate_v4()',
  })
  idIncidencia: string;

  @Column('character varying', { name: 'titulo' })
  titulo: string;

  @Column('text', { name: 'descripcion' })
  descripcion: string;

  @Column('character varying', { name: 'estado' })
  estado: string;

  @Column('character varying', { name: 'prioridad' })
  prioridad: string;

  @Column('character varying', { name: 'ubicacion', nullable: true })
  ubicacion: string | null;

  @Column('timestamp without time zone', {
    name: 'fecha_incidente',
    nullable: true,
  })
  fechaIncidente: Date | null;

  @Column('timestamp without time zone', {
    name: 'fecha_creacion',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechaCreacion: Date | null;

  @Column('timestamp without time zone', {
    name: 'fecha_resolucion',
    nullable: true,
  })
  fechaResolucion: Date | null;

  @OneToMany(
    () => ComentarioIncidencia,
    (comentarioIncidencia) => comentarioIncidencia.idIncidencia,
  )
  comentarioIncidencias: ComentarioIncidencia[];

  @ManyToOne(() => Trabajador, (trabajador) => trabajador.incidencias)
  @JoinColumn([
    { name: 'asignado_a_trabajador', referencedColumnName: 'idTrabajador' },
  ])
  asignadoATrabajador: Trabajador;

  @ManyToOne(() => AreaComun, (areaComun) => areaComun.incidencias)
  @JoinColumn([{ name: 'id_area_comun', referencedColumnName: 'idAreaComun' }])
  idAreaComun: AreaComun;

  @ManyToOne(
    () => TipoIncidencia,
    (tipoIncidencia) => tipoIncidencia.incidencias,
  )
  @JoinColumn([
    { name: 'id_tipo_incidencia', referencedColumnName: 'idTipoIncidencia' },
  ])
  idTipoIncidencia: TipoIncidencia;

  @ManyToOne(() => Usuario, (usuario) => usuario.incidencias)
  @JoinColumn([
    { name: 'reportado_por_usuario', referencedColumnName: 'idUsuario' },
  ])
  reportadoPorUsuario: Usuario;
}

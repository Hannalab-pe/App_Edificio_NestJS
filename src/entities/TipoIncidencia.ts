import { Column, Entity, Index, OneToMany } from 'typeorm';
import { Incidencia } from './Incidencia';

@Index('tipo_incidencia_pkey', ['idTipoIncidencia'], { unique: true })
@Entity('tipo_incidencia', { schema: 'public' })
export class TipoIncidencia {
  @Column('uuid', {
    primary: true,
    name: 'id_tipo_incidencia',
    default: () => 'uuid_generate_v4()',
  })
  idTipoIncidencia: string;

  @Column('character varying', { name: 'nombre' })
  nombre: string;

  @Column('text', { name: 'descripcion', nullable: true })
  descripcion: string | null;

  @Column('character varying', { name: 'prioridad' })
  prioridad: string;

  @Column('character varying', { name: 'color_hex', nullable: true, length: 7 })
  colorHex: string | null;

  @Column('boolean', { name: 'esta_activo', default: () => 'true' })
  estaActivo: boolean;

  @OneToMany(() => Incidencia, (incidencia) => incidencia.idTipoIncidencia)
  incidencias: Incidencia[];
}

import { Column, Entity, Index, OneToMany } from 'typeorm';
import { EspacioArrendable } from './EspacioArrendable';

@Index('tipo_espacio_pkey', ['idTipoEspacio'], { unique: true })
@Entity('tipo_espacio', { schema: 'public' })
export class TipoEspacio {
  @Column('uuid', {
    primary: true,
    name: 'id_tipo_espacio',
    default: () => 'uuid_generate_v4()',
  })
  idTipoEspacio: string;

  @Column('character varying', { name: 'nombre' })
  nombre: string;

  @Column('text', { name: 'descripcion', nullable: true })
  descripcion: string | null;

  @Column('boolean', {
    name: 'requiere_contrato',
    nullable: true,
    default: () => 'false',
  })
  requiereContrato: boolean | null;

  @OneToMany(
    () => EspacioArrendable,
    (espacioArrendable) => espacioArrendable.idTipoEspacio2,
  )
  espacioArrendables: EspacioArrendable[];
}

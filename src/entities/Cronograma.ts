import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Residente } from './Residente';
import { TipoCronograma } from './TipoCronograma';
import { Trabajador } from './Trabajador';

@Index('cronograma_pkey', ['idCronograma'], { unique: true })
@Entity('cronograma', { schema: 'public' })
export class Cronograma {
  @Column('uuid', {
    primary: true,
    name: 'id_cronograma',
    default: () => 'uuid_generate_v4()',
  })
  idCronograma: string;

  @Column('text', { name: 'titulo' })
  titulo: string;

  @Column('text', { name: 'descripcion' })
  descripcion: string;

  @Column('date', { name: 'fecha_inicio' })
  fechaInicio: string;

  @Column('date', { name: 'fecha_fin' })
  fechaFin: string;

  @ManyToOne(() => Residente, (residente) => residente.cronogramas)
  @JoinColumn([{ name: 'id_residente', referencedColumnName: 'idResidente' }])
  idResidente: Residente;

  @ManyToOne(
    () => TipoCronograma,
    (tipoCronograma) => tipoCronograma.cronogramas,
  )
  @JoinColumn([
    { name: 'id_tipo_cronograma', referencedColumnName: 'idTipoCronograma' },
  ])
  idTipoCronograma: TipoCronograma;

  @ManyToOne(() => Trabajador, (trabajador) => trabajador.cronogramas)
  @JoinColumn([{ name: 'id_trabajador', referencedColumnName: 'idTrabajador' }])
  idTrabajador: Trabajador;
}

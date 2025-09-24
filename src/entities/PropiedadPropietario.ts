import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Propiedad } from './Propiedad';
import { Propietario } from './Propietario';

@Index('propiedad_propietario_pkey', ['idPropiedadPropietario'], {
  unique: true,
})
@Entity('propiedad_propietario', { schema: 'public' })
export class PropiedadPropietario {
  @Column('uuid', {
    primary: true,
    name: 'id_propiedad_propietario',
    default: () => 'uuid_generate_v4()',
  })
  idPropiedadPropietario: string;

  @Column('date', { name: 'fecha_adquisicion' })
  fechaAdquisicion: string;

  @Column('date', { name: 'fecha_fin', nullable: true })
  fechaFin: string | null;

  @Column('boolean', { name: 'es_propietario_actual', default: () => 'true' })
  esPropietarioActual: boolean;

  @Column('numeric', {
    name: 'porcentaje_propiedad',
    nullable: true,
    precision: 5,
    scale: 2,
  })
  porcentajePropiedad: string | null;

  @ManyToOne(() => Propiedad, (propiedad) => propiedad.propiedadPropietarios)
  @JoinColumn([{ name: 'id_propiedad', referencedColumnName: 'idPropiedad' }])
  idPropiedad: Propiedad;

  @ManyToOne(
    () => Propietario,
    (propietario) => propietario.propiedadPropietarios,
  )
  @JoinColumn([
    { name: 'id_propietario', referencedColumnName: 'idPropietario' },
  ])
  idPropietario: Propietario;
}

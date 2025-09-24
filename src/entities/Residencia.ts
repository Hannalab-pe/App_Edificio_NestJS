import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Pago } from './Pago';
import { Propiedad } from './Propiedad';
import { Propietario } from './Propietario';
import { Residente } from './Residente';

@Index('residencia_pkey', ['idResidencia'], { unique: true })
@Entity('residencia', { schema: 'public' })
export class Residencia {
  @Column('uuid', {
    primary: true,
    name: 'id_residencia',
    default: () => 'uuid_generate_v4()',
  })
  idResidencia: string;

  @Column('date', { name: 'fecha_inicio' })
  fechaInicio: string;

  @Column('date', { name: 'fecha_fin', nullable: true })
  fechaFin: string | null;

  @Column('numeric', {
    name: 'monto_alquiler',
    nullable: true,
    precision: 10,
    scale: 2,
  })
  montoAlquiler: string | null;

  @Column('numeric', {
    name: 'deposito',
    nullable: true,
    precision: 10,
    scale: 2,
  })
  deposito: string | null;

  @Column('character varying', { name: 'tipo_ocupacion' })
  tipoOcupacion: string;

  @Column('character varying', { name: 'estado' })
  estado: string;

  @Column('text', { name: 'contrato_url', nullable: true })
  contratoUrl: string | null;

  @OneToMany(() => Pago, (pago) => pago.idResidencia)
  pagos: Pago[];

  @ManyToOne(() => Propiedad, (propiedad) => propiedad.residencias)
  @JoinColumn([{ name: 'id_propiedad', referencedColumnName: 'idPropiedad' }])
  idPropiedad: Propiedad;

  @ManyToOne(() => Propietario, (propietario) => propietario.residencias)
  @JoinColumn([
    { name: 'id_propietario', referencedColumnName: 'idPropietario' },
  ])
  idPropietario: Propietario;

  @ManyToOne(() => Residente, (residente) => residente.residencias)
  @JoinColumn([{ name: 'id_residente', referencedColumnName: 'idResidente' }])
  idResidente: Residente;
}

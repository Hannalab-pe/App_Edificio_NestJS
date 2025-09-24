import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Contrato } from './Contrato';

@Index('historial_contrato_pkey', ['idHistorialContrato'], { unique: true })
@Entity('historial_contrato', { schema: 'public' })
export class HistorialContrato {
  @Column('uuid', {
    primary: true,
    name: 'id_historial_contrato',
    default: () => 'uuid_generate_v4()',
  })
  idHistorialContrato: string;

  @Column('date', {
    name: 'fecha_actualizacion',
    nullable: true,
    default: () => 'CURRENT_DATE',
  })
  fechaActualizacion: string | null;

  @ManyToOne(() => Contrato, (contrato) => contrato.historialContratoes)
  @JoinColumn([{ name: 'id_contrato', referencedColumnName: 'idContrato' }])
  idContrato: Contrato;
}

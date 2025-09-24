import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { MovimientoCaja } from './MovimientoCaja';
import { ArrendamientoEspacio } from './ArrendamientoEspacio';
import { ConceptoPago } from './ConceptoPago';
import { Residencia } from './Residencia';
import { Recibo } from './Recibo';

@Index('idx_pago_estado', ['estado'], {})
@Index('idx_pago_fecha_vencimiento', ['fechaVencimiento'], {})
@Index('pago_pkey', ['idPago'], { unique: true })
@Entity('pago', { schema: 'public' })
export class Pago {
  @Column('uuid', {
    primary: true,
    name: 'id_pago',
    default: () => 'uuid_generate_v4()',
  })
  idPago: string;

  @Column('numeric', { name: 'monto', precision: 10, scale: 2 })
  monto: string;

  @Column('date', { name: 'fecha_vencimiento' })
  fechaVencimiento: string;

  @Column('date', { name: 'fecha_pago', nullable: true })
  fechaPago: string | null;

  @Column('character varying', { name: 'estado' })
  estado: string;

  @Column('text', { name: 'descripcion', nullable: true })
  descripcion: string | null;

  @Column('text', { name: 'comprobante_url', nullable: true })
  comprobanteUrl: string | null;

  @Column('character varying', { name: 'metodo_pago', nullable: true })
  metodoPago: string | null;

  @Column('character varying', { name: 'referencia_pago', nullable: true })
  referenciaPago: string | null;

  @OneToMany(() => MovimientoCaja, (movimientoCaja) => movimientoCaja.idPago)
  movimientoCajas: MovimientoCaja[];

  @ManyToOne(
    () => ArrendamientoEspacio,
    (arrendamientoEspacio) => arrendamientoEspacio.pagos,
  )
  @JoinColumn([
    { name: 'id_arrendamiento', referencedColumnName: 'idArrendamiento' },
  ])
  idArrendamiento: ArrendamientoEspacio;

  @ManyToOne(() => ConceptoPago, (conceptoPago) => conceptoPago.pagos)
  @JoinColumn([
    { name: 'id_concepto_pago', referencedColumnName: 'idConceptoPago' },
  ])
  idConceptoPago: ConceptoPago;

  @ManyToOne(() => Residencia, (residencia) => residencia.pagos)
  @JoinColumn([{ name: 'id_residencia', referencedColumnName: 'idResidencia' }])
  idResidencia: Residencia;

  @OneToMany(() => Recibo, (recibo) => recibo.idPago)
  recibos: Recibo[];
}

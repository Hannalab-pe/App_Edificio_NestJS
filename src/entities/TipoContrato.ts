import { Column, Entity, Index, OneToMany } from 'typeorm';
import { Contacto } from './Contacto';
import { Contrato } from './Contrato';

@Index('tipo_contrato_pkey', ['idTipoContrato'], { unique: true })
@Entity('tipo_contrato', { schema: 'public' })
export class TipoContrato {
  @Column('uuid', {
    primary: true,
    name: 'id_tipo_contrato',
    default: () => 'uuid_generate_v4()',
  })
  idTipoContrato: string;

  @Column('character varying', { name: 'nombre' })
  nombre: string;

  @Column('text', { name: 'descripcion', nullable: true })
  descripcion: string | null;

  @OneToMany(() => Contacto, (contacto) => contacto.idTipoContrato)
  contactos: Contacto[];

  @OneToMany(() => Contrato, (contrato) => contrato.idTipoContrato)
  contratoes: Contrato[];
}

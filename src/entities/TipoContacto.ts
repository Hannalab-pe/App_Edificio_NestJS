import { Column, Entity, Index, OneToMany } from 'typeorm';
import { Contacto } from './Contacto';

@Index('tipo_contacto_pkey', ['idTipoContacto'], { unique: true })
@Entity('tipo_contacto', { schema: 'public' })
export class TipoContacto {
  @Column('uuid', {
    primary: true,
    name: 'id_tipo_contacto',
    default: () => 'uuid_generate_v4()',
  })
  idTipoContacto: string;

  @Column('character varying', { name: 'nombre' })
  nombre: string;

  @Column('text', { name: 'descripcion', nullable: true })
  descripcion: string | null;

  @OneToMany(() => Contacto, (contacto) => contacto.idTipoContacto)
  contactos: Contacto[];
}

import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ArrendamientoEspacio } from './ArrendamientoEspacio';
import { DocumentoIdentidad } from './DocumentoIdentidad';

@Index('usuario_externo_correo_key', ['correo'], { unique: true })
@Index('idx_usuario_externo_correo', ['correo'], {})
@Index('usuario_externo_pkey', ['idUsuarioExterno'], { unique: true })
@Entity('usuario_externo', { schema: 'public' })
export class UsuarioExterno {
  @Column('uuid', {
    primary: true,
    name: 'id_usuario_externo',
    default: () => 'uuid_generate_v4()',
  })
  idUsuarioExterno: string;

  @Column('character varying', { name: 'nombre' })
  nombre: string;

  @Column('character varying', { name: 'apellido' })
  apellido: string;

  @Column('character varying', { name: 'correo', unique: true })
  correo: string;

  @Column('character varying', { name: 'telefono', nullable: true })
  telefono: string | null;

  @Column('character varying', { name: 'empresa', nullable: true })
  empresa: string | null;

  @Column('boolean', { name: 'esta_activo', default: () => 'true' })
  estaActivo: boolean;

  @Column('timestamp without time zone', {
    name: 'fecha_registro',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechaRegistro: Date | null;

  @OneToMany(
    () => ArrendamientoEspacio,
    (arrendamientoEspacio) => arrendamientoEspacio.idUsuarioExterno2,
  )
  arrendamientoEspacios: ArrendamientoEspacio[];

  @ManyToOne(
    () => DocumentoIdentidad,
    (documentoIdentidad) => documentoIdentidad.usuarioExternos,
  )
  @JoinColumn([
    {
      name: 'id_documento_identidad',
      referencedColumnName: 'idDocumentoIdentidad',
    },
  ])
  idDocumentoIdentidad: DocumentoIdentidad;
}

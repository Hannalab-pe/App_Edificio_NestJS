import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Usuario } from './Usuario';

@Index('idx_mensaje_fecha', ['fechaEnvio'], {})
@Index('mensaje_privado_pkey', ['idMensaje'], { unique: true })
@Index('idx_mensaje_receptor', ['receptorUsuario'], {})
@Entity('mensaje_privado', { schema: 'public' })
export class MensajePrivado {
  @Column('uuid', {
    primary: true,
    name: 'id_mensaje',
    default: () => 'uuid_generate_v4()',
  })
  idMensaje: string;

  @Column('character varying', { name: 'asunto' })
  asunto: string;

  @Column('text', { name: 'contenido' })
  contenido: string;

  @Column('timestamp without time zone', {
    name: 'fecha_envio',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechaEnvio: Date | null;

  @Column('timestamp without time zone', {
    name: 'fecha_lectura',
    nullable: true,
  })
  fechaLectura: Date | null;

  @Column('boolean', { name: 'leido', nullable: true, default: () => 'false' })
  leido: boolean | null;

  @Column('text', { name: 'archivo_adjunto_url', nullable: true })
  archivoAdjuntoUrl: string | null;

  @Column('uuid', { name: 'receptor_usuario' })
  receptorUsuario: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.mensajePrivados)
  @JoinColumn([{ name: 'emisor_usuario', referencedColumnName: 'idUsuario' }])
  emisorUsuario: Usuario;

  @ManyToOne(
    () => MensajePrivado,
    (mensajePrivado) => mensajePrivado.mensajePrivados,
  )
  @JoinColumn([{ name: 'mensaje_padre', referencedColumnName: 'idMensaje' }])
  mensajePadre: MensajePrivado;

  @OneToMany(
    () => MensajePrivado,
    (mensajePrivado) => mensajePrivado.mensajePadre,
  )
  mensajePrivados: MensajePrivado[];

  @ManyToOne(() => Usuario, (usuario) => usuario.mensajePrivados2)
  @JoinColumn([{ name: 'receptor_usuario', referencedColumnName: 'idUsuario' }])
  receptorUsuario2: Usuario;
}

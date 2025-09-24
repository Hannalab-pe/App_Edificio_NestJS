import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Incidencia } from './Incidencia';
import { Usuario } from './Usuario';

@Index('comentario_incidencia_pkey', ['idComentario'], { unique: true })
@Entity('comentario_incidencia', { schema: 'public' })
export class ComentarioIncidencia {
  @Column('uuid', {
    primary: true,
    name: 'id_comentario',
    default: () => 'uuid_generate_v4()',
  })
  idComentario: string;

  @Column('text', { name: 'comentario' })
  comentario: string;

  @Column('text', { name: 'archivo_adjunto_url', nullable: true })
  archivoAdjuntoUrl: string | null;

  @Column('timestamp without time zone', {
    name: 'fecha_comentario',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechaComentario: Date | null;

  @ManyToOne(() => Incidencia, (incidencia) => incidencia.comentarioIncidencias)
  @JoinColumn([{ name: 'id_incidencia', referencedColumnName: 'idIncidencia' }])
  idIncidencia: Incidencia;

  @ManyToOne(() => Usuario, (usuario) => usuario.comentarioIncidencias)
  @JoinColumn([{ name: 'id_usuario', referencedColumnName: 'idUsuario' }])
  idUsuario: Usuario;
}

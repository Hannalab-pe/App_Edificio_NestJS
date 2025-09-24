import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { OpcionVoto } from './OpcionVoto';
import { Usuario } from './Usuario';
import { Votacion } from './Votacion';

@Index('uk_voto_votacion_usuario', ['idUsuario', 'idVotacion'], {
  unique: true,
})
@Index('voto_pkey', ['idVoto'], { unique: true })
@Entity('voto', { schema: 'public' })
export class Voto {
  @Column('uuid', {
    primary: true,
    name: 'id_voto',
    default: () => 'uuid_generate_v4()',
  })
  idVoto: string;

  @Column('uuid', { name: 'id_votacion', unique: true })
  idVotacion: string;

  @Column('uuid', { name: 'id_usuario', unique: true })
  idUsuario: string;

  @Column('timestamp without time zone', {
    name: 'fecha_voto',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechaVoto: Date | null;

  @ManyToOne(() => OpcionVoto, (opcionVoto) => opcionVoto.votos)
  @JoinColumn([
    { name: 'id_opcion_voto', referencedColumnName: 'idOpcionVoto' },
  ])
  idOpcionVoto: OpcionVoto;

  @ManyToOne(() => Usuario, (usuario) => usuario.votos)
  @JoinColumn([{ name: 'id_usuario', referencedColumnName: 'idUsuario' }])
  idUsuario2: Usuario;

  @ManyToOne(() => Votacion, (votacion) => votacion.votos)
  @JoinColumn([{ name: 'id_votacion', referencedColumnName: 'idVotacion' }])
  idVotacion2: Votacion;
}

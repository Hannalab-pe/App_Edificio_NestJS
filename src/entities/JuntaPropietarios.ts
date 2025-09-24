import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Usuario } from './Usuario';
import { Documento } from './Documento';

@Index('junta_propietarios_pkey', ['idJunta'], { unique: true })
@Index('junta_propietarios_numero_acta_key', ['numeroActa'], { unique: true })
@Entity('junta_propietarios', { schema: 'public' })
export class JuntaPropietarios {
  @Column('uuid', {
    primary: true,
    name: 'id_junta',
    default: () => 'uuid_generate_v4()',
  })
  idJunta: string;

  @Column('character varying', { name: 'numero_acta', unique: true })
  numeroActa: string;

  @Column('date', { name: 'fecha_junta' })
  fechaJunta: string;

  @Column('character varying', { name: 'tipo_junta' })
  tipoJunta: string;

  @Column('integer', { name: 'asistentes_count', nullable: true })
  asistentesCount: number | null;

  @Column('boolean', { name: 'quorum_alcanzado', nullable: true })
  quorumAlcanzado: boolean | null;

  @Column('character varying', { name: 'estado' })
  estado: string;

  @Column('text', { name: 'resumen', nullable: true })
  resumen: string | null;

  @ManyToOne(() => Usuario, (usuario) => usuario.juntaPropietarios)
  @JoinColumn([{ name: 'creado_por', referencedColumnName: 'idUsuario' }])
  creadoPor: Usuario;

  @ManyToOne(() => Documento, (documento) => documento.juntaPropietarios)
  @JoinColumn([{ name: 'id_documento', referencedColumnName: 'idDocumento' }])
  idDocumento: Documento;
}

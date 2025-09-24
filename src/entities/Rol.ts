import { Column, Entity, Index, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Notificacion } from './Notificacion';
import { Usuario } from './Usuario';

@Index('rol_pkey', ['idRol'], { unique: true })
@Entity('rol', { schema: 'public' })
export class Rol {
  @ApiProperty({ description: 'ID único del rol' })
  @Column('uuid', {
    primary: true,
    name: 'id_rol',
    default: () => 'uuid_generate_v4()',
  })
  idRol: string;

  @ApiProperty({ description: 'Nombre del rol' })
  @Column('character varying', { name: 'nombre' })
  nombre: string;

  @ApiProperty({ description: 'Descripción del rol', required: false })
  @Column('text', { name: 'descripcion', nullable: true })
  descripcion: string | null;

  @OneToMany(() => Notificacion, (notificacion) => notificacion.destinatarioRol)
  notificacions: Notificacion[];

  @ApiProperty({ description: 'Usuarios con este rol', type: () => [Usuario] })
  @OneToMany(() => Usuario, (usuario) => usuario.idRol)
  usuarios: Usuario[];
}

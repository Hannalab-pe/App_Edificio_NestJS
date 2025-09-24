import { Column, Entity, Index, OneToMany } from 'typeorm';
import { Incidencia } from './Incidencia';
import { Mantenimiento } from './Mantenimiento';
import { Reserva } from './Reserva';
import { Edificio } from './Edificio';

@Index('area_comun_pkey', ['idAreaComun'], { unique: true })
@Entity('area_comun', { schema: 'public' })
export class AreaComun {
  @Column('uuid', {
    primary: true,
    name: 'id_area_comun',
    default: () => 'uuid_generate_v4()',
  })
  idAreaComun: string;

  @Column('character varying', { name: 'nombre' })
  nombre: string;

  @Column('text', { name: 'descripcion', nullable: true })
  descripcion: string | null;

  @Column('integer', { name: 'capacidad_maxima' })
  capacidadMaxima: number;

  @Column('numeric', { name: 'precio_reserva', precision: 10, scale: 2 })
  precioReserva: number;

  @Column('time without time zone', { name: 'tiempo_minimo_reserva' })
  tiempoMinimoReserva: string;

  @Column('time without time zone', { name: 'tiempo_maximo_reserva' })
  tiempoMaximoReserva: string;

  @Column('time without time zone', { name: 'horario_apertura' })
  horarioApertura: string;

  @Column('time without time zone', { name: 'horario_cierre' })
  horarioCierre: string;

  @Column('integer', { name: 'dias_anticipacion_max' })
  diasAnticipacionMax: number;

  @Column('boolean', { name: 'esta_activo', default: () => 'true' })
  estaActivo: boolean;

  @OneToMany(() => Incidencia, (incidencia) => incidencia.idAreaComun)
  incidencias: Incidencia[];

  @OneToMany(() => Mantenimiento, (mantenimiento) => mantenimiento.idAreaComun)
  mantenimientos: Mantenimiento[];

  @OneToMany(() => Reserva, (reserva) => reserva.idAreaComun)
  reservas: Reserva[];

  @OneToMany(() => Edificio, (edificio) => edificio.idAreasComunes)
  edificios: Edificio[];
}

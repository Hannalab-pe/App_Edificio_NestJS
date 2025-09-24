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
import { Usuario } from './Usuario';

@Index('arrendatario_pkey', ['idArrendatario'], { unique: true })
@Entity('arrendatario', { schema: 'public' })
export class Arrendatario {
  @Column('uuid', {
    primary: true,
    name: 'id_arrendatario',
    default: () => 'gen_random_uuid()',
  })
  idArrendatario: string;

  @Column('character varying', {
    name: 'telefono_secundario',
    nullable: true,
    length: 15,
  })
  telefonoSecundario: string | null;

  @Column('character varying', {
    name: 'direccion_correspondencia',
    nullable: true,
    length: 200,
  })
  direccionCorrespondencia: string | null;

  @Column('character varying', {
    name: 'ciudad_correspondencia',
    nullable: true,
    length: 100,
  })
  ciudadCorrespondencia: string | null;

  @Column('character varying', {
    name: 'ocupacion_actividad',
    nullable: true,
    length: 150,
  })
  ocupacionActividad: string | null;

  @Column('boolean', {
    name: 'es_persona_juridica',
    nullable: true,
    default: () => 'false',
  })
  esPersonaJuridica: boolean | null;

  @Column('character varying', {
    name: 'nombre_empresa',
    nullable: true,
    length: 150,
  })
  nombreEmpresa: string | null;

  @Column('numeric', {
    name: 'ingresos_aproximados',
    nullable: true,
    precision: 10,
    scale: 2,
  })
  ingresosAproximados: string | null;

  @Column('numeric', {
    name: 'capacidad_pago_declarada',
    nullable: true,
    precision: 10,
    scale: 2,
  })
  capacidadPagoDeclarada: string | null;

  @Column('character varying', {
    name: 'referencia_personal_nombre',
    nullable: true,
    length: 100,
  })
  referenciaPersonalNombre: string | null;

  @Column('character varying', {
    name: 'referencia_personal_telefono',
    nullable: true,
    length: 15,
  })
  referenciaPersonalTelefono: string | null;

  @Column('character varying', {
    name: 'referencia_comercial_nombre',
    nullable: true,
    length: 100,
  })
  referenciaComercialNombre: string | null;

  @Column('character varying', {
    name: 'referencia_comercial_telefono',
    nullable: true,
    length: 15,
  })
  referenciaComercialTelefono: string | null;

  @Column('text', { name: 'uso_previsto', nullable: true })
  usoPrevisto: string | null;

  @Column('character varying', {
    name: 'horario_uso_previsto',
    nullable: true,
    length: 100,
  })
  horarioUsoPrevisto: string | null;

  @Column('boolean', {
    name: 'requiere_modificaciones',
    nullable: true,
    default: () => 'false',
  })
  requiereModificaciones: boolean | null;

  @Column('text', { name: 'modificaciones_requeridas', nullable: true })
  modificacionesRequeridas: string | null;

  @Column('character varying', {
    name: 'cedula_documento_url',
    nullable: true,
    length: 255,
  })
  cedulaDocumentoUrl: string | null;

  @Column('character varying', {
    name: 'referencias_url',
    nullable: true,
    length: 255,
  })
  referenciasUrl: string | null;

  @Column('character varying', {
    name: 'placa_vehiculo',
    nullable: true,
    length: 10,
  })
  placaVehiculo: string | null;

  @Column('character varying', {
    name: 'marca_vehiculo',
    nullable: true,
    length: 50,
  })
  marcaVehiculo: string | null;

  @Column('character varying', {
    name: 'modelo_vehiculo',
    nullable: true,
    length: 50,
  })
  modeloVehiculo: string | null;

  @Column('character varying', {
    name: 'color_vehiculo',
    nullable: true,
    length: 30,
  })
  colorVehiculo: string | null;

  @Column('character varying', {
    name: 'tipo_vehiculo',
    nullable: true,
    length: 20,
  })
  tipoVehiculo: string | null;

  @Column('character varying', {
    name: 'estado_verificacion',
    nullable: true,
    length: 20,
    default: () => "'pendiente'",
  })
  estadoVerificacion: string | null;

  @Column('timestamp without time zone', {
    name: 'fecha_verificacion',
    nullable: true,
  })
  fechaVerificacion: Date | null;

  @Column('text', { name: 'observaciones_verificacion', nullable: true })
  observacionesVerificacion: string | null;

  @Column('timestamp without time zone', {
    name: 'fecha_registro',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechaRegistro: Date | null;

  @Column('timestamp without time zone', {
    name: 'fecha_actualizacion',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechaActualizacion: Date | null;

  @Column('boolean', {
    name: 'esta_activo',
    nullable: true,
    default: () => 'true',
  })
  estaActivo: boolean | null;

  @OneToMany(
    () => ArrendamientoEspacio,
    (arrendamientoEspacio) => arrendamientoEspacio.idArrendatario2,
  )
  arrendamientoEspacios: ArrendamientoEspacio[];

  @ManyToOne(
    () => DocumentoIdentidad,
    (documentoIdentidad) => documentoIdentidad.arrendatarios,
  )
  @JoinColumn([
    {
      name: 'id_documento_identidad',
      referencedColumnName: 'idDocumentoIdentidad',
    },
  ])
  idDocumentoIdentidad: DocumentoIdentidad;

  @ManyToOne(() => Usuario, (usuario) => usuario.arrendatarios, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'id_usuario', referencedColumnName: 'idUsuario' }])
  idUsuario: Usuario;

  @ManyToOne(() => Usuario, (usuario) => usuario.arrendatarios2)
  @JoinColumn([{ name: 'registrado_por', referencedColumnName: 'idUsuario' }])
  registradoPor: Usuario;
}

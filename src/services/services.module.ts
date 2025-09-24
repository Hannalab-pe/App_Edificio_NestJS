// services/services.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EntitiesModule } from '../entities/entities.module';
import {
  // Servicios principales
  UsuarioService,
  AuthService,
  RolService,
  PropietarioService,
  PropiedadService,

  // Servicios de gestión
  IncidenciaService,
  NotificacionService,
  PagoService,
  DocumentoService,
  DocumentoIdentidadService,

  // Servicios de áreas y espacios
  AreaComunService,
  EspacioArrendableService,
  ReservaService,
  ArrendamientoEspacioService,
  ArrendatarioService,

  // Servicios de usuarios
  ResidenteService,
  TrabajadorService,
  VisitaService,

  // Servicios financieros
  ConceptoPagoService,
  ReciboService,
  CajaService,
  MovimientoCajaService,
  PresupuestoService,

  // Servicios de gestión administrativa
  MantenimientoService,
  VotacionService,
  VotoService,
  OpcionVotoService,
  JuntaPropietariosService,

  // Servicios de comunicación
  MensajePrivadoService,
  ComentarioIncidenciaService,
  EncomiendaService,

  // Servicios de contratos
  ContratoService,
  HistorialContratoService,
  CronogramaService,

  // Servicios de tipos
  TipoDocumentoService,
  TipoIncidenciaService,
  TipoContratoService,
  TipoCronogramaService,
  TipoEspacioService,
  TipoContactoService,

  // Servicios de relaciones
  ContactoService,
  PropiedadPropietarioService,
  ResidenciaService,
} from './implementations';

@Module({
  imports: [
    EntitiesModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret:
          configService.get<string>('JWT_SECRET') ||
          'your-super-secret-jwt-key',
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '24h',
        },
      }),
    }),
  ],
  providers: [
    // Usando string tokens para interfaces - Servicios principales
    {
      provide: 'IUsuarioService',
      useClass: UsuarioService,
    },
    {
      provide: 'IAuthService',
      useClass: AuthService,
    },
    {
      provide: 'IRolService',
      useClass: RolService,
    },
    {
      provide: 'IPropietarioService',
      useClass: PropietarioService,
    },
    {
      provide: 'IPropiedadService',
      useClass: PropiedadService,
    },

    // Servicios de gestión
    {
      provide: 'IIncidenciaService',
      useClass: IncidenciaService,
    },
    {
      provide: 'INotificacionService',
      useClass: NotificacionService,
    },
    {
      provide: 'IPagoService',
      useClass: PagoService,
    },
    {
      provide: 'IDocumentoService',
      useClass: DocumentoService,
    },
    {
      provide: 'IDocumentoIdentidadService',
      useClass: DocumentoIdentidadService,
    },

    // Servicios de áreas y espacios
    {
      provide: 'IAreaComunService',
      useClass: AreaComunService,
    },
    {
      provide: 'IEspacioArrendableService',
      useClass: EspacioArrendableService,
    },
    {
      provide: 'IReservaService',
      useClass: ReservaService,
    },
    {
      provide: 'IArrendamientoEspacioService',
      useClass: ArrendamientoEspacioService,
    },
    {
      provide: 'IArrendatarioService',
      useClass: ArrendatarioService,
    },
    // Asegurar que ArrendatarioService tenga acceso a DocumentoIdentidadService
    ArrendatarioService,

    // Servicios de usuarios
    {
      provide: 'IResidenteService',
      useClass: ResidenteService,
    },
    {
      provide: 'ITrabajadorService',
      useClass: TrabajadorService,
    },
    {
      provide: 'IVisitaService',
      useClass: VisitaService,
    },

    // Servicios financieros
    {
      provide: 'IConceptoPagoService',
      useClass: ConceptoPagoService,
    },
    {
      provide: 'IReciboService',
      useClass: ReciboService,
    },
    {
      provide: 'ICajaService',
      useClass: CajaService,
    },
    {
      provide: 'IMovimientoCajaService',
      useClass: MovimientoCajaService,
    },
    {
      provide: 'IPresupuestoService',
      useClass: PresupuestoService,
    },

    // Servicios de gestión administrativa
    {
      provide: 'IMantenimientoService',
      useClass: MantenimientoService,
    },
    {
      provide: 'IVotacionService',
      useClass: VotacionService,
    },
    {
      provide: 'IVotoService',
      useClass: VotoService,
    },
    {
      provide: 'IOpcionVotoService',
      useClass: OpcionVotoService,
    },
    {
      provide: 'IJuntaPropietariosService',
      useClass: JuntaPropietariosService,
    },

    // Servicios de comunicación
    {
      provide: 'IMensajePrivadoService',
      useClass: MensajePrivadoService,
    },
    {
      provide: 'IComentarioIncidenciaService',
      useClass: ComentarioIncidenciaService,
    },
    {
      provide: 'IEncomiendaService',
      useClass: EncomiendaService,
    },

    // Servicios de contratos
    {
      provide: 'IContratoService',
      useClass: ContratoService,
    },
    {
      provide: 'IHistorialContratoService',
      useClass: HistorialContratoService,
    },
    {
      provide: 'ICronogramaService',
      useClass: CronogramaService,
    },

    // Servicios de tipos
    {
      provide: 'ITipoDocumentoService',
      useClass: TipoDocumentoService,
    },
    {
      provide: 'ITipoIncidenciaService',
      useClass: TipoIncidenciaService,
    },
    {
      provide: 'ITipoContratoService',
      useClass: TipoContratoService,
    },
    {
      provide: 'ITipoCronogramaService',
      useClass: TipoCronogramaService,
    },
    {
      provide: 'ITipoEspacioService',
      useClass: TipoEspacioService,
    },
    {
      provide: 'ITipoContactoService',
      useClass: TipoContactoService,
    },

    // Servicios de relaciones
    {
      provide: 'IContactoService',
      useClass: ContactoService,
    },
    {
      provide: 'IPropiedadPropietarioService',
      useClass: PropiedadPropietarioService,
    },
    {
      provide: 'IResidenciaService',
      useClass: ResidenciaService,
    },

    // También exportar las clases directas para casos específicos
    UsuarioService,
    AuthService,
    RolService,
    PropietarioService,
    PropiedadService,
    IncidenciaService,
    NotificacionService,
    PresupuestoService,
    PagoService,
    DocumentoService,
    DocumentoIdentidadService,
    AreaComunService,
    EspacioArrendableService,
    ReservaService,
    ArrendamientoEspacioService,
    ArrendatarioService,
    ResidenteService,
    TrabajadorService,
    VisitaService,
    ConceptoPagoService,
    ReciboService,
    CajaService,
    MovimientoCajaService,
    MantenimientoService,
    VotacionService,
    VotoService,
    OpcionVotoService,
    JuntaPropietariosService,
    MensajePrivadoService,
    ComentarioIncidenciaService,
    EncomiendaService,
    ContratoService,
    HistorialContratoService,
    CronogramaService,
    TipoDocumentoService,
    TipoIncidenciaService,
    TipoContratoService,
    TipoCronogramaService,
    TipoEspacioService,
    TipoContactoService,
    ContactoService,
    PropiedadPropietarioService,
    ResidenciaService,
  ],
  exports: [
    // String tokens para interfaces
    'IUsuarioService',
    'IAuthService',
    'IRolService',
    'IPropietarioService',
    'IPropiedadService',
    'IIncidenciaService',
    'INotificacionService',
    'IPagoService',
    'IDocumentoService',
    'IDocumentoIdentidadService',
    'IAreaComunService',
    'IEspacioArrendableService',
    'IReservaService',
    'IArrendamientoEspacioService',
    'IArrendatarioService',
    'IResidenteService',
    'ITrabajadorService',
    'IVisitaService',
    'IConceptoPagoService',
    'IReciboService',
    'IPresupuestoService',
    'ICajaService',
    'IMovimientoCajaService',
    'IMantenimientoService',
    'IVotacionService',
    'IVotoService',
    'IOpcionVotoService',
    'IJuntaPropietariosService',
    'IMensajePrivadoService',
    'IComentarioIncidenciaService',
    'IEncomiendaService',
    'IContratoService',
    'IHistorialContratoService',
    'ICronogramaService',
    'ITipoDocumentoService',
    'ITipoIncidenciaService',
    'ITipoContratoService',
    'ITipoCronogramaService',
    'ITipoEspacioService',
    'ITipoContactoService',
    'IContactoService',
    'IPropiedadPropietarioService',
    'IResidenciaService',

    // Clases directas
    UsuarioService,
    AuthService,
    RolService,
    PropietarioService,
    PropiedadService,
    IncidenciaService,
    NotificacionService,
    PagoService,
    DocumentoService,
    DocumentoIdentidadService,
    AreaComunService,
    EspacioArrendableService,
    ReservaService,
    ArrendamientoEspacioService,
    ArrendatarioService,
    ResidenteService,
    TrabajadorService,
    VisitaService,
    ConceptoPagoService,
    ReciboService,
    CajaService,
    MovimientoCajaService,
    PresupuestoService,
    MantenimientoService,
    VotacionService,
    VotoService,
    OpcionVotoService,
    JuntaPropietariosService,
    MensajePrivadoService,
    ComentarioIncidenciaService,
    EncomiendaService,
    ContratoService,
    HistorialContratoService,
    CronogramaService,
    TipoDocumentoService,
    TipoIncidenciaService,
    TipoContratoService,
    TipoCronogramaService,
    TipoEspacioService,
    TipoContactoService,
    ContactoService,
    PropiedadPropietarioService,
    ResidenciaService,
  ],
})
export class ServicesModule {}

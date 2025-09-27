import { ApiProperty } from '@nestjs/swagger';

export class UsuarioResponseDto {
  @ApiProperty({
    description: 'ID único del usuario',
    example: '550e8400-e29b-41d4-a716-446655440000',
    type: String,
  })
  idUsuario: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'usuario@viveconecta.com',
    type: String,
  })
  correo: string;

  @ApiProperty({
    description: 'Estado de activación del usuario',
    example: true,
    type: Boolean,
  })
  estaActivo: boolean;

  @ApiProperty({
    description: 'Información del rol asignado al usuario',
    example: {
      idRol: '550e8400-e29b-41d4-a716-446655440001',
      nombreRol: 'Administrador',
      descripcion: 'Usuario con acceso completo al sistema',
    },
    required: false,
  })
  rol?: {
    idRol: string;
    nombreRol: string;
    descripcion?: string;
  };

  @ApiProperty({
    description: 'Estadísticas de actividad del usuario en el sistema',
    example: {
      totalIncidenciasReportadas: 5,
      totalReservasActivas: 2,
      totalVotacionesCreadas: 1,
      totalMensajesEnviados: 15,
      ultimaActividad: '2024-01-15T10:30:00.000Z',
    },
    required: false,
  })
  estadisticas?: {
    totalIncidenciasReportadas: number;
    totalReservasActivas: number;
    totalVotacionesCreadas: number;
    totalMensajesEnviados: number;
    ultimaActividad?: string;
  };

  @ApiProperty({
    description:
      'Perfiles asociados al usuario (propietario, residente, trabajador)',
    example: {
      esPropietario: true,
      esResidente: false,
      esTrabajador: false,
      esArrendatario: false,
      detallesPropietario: {
        nombre: 'Juan Carlos',
        apellido: 'Pérez García',
        telefono: '+51987654321',
      },
    },
    required: false,
  })
  perfiles?: {
    esPropietario: boolean;
    esResidente: boolean;
    esTrabajador: boolean;
    esArrendatario: boolean;
    detallesPropietario?: {
      nombre: string;
      apellido: string;
      telefono?: string;
    };
    detallesResidente?: {
      nombre: string;
      apellido: string;
      telefono?: string;
    };
    detallesTrabajador?: {
      nombre: string;
      apellido: string;
      cargo?: string;
    };
    detallesArrendatario?: {
      nombre: string;
      apellido: string;
      telefono?: string;
    };
  };

  @ApiProperty({
    description: 'Notificaciones pendientes del usuario',
    example: {
      totalPendientes: 3,
      ultimasNotificaciones: [
        {
          id: '550e8400-e29b-41d4-a716-446655440002',
          titulo: 'Nueva reunión programada',
          fechaCreacion: '2024-01-15T09:00:00.000Z',
        },
      ],
    },
    required: false,
  })
  notificaciones?: {
    totalPendientes: number;
    ultimasNotificaciones: Array<{
      id: string;
      titulo: string;
      fechaCreacion: string;
    }>;
  };

  @ApiProperty({
    description: 'Fecha de creación del usuario',
    example: '2024-01-01T00:00:00.000Z',
    type: String,
    required: false,
  })
  fechaCreacion?: string;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2024-01-15T10:30:00.000Z',
    type: String,
    required: false,
  })
  fechaActualizacion?: string;
}

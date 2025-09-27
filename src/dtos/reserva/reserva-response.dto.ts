import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ReservaResponseDto {
  @ApiProperty({
    description: 'ID único de la reserva',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  idReserva: string;

  @ApiProperty({
    description: 'Fecha de la reserva en formato YYYY-MM-DD',
    example: '2025-09-27',
  })
  fechaReserva: string;

  @ApiProperty({
    description: 'Hora de inicio en formato HH:MM',
    example: '09:00',
  })
  horaInicio: string;

  @ApiProperty({
    description: 'Hora de fin en formato HH:MM',
    example: '12:00',
  })
  horaFin: string;

  @ApiProperty({
    description: 'Estado de la reserva',
    example: 'confirmada',
    enum: ['pendiente', 'confirmada', 'cancelada', 'completada'],
  })
  estado: string;

  @ApiPropertyOptional({
    description: 'Motivo de la reserva',
    example: 'Reunión familiar',
  })
  motivo: string | null;

  @ApiPropertyOptional({
    description: 'Costo total de la reserva',
    example: '50.00',
  })
  costoTotal: string | null;

  @ApiProperty({
    description: 'Indica si la reserva está pagada',
    example: false,
  })
  pagado: boolean;

  @ApiPropertyOptional({
    description: 'Observaciones adicionales sobre la reserva',
    example: 'Requiere sillas adicionales',
  })
  observaciones: string | null;

  @ApiPropertyOptional({
    description: 'Fecha de creación de la reserva',
    example: '2025-09-26T19:30:00.000Z',
  })
  fechaCreacion: Date | null;

  @ApiPropertyOptional({
    description: 'Información del área común asociada',
  })
  idAreaComun?: {
    idAreaComun: string;
    nombre: string;
    ubicacion: string;
    capacidad: number;
    estado: string;
  };

  @ApiPropertyOptional({
    description: 'Información del usuario que realizó la reserva',
  })
  idUsuario?: {
    idUsuario: string;
    nombre: string;
    email: string;
    telefono: string | null;
  };
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsBoolean,
  IsOptional,
  IsDateString,
  Matches,
} from 'class-validator';

export class CreateReservaDto {
  @ApiProperty({
    description: 'Fecha de la reserva en formato YYYY-MM-DD',
    example: '2025-09-27',
  })
  @IsDateString(
    {},
    {
      message:
        'La fecha de reserva debe ser una fecha válida en formato YYYY-MM-DD',
    },
  )
  @IsNotEmpty({ message: 'La fecha de reserva es obligatoria' })
  fechaReserva: string;

  @ApiProperty({
    description: 'Hora de inicio en formato HH:MM',
    example: '09:00',
  })
  @IsString({ message: 'La hora de inicio debe ser una cadena de texto' })
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'La hora de inicio debe tener formato HH:MM válido',
  })
  @IsNotEmpty({ message: 'La hora de inicio es obligatoria' })
  horaInicio: string;

  @ApiProperty({
    description: 'Hora de fin en formato HH:MM',
    example: '12:00',
  })
  @IsString({ message: 'La hora de fin debe ser una cadena de texto' })
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'La hora de fin debe tener formato HH:MM válido',
  })
  @IsNotEmpty({ message: 'La hora de fin es obligatoria' })
  horaFin: string;

  @ApiProperty({
    description: 'Estado de la reserva',
    example: 'pendiente',
    enum: ['pendiente', 'confirmada', 'cancelada', 'completada'],
  })
  @IsString({ message: 'El estado debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El estado es obligatorio' })
  estado: string;

  @ApiPropertyOptional({
    description: 'Motivo de la reserva',
    example: 'Reunión familiar',
  })
  @IsOptional()
  @IsString({ message: 'El motivo debe ser una cadena de texto' })
  motivo?: string;

  @ApiPropertyOptional({
    description: 'Costo total de la reserva',
    example: '50.00',
  })
  @IsOptional()
  @IsString({ message: 'El costo total debe ser una cadena de texto' })
  costoTotal?: string;

  @ApiPropertyOptional({
    description: 'Indica si la reserva está pagada',
    example: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'El campo pagado debe ser un valor booleano' })
  pagado?: boolean;

  @ApiPropertyOptional({
    description: 'Observaciones adicionales sobre la reserva',
    example: 'Requiere sillas adicionales',
  })
  @IsOptional()
  @IsString({ message: 'Las observaciones deben ser una cadena de texto' })
  observaciones?: string;

  @ApiProperty({
    description: 'ID del área común a reservar',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID(4, { message: 'El ID del área común debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El ID del área común es obligatorio' })
  idAreaComun: string;

  @ApiProperty({
    description: 'ID del usuario que hace la reserva',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID(4, { message: 'El ID del usuario debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El ID del usuario es obligatorio' })
  idUsuario: string;
}

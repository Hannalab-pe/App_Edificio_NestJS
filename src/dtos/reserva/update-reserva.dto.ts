import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsString, IsUUID, IsBoolean, IsOptional, IsDateString, Matches } from 'class-validator';
import { CreateReservaDto } from './create-reserva.dto';

export class UpdateReservaDto extends PartialType(CreateReservaDto) {
  @ApiPropertyOptional({
    description: 'Fecha de la reserva en formato YYYY-MM-DD',
    example: '2025-09-27',
  })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha de reserva debe ser una fecha válida en formato YYYY-MM-DD' })
  fechaReserva?: string;

  @ApiPropertyOptional({
    description: 'Hora de inicio en formato HH:MM',
    example: '09:00',
  })
  @IsOptional()
  @IsString({ message: 'La hora de inicio debe ser una cadena de texto' })
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'La hora de inicio debe tener formato HH:MM válido'
  })
  horaInicio?: string;

  @ApiPropertyOptional({
    description: 'Hora de fin en formato HH:MM',
    example: '12:00',
  })
  @IsOptional()
  @IsString({ message: 'La hora de fin debe ser una cadena de texto' })
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'La hora de fin debe tener formato HH:MM válido'
  })
  horaFin?: string;

  @ApiPropertyOptional({
    description: 'Estado de la reserva',
    example: 'confirmada',
    enum: ['pendiente', 'confirmada', 'cancelada', 'completada'],
  })
  @IsOptional()
  @IsString({ message: 'El estado debe ser una cadena de texto' })
  estado?: string;

  @ApiPropertyOptional({
    description: 'Motivo de la reserva',
    example: 'Reunión familiar actualizada',
  })
  @IsOptional()
  @IsString({ message: 'El motivo debe ser una cadena de texto' })
  motivo?: string;

  @ApiPropertyOptional({
    description: 'Costo total de la reserva',
    example: '75.00',
  })
  @IsOptional()
  @IsString({ message: 'El costo total debe ser una cadena de texto' })
  costoTotal?: string;

  @ApiPropertyOptional({
    description: 'Indica si la reserva está pagada',
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'El campo pagado debe ser un valor booleano' })
  pagado?: boolean;

  @ApiPropertyOptional({
    description: 'Observaciones adicionales sobre la reserva',
    example: 'Actualización: Requiere sillas y mesas adicionales',
  })
  @IsOptional()
  @IsString({ message: 'Las observaciones deben ser una cadena de texto' })
  observaciones?: string;

  @ApiPropertyOptional({
    description: 'ID del área común a reservar',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID(4, { message: 'El ID del área común debe ser un UUID válido' })
  idAreaComun?: string;

  @ApiPropertyOptional({
    description: 'ID del usuario que hace la reserva',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID(4, { message: 'El ID del usuario debe ser un UUID válido' })
  idUsuario?: string;
}
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateAreaComunDto {
  @ApiProperty({
    description: 'Nombre del área común',
    example: 'Salón de Eventos',
    type: String,
  })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  nombre: string;

  @ApiPropertyOptional({
    description: 'Descripción del área común',
    example:
      'Amplio salón para eventos sociales con capacidad para 100 personas',
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  descripcion?: string;

  @ApiProperty({
    description: 'Capacidad máxima de personas',
    example: 100,
    type: Number,
  })
  @IsNumber({}, { message: 'La capacidad máxima debe ser un número' })
  @Min(1, { message: 'La capacidad máxima debe ser mayor a 0' })
  @IsNotEmpty({ message: 'La capacidad máxima es obligatoria' })
  capacidadMaxima: number;

  @ApiProperty({
    description: 'Precio por reserva del área común',
    example: 150.0,
    type: Number,
  })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        'El precio de reserva debe ser un número decimal válido con máximo 2 decimales',
    },
  )
  @Min(0, { message: 'El precio de reserva debe ser mayor o igual a 0' })
  @IsNotEmpty({ message: 'El precio de reserva es obligatorio' })
  precioReserva: number;

  @ApiProperty({
    description: 'Tiempo mínimo de reserva (formato HH:MM:SS)',
    example: '01:00:00',
    type: String,
  })
  @IsString({
    message: 'El tiempo mínimo de reserva debe ser una cadena de texto',
  })
  @IsNotEmpty({ message: 'El tiempo mínimo de reserva es obligatorio' })
  tiempoMinimoReserva: string;

  @ApiProperty({
    description: 'Tiempo máximo de reserva (formato HH:MM:SS)',
    example: '08:00:00',
    type: String,
  })
  @IsString({
    message: 'El tiempo máximo de reserva debe ser una cadena de texto',
  })
  @IsNotEmpty({ message: 'El tiempo máximo de reserva es obligatorio' })
  tiempoMaximoReserva: string;

  @ApiProperty({
    description: 'Horario de apertura (formato HH:MM:SS)',
    example: '08:00:00',
    type: String,
  })
  @IsString({ message: 'El horario de apertura debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El horario de apertura es obligatorio' })
  horarioApertura: string;

  @ApiProperty({
    description: 'Horario de cierre (formato HH:MM:SS)',
    example: '22:00:00',
    type: String,
  })
  @IsString({ message: 'El horario de cierre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El horario de cierre es obligatorio' })
  horarioCierre: string;

  @ApiProperty({
    description: 'Días máximos de anticipación para reserva',
    example: 30,
    type: Number,
  })
  @IsNumber(
    {},
    { message: 'Los días de anticipación máxima deben ser un número' },
  )
  @Min(1, { message: 'Los días de anticipación máxima deben ser mayor a 0' })
  @IsNotEmpty({ message: 'Los días de anticipación máxima son obligatorios' })
  diasAnticipacionMax: number;
}

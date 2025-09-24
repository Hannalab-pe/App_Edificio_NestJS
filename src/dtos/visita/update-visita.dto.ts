import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsUUID,
  IsDateString,
  Matches,
  Length,
  IsIn,
} from 'class-validator';

export class UpdateVisitaDto {
  @ApiProperty({
    description: 'Nombre completo del visitante',
    example: 'Juan Carlos Pérez',
    type: String,
    required: false,
  })
  @IsString({ message: 'El nombre del visitante debe ser una cadena de texto' })
  @IsOptional()
  @Length(2, 100, {
    message: 'El nombre del visitante debe tener entre 2 y 100 caracteres',
  })
  nombreVisitante?: string;

  @ApiProperty({
    description: 'Documento de identidad del visitante (DNI, CE, Pasaporte)',
    example: '12345678',
    type: String,
    required: false,
  })
  @IsString({ message: 'El documento debe ser una cadena de texto' })
  @IsOptional()
  @Length(8, 15, { message: 'El documento debe tener entre 8 y 15 caracteres' })
  documentoVisitante?: string;

  @ApiProperty({
    description: 'Número de teléfono del visitante',
    example: '987654321',
    type: String,
    required: false,
  })
  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  @IsOptional()
  @Matches(/^[0-9+\-\s()]{9,15}$/, {
    message: 'El teléfono debe tener un formato válido (9-15 dígitos)',
  })
  telefonoVisitante?: string;

  @ApiProperty({
    description: 'Motivo de la visita',
    example: 'Visita familiar',
    type: String,
    required: false,
  })
  @IsString({ message: 'El motivo debe ser una cadena de texto' })
  @IsOptional()
  @Length(0, 500, { message: 'El motivo no puede exceder los 500 caracteres' })
  motivo?: string;

  @ApiProperty({
    description: 'Fecha programada para la visita (formato: YYYY-MM-DD)',
    example: '2024-01-15',
    type: String,
    required: false,
  })
  @IsDateString(
    {},
    { message: 'La fecha programada debe tener formato válido (YYYY-MM-DD)' },
  )
  @IsOptional()
  fechaProgramada?: string;

  @ApiProperty({
    description: 'Hora de inicio de la visita (formato: HH:MM)',
    example: '14:30',
    type: String,
    required: false,
  })
  @IsString({ message: 'La hora de inicio debe ser una cadena de texto' })
  @IsOptional()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'La hora de inicio debe tener formato HH:MM (24h)',
  })
  horaInicio?: string;

  @ApiProperty({
    description: 'Hora de fin de la visita (formato: HH:MM)',
    example: '18:00',
    type: String,
    required: false,
  })
  @IsString({ message: 'La hora de fin debe ser una cadena de texto' })
  @IsOptional()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'La hora de fin debe tener formato HH:MM (24h)',
  })
  horaFin?: string;

  @ApiProperty({
    description: 'Estado de la visita',
    example: 'PROGRAMADA',
    enum: ['PROGRAMADA', 'EN_CURSO', 'FINALIZADA', 'CANCELADA'],
    required: false,
  })
  @IsString({ message: 'El estado debe ser una cadena de texto' })
  @IsOptional()
  @IsIn(['PROGRAMADA', 'EN_CURSO', 'FINALIZADA', 'CANCELADA'], {
    message: 'El estado debe ser: PROGRAMADA, EN_CURSO, FINALIZADA o CANCELADA',
  })
  estado?: string;

  @ApiProperty({
    description:
      'ID del usuario que autoriza la visita (debe ser residente o propietario)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
    required: false,
  })
  @IsUUID('4', {
    message: 'El ID del usuario autorizador debe ser un UUID válido',
  })
  @IsOptional()
  autorizadorUsuario?: string;

  @ApiProperty({
    description: 'ID de la propiedad que será visitada',
    example: '123e4567-e89b-12d3-a456-426614174001',
    type: String,
    required: false,
  })
  @IsUUID('4', { message: 'El ID de la propiedad debe ser un UUID válido' })
  @IsOptional()
  idPropiedad?: string;
}

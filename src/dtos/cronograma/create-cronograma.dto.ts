import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, IsDateString } from 'class-validator';

export class CreateCronogramaDto {
  @ApiProperty({
    description: 'Título del cronograma',
    example: 'Mantenimiento de ascensores',
    type: String,
  })
  @IsString({ message: 'El título debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El título es obligatorio' })
  titulo: string;

  @ApiProperty({
    description: 'Descripción detallada del cronograma',
    example:
      'Mantenimiento preventivo mensual de todos los ascensores del edificio',
    type: String,
  })
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La descripción es obligatoria' })
  descripcion: string;

  @ApiProperty({
    description: 'Fecha de inicio del cronograma',
    example: '2024-01-15',
    type: String,
    format: 'date',
  })
  @IsDateString(
    {},
    {
      message:
        'La fecha de inicio debe ser una fecha válida en formato YYYY-MM-DD',
    },
  )
  @IsNotEmpty({ message: 'La fecha de inicio es obligatoria' })
  fechaInicio: string;

  @ApiProperty({
    description: 'Fecha de fin del cronograma',
    example: '2024-01-16',
    type: String,
    format: 'date',
  })
  @IsDateString(
    {},
    {
      message:
        'La fecha de fin debe ser una fecha válida en formato YYYY-MM-DD',
    },
  )
  @IsNotEmpty({ message: 'La fecha de fin es obligatoria' })
  fechaFin: string;

  @ApiPropertyOptional({
    description: 'ID del residente relacionado con el cronograma',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsUUID('4', { message: 'El ID del residente debe ser un UUID válido' })
  idResidente?: string;

  @ApiProperty({
    description: 'ID del tipo de cronograma',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsUUID('4', {
    message: 'El ID del tipo de cronograma debe ser un UUID válido',
  })
  @IsNotEmpty({ message: 'El ID del tipo de cronograma es obligatorio' })
  idTipoCronograma: string;

  @ApiPropertyOptional({
    description: 'ID del trabajador asignado al cronograma',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsUUID('4', { message: 'El ID del trabajador debe ser un UUID válido' })
  idTrabajador?: string;
}

import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsUUID,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsDateString,
} from 'class-validator';
import { TipoNotificacion } from '../../Enums/globales.enum';

export class UpdateNotificacionDto {
  @ApiPropertyOptional({
    description: 'Título de la notificación',
    example: 'Mantenimiento programado',
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'El título debe ser una cadena de texto' })
  titulo?: string;

  @ApiPropertyOptional({
    description: 'Mensaje de la notificación',
    example:
      'Se realizará mantenimiento en las áreas comunes el próximo sábado',
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'El mensaje debe ser una cadena de texto' })
  mensaje?: string;

  @ApiPropertyOptional({
    description: 'Tipo de notificación',
    example: TipoNotificacion.INFORMATIVA,
    enum: TipoNotificacion,
  })
  @IsOptional()
  @IsEnum(TipoNotificacion, {
    message: 'El tipo debe ser uno de los valores válidos',
  })
  tipo?: TipoNotificacion;

  @ApiPropertyOptional({
    description: 'Indica si la notificación ha sido leída',
    example: true,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean({ message: 'El estado de lectura debe ser un valor booleano' })
  leida?: boolean;

  @ApiPropertyOptional({
    description: 'Fecha en que se leyó la notificación',
    example: '2025-09-23T14:30:00Z',
    type: String,
    format: 'date-time',
  })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'La fecha de lectura debe ser una fecha válida' },
  )
  fechaLectura?: string;

  @ApiPropertyOptional({
    description: 'ID del usuario destinatario específico',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsOptional()
  @IsUUID('4', {
    message: 'El ID del usuario destinatario debe ser un UUID válido',
  })
  destinatarioUsuario?: string;

  @ApiPropertyOptional({
    description: 'ID del rol destinatario',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsOptional()
  @IsUUID('4', {
    message: 'El ID del rol destinatario debe ser un UUID válido',
  })
  destinatarioRol?: string;
}

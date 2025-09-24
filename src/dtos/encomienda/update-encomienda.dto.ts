import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsUUID,
  IsOptional,
  IsEnum,
  IsUrl,
  IsDateString,
} from 'class-validator';
import { EstadoEncomienda } from 'src/Enums/encomienda.enum';

export class UpdateEncomiendaDto {
  @ApiPropertyOptional({
    description: 'Código de seguimiento de la encomienda',
    example: 'TK123456789',
    type: String,
  })
  @IsOptional()
  @IsString({
    message: 'El código de seguimiento debe ser una cadena de texto',
  })
  codigoSeguimiento?: string;

  @ApiPropertyOptional({
    description: 'Nombre del remitente',
    example: 'Juan Pérez',
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'El remitente debe ser una cadena de texto' })
  remitente?: string;

  @ApiPropertyOptional({
    description: 'Empresa de courier',
    example: 'DHL',
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'La empresa courier debe ser una cadena de texto' })
  empresaCourier?: string;

  @ApiPropertyOptional({
    description: 'Fecha de llegada de la encomienda',
    example: '2025-09-23T10:30:00Z',
    type: String,
    format: 'date-time',
  })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'La fecha de llegada debe ser una fecha válida' },
  )
  fechaLlegada?: string;

  @ApiPropertyOptional({
    description: 'Fecha de entrega de la encomienda',
    example: '2025-09-23T15:00:00Z',
    type: String,
    format: 'date-time',
  })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'La fecha de entrega debe ser una fecha válida' },
  )
  fechaEntrega?: string;

  @ApiPropertyOptional({
    description: 'Estado de la encomienda',
    example: EstadoEncomienda.ENTREGADA,
    enum: EstadoEncomienda,
  })
  @IsOptional()
  @IsEnum(EstadoEncomienda, {
    message: 'El estado debe ser uno de los valores válidos',
  })
  estado?: EstadoEncomienda;

  @ApiPropertyOptional({
    description: 'Descripción de la encomienda',
    example: 'Paquete pequeño con documentos',
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  descripcion?: string;

  @ApiPropertyOptional({
    description: 'URL de la foto de evidencia',
    example: 'https://storage.example.com/encomiendas/foto-123.jpg',
    type: String,
  })
  @IsOptional()
  @IsUrl(
    {},
    { message: 'La URL de la foto de evidencia debe ser una URL válida' },
  )
  fotoEvidenciaUrl?: string;

  @ApiPropertyOptional({
    description: 'Observaciones adicionales',
    example: 'Paquete entregado en buen estado',
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'Las observaciones deben ser una cadena de texto' })
  observaciones?: string;

  @ApiPropertyOptional({
    description: 'ID de la propiedad destinataria',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsOptional()
  @IsUUID('4', { message: 'El ID de la propiedad debe ser un UUID válido' })
  idPropiedad?: string;

  @ApiPropertyOptional({
    description: 'ID del trabajador que recibe la encomienda',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsOptional()
  @IsUUID('4', { message: 'El ID del trabajador debe ser un UUID válido' })
  recibidoPorTrabajador?: string;
}

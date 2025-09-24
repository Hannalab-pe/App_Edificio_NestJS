import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsUUID,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class UpdatePropietarioDto {
  @ApiPropertyOptional({
    description: 'Nombre del propietario',
    example: 'Juan',
    type: String,
  })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsOptional()
  nombre?: string;

  @ApiPropertyOptional({
    description: 'Apellido del propietario',
    example: 'Pérez',
    type: String,
  })
  @IsString({ message: 'El apellido debe ser una cadena de texto' })
  @IsOptional()
  apellido?: string;

  @ApiPropertyOptional({
    description: 'Correo electrónico del propietario',
    example: 'juan.perez@ejemplo.com',
    type: String,
  })
  @IsEmail({}, { message: 'El correo debe tener un formato válido' })
  @IsOptional()
  correo?: string;

  @ApiPropertyOptional({
    description: 'Teléfono del propietario',
    example: '+51987654321',
    type: String,
  })
  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  @IsOptional()
  telefono?: string;

  @ApiPropertyOptional({
    description: 'Dirección del propietario',
    example: 'Av. Ejemplo 123, Lima',
    type: String,
  })
  @IsString({ message: 'La dirección debe ser una cadena de texto' })
  @IsOptional()
  direccion?: string;

  @ApiPropertyOptional({
    description: 'Estado del propietario (activo/inactivo)',
    example: true,
    type: Boolean,
  })
  @IsBoolean({ message: 'El estado debe ser un valor booleano' })
  @IsOptional()
  estaActivo?: boolean;

  @ApiPropertyOptional({
    description: 'ID del documento de identidad',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsUUID('4', {
    message: 'El ID del documento de identidad debe ser un UUID válido',
  })
  @IsOptional()
  idDocumentoIdentidad?: string;

  @ApiPropertyOptional({
    description: 'ID del usuario asociado',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsUUID('4', { message: 'El ID del usuario debe ser un UUID válido' })
  @IsOptional()
  idUsuario?: string;
}

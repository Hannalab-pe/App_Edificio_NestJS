import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsOptional,
  IsNumber,
  Min,
  MaxLength,
} from 'class-validator';

export class CreateOpcionVotoDto {
  @ApiProperty({
    description: 'ID de la votación a la que pertenece esta opción',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID('4', { message: 'El ID de la votación debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El ID de la votación es obligatorio' })
  idVotacion: string;

  @ApiProperty({
    description: 'Texto de la opción de voto',
    example: 'Apruebo',
    maxLength: 255,
  })
  @IsString({ message: 'La opción debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La opción es obligatoria' })
  @MaxLength(255, {
    message: 'La opción no puede exceder 255 caracteres',
  })
  opcion: string;

  @ApiPropertyOptional({
    description: 'Descripción detallada de la opción (opcional)',
    example: 'Apruebo la propuesta de mejoras en las áreas comunes',
  })
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @IsOptional()
  descripcion?: string;

  @ApiProperty({
    description: 'Orden de presentación de la opción (para ordenar en la UI)',
    example: 1,
    minimum: 1,
  })
  @IsNumber({}, { message: 'El orden de presentación debe ser un número' })
  @IsNotEmpty({ message: 'El orden de presentación es obligatorio' })
  @Min(1, { message: 'El orden de presentación debe ser mayor a 0' })
  ordenPresentacion: number;
}

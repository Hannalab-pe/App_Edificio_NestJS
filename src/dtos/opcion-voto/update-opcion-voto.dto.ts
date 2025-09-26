import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsUUID,
  IsNumber,
  Min,
  MaxLength,
} from 'class-validator';

export class UpdateOpcionVotoDto {
  @ApiPropertyOptional({
    description: 'ID de la votación a la que pertenece esta opción',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID('4', { message: 'El ID de la votación debe ser un UUID válido' })
  @IsOptional()
  idVotacion?: string;

  @ApiPropertyOptional({
    description: 'Texto de la opción de voto',
    example: 'Rechazo',
    maxLength: 255,
  })
  @IsString({ message: 'La opción debe ser una cadena de texto' })
  @MaxLength(255, {
    message: 'La opción no puede exceder 255 caracteres',
  })
  @IsOptional()
  opcion?: string;

  @ApiPropertyOptional({
    description: 'Descripción detallada de la opción',
    example: 'Rechazo la propuesta por considerarla innecesaria',
  })
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @IsOptional()
  descripcion?: string;

  @ApiPropertyOptional({
    description: 'Orden de presentación de la opción',
    example: 2,
    minimum: 1,
  })
  @IsNumber({}, { message: 'El orden de presentación debe ser un número' })
  @Min(1, { message: 'El orden de presentación debe ser mayor a 0' })
  @IsOptional()
  ordenPresentacion?: number;
}
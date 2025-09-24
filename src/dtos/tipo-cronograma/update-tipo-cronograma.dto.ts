import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateTipoCronogramaDto {
  @ApiPropertyOptional({
    description: 'Tipo de cronograma',
    example: 'Reunión extraordinaria',
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'El tipo de cronograma debe ser una cadena de texto' })
  tipoCronograma?: string;

  @ApiPropertyOptional({
    description: 'Descripción del tipo de cronograma',
    example:
      'Cronograma para reuniones extraordinarias convocadas por situaciones especiales',
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  descripcion?: string;
}

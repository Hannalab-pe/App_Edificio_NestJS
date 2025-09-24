import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTipoCronogramaDto {
  @ApiProperty({
    description: 'Tipo de cronograma',
    example: 'Reunión ordinaria',
    type: String,
  })
  @IsString({ message: 'El tipo de cronograma debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El tipo de cronograma es obligatorio' })
  tipoCronograma: string;

  @ApiProperty({
    description: 'Descripción del tipo de cronograma',
    example: 'Cronograma para reuniones ordinarias de la junta de propietarios',
    type: String,
  })
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La descripción es obligatoria' })
  descripcion: string;
}

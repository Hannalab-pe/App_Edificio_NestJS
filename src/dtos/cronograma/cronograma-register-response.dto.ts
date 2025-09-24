import { ApiProperty } from '@nestjs/swagger';
import { Cronograma } from '../../entities/Cronograma';

export class CronogramaRegisterResponseDto {
  @ApiProperty({
    description: 'Indica si el registro fue exitoso',
    example: true,
    type: Boolean,
  })
  success: boolean;

  @ApiProperty({
    description: 'Mensaje descriptivo del resultado',
    example: 'Cronograma registrado exitosamente',
    type: String,
  })
  message: string;

  @ApiProperty({
    description: 'Datos del cronograma registrado',
    type: Cronograma,
  })
  cronograma: Cronograma;
}
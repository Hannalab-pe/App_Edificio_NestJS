import { ApiProperty } from '@nestjs/swagger';
import { ReciboResponseDto } from './recibo-response.dto';

export class ReciboSingleResponseDto {
  @ApiProperty({
    description: 'Indica si la operación fue exitosa',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Mensaje descriptivo del resultado',
    example: 'Recibo obtenido exitosamente',
  })
  message: string;

  @ApiProperty({
    description: 'Datos del recibo',
    type: ReciboResponseDto,
  })
  data: ReciboResponseDto;

  @ApiProperty({
    description: 'Código de estado HTTP',
    example: 200,
  })
  statusCode: number;
}

export class ReciboArrayResponseDto {
  @ApiProperty({
    description: 'Indica si la operación fue exitosa',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Mensaje descriptivo del resultado',
    example: 'Lista de recibos obtenida exitosamente',
  })
  message: string;

  @ApiProperty({
    description: 'Array de recibos',
    type: [ReciboResponseDto],
  })
  data: ReciboResponseDto[];

  @ApiProperty({
    description: 'Código de estado HTTP',
    example: 200,
  })
  statusCode: number;
}

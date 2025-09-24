import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTipoEspacioDto {
  @ApiProperty({
    description: 'Nombre del tipo de espacio',
    example: 'Salón de eventos',
  })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser un texto' })
  nombre: string;

  @ApiProperty({
    description: 'Descripción detallada del tipo de espacio',
    example: 'Espacio amplio para reuniones y eventos sociales',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser un texto' })
  descripcion?: string;

  @ApiProperty({
    description: 'Indica si el tipo de espacio requiere contrato para su uso',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'requiereContrato debe ser un valor booleano' })
  requiereContrato?: boolean;
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePropiedadDto {
  @ApiProperty({
    description: 'Número del departamento',
    example: 'A-101',
    type: String,
  })
  @IsString({
    message: 'El número de departamento debe ser una cadena de texto',
  })
  @IsNotEmpty({ message: 'El número de departamento es obligatorio' })
  numeroDepartamento: string;

  @ApiProperty({
    description: 'Tipo de propiedad',
    example: 'Departamento',
    type: String,
    maxLength: 25,
  })
  @IsString({ message: 'El tipo de propiedad debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El tipo de propiedad es obligatorio' })
  tipoPropiedad: string;

  @ApiProperty({
    description: 'Piso donde se encuentra la propiedad',
    example: 10,
    type: Number,
  })
  @IsNumber({}, { message: 'El piso debe ser un número' })
  @IsNotEmpty({ message: 'El piso es obligatorio' })
  piso: number;

  @ApiPropertyOptional({
    description: 'Área en metros cuadrados',
    example: 85.5,
    type: Number,
  })
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'El área debe ser un número decimal válido con máximo 2 decimales' },
  )
  areaM2?: number;

  @ApiPropertyOptional({
    description: 'Número de cuartos',
    example: 3,
    type: Number,
    default: 0,
  })
  @IsOptional()
  @IsNumber({}, { message: 'El número de cuartos debe ser un número' })
  cuartos?: number;

  @ApiPropertyOptional({
    description: 'Número de baños',
    example: 2,
    type: Number,
    default: 0,
  })
  @IsOptional()
  @IsNumber({}, { message: 'El número de baños debe ser un número' })
  banios?: number;

  @ApiPropertyOptional({
    description: 'Número de estacionamientos',
    example: 1,
    type: Number,
    default: 0,
  })
  @IsOptional()
  @IsNumber({}, { message: 'El número de estacionamientos debe ser un número' })
  estacionamientos?: number;

  @ApiPropertyOptional({
    description: 'Indica si tiene cuartos de servicio',
    example: false,
    type: Boolean,
    default: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'Cuartos de servicio debe ser un valor booleano' })
  cuartosServicio?: boolean;

  @ApiProperty({
    description: 'Estado de ocupación de la propiedad',
    example: 'Ocupado',
    type: String,
    maxLength: 25,
  })
  @IsString({ message: 'El estado de ocupación debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El estado de ocupación es obligatorio' })
  estadoOcupacion: string;

  @ApiPropertyOptional({
    description: 'Valor comercial de la propiedad',
    example: 250000.0,
    type: Number,
  })
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'El valor comercial debe ser un número decimal válido con máximo 2 decimales' },
  )
  valorComercial?: number;

  @ApiPropertyOptional({
    description: 'Descripción adicional de la propiedad',
    example: 'Departamento con vista al mar',
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  descripcion?: string;

  @ApiPropertyOptional({
    description: 'Estado de la propiedad (activo/inactivo)',
    example: true,
    type: Boolean,
    default: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'El estado debe ser un valor booleano' })
  estaActivo?: boolean;
}

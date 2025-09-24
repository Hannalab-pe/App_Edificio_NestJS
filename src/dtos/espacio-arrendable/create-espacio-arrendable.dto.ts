import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsOptional,
  IsDecimal,
  IsEnum,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { EstadoEspacio } from 'src/Enums/espacio.enum';

export class CreateEspacioArrendableDto {
  @ApiProperty({
    description: 'Código único del espacio arrendable',
    example: 'ESP-001',
    type: String,
  })
  @IsString({ message: 'El código debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El código es obligatorio' })
  codigo: string;

  @ApiPropertyOptional({
    description: 'Descripción del espacio arrendable',
    example: 'Local comercial en primer piso con vista a la calle principal',
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  descripcion?: string;

  @ApiProperty({
    description: 'Ubicación del espacio arrendable',
    example: 'Primer piso, ala norte',
    type: String,
  })
  @IsString({ message: 'La ubicación debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La ubicación es obligatoria' })
  ubicacion: string;

  @ApiPropertyOptional({
    description: 'Área en metros cuadrados',
    example: 45.5,
    type: Number,
  })
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsDecimal(
    { decimal_digits: '1,2' },
    { message: 'El área debe ser un número decimal válido' },
  )
  areaM2?: number;

  @ApiProperty({
    description: 'Estado del espacio arrendable',
    example: EstadoEspacio.DISPONIBLE,
    enum: EstadoEspacio,
  })
  @IsEnum(EstadoEspacio, {
    message: 'El estado debe ser uno de los valores válidos',
  })
  @IsNotEmpty({ message: 'El estado es obligatorio' })
  estado: EstadoEspacio;

  @ApiPropertyOptional({
    description: 'Tarifa mensual del espacio',
    example: 800.0,
    type: Number,
  })
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsDecimal(
    { decimal_digits: '1,2' },
    { message: 'La tarifa mensual debe ser un número decimal válido' },
  )
  tarifaMensual?: number;

  @ApiProperty({
    description: 'ID del tipo de espacio',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsUUID('4', { message: 'El ID del tipo de espacio debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El ID del tipo de espacio es obligatorio' })
  idTipoEspacio: string;
}

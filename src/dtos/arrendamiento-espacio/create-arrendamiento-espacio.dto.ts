import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsOptional,
  IsDateString,
  IsDecimal,
} from 'class-validator';

export class CreateArrendamientoEspacioDto {
  @ApiProperty({
    description: 'Fecha de inicio del arrendamiento',
    example: '2024-01-15',
    type: String,
  })
  @IsDateString({}, { message: 'La fecha de inicio debe ser una fecha válida' })
  @IsNotEmpty({ message: 'La fecha de inicio es obligatoria' })
  fechaInicio: string;

  @ApiPropertyOptional({
    description: 'Fecha de fin del arrendamiento',
    example: '2024-12-15',
    type: String,
  })
  @IsDateString({}, { message: 'La fecha de fin debe ser una fecha válida' })
  @IsOptional()
  fechaFin?: string;

  @ApiProperty({
    description: 'Monto mensual del arrendamiento',
    example: '2500.00',
    type: String,
  })
  @IsString({ message: 'El monto mensual debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El monto mensual es obligatorio' })
  montoMensual: string;

  @ApiPropertyOptional({
    description: 'Depósito del arrendamiento',
    example: '5000.00',
    type: String,
  })
  @IsString({ message: 'El depósito debe ser una cadena de texto' })
  @IsOptional()
  deposito?: string;

  @ApiProperty({
    description: 'Estado del arrendamiento',
    example: 'ACTIVO',
    enum: ['ACTIVO', 'INACTIVO', 'VENCIDO', 'TERMINADO'],
  })
  @IsString({ message: 'El estado debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El estado es obligatorio' })
  estado: string;

  @ApiPropertyOptional({
    description: 'Observaciones del arrendamiento',
    example: 'Contrato con opción a renovación automática',
  })
  @IsString({ message: 'Las observaciones deben ser una cadena de texto' })
  @IsOptional()
  observaciones?: string;

  @ApiProperty({
    description: 'ID del arrendatario',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID('4', { message: 'El ID del arrendatario debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El ID del arrendatario es obligatorio' })
  idArrendatario: string;

  @ApiProperty({
    description: 'ID del espacio arrendable',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID('4', { message: 'El ID del espacio debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El ID del espacio es obligatorio' })
  idEspacio: string;
}

import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsNumber,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateResidenciaDto {
  @ApiProperty({
    description: 'Fecha de inicio de la residencia',
    example: '2024-01-15',
    type: 'string',
    format: 'date',
  })
  @IsDateString()
  @IsNotEmpty()
  fechaInicio: string;

  @ApiProperty({
    description: 'Fecha de fin de la residencia (opcional)',
    example: '2024-12-31',
    type: 'string',
    format: 'date',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  fechaFin?: string;

  @ApiProperty({
    description: 'Monto de alquiler mensual',
    example: 1500.0,
    type: 'number',
    format: 'decimal',
    required: false,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  montoAlquiler?: number;

  @ApiProperty({
    description: 'Depósito de garantía',
    example: 3000.0,
    type: 'number',
    format: 'decimal',
    required: false,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  deposito?: number;

  @ApiProperty({
    description: 'Tipo de ocupación de la residencia',
    example: 'alquiler',
    enum: ['propietario', 'alquiler', 'invitado', 'familiar'],
  })
  @IsString()
  @IsNotEmpty()
  tipoOcupacion: string;

  @ApiProperty({
    description: 'Estado actual de la residencia',
    example: 'activa',
    enum: ['activa', 'inactiva', 'suspendida', 'finalizada'],
  })
  @IsString()
  @IsNotEmpty()
  estado: string;

  @ApiProperty({
    description: 'URL del contrato de residencia (opcional)',
    example: 'https://example.com/contrato.pdf',
    required: false,
  })
  @IsOptional()
  @IsString()
  contratoUrl?: string;

  @ApiProperty({
    description: 'UUID de la propiedad asociada',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  idPropiedad: string;

  @ApiProperty({
    description: 'UUID del propietario asociado',
    example: '123e4567-e89b-12d3-a456-426614174001',
    format: 'uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  idPropietario: string;

  @ApiProperty({
    description: 'UUID del residente asociado',
    example: '123e4567-e89b-12d3-a456-426614174002',
    format: 'uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  idResidente: string;
}

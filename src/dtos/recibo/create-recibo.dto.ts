import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateReciboDto {
  @ApiProperty({
    description: 'Número único del recibo',
    example: 'REC-2025-001',
    maxLength: 50,
    minLength: 3,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  numeroRecibo: string;

  @ApiProperty({
    description: 'URL del archivo PDF del recibo',
    example: 'https://storage.example.com/recibos/rec-001.pdf',
    required: false,
  })
  @IsOptional()
  @IsString()
  archivoPdfUrl?: string;

  @ApiProperty({
    description: 'ID del pago asociado al recibo',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  idPago: string;
}

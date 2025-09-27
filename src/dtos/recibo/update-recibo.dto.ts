import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID, MaxLength, MinLength } from 'class-validator';

export class UpdateReciboDto {
  @ApiPropertyOptional({
    description: 'Número único del recibo',
    example: 'REC-2025-001-UPD',
    maxLength: 50,
    minLength: 3,
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  numeroRecibo?: string;

  @ApiPropertyOptional({
    description: 'URL del archivo PDF del recibo',
    example: 'https://storage.example.com/recibos/rec-001-updated.pdf',
  })
  @IsOptional()
  @IsString()
  archivoPdfUrl?: string;

  @ApiPropertyOptional({
    description: 'ID del pago asociado al recibo',
    example: '987e6543-e21b-34d5-a678-542316789abc',
  })
  @IsOptional()
  @IsUUID()
  idPago?: string;
}
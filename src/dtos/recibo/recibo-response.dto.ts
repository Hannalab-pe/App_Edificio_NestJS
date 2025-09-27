import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ReciboResponseDto {
  @ApiProperty({
    description: 'ID único del recibo',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  idRecibo: string;

  @ApiProperty({
    description: 'Número único del recibo',
    example: 'REC-2025-001',
  })
  numeroRecibo: string;

  @ApiPropertyOptional({
    description: 'URL del archivo PDF del recibo',
    example: 'https://storage.example.com/recibos/rec-001.pdf',
  })
  archivoPdfUrl: string | null;

  @ApiPropertyOptional({
    description: 'Información del pago asociado',
  })
  idPago?: {
    idPago: string;
    monto: number;
    fechaPago: string | null;
    estado: string;
  };
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EstadoPago, MetodoPago } from 'src/Enums/globales.enum';

export class PagoResponseDto {
  @ApiProperty({
    description: 'ID único del pago',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  idPago: string;

  @ApiProperty({
    description: 'Monto del pago',
    example: 350.75,
    type: Number,
  })
  monto: number;

  @ApiProperty({
    description: 'Fecha de vencimiento del pago',
    example: '2025-10-15',
    type: String,
    format: 'date',
  })
  fechaVencimiento: string;

  @ApiPropertyOptional({
    description: 'Fecha en que se realizó el pago',
    example: '2025-10-10',
    type: String,
    format: 'date',
  })
  fechaPago: string | null;

  @ApiProperty({
    description: 'Estado del pago',
    example: EstadoPago.PENDIENTE,
    enum: EstadoPago,
  })
  estado: EstadoPago;

  @ApiPropertyOptional({
    description: 'Descripción del pago',
    example: 'Pago de mantenimiento del mes de octubre',
    type: String,
  })
  descripcion: string | null;

  @ApiPropertyOptional({
    description: 'URL del comprobante de pago',
    example: 'https://ejemplo.com/comprobantes/pago-001.pdf',
    type: String,
  })
  comprobanteUrl: string | null;

  @ApiPropertyOptional({
    description: 'Método de pago utilizado',
    example: MetodoPago.TRANSFERENCIA,
    enum: MetodoPago,
  })
  metodoPago: MetodoPago | null;

  @ApiPropertyOptional({
    description: 'Referencia del pago (número de transacción, etc.)',
    example: 'TXN-20250923-001',
    type: String,
  })
  referenciaPago: string | null;

  @ApiPropertyOptional({
    description: 'ID de la residencia asociada',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  idResidencia?: string;

  @ApiPropertyOptional({
    description: 'ID del arrendamiento asociado',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  idArrendamiento?: string;

  @ApiPropertyOptional({
    description: 'ID del concepto de pago asociado',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  idConceptoPago?: string;

  @ApiPropertyOptional({
    description: 'Información del concepto de pago',
    type: Object,
  })
  conceptoPago?: {
    idConceptoPago: string;
    nombre: string;
    descripcion?: string;
    monto?: number;
  };

  @ApiPropertyOptional({
    description: 'Información de la residencia',
    type: Object,
  })
  residencia?: {
    idResidencia: string;
    numero: string;
    piso?: string;
  };

  @ApiPropertyOptional({
    description: 'Información del arrendamiento',
    type: Object,
  })
  arrendamiento?: {
    idArrendamiento: string;
    fechaInicio: string;
    fechaFin: string;
  };
}
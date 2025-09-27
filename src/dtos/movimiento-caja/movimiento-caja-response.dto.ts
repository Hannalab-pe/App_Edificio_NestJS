import { ApiProperty } from '@nestjs/swagger';

export class MovimientoCajaResponseDto {
    @ApiProperty({
        description: 'ID único del movimiento',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    idMovimiento: string;

    @ApiProperty({
        description: 'Tipo de movimiento',
        example: 'INGRESO',
    })
    tipo: string;

    @ApiProperty({
        description: 'Concepto del movimiento',
        example: 'Pago de alquiler - Local 101',
    })
    concepto: string;

    @ApiProperty({
        description: 'Monto del movimiento',
        example: 250.00,
    })
    monto: number;

    @ApiProperty({
        description: 'Fecha y hora del movimiento',
        example: '2025-09-26T10:30:00.000Z',
        nullable: true,
    })
    fechaMovimiento: Date | null;

    @ApiProperty({
        description: 'URL del comprobante',
        example: 'https://storage.com/comprobante-001.pdf',
        nullable: true,
    })
    comprobanteUrl: string | null;

    @ApiProperty({
        description: 'Descripción detallada',
        example: 'Pago recibido en efectivo por arrendatario Juan Pérez',
        nullable: true,
    })
    descripcion: string | null;

    @ApiProperty({
        description: 'Información de la caja asociada',
        type: 'object',
        properties: {
            idCaja: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174001' },
            numeroCaja: { type: 'string', example: 'CAJA-001-20250926' },
            estado: { type: 'boolean', example: true },
        },
    })
    idCaja?: {
        idCaja: string;
        numeroCaja: string | null;
        estado: boolean;
    };

    @ApiProperty({
        description: 'Información del pago asociado (si aplica)',
        type: 'object',
        properties: {
            idPago: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174002' },
            monto: { type: 'number', example: 250.00 },
            estado: { type: 'string', example: 'PAGADO' },
            fechaPago: { type: 'string', example: '2025-09-26' },
        },
        nullable: true,
    })
    idPago?: {
        idPago: string;
        monto: number;
        estado: string;
        fechaPago: string | null;
    } | null;
}
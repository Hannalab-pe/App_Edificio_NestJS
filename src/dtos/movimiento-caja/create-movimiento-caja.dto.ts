import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsUUID,
    IsDecimal,
    IsOptional,
    IsString,
    IsEnum,
    Min,
} from 'class-validator';
import { Transform } from 'class-transformer';

export enum TipoMovimiento {
    INGRESO = 'INGRESO',
    EGRESO = 'EGRESO',
    AJUSTE = 'AJUSTE',
}

export class CreateMovimientoCajaDto {
    @ApiProperty({
        description: 'Tipo de movimiento',
        example: TipoMovimiento.INGRESO,
        enum: TipoMovimiento,
    })
    @IsEnum(TipoMovimiento, {
        message: 'El tipo debe ser INGRESO, EGRESO o AJUSTE',
    })
    @IsNotEmpty({ message: 'El tipo de movimiento es obligatorio' })
    tipo: TipoMovimiento;

    @ApiProperty({
        description: 'Concepto del movimiento',
        example: 'Pago de alquiler - Local 101',
        type: String,
    })
    @IsString({ message: 'El concepto debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'El concepto es obligatorio' })
    concepto: string;

    @ApiProperty({
        description: 'Monto del movimiento',
        example: 250.00,
        type: Number,
    })
    @IsNotEmpty({ message: 'El monto es obligatorio' })
    @Transform(({ value }) => parseFloat(value))
    @IsDecimal(
        { decimal_digits: '1,2' },
        { message: 'El monto debe ser un número decimal válido' },
    )
    @Min(0.01, { message: 'El monto debe ser mayor a 0' })
    monto: number;

    @ApiProperty({
        description: 'ID de la caja donde se registra el movimiento',
        example: '123e4567-e89b-12d3-a456-426614174000',
        type: String,
    })
    @IsUUID('4', { message: 'El ID de la caja debe ser un UUID válido' })
    @IsNotEmpty({ message: 'El ID de la caja es obligatorio' })
    idCaja: string;

    @ApiPropertyOptional({
        description: 'Descripción detallada del movimiento',
        example: 'Pago recibido en efectivo por arrendatario Juan Pérez',
        type: String,
    })
    @IsOptional()
    @IsString({ message: 'La descripción debe ser una cadena de texto' })
    descripcion?: string;

    @ApiPropertyOptional({
        description: 'URL del comprobante asociado',
        example: 'https://storage.com/comprobante-001.pdf',
        type: String,
    })
    @IsOptional()
    @IsString({ message: 'La URL del comprobante debe ser una cadena de texto' })
    comprobanteUrl?: string;

    @ApiPropertyOptional({
        description: 'ID del pago asociado (si aplica)',
        example: '123e4567-e89b-12d3-a456-426614174001',
        type: String,
    })
    @IsOptional()
    @IsUUID('4', { message: 'El ID del pago debe ser un UUID válido' })
    idPago?: string;
}
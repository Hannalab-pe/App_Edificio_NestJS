import { ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsOptional,
    IsDecimal,
    IsString,
    IsEnum,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { TipoMovimiento } from './create-movimiento-caja.dto';

export class UpdateMovimientoCajaDto {
    @ApiPropertyOptional({
        description: 'Tipo de movimiento',
        example: TipoMovimiento.AJUSTE,
        enum: TipoMovimiento,
    })
    @IsOptional()
    @IsEnum(TipoMovimiento, {
        message: 'El tipo debe ser INGRESO, EGRESO o AJUSTE',
    })
    tipo?: TipoMovimiento;

    @ApiPropertyOptional({
        description: 'Concepto del movimiento',
        example: 'Ajuste por diferencia de caja',
        type: String,
    })
    @IsOptional()
    @IsString({ message: 'El concepto debe ser una cadena de texto' })
    concepto?: string;

    @ApiPropertyOptional({
        description: 'Monto del movimiento',
        example: 10.50,
        type: Number,
    })
    @IsOptional()
    @Transform(({ value }) => parseFloat(value))
    @IsDecimal(
        { decimal_digits: '1,2' },
        { message: 'El monto debe ser un número decimal válido' },
    )
    monto?: number;

    @ApiPropertyOptional({
        description: 'Descripción detallada del movimiento',
        example: 'Movimiento corregido por error de captura',
        type: String,
    })
    @IsOptional()
    @IsString({ message: 'La descripción debe ser una cadena de texto' })
    descripcion?: string;

    @ApiPropertyOptional({
        description: 'URL del comprobante asociado',
        example: 'https://storage.com/comprobante-corregido-001.pdf',
        type: String,
    })
    @IsOptional()
    @IsString({ message: 'La URL del comprobante debe ser una cadena de texto' })
    comprobanteUrl?: string;
}
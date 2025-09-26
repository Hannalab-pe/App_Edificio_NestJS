import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsDecimal,
    IsOptional,
    IsString,
    Min,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CierreCajaDto {
    @ApiProperty({
        description: 'Monto final real contado en la caja',
        example: 750.50,
        type: Number,
    })
    @IsNotEmpty({ message: 'El monto final es obligatorio' })
    @Transform(({ value }) => parseFloat(value))
    @IsDecimal(
        { decimal_digits: '1,2' },
        { message: 'El monto final debe ser un número decimal válido' },
    )
    @Min(0, { message: 'El monto final debe ser mayor o igual a 0' })
    montoFinalReal: number;

    @ApiPropertyOptional({
        description: 'Observaciones del cierre de caja',
        example: 'Cierre normal - sin novedades',
        type: String,
    })
    @IsOptional()
    @IsString({ message: 'Las observaciones deben ser una cadena de texto' })
    observaciones?: string;
}
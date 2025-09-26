import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsUUID,
    IsDecimal,
    IsOptional,
    IsString,
    Min,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class AperturaCajaDto {
    @ApiProperty({
        description: 'Monto inicial con el que se abre la caja',
        example: 500.00,
        type: Number,
    })
    @IsNotEmpty({ message: 'El monto inicial es obligatorio' })
    @Transform(({ value }) => parseFloat(value))
    @IsDecimal(
        { decimal_digits: '1,2' },
        { message: 'El monto inicial debe ser un número decimal válido' },
    )
    @Min(0.01, { message: 'El monto inicial debe ser mayor a 0' })
    montoInicial: number;

    @ApiPropertyOptional({
        description: 'Descripción para la apertura de caja',
        example: 'Apertura de caja turno mañana - 26/09/2025',
        type: String,
    })
    @IsOptional()
    @IsString({ message: 'La descripción debe ser una cadena de texto' })
    descripcion?: string;
}
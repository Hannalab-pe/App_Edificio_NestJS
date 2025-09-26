import { ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsOptional,
    IsDecimal,
    IsString,
    IsBoolean,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateCajaDto {
    @ApiPropertyOptional({
        description: 'Monto final real de la caja (para cierre)',
        example: 750.50,
        type: Number,
    })
    @IsOptional()
    @Transform(({ value }) => parseFloat(value))
    @IsDecimal(
        { decimal_digits: '1,2' },
        { message: 'El monto final debe ser un número decimal válido' },
    )
    montoFinal?: number;

    @ApiPropertyOptional({
        description: 'Estado de la caja (true=abierta, false=cerrada)',
        example: false,
        type: Boolean,
    })
    @IsOptional()
    @IsBoolean({ message: 'El estado debe ser un valor booleano' })
    estado?: boolean;

    @ApiPropertyOptional({
        description: 'Descripción del cierre de caja',
        example: 'Cierre normal - turno completado',
        type: String,
    })
    @IsOptional()
    @IsString({ message: 'La descripción debe ser una cadena de texto' })
    descripcion?: string;

    @ApiPropertyOptional({
        description: 'Fecha de fin de la caja (se asigna automáticamente al cerrar)',
        example: '2025-09-26',
        type: String,
    })
    @IsOptional()
    @IsString({ message: 'La fecha de fin debe ser una cadena de texto' })
    fechaFin?: string;
}
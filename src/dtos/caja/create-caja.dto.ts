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

export class CreateCajaDto {
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
    @Min(0, { message: 'El monto inicial debe ser mayor o igual a 0' })
    montoInicial: number;

    @ApiProperty({
        description: 'ID del trabajador que manejará la caja',
        example: '123e4567-e89b-12d3-a456-426614174000',
        type: String,
    })
    @IsUUID('4', { message: 'El ID del trabajador debe ser un UUID válido' })
    @IsNotEmpty({ message: 'El ID del trabajador es obligatorio' })
    idTrabajador: string;

    @ApiPropertyOptional({
        description: 'Descripción opcional para la apertura de caja',
        example: 'Apertura de caja turno mañana',
        type: String,
    })
    @IsOptional()
    @IsString({ message: 'La descripción debe ser una cadena de texto' })
    descripcion?: string;

    @ApiPropertyOptional({
        description: 'Número de caja específico (se genera automáticamente si no se proporciona)',
        example: 'CAJA-001-20250926',
        type: String,
    })
    @IsOptional()
    @IsString({ message: 'El número de caja debe ser una cadena de texto' })
    numeroCaja?: string;
}
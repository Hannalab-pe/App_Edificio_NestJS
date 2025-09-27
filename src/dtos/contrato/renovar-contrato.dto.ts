import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsDateString,
    IsDecimal,
    IsOptional,
    Min,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class RenovarContratoDto {
    @ApiProperty({
        description: 'Nueva fecha de fin del contrato',
        example: '2027-09-30',
        type: String,
        format: 'date',
    })
    @IsDateString({}, { message: 'La nueva fecha de fin debe ser una fecha válida' })
    @IsNotEmpty({ message: 'La nueva fecha de fin es obligatoria' })
    nuevaFechaFin: string;

    @ApiPropertyOptional({
        description: 'Nueva remuneración para el contrato renovado',
        example: 2800.75,
        type: Number,
    })
    @IsOptional()
    @Transform(({ value }) => parseFloat(value))
    @IsDecimal(
        { decimal_digits: '1,2' },
        { message: 'La remuneración debe ser un número decimal válido' }
    )
    @Min(0.01, { message: 'La remuneración debe ser mayor a 0' })
    nuevaRemuneracion?: number;
}
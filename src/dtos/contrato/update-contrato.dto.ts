import { ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsOptional,
    IsDateString,
    IsDecimal,
    IsUrl,
    Min,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateContratoDto {
    @ApiPropertyOptional({
        description: 'Nueva fecha de fin del contrato',
        example: '2027-09-30',
        type: String,
        format: 'date',
    })
    @IsOptional()
    @IsDateString({}, { message: 'La fecha de fin debe ser una fecha válida' })
    fechaFin?: string;

    @ApiPropertyOptional({
        description: 'Nueva remuneración del contrato',
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
    remuneracion?: number;

    @ApiPropertyOptional({
        description: 'Nueva URL del documento del contrato',
        example: 'https://storage.com/contratos/contrato-actualizado-001.pdf',
        type: String,
    })
    @IsOptional()
    @IsUrl({}, { message: 'Debe ser una URL válida' })
    documentourl?: string;
}
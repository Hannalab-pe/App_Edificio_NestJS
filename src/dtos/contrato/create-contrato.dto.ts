import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsString,
    IsUUID,
    IsDecimal,
    IsDateString,
    IsUrl,
    Min,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateContratoDto {
    @ApiProperty({
        description: 'ID del trabajador al que se le asignará el contrato',
        example: '123e4567-e89b-12d3-a456-426614174000',
        type: String,
    })
    @IsUUID('4', { message: 'El ID del trabajador debe ser un UUID válido' })
    @IsNotEmpty({ message: 'El ID del trabajador es obligatorio' })
    idTrabajador: string;

    @ApiProperty({
        description: 'ID del tipo de contrato',
        example: '123e4567-e89b-12d3-a456-426614174001',
        type: String,
    })
    @IsUUID('4', { message: 'El ID del tipo de contrato debe ser un UUID válido' })
    @IsNotEmpty({ message: 'El ID del tipo de contrato es obligatorio' })
    idTipoContrato: string;

    @ApiProperty({
        description: 'Fecha de inicio del contrato',
        example: '2025-10-01',
        type: String,
        format: 'date',
    })
    @IsDateString({}, { message: 'La fecha de inicio debe ser una fecha válida' })
    @IsNotEmpty({ message: 'La fecha de inicio es obligatoria' })
    fechaInicio: string;

    @ApiProperty({
        description: 'Fecha de fin del contrato',
        example: '2026-09-30',
        type: String,
        format: 'date',
    })
    @IsDateString({}, { message: 'La fecha de fin debe ser una fecha válida' })
    @IsNotEmpty({ message: 'La fecha de fin es obligatoria' })
    fechaFin: string;

    @ApiProperty({
        description: 'URL del documento del contrato',
        example: 'https://storage.com/contratos/contrato-001.pdf',
        type: String,
    })
    @IsUrl({}, { message: 'Debe ser una URL válida' })
    @IsNotEmpty({ message: 'La URL del documento es obligatoria' })
    documentourl: string;
}
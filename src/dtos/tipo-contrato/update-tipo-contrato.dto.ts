import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateTipoContratoDto {
    @ApiPropertyOptional({
        description: 'Nombre del tipo de contrato',
        example: 'Contrato de Servicios',
        type: String,
    })
    @IsOptional()
    @IsString({ message: 'El nombre debe ser una cadena de texto' })
    nombre?: string;

    @ApiPropertyOptional({
        description: 'Descripción del tipo de contrato',
        example: 'Contrato para la prestación de servicios especializados',
        type: String,
    })
    @IsOptional()
    @IsString({ message: 'La descripción debe ser una cadena de texto' })
    descripcion?: string;
}
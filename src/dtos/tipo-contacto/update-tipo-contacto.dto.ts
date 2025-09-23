import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateTipoContactoDto {
    @ApiPropertyOptional({
        description: 'Nombre del tipo de contacto',
        example: 'Teléfono móvil',
        type: String,
    })
    @IsOptional()
    @IsString({ message: 'El nombre debe ser una cadena de texto' })
    nombre?: string;

    @ApiPropertyOptional({
        description: 'Descripción del tipo de contacto',
        example: 'Número de teléfono móvil personal',
        type: String,
    })
    @IsOptional()
    @IsString({ message: 'La descripción debe ser una cadena de texto' })
    descripcion?: string;
}
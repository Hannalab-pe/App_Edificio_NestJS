import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateTipoContratoDto {
    @ApiProperty({
        description: 'Nombre del tipo de contrato',
        example: 'Contrato de Arrendamiento',
        type: String,
    })
    @IsString({ message: 'El nombre debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    nombre: string;

    @ApiPropertyOptional({
        description: 'Descripción del tipo de contrato',
        example: 'Contrato para el arrendamiento de espacios comunes',
        type: String,
    })
    @IsOptional()
    @IsString({ message: 'La descripción debe ser una cadena de texto' })
    descripcion?: string;
}
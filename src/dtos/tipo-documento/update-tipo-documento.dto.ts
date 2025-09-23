import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateTipoDocumentoDto {
    @ApiPropertyOptional({
        description: 'Nombre del tipo de documento',
        example: 'Contrato de Arrendamiento',
        type: String,
    })
    @IsOptional()
    @IsString({ message: 'El tipo de documento debe ser una cadena de texto' })
    tipoDocumento?: string;

    @ApiPropertyOptional({
        description: 'Descripción del tipo de documento',
        example: 'Documentos relacionados con contratos de arrendamiento de espacios',
        type: String,
    })
    @IsOptional()
    @IsString({ message: 'La descripción debe ser una cadena de texto' })
    descripcion?: string;
}
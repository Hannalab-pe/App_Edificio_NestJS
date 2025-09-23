import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTipoDocumentoDto {
    @ApiProperty({
        description: 'Nombre del tipo de documento',
        example: 'Contrato de Arrendamiento',
        type: String,
    })
    @IsString({ message: 'El tipo de documento debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'El tipo de documento es obligatorio' })
    tipoDocumento: string;

    @ApiProperty({
        description: 'Descripción del tipo de documento',
        example: 'Documentos relacionados con contratos de arrendamiento de espacios',
        type: String,
    })
    @IsString({ message: 'La descripción debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'La descripción es obligatoria' })
    descripcion: string;
}
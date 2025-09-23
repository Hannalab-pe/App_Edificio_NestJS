import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, IsUrl } from 'class-validator';

export class CreateDocumentoDto {
    @ApiProperty({
        description: 'URL donde se encuentra almacenado el documento',
        example: 'https://storage.example.com/documents/doc-123.pdf',
        type: String,
    })
    @IsUrl({}, { message: 'La URL del documento debe ser una URL válida' })
    @IsNotEmpty({ message: 'La URL del documento es obligatoria' })
    urlDocumento: string;

    @ApiProperty({
        description: 'Descripción del documento',
        example: 'Contrato de arrendamiento firmado',
        type: String,
    })
    @IsString({ message: 'La descripción debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'La descripción es obligatoria' })
    descripcion: string;

    @ApiProperty({
        description: 'ID del tipo de documento',
        example: '123e4567-e89b-12d3-a456-426614174000',
        type: String,
    })
    @IsUUID('4', { message: 'El ID del tipo de documento debe ser un UUID válido' })
    @IsNotEmpty({ message: 'El ID del tipo de documento es obligatorio' })
    idTipoDocumento: string;

    @ApiProperty({
        description: 'ID del trabajador que gestiona el documento',
        example: '123e4567-e89b-12d3-a456-426614174000',
        type: String,
    })
    @IsUUID('4', { message: 'El ID del trabajador debe ser un UUID válido' })
    @IsNotEmpty({ message: 'El ID del trabajador es obligatorio' })
    idTrabajador: string;
}
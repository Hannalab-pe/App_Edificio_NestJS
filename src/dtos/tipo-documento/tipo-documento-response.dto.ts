import { ApiProperty } from '@nestjs/swagger';

export class TipoDocumentoResponseDto {
    @ApiProperty({
        description: 'ID único del tipo de documento',
        example: '550e8400-e29b-41d4-a716-446655440000',
        type: String,
    })
    idTipoDocumento: string;

    @ApiProperty({
        description: 'Nombre del tipo de documento',
        example: 'Contrato de Arrendamiento',
        type: String,
    })
    tipoDocumento: string;

    @ApiProperty({
        description: 'Descripción del tipo de documento',
        example: 'Documentos relacionados con contratos de arrendamiento de espacios',
        type: String,
    })
    descripcion: string;
}
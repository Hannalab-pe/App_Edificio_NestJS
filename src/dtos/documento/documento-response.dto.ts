import { ApiProperty } from '@nestjs/swagger';

export class TipoDocumentoInfoDto {
    @ApiProperty({
        description: 'ID del tipo de documento',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    idTipoDocumento: string;

    @ApiProperty({
        description: 'Nombre del tipo de documento',
        example: 'Contrato de Trabajo',
    })
    tipoDocumento: string;

    @ApiProperty({
        description: 'Descripción del tipo de documento',
        example: 'Contrato laboral entre empresa y trabajador',
    })
    descripcion: string;
}

export class TrabajadorInfoDto {
    @ApiProperty({
        description: 'ID del trabajador',
        example: '123e4567-e89b-12d3-a456-426614174001',
    })
    idTrabajador: string;

    @ApiProperty({
        description: 'Nombre completo del trabajador',
        example: 'Juan Pérez González',
    })
    nombreCompleto: string;

    @ApiProperty({
        description: 'Correo electrónico del trabajador',
        example: 'juan.perez@empresa.com',
    })
    correo: string;
}

export class DocumentoResponseDto {
    @ApiProperty({
        description: 'ID único del documento',
        example: '123e4567-e89b-12d3-a456-426614174002',
    })
    idDocumento: string;

    @ApiProperty({
        description: 'URL del documento almacenado',
        example: 'https://storage.example.com/documents/doc-123.pdf',
    })
    urlDocumento: string;

    @ApiProperty({
        description: 'Descripción del documento',
        example: 'Contrato de trabajo firmado',
    })
    descripcion: string;

    @ApiProperty({
        description: 'Información del tipo de documento',
        type: TipoDocumentoInfoDto,
    })
    tipoDocumento?: TipoDocumentoInfoDto;

    @ApiProperty({
        description: 'Información del trabajador asociado',
        type: TrabajadorInfoDto,
        required: false,
    })
    trabajador?: TrabajadorInfoDto;
}
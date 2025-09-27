import { ApiProperty } from '@nestjs/swagger';

export class JuntaPropietariosResponseDto {
    @ApiProperty({
        description: 'ID único de la junta de propietarios',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    idJunta: string;

    @ApiProperty({
        description: 'Número único del acta de la junta',
        example: 'ACTA-2024-001',
    })
    numeroActa: string;

    @ApiProperty({
        description: 'Fecha de realización de la junta',
        example: '2024-09-26',
    })
    fechaJunta: string;

    @ApiProperty({
        description: 'Tipo de junta de propietarios',
        example: 'Ordinaria',
    })
    tipoJunta: string;

    @ApiProperty({
        description: 'Número de asistentes a la junta',
        example: 15,
        nullable: true,
    })
    asistentesCount: number | null;

    @ApiProperty({
        description: 'Indica si se alcanzó el quórum necesario',
        example: true,
        nullable: true,
    })
    quorumAlcanzado: boolean | null;

    @ApiProperty({
        description: 'Estado actual de la junta',
        example: 'Finalizada',
    })
    estado: string;

    @ApiProperty({
        description: 'Resumen de la junta y acuerdos tomados',
        example: 'Junta ordinaria con aprobación del presupuesto anual...',
        nullable: true,
    })
    resumen: string | null;

    @ApiProperty({
        description: 'Información del usuario que creó la junta',
        example: {
            idUsuario: '123e4567-e89b-12d3-a456-426614174000',
            correo: 'encargado@edificio.com'
        }
    })
    creadoPor: {
        idUsuario: string;
        correo: string;
    };

    @ApiProperty({
        description: 'Información del documento asociado',
        example: {
            idDocumento: '123e4567-e89b-12d3-a456-426614174001',
            urlDocumento: 'https://storage.example.com/documents/acta.pdf',
            descripcion: 'Acta de junta ordinaria',
            tipoDocumento: {
                idTipoDocumento: '123e4567-e89b-12d3-a456-426614174002',
                tipoDocumento: 'Acta de Junta',
                descripcion: 'Documento oficial de junta de propietarios'
            }
        }
    })
    documento: {
        idDocumento: string;
        urlDocumento: string;
        descripcion: string;
        tipoDocumento: {
            idTipoDocumento: string;
            tipoDocumento: string;
            descripcion: string;
        };
        trabajador: {
            idTrabajador: string;
            nombre: string;
            apellido: string;
        };
    };
}
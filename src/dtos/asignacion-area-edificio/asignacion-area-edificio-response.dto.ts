import { ApiProperty } from '@nestjs/swagger';

export class AsignacionAreaEdificioResponseDto {
    @ApiProperty({
        description: 'ID único de la asignación',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    idAsignacion: string;

    @ApiProperty({
        description: 'ID del edificio',
        example: '123e4567-e89b-12d3-a456-426614174001',
    })
    idEdificioUuid: string;

    @ApiProperty({
        description: 'ID del área común',
        example: '123e4567-e89b-12d3-a456-426614174002',
    })
    idAreaComunUuid: string;

    @ApiProperty({
        description: 'Fecha de asignación',
        example: '2023-01-01T00:00:00.000Z',
    })
    fechaAsignacion: Date;

    @ApiProperty({
        description: 'Estado activo de la asignación',
        example: true,
    })
    estaActivo: boolean;

    @ApiProperty({
        description: 'Observaciones sobre la asignación',
        example: 'Area asignada para uso exclusivo de residentes',
        nullable: true,
    })
    observaciones: string | null;

    @ApiProperty({
        description: 'Información del edificio relacionado',
        type: 'object',
        properties: {
            idEdificio: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174001' },
            nombreEdificio: { type: 'string', example: 'Torre Libertad' },
            direccion: { type: 'string', example: 'Av. Javier Prado 123' },
        },
    })
    idEdificio?: {
        idEdificio: string;
        nombreEdificio: string;
        direccion: string;
    };

    @ApiProperty({
        description: 'Información del área común relacionada',
        type: 'object',
        properties: {
            idAreaComun: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174002' },
            nombre: { type: 'string', example: 'Piscina' },
            descripcion: { type: 'string', example: 'Piscina comunitaria para adultos', nullable: true },
        },
    })
    idAreaComun?: {
        idAreaComun: string;
        nombre: string;
        descripcion: string | null;
    };
}
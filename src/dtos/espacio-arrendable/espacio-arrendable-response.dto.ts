import { ApiProperty } from '@nestjs/swagger';

export class EspacioArrendableResponseDto {
    @ApiProperty({
        description: 'ID único del espacio arrendable',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    idEspacio: string;

    @ApiProperty({
        description: 'Código único del espacio arrendable',
        example: 'ESP-001',
    })
    codigo: string;

    @ApiProperty({
        description: 'Descripción del espacio arrendable',
        example: 'Local comercial en primer piso con vista a la calle principal',
        nullable: true,
    })
    descripcion: string | null;

    @ApiProperty({
        description: 'Ubicación del espacio arrendable',
        example: 'Primer piso, ala norte',
    })
    ubicacion: string;

    @ApiProperty({
        description: 'Área en metros cuadrados',
        example: 45.5,
        nullable: true,
    })
    areaM2: number | null;

    @ApiProperty({
        description: 'Estado del espacio arrendable',
        example: 'DISPONIBLE',
    })
    estado: string;

    @ApiProperty({
        description: 'Tarifa mensual del espacio',
        example: 800.0,
        nullable: true,
    })
    tarifaMensual: number | null;

    @ApiProperty({
        description: 'Estado del espacio (activo/inactivo)',
        example: true,
        nullable: true,
    })
    estaActivo: boolean | null;

    @ApiProperty({
        description: 'Información del tipo de espacio relacionado',
        type: 'object',
        properties: {
            idTipoEspacio: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174001' },
            nombre: { type: 'string', example: 'Oficina' },
            descripcion: { type: 'string', example: 'Espacio para oficinas', nullable: true },
        },
    })
    idTipoEspacio2?: {
        idTipoEspacio: string;
        nombre: string;
        descripcion: string | null;
    };
}
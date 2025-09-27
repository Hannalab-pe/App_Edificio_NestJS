import { ApiProperty } from '@nestjs/swagger';

export class MantenimientoResponseDto {
    @ApiProperty({
        description: 'ID único del mantenimiento',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    idMantenimiento: string;

    @ApiProperty({
        description: 'Descripción detallada del mantenimiento',
        example: 'Reparación de equipos de gimnasio y mantenimiento preventivo',
        nullable: true,
    })
    descripcion: string | null;

    @ApiProperty({
        description: 'Fecha y hora de inicio del mantenimiento',
        example: '2024-09-27T08:00:00.000Z',
    })
    fechaInicio: Date;

    @ApiProperty({
        description: 'Fecha y hora de finalización del mantenimiento',
        example: '2024-09-27T17:00:00.000Z',
    })
    fechaFin: Date;

    @ApiProperty({
        description: 'Estado actual del mantenimiento',
        example: 'En Progreso',
    })
    estado: string;

    @ApiProperty({
        description: 'Información del área común donde se realiza el mantenimiento',
        example: {
            idAreaComun: '123e4567-e89b-12d3-a456-426614174001',
            nombre: 'Gimnasio',
            descripcion: 'Área de gimnasio con equipos de ejercicio',
            capacidadMaxima: 25,
            estaActivo: true
        }
    })
    areaComun: {
        idAreaComun: string;
        nombre: string;
        descripcion: string | null;
        capacidadMaxima: number;
        estaActivo: boolean;
    };

    @ApiProperty({
        description: 'Información del contacto/proveedor responsable',
        example: {
            idContacto: '123e4567-e89b-12d3-a456-426614174002',
            nombre: 'Servicios Técnicos ABC',
            descripcion: 'Empresa especializada en mantenimiento de equipos deportivos',
            correo: 'contacto@serviciotecnico.com',
            telefono: '+51987654321',
            tipoContacto: {
                idTipoContacto: '123e4567-e89b-12d3-a456-426614174003',
                tipoContacto: 'Proveedor de Servicios',
                descripcion: 'Empresas proveedoras de servicios especializados'
            }
        }
    })
    contacto: {
        idContacto: string;
        nombre: string;
        descripcion: string | null;
        correo: string | null;
        telefono: string | null;
        tipoContacto: {
            idTipoContacto: string;
            tipoContacto: string;
            descripcion: string;
        };
    };

    @ApiProperty({
        description: 'Duración calculada del mantenimiento en horas',
        example: 9,
    })
    duracionHoras?: number;

    @ApiProperty({
        description: 'Indica si el mantenimiento está actualmente en curso',
        example: true,
    })
    enCurso?: boolean;
}
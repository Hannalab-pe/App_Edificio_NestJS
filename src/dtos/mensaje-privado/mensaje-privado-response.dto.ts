import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MensajePrivadoResponseDto {
    @ApiProperty({
        description: 'ID único del mensaje',
        example: '550e8400-e29b-41d4-a716-446655440000',
        format: 'uuid',
    })
    idMensaje: string;

    @ApiProperty({
        description: 'Asunto del mensaje',
        example: 'Consulta sobre mantenimiento del edificio',
    })
    asunto: string;

    @ApiProperty({
        description: 'Contenido del mensaje',
        example: 'Estimado administrador, tengo una consulta sobre...',
    })
    contenido: string;

    @ApiProperty({
        description: 'Fecha de envío del mensaje',
        example: '2025-09-26T10:30:00Z',
        type: 'string',
        format: 'date-time',
    })
    fechaEnvio: Date;

    @ApiPropertyOptional({
        description: 'Fecha de lectura del mensaje',
        example: '2025-09-26T11:15:00Z',
        type: 'string',
        format: 'date-time',
        nullable: true,
    })
    fechaLectura: Date | null;

    @ApiProperty({
        description: 'Indica si el mensaje ha sido leído',
        example: false,
    })
    leido: boolean;

    @ApiPropertyOptional({
        description: 'URL del archivo adjunto',
        example: 'https://ejemplo.com/archivo.pdf',
        nullable: true,
    })
    archivoAdjuntoUrl: string | null;

    @ApiProperty({
        description: 'ID del usuario receptor',
        example: '550e8400-e29b-41d4-a716-446655440001',
        format: 'uuid',
    })
    receptorUsuario: string;

    @ApiProperty({
        description: 'Información del usuario emisor',
        type: 'object',
        properties: {
            idUsuario: {
                type: 'string',
                format: 'uuid',
                example: '550e8400-e29b-41d4-a716-446655440002',
            },
            correo: {
                type: 'string',
                example: 'juan.perez@ejemplo.com',
            },
        },
    })
    emisorUsuario: {
        idUsuario: string;
        correo: string;
    };

    @ApiPropertyOptional({
        description: 'Información del usuario receptor',
        type: 'object',
        properties: {
            idUsuario: {
                type: 'string',
                format: 'uuid',
                example: '550e8400-e29b-41d4-a716-446655440003',
            },
            correo: {
                type: 'string',
                example: 'maria.gonzalez@ejemplo.com',
            },
        },
        nullable: true,
    })
    receptorUsuarioInfo?: {
        idUsuario: string;
        correo: string;
    } | null;

    @ApiPropertyOptional({
        description: 'Información del mensaje padre (si es una respuesta)',
        type: 'object',
        properties: {
            idMensaje: {
                type: 'string',
                format: 'uuid',
                example: '550e8400-e29b-41d4-a716-446655440004',
            },
            asunto: {
                type: 'string',
                example: 'Mensaje original',
            },
            fechaEnvio: {
                type: 'string',
                format: 'date-time',
                example: '2025-09-25T15:20:00Z',
            },
        },
        nullable: true,
    })
    mensajePadre?: {
        idMensaje: string;
        asunto: string;
        fechaEnvio: Date;
    } | null;

    @ApiPropertyOptional({
        description: 'Lista de respuestas a este mensaje',
        type: 'array',
        items: {
            type: 'object',
            properties: {
                idMensaje: {
                    type: 'string',
                    format: 'uuid',
                },
                asunto: {
                    type: 'string',
                },
                fechaEnvio: {
                    type: 'string',
                    format: 'date-time',
                },
                leido: {
                    type: 'boolean',
                },
            },
        },
    })
    respuestas?: {
        idMensaje: string;
        asunto: string;
        fechaEnvio: Date;
        leido: boolean;
    }[];
}
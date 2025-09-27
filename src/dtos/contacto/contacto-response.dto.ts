import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// DTOs anidados para las relaciones
export class TipoContactoInfoDto {
    @ApiProperty({
        description: 'ID del tipo de contacto',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    idTipoContacto: string;

    @ApiProperty({
        description: 'Nombre del tipo de contacto',
        example: 'PROVEEDOR_SERVICIOS',
    })
    nombre: string;

    @ApiPropertyOptional({
        description: 'Descripción del tipo de contacto',
        example: 'Electricistas, plomeros, técnicos especializados',
    })
    descripcion?: string;
}

export class TipoContratoInfoDto {
    @ApiProperty({
        description: 'ID del tipo de contrato',
        example: '123e4567-e89b-12d3-a456-426614174001',
    })
    idTipoContrato: string;

    @ApiProperty({
        description: 'Nombre del tipo de contrato',
        example: 'POR_HORAS',
    })
    nombre: string;

    @ApiPropertyOptional({
        description: 'Descripción del tipo de contrato',
        example: 'Pago por tiempo trabajado',
    })
    descripcion?: string;
}

export class ContactoResponseDto {
    @ApiProperty({
        description: 'ID único del contacto',
        example: '123e4567-e89b-12d3-a456-426614174002',
    })
    idContacto: string;

    @ApiProperty({
        description: 'Nombre del contacto',
        example: 'Juan Pérez - Electricista',
    })
    nombre: string;

    @ApiPropertyOptional({
        description: 'Descripción del contacto',
        example: 'Electricista especializado en instalaciones industriales',
    })
    descripcion?: string;

    @ApiPropertyOptional({
        description: 'Correo electrónico',
        example: 'juan.electricista@email.com',
    })
    correo?: string;

    @ApiPropertyOptional({
        description: 'Teléfono de contacto',
        example: '+51 987 654 321',
    })
    telefono?: string;

    @ApiPropertyOptional({
        description: 'Dirección física',
        example: 'Av. Los Electricistas 123, Lima',
    })
    direccion?: string;

    @ApiPropertyOptional({
        description: 'URL de imagen o logo',
        example: 'https://storage.com/contacto-logo.jpg',
    })
    imagenUrl?: string;

    @ApiProperty({
        description: 'Estado activo del contacto',
        example: true,
    })
    estaActivo: boolean;

    @ApiProperty({
        description: 'Información del tipo de contacto',
        type: TipoContactoInfoDto,
    })
    tipoContacto: TipoContactoInfoDto;

    @ApiProperty({
        description: 'Información del tipo de contrato',
        type: TipoContratoInfoDto,
    })
    tipoContrato: TipoContratoInfoDto;

    @ApiPropertyOptional({
        description: 'Número de mantenimientos realizados',
        example: 5,
    })
    totalMantenimientos?: number;
}
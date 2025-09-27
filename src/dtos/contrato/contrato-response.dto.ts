import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ContratoResponseDto {
    @ApiProperty({
        description: 'ID único del contrato',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    idContrato: string;

    @ApiProperty({
        description: 'URL del documento del contrato',
        example: 'https://storage.com/contratos/contrato-001.pdf',
    })
    documentourl: string;

    @ApiProperty({
        description: 'Remuneración del contrato',
        example: 2500.50,
    })
    remuneracion: number;

    @ApiProperty({
        description: 'Fecha de inicio del contrato',
        example: '2025-10-01',
    })
    fechaInicio: string;

    @ApiProperty({
        description: 'Fecha de fin del contrato',
        example: '2026-09-30',
    })
    fechaFin: string;

    @ApiPropertyOptional({
        description: 'Fecha de renovación del contrato',
        example: '2025-09-15',
    })
    fechaRenovacion?: string;

    @ApiProperty({
        description: 'Estado de renovación del contrato',
        example: false,
    })
    estadoRenovacion: boolean;

    @ApiProperty({
        description: 'Estado lógico calculado del contrato',
        example: 'ACTIVO',
        enum: ['ACTIVO', 'VENCIDO', 'RENOVADO'],
    })
    estadoLogico: string;

    @ApiProperty({
        description: 'Indica si el contrato está actualmente activo',
        example: true,
    })
    esActivo: boolean;

    @ApiPropertyOptional({
        description: 'Información del trabajador',
    })
    trabajador?: {
        idTrabajador: string;
        nombre: string;
        apellido: string;
        dni: string;
    };

    @ApiPropertyOptional({
        description: 'Información del tipo de contrato',
    })
    tipoContrato?: {
        idTipoContrato: string;
        nombre: string;
        descripcion?: string;
    };
}
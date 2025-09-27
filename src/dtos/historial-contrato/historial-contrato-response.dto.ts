import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TipoAccionHistorial } from '../../Enums/TipoAccionHistorial';

export class ContratoInfoDto {
    @ApiProperty({
        description: 'ID del contrato',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    idContrato: string;

    @ApiProperty({
        description: 'URL del documento del contrato',
        example: 'https://documents.empresa.com/contrato-001.pdf',
    })
    documentourl: string;

    @ApiProperty({
        description: 'Remuneración del contrato',
        example: 2500.00,
    })
    remuneracion: number;

    @ApiProperty({
        description: 'Fecha de inicio del contrato',
        example: '2024-01-15',
    })
    fechaInicio: string;

    @ApiProperty({
        description: 'Fecha de fin del contrato',
        example: '2024-12-15',
    })
    fechaFin: string;

    @ApiPropertyOptional({
        description: 'Estado del contrato',
        example: 'ACTIVO',
    })
    estado?: string;
}

export class TrabajadorInfoHistorialDto {
    @ApiProperty({
        description: 'ID del trabajador',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    idTrabajador: string;

    @ApiProperty({
        description: 'Nombre completo del trabajador',
        example: 'Juan Pérez López',
    })
    nombreCompleto: string;

    @ApiProperty({
        description: 'Correo del trabajador',
        example: 'juan.perez@empresa.com',
    })
    correo: string;

    @ApiPropertyOptional({
        description: 'Salario actual del trabajador',
        example: 2500.00,
    })
    salarioActual?: number;
}

export class HistorialContratoResponseDto {
    @ApiProperty({
        description: 'ID único del registro de historial',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    idHistorialContrato: string;

    @ApiProperty({
        description: 'Fecha y hora de registro del cambio',
        example: '2024-01-15T10:30:00.000Z',
    })
    fechaRegistro: Date;

    @ApiProperty({
        description: 'Tipo de acción realizada',
        enum: TipoAccionHistorial,
        example: TipoAccionHistorial.MODIFICACION,
    })
    tipoAccion: TipoAccionHistorial;

    @ApiProperty({
        description: 'Descripción detallada de la acción',
        example: 'Se actualizó la remuneración del contrato de $2000 a $2500',
    })
    descripcionAccion: string;

    @ApiPropertyOptional({
        description: 'Estado anterior del contrato',
        example: { remuneracion: 2000, estado: 'ACTIVO' },
    })
    estadoAnterior?: any;

    @ApiPropertyOptional({
        description: 'Estado nuevo del contrato',
        example: { remuneracion: 2500, estado: 'ACTIVO' },
    })
    estadoNuevo?: any;

    @ApiPropertyOptional({
        description: 'Observaciones adicionales',
        example: 'Ajuste salarial por evaluación de desempeño',
    })
    observaciones?: string;

    @ApiPropertyOptional({
        description: 'Usuario que realizó la acción',
        example: 'admin@empresa.com',
    })
    usuarioAccion?: string;

    @ApiPropertyOptional({
        description: 'IP del usuario que realizó la acción',
        example: '192.168.1.100',
    })
    ipUsuario?: string;

    @ApiProperty({
        description: 'Información del contrato relacionado',
        type: ContratoInfoDto,
    })
    contrato: ContratoInfoDto;

    @ApiProperty({
        description: 'Información del trabajador del contrato',
        type: TrabajadorInfoHistorialDto,
    })
    trabajador: TrabajadorInfoHistorialDto;
}
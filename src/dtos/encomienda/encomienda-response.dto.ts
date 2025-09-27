import { ApiProperty } from '@nestjs/swagger';
import { EstadoEncomienda } from 'src/Enums/encomienda.enum';

export class PropiedadInfoDto {
    @ApiProperty({
        description: 'ID de la propiedad',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    idPropiedad: string;

    @ApiProperty({
        description: 'Número del departamento',
        example: '101',
    })
    numeroDepartamento: string;

    @ApiProperty({
        description: 'Tipo de propiedad',
        example: 'Departamento',
    })
    tipoPropiedad: string;

    @ApiProperty({
        description: 'Piso donde se encuentra',
        example: 1,
    })
    piso: number;
}

export class TrabajadorInfoDto {
    @ApiProperty({
        description: 'ID del trabajador',
        example: '123e4567-e89b-12d3-a456-426614174001',
    })
    idTrabajador: string;

    @ApiProperty({
        description: 'Nombre completo del trabajador',
        example: 'María González López',
    })
    nombreCompleto: string;

    @ApiProperty({
        description: 'Correo electrónico del trabajador',
        example: 'maria.gonzalez@empresa.com',
    })
    correo: string;

    @ApiProperty({
        description: 'Estado activo del trabajador',
        example: true,
    })
    estaActivo: boolean;
}

export class EncomiendaResponseDto {
    @ApiProperty({
        description: 'ID único de la encomienda',
        example: '123e4567-e89b-12d3-a456-426614174002',
    })
    idEncomienda: string;

    @ApiProperty({
        description: 'Código de seguimiento',
        example: 'ENC-2024-001',
        required: false,
    })
    codigoSeguimiento?: string;

    @ApiProperty({
        description: 'Nombre del remitente',
        example: 'Juan Pérez',
    })
    remitente: string;

    @ApiProperty({
        description: 'Empresa courier',
        example: 'Olva Courier',
        required: false,
    })
    empresaCourier?: string;

    @ApiProperty({
        description: 'Fecha de llegada',
        example: '2024-09-26T10:30:00.000Z',
        required: false,
    })
    fechaLlegada?: Date;

    @ApiProperty({
        description: 'Fecha de entrega',
        example: '2024-09-26T15:00:00.000Z',
        required: false,
    })
    fechaEntrega?: Date;

    @ApiProperty({
        description: 'Estado de la encomienda',
        example: 'PENDIENTE',
        enum: EstadoEncomienda,
    })
    estado: EstadoEncomienda;

    @ApiProperty({
        description: 'Descripción de la encomienda',
        example: 'Paquete con documentos importantes',
        required: false,
    })
    descripcion?: string;

    @ApiProperty({
        description: 'URL de la foto de evidencia',
        example: 'https://storage.example.com/encomiendas/foto-123.jpg',
        required: false,
    })
    fotoEvidenciaUrl?: string;

    @ApiProperty({
        description: 'Observaciones adicionales',
        example: 'Entregado en horario de oficina',
        required: false,
    })
    observaciones?: string;

    @ApiProperty({
        description: 'Información de la propiedad destinataria',
        type: PropiedadInfoDto,
    })
    propiedad: PropiedadInfoDto;

    @ApiProperty({
        description: 'Información del trabajador que recibe',
        type: TrabajadorInfoDto,
    })
    trabajador: TrabajadorInfoDto;
}
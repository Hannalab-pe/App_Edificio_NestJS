import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, IsOptional, IsEnum, IsUrl, IsDateString } from 'class-validator';
import { EstadoEncomienda } from 'src/Enums/encomienda.enum';


export class CreateEncomiendaDto {
    @ApiPropertyOptional({
        description: 'Código de seguimiento de la encomienda',
        example: 'TK123456789',
        type: String,
    })
    @IsOptional()
    @IsString({ message: 'El código de seguimiento debe ser una cadena de texto' })
    codigoSeguimiento?: string;

    @ApiProperty({
        description: 'Nombre del remitente',
        example: 'Juan Pérez',
        type: String,
    })
    @IsString({ message: 'El remitente debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'El remitente es obligatorio' })
    remitente: string;

    @ApiPropertyOptional({
        description: 'Empresa de courier',
        example: 'DHL',
        type: String,
    })
    @IsOptional()
    @IsString({ message: 'La empresa courier debe ser una cadena de texto' })
    empresaCourier?: string;

    @ApiPropertyOptional({
        description: 'Fecha de llegada de la encomienda',
        example: '2025-09-23T10:30:00Z',
        type: String,
        format: 'date-time',
    })
    @IsOptional()
    @IsDateString({}, { message: 'La fecha de llegada debe ser una fecha válida' })
    fechaLlegada?: string;

    @ApiProperty({
        description: 'Estado de la encomienda',
        example: EstadoEncomienda.PENDIENTE,
        enum: EstadoEncomienda,
    })
    @IsEnum(EstadoEncomienda, { message: 'El estado debe ser uno de los valores válidos' })
    @IsNotEmpty({ message: 'El estado es obligatorio' })
    estado: EstadoEncomienda;

    @ApiPropertyOptional({
        description: 'Descripción de la encomienda',
        example: 'Paquete pequeño con documentos',
        type: String,
    })
    @IsOptional()
    @IsString({ message: 'La descripción debe ser una cadena de texto' })
    descripcion?: string;

    @ApiPropertyOptional({
        description: 'URL de la foto de evidencia',
        example: 'https://storage.example.com/encomiendas/foto-123.jpg',
        type: String,
    })
    @IsOptional()
    @IsUrl({}, { message: 'La URL de la foto de evidencia debe ser una URL válida' })
    fotoEvidenciaUrl?: string;

    @ApiPropertyOptional({
        description: 'Observaciones adicionales',
        example: 'Paquete en buen estado',
        type: String,
    })
    @IsOptional()
    @IsString({ message: 'Las observaciones deben ser una cadena de texto' })
    observaciones?: string;

    @ApiProperty({
        description: 'ID de la propiedad destinataria',
        example: '123e4567-e89b-12d3-a456-426614174000',
        type: String,
    })
    @IsUUID('4', { message: 'El ID de la propiedad debe ser un UUID válido' })
    @IsNotEmpty({ message: 'El ID de la propiedad es obligatorio' })
    idPropiedad: string;

    @ApiProperty({
        description: 'ID del trabajador que recibe la encomienda',
        example: '123e4567-e89b-12d3-a456-426614174000',
        type: String,
    })
    @IsUUID('4', { message: 'El ID del trabajador debe ser un UUID válido' })
    @IsNotEmpty({ message: 'El ID del trabajador es obligatorio' })
    recibidoPorTrabajador: string;
}
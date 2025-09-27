import { ApiProperty } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsString,
    IsUUID,
    IsDateString,
    IsOptional,
    IsIn
} from 'class-validator';

export class CreateMantenimientoDto {
    @ApiProperty({
        description: 'Descripción detallada del mantenimiento requerido',
        example: 'Reparación de equipos de gimnasio y mantenimiento preventivo de aires acondicionados',
        type: String,
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'La descripción debe ser una cadena de texto' })
    descripcion?: string;

    @ApiProperty({
        description: 'Fecha y hora de inicio del mantenimiento',
        example: '2024-09-27T08:00:00.000Z',
        type: String,
    })
    @IsDateString({}, { message: 'La fecha de inicio debe ser una fecha válida en formato ISO' })
    @IsNotEmpty({ message: 'La fecha de inicio es obligatoria' })
    fechaInicio: string;

    @ApiProperty({
        description: 'Fecha y hora de finalización del mantenimiento',
        example: '2024-09-27T17:00:00.000Z',
        type: String,
    })
    @IsDateString({}, { message: 'La fecha de finalización debe ser una fecha válida en formato ISO' })
    @IsNotEmpty({ message: 'La fecha de finalización es obligatoria' })
    fechaFin: string;

    @ApiProperty({
        description: 'Estado actual del mantenimiento',
        example: 'Programado',
        enum: ['Programado', 'En Progreso', 'Completado', 'Cancelado', 'Pendiente'],
    })
    @IsIn(['Programado', 'En Progreso', 'Completado', 'Cancelado', 'Pendiente'], {
        message: 'El estado debe ser uno de: Programado, En Progreso, Completado, Cancelado, Pendiente'
    })
    @IsNotEmpty({ message: 'El estado es obligatorio' })
    estado: string;

    @ApiProperty({
        description: 'ID del área común donde se realizará el mantenimiento',
        example: '123e4567-e89b-12d3-a456-426614174000',
        type: String,
    })
    @IsUUID('4', { message: 'El ID del área común debe ser un UUID válido' })
    @IsNotEmpty({ message: 'El ID del área común es obligatorio' })
    idAreaComun: string;

    @ApiProperty({
        description: 'ID del contacto/proveedor responsable del mantenimiento',
        example: '123e4567-e89b-12d3-a456-426614174001',
        type: String,
    })
    @IsUUID('4', { message: 'El ID del contacto debe ser un UUID válido' })
    @IsNotEmpty({ message: 'El ID del contacto es obligatorio' })
    idContacto: string;
}
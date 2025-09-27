import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateMantenimientoDto } from './create-mantenimiento.dto';
import {
    IsOptional,
    IsString,
    IsUUID,
    IsDateString,
    IsIn
} from 'class-validator';

export class UpdateMantenimientoDto extends PartialType(CreateMantenimientoDto) {
    @ApiProperty({
        description: 'Descripción detallada del mantenimiento requerido',
        example: 'Reparación de equipos de gimnasio completada - Se requiere mantenimiento adicional en vestuarios',
        type: String,
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'La descripción debe ser una cadena de texto' })
    descripcion?: string;

    @ApiProperty({
        description: 'Nueva fecha y hora de inicio del mantenimiento',
        example: '2024-09-28T08:00:00.000Z',
        type: String,
        required: false,
    })
    @IsOptional()
    @IsDateString({}, { message: 'La fecha de inicio debe ser una fecha válida en formato ISO' })
    fechaInicio?: string;

    @ApiProperty({
        description: 'Nueva fecha y hora de finalización del mantenimiento',
        example: '2024-09-28T17:00:00.000Z',
        type: String,
        required: false,
    })
    @IsOptional()
    @IsDateString({}, { message: 'La fecha de finalización debe ser una fecha válida en formato ISO' })
    fechaFin?: string;

    @ApiProperty({
        description: 'Nuevo estado del mantenimiento',
        example: 'En Progreso',
        enum: ['Programado', 'En Progreso', 'Completado', 'Cancelado', 'Pendiente'],
        required: false,
    })
    @IsOptional()
    @IsIn(['Programado', 'En Progreso', 'Completado', 'Cancelado', 'Pendiente'], {
        message: 'El estado debe ser uno de: Programado, En Progreso, Completado, Cancelado, Pendiente'
    })
    estado?: string;

    @ApiProperty({
        description: 'Nuevo ID del área común (si se cambia la ubicación)',
        example: '123e4567-e89b-12d3-a456-426614174002',
        type: String,
        required: false,
    })
    @IsOptional()
    @IsUUID('4', { message: 'El ID del área común debe ser un UUID válido' })
    idAreaComun?: string;

    @ApiProperty({
        description: 'Nuevo ID del contacto/proveedor responsable (si se reasigna)',
        example: '123e4567-e89b-12d3-a456-426614174003',
        type: String,
        required: false,
    })
    @IsOptional()
    @IsUUID('4', { message: 'El ID del contacto debe ser un UUID válido' })
    idContacto?: string;
}
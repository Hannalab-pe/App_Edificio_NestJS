import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsUUID, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { EstadoIncidencia, PrioridadIncidencia } from 'src/Enums/inicidencias.enum';

export class UpdateIncidenciaDto {
    @ApiPropertyOptional({
        description: 'Título de la incidencia',
        example: 'Problema con el ascensor',
        type: String,
    })
    @IsOptional()
    @IsString({ message: 'El título debe ser una cadena de texto' })
    titulo?: string;

    @ApiPropertyOptional({
        description: 'Descripción detallada de la incidencia',
        example: 'El ascensor del primer piso no está funcionando correctamente',
        type: String,
    })
    @IsOptional()
    @IsString({ message: 'La descripción debe ser una cadena de texto' })
    descripcion?: string;

    @ApiPropertyOptional({
        description: 'Estado de la incidencia',
        example: EstadoIncidencia.EN_PROCESO,
        enum: EstadoIncidencia,
    })
    @IsOptional()
    @IsEnum(EstadoIncidencia, { message: 'El estado debe ser uno de los valores válidos' })
    estado?: EstadoIncidencia;

    @ApiPropertyOptional({
        description: 'Prioridad de la incidencia',
        example: PrioridadIncidencia.ALTA,
        enum: PrioridadIncidencia,
    })
    @IsOptional()
    @IsEnum(PrioridadIncidencia, { message: 'La prioridad debe ser uno de los valores válidos' })
    prioridad?: PrioridadIncidencia;

    @ApiPropertyOptional({
        description: 'Ubicación donde ocurrió la incidencia',
        example: 'Primer piso, ascensor principal',
        type: String,
    })
    @IsOptional()
    @IsString({ message: 'La ubicación debe ser una cadena de texto' })
    ubicacion?: string;

    @ApiPropertyOptional({
        description: 'Fecha cuando ocurrió el incidente',
        example: '2025-09-23T10:30:00Z',
        type: String,
        format: 'date-time',
    })
    @IsOptional()
    @IsDateString({}, { message: 'La fecha del incidente debe ser una fecha válida' })
    fechaIncidente?: string;

    @ApiPropertyOptional({
        description: 'Fecha de resolución de la incidencia',
        example: '2025-09-24T15:00:00Z',
        type: String,
        format: 'date-time',
    })
    @IsOptional()
    @IsDateString({}, { message: 'La fecha de resolución debe ser una fecha válida' })
    fechaResolucion?: string;

    @ApiPropertyOptional({
        description: 'ID del trabajador asignado a la incidencia',
        example: '123e4567-e89b-12d3-a456-426614174000',
        type: String,
    })
    @IsOptional()
    @IsUUID('4', { message: 'El ID del trabajador debe ser un UUID válido' })
    asignadoATrabajador?: string;

    @ApiPropertyOptional({
        description: 'ID del área común donde ocurrió la incidencia',
        example: '123e4567-e89b-12d3-a456-426614174000',
        type: String,
    })
    @IsOptional()
    @IsUUID('4', { message: 'El ID del área común debe ser un UUID válido' })
    idAreaComun?: string;

    @ApiPropertyOptional({
        description: 'ID del tipo de incidencia',
        example: '123e4567-e89b-12d3-a456-426614174000',
        type: String,
    })
    @IsOptional()
    @IsUUID('4', { message: 'El ID del tipo de incidencia debe ser un UUID válido' })
    idTipoIncidencia?: string;
}
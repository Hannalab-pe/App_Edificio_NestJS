import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { EstadoIncidencia, PrioridadIncidencia } from 'src/Enums/inicidencias.enum';


export class CreateIncidenciaDto {
    @ApiProperty({
        description: 'Título de la incidencia',
        example: 'Problema con el ascensor',
        type: String,
    })
    @IsString({ message: 'El título debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'El título es obligatorio' })
    titulo: string;

    @ApiProperty({
        description: 'Descripción detallada de la incidencia',
        example: 'El ascensor del primer piso no está funcionando correctamente',
        type: String,
    })
    @IsString({ message: 'La descripción debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'La descripción es obligatoria' })
    descripcion: string;

    @ApiProperty({
        description: 'Estado de la incidencia',
        example: EstadoIncidencia.PENDIENTE,
        enum: EstadoIncidencia,
    })
    @IsEnum(EstadoIncidencia, { message: 'El estado debe ser uno de los valores válidos' })
    @IsNotEmpty({ message: 'El estado es obligatorio' })
    estado: EstadoIncidencia;

    @ApiProperty({
        description: 'Prioridad de la incidencia',
        example: PrioridadIncidencia.ALTA,
        enum: PrioridadIncidencia,
    })
    @IsEnum(PrioridadIncidencia, { message: 'La prioridad debe ser uno de los valores válidos' })
    @IsNotEmpty({ message: 'La prioridad es obligatoria' })
    prioridad: PrioridadIncidencia;

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

    @ApiProperty({
        description: 'ID del área común donde ocurrió la incidencia',
        example: '123e4567-e89b-12d3-a456-426614174000',
        type: String,
    })
    @IsUUID('4', { message: 'El ID del área común debe ser un UUID válido' })
    @IsNotEmpty({ message: 'El ID del área común es obligatorio' })
    idAreaComun: string;

    @ApiProperty({
        description: 'ID del tipo de incidencia',
        example: '123e4567-e89b-12d3-a456-426614174000',
        type: String,
    })
    @IsUUID('4', { message: 'El ID del tipo de incidencia debe ser un UUID válido' })
    @IsNotEmpty({ message: 'El ID del tipo de incidencia es obligatorio' })
    idTipoIncidencia: string;

    @ApiProperty({
        description: 'ID del usuario que reporta la incidencia',
        example: '123e4567-e89b-12d3-a456-426614174000',
        type: String,
    })
    @IsUUID('4', { message: 'El ID del usuario debe ser un UUID válido' })
    @IsNotEmpty({ message: 'El ID del usuario es obligatorio' })
    reportadoPorUsuario: string;

    @ApiPropertyOptional({
        description: 'ID del trabajador asignado a la incidencia',
        example: '123e4567-e89b-12d3-a456-426614174000',
        type: String,
    })
    @IsOptional()
    @IsUUID('4', { message: 'El ID del trabajador debe ser un UUID válido' })
    asignadoATrabajador?: string;
}
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsEnum, IsHexColor } from 'class-validator';
import { PrioridadIncidencia } from '../../Enums/inicidencias.enum';

export class CreateTipoIncidenciaDto {
    @ApiProperty({
        description: 'Nombre del tipo de incidencia',
        example: 'Problema Eléctrico',
        type: String,
    })
    @IsString({ message: 'El nombre debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    nombre: string;

    @ApiPropertyOptional({
        description: 'Descripción del tipo de incidencia',
        example: 'Problemas relacionados con el sistema eléctrico del edificio',
        type: String,
    })
    @IsOptional()
    @IsString({ message: 'La descripción debe ser una cadena de texto' })
    descripcion?: string;

    @ApiProperty({
        description: 'Prioridad por defecto para este tipo de incidencia',
        example: PrioridadIncidencia.ALTA,
        enum: PrioridadIncidencia,
    })
    @IsEnum(PrioridadIncidencia, { message: 'La prioridad debe ser uno de los valores válidos' })
    @IsNotEmpty({ message: 'La prioridad es obligatoria' })
    prioridad: PrioridadIncidencia;

    @ApiPropertyOptional({
        description: 'Color hexadecimal para identificar visualmente el tipo de incidencia',
        example: '#FF5722',
        type: String,
    })
    @IsOptional()
    @IsHexColor({ message: 'El color debe ser un código hexadecimal válido (ejemplo: #FF5722)' })
    colorHex?: string;
}
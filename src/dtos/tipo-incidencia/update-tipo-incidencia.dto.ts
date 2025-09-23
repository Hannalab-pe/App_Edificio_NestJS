import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsHexColor } from 'class-validator';
import { PrioridadIncidencia } from '../../Enums/inicidencias.enum';

export class UpdateTipoIncidenciaDto {
    @ApiPropertyOptional({
        description: 'Nombre del tipo de incidencia',
        example: 'Problema Eléctrico Actualizado',
        type: String,
    })
    @IsOptional()
    @IsString({ message: 'El nombre debe ser una cadena de texto' })
    nombre?: string;

    @ApiPropertyOptional({
        description: 'Descripción del tipo de incidencia',
        example: 'Problemas relacionados con el sistema eléctrico del edificio - descripción actualizada',
        type: String,
    })
    @IsOptional()
    @IsString({ message: 'La descripción debe ser una cadena de texto' })
    descripcion?: string;

    @ApiPropertyOptional({
        description: 'Prioridad por defecto para este tipo de incidencia',
        example: PrioridadIncidencia.CRITICA,
        enum: PrioridadIncidencia,
    })
    @IsOptional()
    @IsEnum(PrioridadIncidencia, { message: 'La prioridad debe ser uno de los valores válidos' })
    prioridad?: PrioridadIncidencia;

    @ApiPropertyOptional({
        description: 'Color hexadecimal para identificar visualmente el tipo de incidencia',
        example: '#E91E63',
        type: String,
    })
    @IsOptional()
    @IsHexColor({ message: 'El color debe ser un código hexadecimal válido (ejemplo: #E91E63)' })
    colorHex?: string;
}
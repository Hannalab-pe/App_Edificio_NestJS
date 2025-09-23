<<<<<<< HEAD
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsEnum, IsHexColor } from 'class-validator';
import { PrioridadIncidencia } from '../../Enums/inicidencias.enum';
=======
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
>>>>>>> 56ba60af9806ab17fa9dd2551616d39c4ecc114c

export class CreateTipoIncidenciaDto {
    @ApiProperty({
        description: 'Nombre del tipo de incidencia',
<<<<<<< HEAD
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
=======
        example: 'Eléctrica'
    })
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    @IsString({ message: 'El nombre debe ser un texto' })
    nombre: string;

    @ApiProperty({
        description: 'Descripción detallada del tipo de incidencia',
        example: 'Incidencias relacionadas con problemas eléctricos',
        required: false
    })
    @IsOptional()
    @IsString({ message: 'La descripción debe ser un texto' })
    descripcion?: string;

    @ApiProperty({
        description: 'Prioridad de la incidencia',
        example: 'Alta'
    })
    @IsNotEmpty({ message: 'La prioridad es obligatoria' })
    @IsString({ message: 'La prioridad debe ser un texto' })
    prioridad: string;

    @ApiProperty({
        description: 'Color hexadecimal para identificar el tipo',
        example: '#FF0000',
        required: false
    })
    @IsOptional()
    @IsString({ message: 'El color debe ser un texto hexadecimal' })
    @Length(7, 7, { message: 'El color debe tener 7 caracteres (ejemplo: #FF0000)' })
    colorHex?: string;

    @ApiProperty({
        description: 'Indica si el tipo de incidencia está activo',
        example: true,
        default: true
    })
    @IsOptional()
    @IsBoolean({ message: 'estaActivo debe ser un valor booleano' })
    estaActivo?: boolean;
}
>>>>>>> 56ba60af9806ab17fa9dd2551616d39c4ecc114c

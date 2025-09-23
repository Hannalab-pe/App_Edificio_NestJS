import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateTipoIncidenciaDto {
    @ApiProperty({
        description: 'Nombre del tipo de incidencia',
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

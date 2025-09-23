import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsUUID, IsOptional, IsDecimal, IsEnum, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import { EstadoEspacio } from 'src/Enums/espacio.enum';

export class UpdateEspacioArrendableDto {
    @ApiPropertyOptional({
        description: 'Código único del espacio arrendable',
        example: 'ESP-001',
        type: String,
    })
    @IsOptional()
    @IsString({ message: 'El código debe ser una cadena de texto' })
    codigo?: string;

    @ApiPropertyOptional({
        description: 'Descripción del espacio arrendable',
        example: 'Local comercial en primer piso con vista a la calle principal',
        type: String,
    })
    @IsOptional()
    @IsString({ message: 'La descripción debe ser una cadena de texto' })
    descripcion?: string;

    @ApiPropertyOptional({
        description: 'Ubicación del espacio arrendable',
        example: 'Primer piso, ala norte',
        type: String,
    })
    @IsOptional()
    @IsString({ message: 'La ubicación debe ser una cadena de texto' })
    ubicacion?: string;

    @ApiPropertyOptional({
        description: 'Área en metros cuadrados',
        example: 45.50,
        type: Number,
    })
    @IsOptional()
    @Transform(({ value }) => parseFloat(value))
    @IsDecimal({ decimal_digits: '1,2' }, { message: 'El área debe ser un número decimal válido' })
    areaM2?: number;

    @ApiPropertyOptional({
        description: 'Estado del espacio arrendable',
        example: EstadoEspacio.DISPONIBLE,
        enum: EstadoEspacio,
    })
    @IsOptional()
    @IsEnum(EstadoEspacio, { message: 'El estado debe ser uno de los valores válidos' })
    estado?: EstadoEspacio;

    @ApiPropertyOptional({
        description: 'Tarifa mensual del espacio',
        example: 800.00,
        type: Number,
    })
    @IsOptional()
    @Transform(({ value }) => parseFloat(value))
    @IsDecimal({ decimal_digits: '1,2' }, { message: 'La tarifa mensual debe ser un número decimal válido' })
    tarifaMensual?: number;

    @ApiPropertyOptional({
        description: 'Estado del espacio (activo/inactivo)',
        example: true,
        type: Boolean,
    })
    @IsOptional()
    @IsBoolean({ message: 'El estado debe ser un valor booleano' })
    estaActivo?: boolean;

    @ApiPropertyOptional({
        description: 'ID del tipo de espacio',
        example: '123e4567-e89b-12d3-a456-426614174000',
        type: String,
    })
    @IsOptional()
    @IsUUID('4', { message: 'El ID del tipo de espacio debe ser un UUID válido' })
    idTipoEspacio?: string;
}
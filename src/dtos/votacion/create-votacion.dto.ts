import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, IsOptional, IsDateString, IsEnum, IsBoolean, IsNumber } from 'class-validator';
import { EstadoVotacion, TipoVotacion } from 'src/Enums/gobernanza.enum';

export class CreateVotacionDto {
    @ApiProperty({
        description: 'Título de la votación',
        example: 'Votación para mejoras en áreas comunes',
        type: String,
    })
    @IsString({ message: 'El título debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'El título es obligatorio' })
    titulo: string;

    @ApiProperty({
        description: 'Descripción detallada de la votación',
        example: 'Votación para decidir las mejoras prioritarias en las áreas comunes del edificio',
        type: String,
    })
    @IsString({ message: 'La descripción debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'La descripción es obligatoria' })
    descripcion: string;

    @ApiProperty({
        description: 'Fecha y hora de inicio de la votación',
        example: '2025-10-01T08:00:00Z',
        type: String,
        format: 'date-time',
    })
    @IsDateString({}, { message: 'La fecha de inicio debe ser una fecha válida' })
    @IsNotEmpty({ message: 'La fecha de inicio es obligatoria' })
    fechaInicio: string;

    @ApiProperty({
        description: 'Fecha y hora de fin de la votación',
        example: '2025-10-07T23:59:59Z',
        type: String,
        format: 'date-time',
    })
    @IsDateString({}, { message: 'La fecha de fin debe ser una fecha válida' })
    @IsNotEmpty({ message: 'La fecha de fin es obligatoria' })
    fechaFin: string;

    @ApiProperty({
        description: 'Estado de la votación',
        example: EstadoVotacion.BORRADOR,
        enum: EstadoVotacion,
    })
    @IsEnum(EstadoVotacion, { message: 'El estado debe ser uno de los valores válidos' })
    @IsNotEmpty({ message: 'El estado es obligatorio' })
    estado: EstadoVotacion;

    @ApiProperty({
        description: 'Tipo de votación',
        example: TipoVotacion.SIMPLE,
        enum: TipoVotacion,
    })
    @IsEnum(TipoVotacion, { message: 'El tipo debe ser uno de los valores válidos' })
    @IsNotEmpty({ message: 'El tipo es obligatorio' })
    tipo: TipoVotacion;

    @ApiPropertyOptional({
        description: 'Indica si la votación requiere quórum mínimo',
        example: true,
        type: Boolean,
        default: false,
    })
    @IsOptional()
    @IsBoolean({ message: 'Requiere quórum debe ser un valor booleano' })
    requiereQuorum?: boolean;

    @ApiPropertyOptional({
        description: 'Número mínimo de votos requeridos para el quórum',
        example: 15,
        type: Number,
    })
    @IsOptional()
    @IsNumber({}, { message: 'El quórum mínimo debe ser un número' })
    quorumMinimo?: number;

    @ApiProperty({
        description: 'ID del usuario que crea la votación',
        example: '123e4567-e89b-12d3-a456-426614174000',
        type: String,
    })
    @IsUUID('4', { message: 'El ID del usuario creador debe ser un UUID válido' })
    @IsNotEmpty({ message: 'El ID del usuario creador es obligatorio' })
    creadoPorUsuario: string;
}
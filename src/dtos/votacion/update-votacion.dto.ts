import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString, IsEnum, IsBoolean, IsNumber } from 'class-validator';
import { EstadoVotacion, TipoVotacion } from 'src/Enums/gobernanza.enum';

export class UpdateVotacionDto {
    @ApiPropertyOptional({
        description: 'Título de la votación',
        example: 'Votación para mejoras en áreas comunes',
        type: String,
    })
    @IsOptional()
    @IsString({ message: 'El título debe ser una cadena de texto' })
    titulo?: string;

    @ApiPropertyOptional({
        description: 'Descripción detallada de la votación',
        example: 'Votación para decidir las mejoras prioritarias en las áreas comunes del edificio',
        type: String,
    })
    @IsOptional()
    @IsString({ message: 'La descripción debe ser una cadena de texto' })
    descripcion?: string;

    @ApiPropertyOptional({
        description: 'Fecha y hora de inicio de la votación',
        example: '2025-10-01T08:00:00Z',
        type: String,
        format: 'date-time',
    })
    @IsOptional()
    @IsDateString({}, { message: 'La fecha de inicio debe ser una fecha válida' })
    fechaInicio?: string;

    @ApiPropertyOptional({
        description: 'Fecha y hora de fin de la votación',
        example: '2025-10-07T23:59:59Z',
        type: String,
        format: 'date-time',
    })
    @IsOptional()
    @IsDateString({}, { message: 'La fecha de fin debe ser una fecha válida' })
    fechaFin?: string;

    @ApiPropertyOptional({
        description: 'Estado de la votación',
        example: EstadoVotacion.ACTIVA,
        enum: EstadoVotacion,
    })
    @IsOptional()
    @IsEnum(EstadoVotacion, { message: 'El estado debe ser uno de los valores válidos' })
    estado?: EstadoVotacion;

    @ApiPropertyOptional({
        description: 'Tipo de votación',
        example: TipoVotacion.SIMPLE,
        enum: TipoVotacion,
    })
    @IsOptional()
    @IsEnum(TipoVotacion, { message: 'El tipo debe ser uno de los valores válidos' })
    tipo?: TipoVotacion;

    @ApiPropertyOptional({
        description: 'Indica si la votación requiere quórum mínimo',
        example: true,
        type: Boolean,
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
}
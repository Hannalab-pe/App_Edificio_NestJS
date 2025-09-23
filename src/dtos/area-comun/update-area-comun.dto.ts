import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsDecimal, IsOptional, IsBoolean, IsNotEmpty, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateAreaComunDto {
    @ApiPropertyOptional({
        description: 'Nombre del área común',
        example: 'Salón de Eventos',
        type: String,
    })
    @IsOptional()
    @IsString({ message: 'El nombre debe ser una cadena de texto' })
    nombre?: string;

    @ApiPropertyOptional({
        description: 'Descripción del área común',
        example: 'Amplio salón para eventos sociales con capacidad para 100 personas',
        type: String,
    })
    @IsOptional()
    @IsString({ message: 'La descripción debe ser una cadena de texto' })
    descripcion?: string;

    @ApiPropertyOptional({
        description: 'Capacidad máxima de personas',
        example: 100,
        type: Number,
    })
    @IsOptional()
    @IsNumber({}, { message: 'La capacidad máxima debe ser un número' })
    capacidadMaxima?: number;

     @ApiPropertyOptional({
            description: 'Precio por reserva del área común',
            example: 150.00,
            type: Number,
        })
        @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El precio de reserva debe ser un número decimal válido con máximo 2 decimales' })
        @Min(0, { message: 'El precio de reserva debe ser mayor o igual a 0' })
        @IsNotEmpty({ message: 'El precio de reserva es obligatorio' })
        precioReserva: number;

    @ApiPropertyOptional({
        description: 'Tiempo mínimo de reserva (formato HH:MM:SS)',
        example: '01:00:00',
        type: String,
    })
    @IsOptional()
    @IsString({ message: 'El tiempo mínimo de reserva debe ser una cadena de texto' })
    tiempoMinimoReserva?: string;

    @ApiPropertyOptional({
        description: 'Tiempo máximo de reserva (formato HH:MM:SS)',
        example: '08:00:00',
        type: String,
    })
    @IsOptional()
    @IsString({ message: 'El tiempo máximo de reserva debe ser una cadena de texto' })
    tiempoMaximoReserva?: string;

    @ApiPropertyOptional({
        description: 'Horario de apertura (formato HH:MM:SS)',
        example: '08:00:00',
        type: String,
    })
    @IsOptional()
    @IsString({ message: 'El horario de apertura debe ser una cadena de texto' })
    horarioApertura?: string;

    @ApiPropertyOptional({
        description: 'Horario de cierre (formato HH:MM:SS)',
        example: '22:00:00',
        type: String,
    })
    @IsOptional()
    @IsString({ message: 'El horario de cierre debe ser una cadena de texto' })
    horarioCierre?: string;

    @ApiPropertyOptional({
        description: 'Días máximos de anticipación para reserva',
        example: 30,
        type: Number,
    })
    @IsOptional()
    @IsNumber({}, { message: 'Los días de anticipación máxima deben ser un número' })
    diasAnticipacionMax?: number;

    @ApiPropertyOptional({
        description: 'Estado del área común (activo/inactivo)',
        example: true,
        type: Boolean,
    })
    @IsOptional()
    @IsBoolean({ message: 'El estado debe ser un valor booleano' })
    estaActivo?: boolean;
}
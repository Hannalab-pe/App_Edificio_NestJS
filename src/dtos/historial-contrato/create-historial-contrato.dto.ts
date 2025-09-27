import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsString, IsNotEmpty, IsOptional, IsObject, IsDateString } from 'class-validator';
import { TipoAccionHistorial } from '../../Enums/TipoAccionHistorial';

export class CreateHistorialContratoDto {
    @ApiProperty({
        description: 'ID del contrato al que pertenece este historial',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @IsString()
    @IsNotEmpty()
    idContrato: string;

    @ApiProperty({
        description: 'Tipo de acción realizada en el contrato',
        enum: TipoAccionHistorial,
        example: TipoAccionHistorial.MODIFICACION,
    })
    @IsEnum(TipoAccionHistorial)
    @IsNotEmpty()
    tipoAccion: TipoAccionHistorial;

    @ApiProperty({
        description: 'Descripción detallada de la acción realizada',
        example: 'Se actualizó la remuneración del contrato de $2000 a $2500',
    })
    @IsString()
    @IsNotEmpty()
    descripcionAccion: string;

    @ApiPropertyOptional({
        description: 'Estado anterior del contrato antes del cambio',
        example: { remuneracion: 2000, estado: 'ACTIVO' },
    })
    @IsOptional()
    @IsObject()
    estadoAnterior?: any;

    @ApiPropertyOptional({
        description: 'Estado nuevo del contrato después del cambio',
        example: { remuneracion: 2500, estado: 'ACTIVO' },
    })
    @IsOptional()
    @IsObject()
    estadoNuevo?: any;

    @ApiPropertyOptional({
        description: 'Observaciones adicionales sobre el cambio',
        example: 'Ajuste salarial por evaluación de desempeño',
    })
    @IsOptional()
    @IsString()
    observaciones?: string;

    @ApiPropertyOptional({
        description: 'Usuario que realizó la acción',
        example: 'admin@empresa.com',
    })
    @IsOptional()
    @IsString()
    usuarioAccion?: string;

    @ApiPropertyOptional({
        description: 'Dirección IP del usuario que realizó la acción',
        example: '192.168.1.100',
    })
    @IsOptional()
    @IsString()
    ipUsuario?: string;
}
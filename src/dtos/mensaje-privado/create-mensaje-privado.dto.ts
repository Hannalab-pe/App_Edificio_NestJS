import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsString,
    IsNotEmpty,
    IsUUID,
    IsOptional,
    IsUrl,
    MaxLength,
    MinLength,
} from 'class-validator';

export class CreateMensajePrivadoDto {
    @ApiProperty({
        description: 'Asunto del mensaje',
        example: 'Consulta sobre mantenimiento del edificio',
        minLength: 1,
        maxLength: 255,
    })
    @IsString({ message: 'El asunto debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'El asunto es obligatorio' })
    @MinLength(1, { message: 'El asunto debe tener al menos 1 carácter' })
    @MaxLength(255, { message: 'El asunto no puede exceder 255 caracteres' })
    asunto: string;

    @ApiProperty({
        description: 'Contenido del mensaje',
        example: 'Estimado administrador, tengo una consulta sobre...',
        minLength: 1,
    })
    @IsString({ message: 'El contenido debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'El contenido es obligatorio' })
    @MinLength(1, { message: 'El contenido debe tener al menos 1 carácter' })
    contenido: string;

    @ApiProperty({
        description: 'ID del usuario receptor del mensaje',
        example: '550e8400-e29b-41d4-a716-446655440000',
        format: 'uuid',
    })
    @IsUUID('4', { message: 'El receptor debe ser un UUID v4 válido' })
    @IsNotEmpty({ message: 'El receptor es obligatorio' })
    receptorUsuario: string;

    @ApiPropertyOptional({
        description: 'URL del archivo adjunto (opcional)',
        example: 'https://ejemplo.com/archivo.pdf',
    })
    @IsOptional()
    @IsString({ message: 'La URL del archivo debe ser una cadena de texto' })
    @IsUrl({}, { message: 'Debe ser una URL válida' })
    archivoAdjuntoUrl?: string;

    @ApiPropertyOptional({
        description: 'ID del mensaje padre (para respuestas)',
        example: '550e8400-e29b-41d4-a716-446655440001',
        format: 'uuid',
    })
    @IsOptional()
    @IsUUID('4', { message: 'El mensaje padre debe ser un UUID v4 válido' })
    mensajePadreId?: string;
}
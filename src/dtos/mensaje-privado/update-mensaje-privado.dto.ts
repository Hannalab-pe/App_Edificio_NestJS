import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
    IsString,
    IsOptional,
    IsBoolean,
    IsUrl,
    MaxLength,
    MinLength,
} from 'class-validator';
import { CreateMensajePrivadoDto } from './create-mensaje-privado.dto';

export class UpdateMensajePrivadoDto extends PartialType(CreateMensajePrivadoDto) {
    @ApiPropertyOptional({
        description: 'Asunto del mensaje (opcional)',
        example: 'Consulta actualizada sobre mantenimiento',
        minLength: 1,
        maxLength: 255,
    })
    @IsOptional()
    @IsString({ message: 'El asunto debe ser una cadena de texto' })
    @MinLength(1, { message: 'El asunto debe tener al menos 1 carácter' })
    @MaxLength(255, { message: 'El asunto no puede exceder 255 caracteres' })
    asunto?: string;

    @ApiPropertyOptional({
        description: 'Contenido del mensaje (opcional)',
        example: 'Contenido actualizado del mensaje...',
        minLength: 1,
    })
    @IsOptional()
    @IsString({ message: 'El contenido debe ser una cadena de texto' })
    @MinLength(1, { message: 'El contenido debe tener al menos 1 carácter' })
    contenido?: string;

    @ApiPropertyOptional({
        description: 'Estado de lectura del mensaje',
        example: true,
    })
    @IsOptional()
    @IsBoolean({ message: 'El estado de lectura debe ser un valor booleano' })
    leido?: boolean;

    @ApiPropertyOptional({
        description: 'URL del archivo adjunto (opcional)',
        example: 'https://ejemplo.com/nuevo-archivo.pdf',
    })
    @IsOptional()
    @IsString({ message: 'La URL del archivo debe ser una cadena de texto' })
    @IsUrl({}, { message: 'Debe ser una URL válida' })
    archivoAdjuntoUrl?: string;
}
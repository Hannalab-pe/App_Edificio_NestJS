import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsUUID, IsUrl } from 'class-validator';

export class CreateComentarioIncidenciaDto {
    @ApiProperty({
        description: 'Contenido del comentario',
        example: 'Se ha revisado la incidencia y se procederá con la reparación mañana por la mañana.',
        type: String,
    })
    @IsString({ message: 'El comentario debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'El comentario es obligatorio' })
    comentario: string;

    @ApiPropertyOptional({
        description: 'URL del archivo adjunto',
        example: 'https://storage.example.com/files/imagen-incidencia.jpg',
        type: String,
    })
    @IsOptional()
    @IsUrl({}, { message: 'La URL del archivo adjunto debe ser válida' })
    archivoAdjuntoUrl?: string;

    @ApiProperty({
        description: 'ID de la incidencia a la que pertenece el comentario',
        example: '123e4567-e89b-12d3-a456-426614174000',
        type: String,
    })
    @IsUUID('4', { message: 'El ID de la incidencia debe ser un UUID válido' })
    @IsNotEmpty({ message: 'El ID de la incidencia es obligatorio' })
    idIncidencia: string;

    @ApiProperty({
        description: 'ID del usuario que realiza el comentario',
        example: '123e4567-e89b-12d3-a456-426614174000',
        type: String,
    })
    @IsUUID('4', { message: 'El ID del usuario debe ser un UUID válido' })
    @IsNotEmpty({ message: 'El ID del usuario es obligatorio' })
    idUsuario: string;
}
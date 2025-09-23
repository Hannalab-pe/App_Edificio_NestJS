import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, IsOptional, IsEnum } from 'class-validator';
import { TipoNotificacion } from 'src/Enums/globales.enum';

export class CreateNotificacionDto {
    @ApiProperty({
        description: 'Título de la notificación',
        example: 'Mantenimiento programado',
        type: String,
    })
    @IsString({ message: 'El título debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'El título es obligatorio' })
    titulo: string;

    @ApiProperty({
        description: 'Mensaje de la notificación',
        example: 'Se realizará mantenimiento en las áreas comunes el próximo sábado',
        type: String,
    })
    @IsString({ message: 'El mensaje debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'El mensaje es obligatorio' })
    mensaje: string;

    @ApiProperty({
        description: 'Tipo de notificación',
        example: TipoNotificacion.INFORMATIVA,
        enum: TipoNotificacion,
    })
    @IsEnum(TipoNotificacion, { message: 'El tipo debe ser uno de los valores válidos' })
    @IsNotEmpty({ message: 'El tipo es obligatorio' })
    tipo: TipoNotificacion;

    @ApiProperty({
        description: 'ID del usuario emisor de la notificación',
        example: '123e4567-e89b-12d3-a456-426614174000',
        type: String,
    })
    @IsUUID('4', { message: 'El ID del usuario emisor debe ser un UUID válido' })
    @IsNotEmpty({ message: 'El ID del usuario emisor es obligatorio' })
    emisorUsuario: string;

    @ApiPropertyOptional({
        description: 'ID del usuario destinatario específico (opcional)',
        example: '123e4567-e89b-12d3-a456-426614174000',
        type: String,
    })
    @IsOptional()
    @IsUUID('4', { message: 'El ID del usuario destinatario debe ser un UUID válido' })
    destinatarioUsuario?: string;

    @ApiPropertyOptional({
        description: 'ID del rol destinatario (para notificaciones masivas)',
        example: '123e4567-e89b-12d3-a456-426614174000',
        type: String,
    })
    @IsOptional()
    @IsUUID('4', { message: 'El ID del rol destinatario debe ser un UUID válido' })
    destinatarioRol?: string;
}
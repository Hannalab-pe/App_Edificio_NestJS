import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsUUID, IsOptional, IsBoolean } from 'class-validator';

export class UpdateUsuarioDto {
    @ApiPropertyOptional({
        description: 'Correo electrónico del usuario',
        example: 'usuario@ejemplo.com',
        type: String,
    })
    @IsEmail({}, { message: 'El correo debe tener un formato válido' })
    @IsOptional()
    correo?: string;

    @ApiPropertyOptional({
        description: 'Contraseña del usuario',
        example: 'MiContraseña123!',
        type: String,
        minLength: 8,
    })
    @IsString({ message: 'La contraseña debe ser una cadena de texto' })
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    @IsOptional()
    contrasena?: string;

    @ApiPropertyOptional({
        description: 'Estado del usuario (activo/inactivo)',
        example: true,
        type: Boolean,
    })
    @IsBoolean({ message: 'El estado debe ser un valor booleano' })
    @IsOptional()
    estaActivo?: boolean;

    @ApiPropertyOptional({
        description: 'ID del rol asignado al usuario',
        example: '123e4567-e89b-12d3-a456-426614174000',
        type: String,
    })
    @IsUUID('4', { message: 'El ID del rol debe ser un UUID válido' })
    @IsOptional()
    idRol?: string;
}
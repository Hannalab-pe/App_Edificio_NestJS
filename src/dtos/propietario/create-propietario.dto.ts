import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, IsUUID, IsOptional } from 'class-validator';

export class CreatePropietarioDto {
    @ApiProperty({
        description: 'Nombre del propietario',
        example: 'Juan',
        type: String,
    })
    @IsString({ message: 'El nombre debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    nombre: string;

    @ApiProperty({
        description: 'Apellido del propietario',
        example: 'Pérez',
        type: String,
    })
    @IsString({ message: 'El apellido debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'El apellido es obligatorio' })
    apellido: string;

    @ApiProperty({
        description: 'Correo electrónico del propietario',
        example: 'juan.perez@ejemplo.com',
        type: String,
    })
    @IsEmail({}, { message: 'El correo debe tener un formato válido' })
    @IsNotEmpty({ message: 'El correo es obligatorio' })
    correo: string;

    @ApiPropertyOptional({
        description: 'Teléfono del propietario',
        example: '+51987654321',
        type: String,
    })
    @IsString({ message: 'El teléfono debe ser una cadena de texto' })
    @IsOptional()
    telefono?: string;

    @ApiPropertyOptional({
        description: 'Dirección del propietario',
        example: 'Av. Ejemplo 123, Lima',
        type: String,
    })
    @IsString({ message: 'La dirección debe ser una cadena de texto' })
    @IsOptional()
    direccion?: string;

    @ApiProperty({
        description: 'ID del documento de identidad',
        example: '123e4567-e89b-12d3-a456-426614174000',
        type: String,
    })
    @IsUUID('4', { message: 'El ID del documento de identidad debe ser un UUID válido' })
    @IsNotEmpty({ message: 'El ID del documento de identidad es obligatorio' })
    idDocumentoIdentidad: string;

    @ApiProperty({
        description: 'ID del usuario asociado',
        example: '123e4567-e89b-12d3-a456-426614174000',
        type: String,
    })
    @IsUUID('4', { message: 'El ID del usuario debe ser un UUID válido' })
    @IsNotEmpty({ message: 'El ID del usuario es obligatorio' })
    idUsuario: string;
}
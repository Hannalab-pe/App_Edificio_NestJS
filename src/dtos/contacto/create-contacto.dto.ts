import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsUUID,
    IsOptional,
    IsString,
    IsEmail,
    IsBoolean,
    ValidateIf,
} from 'class-validator';

export class CreateContactoDto {
    @ApiProperty({
        description: 'Nombre del contacto',
        example: 'Juan Pérez - Electricista',
        type: String,
    })
    @IsString({ message: 'El nombre debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    nombre: string;

    @ApiPropertyOptional({
        description: 'Descripción detallada del contacto',
        example: 'Electricista especializado en instalaciones industriales',
        type: String,
    })
    @IsOptional()
    @IsString({ message: 'La descripción debe ser una cadena de texto' })
    descripcion?: string;

    @ApiPropertyOptional({
        description: 'Correo electrónico del contacto (único en el sistema)',
        example: 'juan.electricista@email.com',
        type: String,
    })
    @IsOptional()
    @IsEmail({}, { message: 'Debe ser un correo electrónico válido' })
    correo?: string;

    @ApiPropertyOptional({
        description: 'Número de teléfono del contacto',
        example: '+51 987 654 321',
        type: String,
    })
    @IsOptional()
    @IsString({ message: 'El teléfono debe ser una cadena de texto' })
    telefono?: string;

    @ApiPropertyOptional({
        description: 'Dirección física del contacto',
        example: 'Av. Los Electricistas 123, Lima',
        type: String,
    })
    @IsOptional()
    @IsString({ message: 'La dirección debe ser una cadena de texto' })
    direccion?: string;

    @ApiPropertyOptional({
        description: 'URL de la imagen o logo del contacto',
        example: 'https://storage.com/contacto-logo.jpg',
        type: String,
    })
    @IsOptional()
    @IsString({ message: 'La URL de imagen debe ser una cadena de texto' })
    imagenUrl?: string;

    @ApiProperty({
        description: 'ID del tipo de contacto',
        example: '123e4567-e89b-12d3-a456-426614174000',
        type: String,
    })
    @IsUUID('4', { message: 'El ID del tipo de contacto debe ser un UUID válido' })
    @IsNotEmpty({ message: 'El ID del tipo de contacto es obligatorio' })
    idTipoContacto: string;

    @ApiProperty({
        description: 'ID del tipo de contrato',
        example: '123e4567-e89b-12d3-a456-426614174001',
        type: String,
    })
    @IsUUID('4', { message: 'El ID del tipo de contrato debe ser un UUID válido' })
    @IsNotEmpty({ message: 'El ID del tipo de contrato es obligatorio' })
    idTipoContrato: string;

    @ApiPropertyOptional({
        description: 'Estado activo del contacto',
        example: true,
        type: Boolean,
        default: true,
    })
    @IsOptional()
    @IsBoolean({ message: 'El estado activo debe ser verdadero o falso' })
    estaActivo?: boolean = true;

    // Validación personalizada: debe tener al menos correo o teléfono
    @ValidateIf((o) => !o.correo && !o.telefono)
    @IsNotEmpty({
        message: 'Debe proporcionar al menos un correo electrónico o teléfono',
    })
    private readonly _validacionContacto?: string;
}
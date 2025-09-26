import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsNotEmpty,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';

export class CreateInmobiliariaDto {
    @ApiProperty({
        description: 'Nombre de la inmobiliaria',
        example: 'Inmobiliaria San Martín S.A.C.',
        maxLength: 50,
    })
    @IsNotEmpty({ message: 'El nombre de la inmobiliaria es obligatorio' })
    @IsString({ message: 'El nombre de la inmobiliaria debe ser un texto' })
    @MaxLength(50, { message: 'El nombre de la inmobiliaria no puede exceder 50 caracteres' })
    nomInmobiliaria: string;

    @ApiProperty({
        description: 'Teléfono de contacto de la inmobiliaria',
        example: '987654321',
        minLength: 9,
        maxLength: 9,
    })
    @IsNotEmpty({ message: 'El teléfono de contacto es obligatorio' })
    @IsString({ message: 'El teléfono de contacto debe ser un texto' })
    @MinLength(9, { message: 'El teléfono debe tener exactamente 9 caracteres' })
    @MaxLength(9, { message: 'El teléfono debe tener exactamente 9 caracteres' })
    telfContacto: string;

    @ApiProperty({
        description: 'Correo electrónico de contacto',
        example: 'contacto@inmobiliaria.com',
        maxLength: 50,
    })
    @IsNotEmpty({ message: 'El correo de contacto es obligatorio' })
    @IsEmail({}, { message: 'El correo debe tener un formato válido' })
    @MaxLength(50, { message: 'El correo no puede exceder 50 caracteres' })
    correoContacto: string;

    @ApiProperty({
        description: 'Dirección de la inmobiliaria',
        example: 'Av. Comercial 456, San Isidro',
        maxLength: 50,
    })
    @IsNotEmpty({ message: 'La dirección de la inmobiliaria es obligatoria' })
    @IsString({ message: 'La dirección debe ser un texto' })
    @MaxLength(50, { message: 'La dirección no puede exceder 50 caracteres' })
    direccionInmobiliaria: string;
}
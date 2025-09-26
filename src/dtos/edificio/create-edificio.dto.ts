import { ApiProperty } from '@nestjs/swagger';
import {
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
    Min,
    MaxLength,
} from 'class-validator';

export class CreateEdificioDto {
    @ApiProperty({
        description: 'Nombre del edificio',
        example: 'Torre San Martín',
        maxLength: 50,
    })
    @IsNotEmpty({ message: 'El nombre del edificio es obligatorio' })
    @IsString({ message: 'El nombre del edificio debe ser un texto' })
    @MaxLength(50, { message: 'El nombre del edificio no puede exceder 50 caracteres' })
    nombreEdificio: string;

    @ApiProperty({
        description: 'Dirección completa del edificio',
        example: 'Av. Principal 123, Miraflores',
        maxLength: 100,
    })
    @IsNotEmpty({ message: 'La dirección es obligatoria' })
    @IsString({ message: 'La dirección debe ser un texto' })
    @MaxLength(100, { message: 'La dirección no puede exceder 100 caracteres' })
    direccion: string;

    @ApiProperty({
        description: 'URL de la imagen del edificio',
        example: 'https://example.com/edificio.jpg',
        maxLength: 300,
    })
    @IsNotEmpty({ message: 'La imagen URL es obligatoria' })
    @IsString({ message: 'La imagen URL debe ser un texto' })
    @MaxLength(300, { message: 'La imagen URL no puede exceder 300 caracteres' })
    imagenUrl: string;

    @ApiProperty({
        description: 'Cantidad total de departamentos',
        example: 24,
    })
    @IsNotEmpty({ message: 'La cantidad de departamentos es obligatoria' })
    @IsNumber({}, { message: 'La cantidad de departamentos debe ser un número' })
    @Min(1, { message: 'La cantidad de departamentos debe ser mayor a 0' })
    cantidadDepartamentos: number;

    @ApiProperty({
        description: 'Distrito donde se ubica el edificio',
        example: 'Miraflores',
        maxLength: 50,
    })
    @IsNotEmpty({ message: 'El distrito es obligatorio' })
    @IsString({ message: 'El distrito debe ser un texto' })
    @MaxLength(50, { message: 'El distrito no puede exceder 50 caracteres' })
    distrito: string;

    @ApiProperty({
        description: 'Número de pisos del edificio',
        example: 8,
    })
    @IsNotEmpty({ message: 'El número de pisos es obligatorio' })
    @IsNumber({}, { message: 'El número de pisos debe ser un número' })
    @Min(1, { message: 'El número de pisos debe ser mayor a 0' })
    numeroPisos: number;

    @ApiProperty({
        description: 'Número de sótanos del edificio',
        example: 2,
        default: 0,
    })
    @IsOptional()
    @IsNumber({}, { message: 'El número de sótanos debe ser un número' })
    @Min(0, { message: 'El número de sótanos debe ser mayor o igual a 0' })
    numeroSotanos?: number;

    @ApiProperty({
        description: 'Cantidad de almacenes',
        example: 24,
        default: 0,
    })
    @IsOptional()
    @IsNumber({}, { message: 'La cantidad de almacenes debe ser un número' })
    @Min(0, { message: 'La cantidad de almacenes debe ser mayor o igual a 0' })
    cantAlmacenes?: number;

    @ApiProperty({
        description: 'Número de cocheras disponibles',
        example: 30,
        default: 0,
    })
    @IsOptional()
    @IsNumber({}, { message: 'El número de cocheras debe ser un número' })
    @Min(0, { message: 'El número de cocheras debe ser mayor o igual a 0' })
    numeroCocheras?: number;

    @ApiProperty({
        description: 'Número de áreas comunes',
        example: 5,
        default: 0,
    })
    @IsOptional()
    @IsNumber({}, { message: 'El número de áreas comunes debe ser un número' })
    @Min(0, { message: 'El número de áreas comunes debe ser mayor o igual a 0' })
    numeroAreasComunes?: number;

    @ApiProperty({
        description: 'Indica si el edificio está activo',
        example: true,
        default: true,
    })
    @IsOptional()
    @IsBoolean({ message: 'estaActivo debe ser un valor booleano' })
    estaActivo?: boolean;

    @ApiProperty({
        description: 'ID del administrador del edificio',
        example: 'uuid-trabajador',
    })
    @IsNotEmpty({ message: 'El ID del administrador es obligatorio' })
    @IsUUID('4', { message: 'El ID del administrador debe ser un UUID válido' })
    idAdministradorEdificio: string;

    @ApiProperty({
        description: 'ID de las áreas comunes',
        example: 'uuid-area-comun',
        required: false,
    })
    @IsOptional()
    @IsUUID('4', { message: 'El ID de áreas comunes debe ser un UUID válido' })
    idAreasComunes?: string;

    @ApiProperty({
        description: 'ID de la inmobiliaria',
        example: 'uuid-inmobiliaria',
    })
    @IsNotEmpty({ message: 'El ID de la inmobiliaria es obligatorio' })
    @IsUUID('4', { message: 'El ID de la inmobiliaria debe ser un UUID válido' })
    idInmobiliaria: string;
}
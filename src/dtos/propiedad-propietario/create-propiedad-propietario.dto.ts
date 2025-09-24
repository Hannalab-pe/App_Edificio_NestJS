import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsUUID,
  IsOptional,
  ValidateNested,
  IsNumber,
  IsBoolean,
  IsDecimal,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

class PropiedadReferenceDto {
  @ApiProperty({
    description: 'Número del departamento de la propiedad existente',
    example: 'A-101',
    type: String,
  })
  @IsString({
    message: 'El número de departamento debe ser una cadena de texto',
  })
  @IsNotEmpty({ message: 'El número de departamento es obligatorio' })
  numeroDepartamento: string;
}

class DocumentoIdentidadDto {
  @ApiProperty({
    description: 'Número del documento de identidad',
    example: '12345678',
    type: String,
  })
  @IsString({ message: 'El número de documento debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El número de documento es obligatorio' })
  numeroDocumento: string;

  @ApiProperty({
    description: 'Tipo de documento de identidad',
    example: 'DNI',
    type: String,
  })
  @IsString({ message: 'El tipo de documento debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El tipo de documento es obligatorio' })
  tipoDocumento: string;
}

class UsuarioDto {
  @ApiProperty({
    description: 'Nombre de usuario',
    example: 'juanperez123',
    type: String,
  })
  @IsString({ message: 'El nombre de usuario debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre de usuario es obligatorio' })
  nombreUsuario: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'password123',
    type: String,
  })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  password: string;

  @ApiPropertyOptional({
    description: 'Rol del usuario',
    example: 'PROPIETARIO',
    type: String,
    default: 'PROPIETARIO',
  })
  @IsOptional()
  @IsString({ message: 'El rol debe ser una cadena de texto' })
  rol?: string;
}

class PropietarioDto {
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
    description: 'Datos del documento de identidad',
    type: DocumentoIdentidadDto,
  })
  @ValidateNested()
  @Type(() => DocumentoIdentidadDto)
  documentoIdentidad: DocumentoIdentidadDto;
}

export class CreatePropiedadPropietarioDto {
  @ApiProperty({
    description: 'Referencia a la propiedad existente',
    type: PropiedadReferenceDto,
  })
  @ValidateNested()
  @Type(() => PropiedadReferenceDto)
  propiedad: PropiedadReferenceDto;

  @ApiProperty({
    description: 'Datos del propietario',
    type: PropietarioDto,
  })
  @ValidateNested()
  @Type(() => PropietarioDto)
  propietario: PropietarioDto;

  @ApiPropertyOptional({
    description: 'Fecha de inicio de propiedad',
    example: '2024-01-01',
    type: Date,
  })
  @IsOptional()
  fechaInicio?: Date;

  @ApiPropertyOptional({
    description: 'Fecha de fin de propiedad',
    example: '2025-01-01',
    type: Date,
  })
  @IsOptional()
  fechaFin?: Date;

  @ApiPropertyOptional({
    description: 'Porcentaje de propiedad',
    example: 100.0,
    default: 100.0,
  })
  @IsOptional()
  @IsDecimal(
    { decimal_digits: '0,2' },
    { message: 'El porcentaje debe ser un número decimal válido' },
  )
  porcentajePropiedad?: string;

  @ApiPropertyOptional({
    description: 'Estado activo de la relación',
    example: true,
    type: Boolean,
    default: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'El estado debe ser un valor booleano' })
  estaActivo?: boolean;
}

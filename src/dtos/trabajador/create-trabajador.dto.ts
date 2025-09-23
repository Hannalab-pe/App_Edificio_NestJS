import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsDateString, IsDecimal, IsUUID, IsEnum, IsNumber } from 'class-validator';
import { TipoDocumentoIdentidad } from 'src/Enums/documento-identidad.enum';

export class CreateTrabajadorDto {
  @ApiProperty({
    description: 'Nombre del trabajador',
    example: 'Juan Carlos',
    type: String,
  })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  nombre: string;

  @ApiProperty({
    description: 'Apellido del trabajador',
    example: 'Pérez García',
    type: String,
  })
  @IsString({ message: 'El apellido debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  apellido: string;

  @ApiProperty({
    description: 'Correo electrónico del trabajador',
    example: 'trabajador@viveconecta.com',
    type: String,
  })
  @IsEmail({}, { message: 'El correo debe tener un formato válido' })
  @IsNotEmpty({ message: 'El correo es obligatorio' })
  correo: string;

  @ApiProperty({
    description: 'Contraseña para el usuario del trabajador',
    example: 'MiContraseña123!',
    type: String,
    minLength: 8,
  })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  contrasena: string;

  @ApiProperty({
    description: 'Confirmación de la contraseña',
    example: 'MiContraseña123!',
    type: String,
  })
  @IsString({ message: 'La confirmación de contraseña debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La confirmación de contraseña es obligatoria' })
  confirmarContrasena: string;

  @ApiProperty({
    description: 'Teléfono del trabajador',
    example: '+51987654321',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  telefono?: string;

  @ApiProperty({
    description: 'Fecha de nacimiento del trabajador',
    example: '1990-05-15',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha de nacimiento debe tener un formato válido (YYYY-MM-DD)' })
  fechaNacimiento?: string;

  @ApiProperty({
    description: 'Fecha de ingreso del trabajador',
    example: '2024-01-15',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha de ingreso debe tener un formato válido (YYYY-MM-DD)' })
  fechaIngreso?: string;

  @ApiProperty({
    description: 'Salario actual del trabajador',
    example: '2500.00',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsDecimal({ decimal_digits: '0,2' }, { message: 'El salario debe ser un número decimal válido' })
  salarioActual?: string;

  @ApiProperty({
    description: 'Tipo de documento de identidad',
    example: TipoDocumentoIdentidad.DNI,
    enum: TipoDocumentoIdentidad,
  })
  @IsEnum(TipoDocumentoIdentidad, { message: 'El tipo de documento debe ser uno de los valores válidos' })
  @IsNotEmpty({ message: 'El tipo de documento es obligatorio' })
  tipoDocumento: TipoDocumentoIdentidad;

  @ApiProperty({
    description: 'Número del documento de identidad',
    example: 12345678,
    type: Number,
  })
  @IsNumber({}, { message: 'El número debe ser un valor numérico' })
  @IsNotEmpty({ message: 'El número del documento es obligatorio' })
  numeroDocumento: number;

  @ApiProperty({
    description: 'ID del rol asignado al trabajador (opcional - por defecto será Trabajador)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsUUID('4', { message: 'El ID del rol debe ser un UUID válido' })
  idRol?: string;
}
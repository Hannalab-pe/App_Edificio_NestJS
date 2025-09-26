import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsOptional,
  IsDateString,
  ValidateNested,
  IsEmail,
  IsNumber,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateArrendatarioDto } from '../arrendatario/create-arrendatario.dto';

export class ArrendatarioDataDto {
  @ApiProperty({
    description: 'id Rol del arrendatario (se usará para crear el usuario)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString({ message: 'El id Rol debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El id Rol es obligatorio' })
  @IsOptional()
  idRol?: string; // Nuevo campo para el ID del rol

  @ApiProperty({
    description:
      'Correo electrónico del arrendatario (se usará para crear el usuario)',
    example: 'juan.perez@ejemplo.com',
  })
  @IsEmail({}, { message: 'El correo debe tener un formato válido' })
  @IsNotEmpty({ message: 'El correo es obligatorio' })
  correo: string;

  @ApiPropertyOptional({
    description: 'Teléfono secundario del arrendatario',
    example: '+51987654321',
  })
  @IsString({ message: 'El teléfono secundario debe ser una cadena de texto' })
  @IsOptional()
  telefonoSecundario?: string;

  @ApiPropertyOptional({
    description: 'Dirección de correspondencia',
    example: 'Av. Ejemplo 456, San Isidro, Lima',
  })
  @IsString({
    message: 'La dirección de correspondencia debe ser una cadena de texto',
  })
  @IsOptional()
  direccionCorrespondencia?: string;

  @ApiPropertyOptional({
    description: 'Ciudad de correspondencia',
    example: 'Lima',
  })
  @IsString({
    message: 'La ciudad de correspondencia debe ser una cadena de texto',
  })
  @IsOptional()
  ciudadCorrespondencia?: string;

  @ApiPropertyOptional({
    description: 'Ocupación o actividad del arrendatario',
    example: 'Ingeniero de Sistemas',
  })
  @IsString({ message: 'La ocupación debe ser una cadena de texto' })
  @IsOptional()
  ocupacionActividad?: string;

  @ApiPropertyOptional({
    description: 'Indica si es persona jurídica',
    example: false,
  })
  @IsOptional()
  esPersonaJuridica?: boolean;

  @ApiPropertyOptional({
    description: 'Nombre de la empresa (si es persona jurídica)',
    example: 'Tecnología Avanzada S.A.C.',
  })
  @IsString({ message: 'El nombre de empresa debe ser una cadena de texto' })
  @IsOptional()
  nombreEmpresa?: string;

  @ApiPropertyOptional({
    description: 'Ingresos aproximados mensuales',
    example: '5000.00',
  })
  @IsOptional()
  ingresosAproximados?: string;

  @ApiPropertyOptional({
    description: 'Capacidad de pago declarada',
    example: '2500.00',
  })
  @IsOptional()
  capacidadPagoDeclarada?: string;

  @ApiPropertyOptional({
    description: 'Nombre de referencia personal',
    example: 'María González',
  })
  @IsString({
    message: 'El nombre de referencia personal debe ser una cadena de texto',
  })
  @IsOptional()
  referenciaPersonalNombre?: string;

  @ApiPropertyOptional({
    description: 'Teléfono de referencia personal',
    example: '+51912345678',
  })
  @IsString({
    message: 'El teléfono de referencia personal debe ser una cadena de texto',
  })
  @IsOptional()
  referenciaPersonalTelefono?: string;

  @ApiPropertyOptional({
    description: 'Nombre de referencia comercial',
    example: 'Banco Continental',
  })
  @IsString({
    message: 'El nombre de referencia comercial debe ser una cadena de texto',
  })
  @IsOptional()
  referenciaComercialNombre?: string;

  @ApiPropertyOptional({
    description: 'Teléfono de referencia comercial',
    example: '+511234567',
  })
  @IsString({
    message: 'El teléfono de referencia comercial debe ser una cadena de texto',
  })
  @IsOptional()
  referenciaComercialTelefono?: string;

  @ApiPropertyOptional({
    description: 'Uso previsto del espacio',
    example: 'Oficina para consultoría tecnológica',
  })
  @IsString({ message: 'El uso previsto debe ser una cadena de texto' })
  @IsOptional()
  usoPrevisto?: string;

  @ApiPropertyOptional({
    description: 'Horario de uso previsto',
    example: 'Lunes a Viernes 8:00 AM - 6:00 PM',
  })
  @IsString({ message: 'El horario de uso debe ser una cadena de texto' })
  @IsOptional()
  horarioUsoPrevisto?: string;

  @ApiPropertyOptional({
    description: 'Indica si requiere modificaciones al espacio',
    example: false,
  })
  @IsOptional()
  requiereModificaciones?: boolean;

  @ApiPropertyOptional({
    description: 'Detalle de las modificaciones requeridas',
    example: 'Instalación de divisiones de oficina',
  })
  @IsString({
    message: 'Las modificaciones requeridas deben ser una cadena de texto',
  })
  @IsOptional()
  modificacionesRequeridas?: string;

  // Datos del documento de identidad (se creará automáticamente)
  @ApiProperty({
    description: 'Tipo de documento de identidad',
    example: 'DNI',
    enum: ['DNI', 'PASAPORTE', 'CARNET_EXTRANJERIA', 'RUC'],
  })
  @IsString({ message: 'El tipo de documento debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El tipo de documento es obligatorio' })
  tipoDocumento: string;

  @ApiProperty({
    description: 'Número del documento de identidad',
    example: 12345678,
    type: Number,
  })
  @IsNotEmpty({ message: 'El número del documento es obligatorio' })
  numeroDocumento: number;

  // Datos del vehículo
  @ApiPropertyOptional({
    description: 'Placa del vehículo',
    example: 'ABC-123',
  })
  @IsString({ message: 'La placa del vehículo debe ser una cadena de texto' })
  @IsOptional()
  placaVehiculo?: string;

  @ApiPropertyOptional({
    description: 'Marca del vehículo',
    example: 'Toyota',
  })
  @IsString({ message: 'La marca del vehículo debe ser una cadena de texto' })
  @IsOptional()
  marcaVehiculo?: string;

  @ApiPropertyOptional({
    description: 'Modelo del vehículo',
    example: 'Corolla',
  })
  @IsString({ message: 'El modelo del vehículo debe ser una cadena de texto' })
  @IsOptional()
  modeloVehiculo?: string;

  @ApiPropertyOptional({
    description: 'Color del vehículo',
    example: 'Blanco',
  })
  @IsString({ message: 'El color del vehículo debe ser una cadena de texto' })
  @IsOptional()
  colorVehiculo?: string;

  @ApiPropertyOptional({
    description: 'Tipo del vehículo',
    example: 'Sedán',
  })
  @IsString({ message: 'El tipo del vehículo debe ser una cadena de texto' })
  @IsOptional()
  tipoVehiculo?: string;
}

export class CreateArrendamientoCompletoDto {
  @ApiProperty({
    description: 'ID del espacio arrendable',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID('4', { message: 'El ID del espacio debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El ID del espacio es obligatorio' })
  espacioId: string;

  @ApiProperty({
    description: 'Datos del arrendatario',
    type: ArrendatarioDataDto,
  })
  @ValidateNested()
  @Type(() => ArrendatarioDataDto)
  @IsNotEmpty({ message: 'Los datos del arrendatario son obligatorios' })
  arrendatario: ArrendatarioDataDto;

  @ApiProperty({
    description: 'Fecha de inicio del arrendamiento',
    example: '2024-01-15',
  })
  @IsDateString({}, { message: 'La fecha de inicio debe ser una fecha válida' })
  @IsNotEmpty({ message: 'La fecha de inicio es obligatoria' })
  fechaInicio: string;

  @ApiPropertyOptional({
    description: 'Fecha de fin del arrendamiento',
    example: '2024-12-15',
  })
  @IsDateString({}, { message: 'La fecha de fin debe ser una fecha válida' })
  @IsOptional()
  fechaFin?: string;

  @ApiProperty({
    description: 'Monto mensual del arrendamiento',
    example: 2500.00,
    type: Number,
  })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'El monto mensual debe ser un número válido con máximo 2 decimales' }
  )
  @Min(0, { message: 'El monto mensual debe ser mayor o igual a 0' })
  @IsNotEmpty({ message: 'El monto mensual es obligatorio' })
  montoMensual: number;

  @ApiPropertyOptional({
    description: 'Depósito del arrendamiento',
    example: 5000.00,
    type: Number,
  })
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'El depósito debe ser un número válido con máximo 2 decimales' }
  )
  @Min(0, { message: 'El depósito debe ser mayor o igual a 0' })
  deposito?: number;

  @ApiPropertyOptional({
    description: 'Observaciones del arrendamiento',
    example: 'Contrato con opción a renovación automática',
  })
  @IsString({ message: 'Las observaciones deben ser una cadena de texto' })
  @IsOptional()
  observaciones?: string;

  @ApiPropertyOptional({
    description:
      'ID del usuario que registra (se asigna automáticamente en el backend)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID('4', {
    message: 'El ID del usuario registrador debe ser un UUID válido',
  })
  @IsOptional()
  registradoPor?: string;
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsUUID,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsDecimal,
  MaxLength,
  IsPhoneNumber,
} from 'class-validator';

export class CreateArrendatarioDto {
  @ApiPropertyOptional({
    description: 'Teléfono secundario del arrendatario',
    example: '+51987654321',
    maxLength: 15,
  })
  @IsString({ message: 'El teléfono secundario debe ser una cadena de texto' })
  @MaxLength(15, {
    message: 'El teléfono secundario no puede exceder 15 caracteres',
  })
  @IsOptional()
  telefonoSecundario?: string;

  @ApiPropertyOptional({
    description: 'Dirección de correspondencia',
    example: 'Av. Ejemplo 456, San Isidro, Lima',
    maxLength: 200,
  })
  @IsString({
    message: 'La dirección de correspondencia debe ser una cadena de texto',
  })
  @MaxLength(200, {
    message: 'La dirección de correspondencia no puede exceder 200 caracteres',
  })
  @IsOptional()
  direccionCorrespondencia?: string;

  @ApiPropertyOptional({
    description: 'Ciudad de correspondencia',
    example: 'Lima',
    maxLength: 100,
  })
  @IsString({
    message: 'La ciudad de correspondencia debe ser una cadena de texto',
  })
  @MaxLength(100, {
    message: 'La ciudad de correspondencia no puede exceder 100 caracteres',
  })
  @IsOptional()
  ciudadCorrespondencia?: string;

  @ApiPropertyOptional({
    description: 'Ocupación o actividad del arrendatario',
    example: 'Ingeniero de Sistemas',
    maxLength: 150,
  })
  @IsString({ message: 'La ocupación debe ser una cadena de texto' })
  @MaxLength(150, { message: 'La ocupación no puede exceder 150 caracteres' })
  @IsOptional()
  ocupacionActividad?: string;

  @ApiPropertyOptional({
    description: 'Indica si es persona jurídica',
    example: false,
    default: false,
  })
  @IsBoolean({ message: 'Debe especificar si es persona jurídica' })
  @IsOptional()
  esPersonaJuridica?: boolean;

  @ApiPropertyOptional({
    description: 'Nombre de la empresa (si es persona jurídica)',
    example: 'Tecnología Avanzada S.A.C.',
    maxLength: 150,
  })
  @IsString({ message: 'El nombre de empresa debe ser una cadena de texto' })
  @MaxLength(150, {
    message: 'El nombre de empresa no puede exceder 150 caracteres',
  })
  @IsOptional()
  nombreEmpresa?: string;

  @ApiPropertyOptional({
    description: 'Ingresos aproximados mensuales',
    example: '5000.00',
    type: String,
  })
  @IsOptional()
  ingresosAproximados?: string;

  @ApiPropertyOptional({
    description: 'Capacidad de pago declarada',
    example: '2500.00',
    type: String,
  })
  @IsOptional()
  capacidadPagoDeclarada?: string;

  @ApiPropertyOptional({
    description: 'Nombre de referencia personal',
    example: 'María González',
    maxLength: 100,
  })
  @IsString({
    message: 'El nombre de referencia personal debe ser una cadena de texto',
  })
  @MaxLength(100, {
    message: 'El nombre de referencia personal no puede exceder 100 caracteres',
  })
  @IsOptional()
  referenciaPersonalNombre?: string;

  @ApiPropertyOptional({
    description: 'Teléfono de referencia personal',
    example: '+51912345678',
    maxLength: 15,
  })
  @IsString({
    message: 'El teléfono de referencia personal debe ser una cadena de texto',
  })
  @MaxLength(15, {
    message:
      'El teléfono de referencia personal no puede exceder 15 caracteres',
  })
  @IsOptional()
  referenciaPersonalTelefono?: string;

  @ApiPropertyOptional({
    description: 'Nombre de referencia comercial',
    example: 'Banco Continental',
    maxLength: 100,
  })
  @IsString({
    message: 'El nombre de referencia comercial debe ser una cadena de texto',
  })
  @MaxLength(100, {
    message:
      'El nombre de referencia comercial no puede exceder 100 caracteres',
  })
  @IsOptional()
  referenciaComercialNombre?: string;

  @ApiPropertyOptional({
    description: 'Teléfono de referencia comercial',
    example: '+511234567',
    maxLength: 15,
  })
  @IsString({
    message: 'El teléfono de referencia comercial debe ser una cadena de texto',
  })
  @MaxLength(15, {
    message:
      'El teléfono de referencia comercial no puede exceder 15 caracteres',
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
    maxLength: 100,
  })
  @IsString({ message: 'El horario de uso debe ser una cadena de texto' })
  @MaxLength(100, {
    message: 'El horario de uso no puede exceder 100 caracteres',
  })
  @IsOptional()
  horarioUsoPrevisto?: string;

  @ApiPropertyOptional({
    description: 'Indica si requiere modificaciones al espacio',
    example: false,
    default: false,
  })
  @IsBoolean({ message: 'Debe especificar si requiere modificaciones' })
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

  @ApiPropertyOptional({
    description: 'URL del documento de cédula o identificación',
    example: 'https://storage.example.com/docs/cedula_123456.pdf',
    maxLength: 255,
  })
  @IsString({
    message: 'La URL del documento de cédula debe ser una cadena de texto',
  })
  @MaxLength(255, {
    message: 'La URL del documento de cédula no puede exceder 255 caracteres',
  })
  @IsOptional()
  cedulaDocumentoUrl?: string;

  @ApiPropertyOptional({
    description: 'URL de las referencias',
    example: 'https://storage.example.com/docs/referencias_123456.pdf',
    maxLength: 255,
  })
  @IsString({ message: 'La URL de referencias debe ser una cadena de texto' })
  @MaxLength(255, {
    message: 'La URL de referencias no puede exceder 255 caracteres',
  })
  @IsOptional()
  referenciasUrl?: string;

  @ApiPropertyOptional({
    description: 'Placa del vehículo',
    example: 'ABC-123',
    maxLength: 10,
  })
  @IsString({ message: 'La placa del vehículo debe ser una cadena de texto' })
  @MaxLength(10, {
    message: 'La placa del vehículo no puede exceder 10 caracteres',
  })
  @IsOptional()
  placaVehiculo?: string;

  @ApiPropertyOptional({
    description: 'Marca del vehículo',
    example: 'Toyota',
    maxLength: 50,
  })
  @IsString({ message: 'La marca del vehículo debe ser una cadena de texto' })
  @MaxLength(50, {
    message: 'La marca del vehículo no puede exceder 50 caracteres',
  })
  @IsOptional()
  marcaVehiculo?: string;

  @ApiPropertyOptional({
    description: 'Modelo del vehículo',
    example: 'Corolla',
    maxLength: 50,
  })
  @IsString({ message: 'El modelo del vehículo debe ser una cadena de texto' })
  @MaxLength(50, {
    message: 'El modelo del vehículo no puede exceder 50 caracteres',
  })
  @IsOptional()
  modeloVehiculo?: string;

  @ApiPropertyOptional({
    description: 'Color del vehículo',
    example: 'Blanco',
    maxLength: 30,
  })
  @IsString({ message: 'El color del vehículo debe ser una cadena de texto' })
  @MaxLength(30, {
    message: 'El color del vehículo no puede exceder 30 caracteres',
  })
  @IsOptional()
  colorVehiculo?: string;

  @ApiPropertyOptional({
    description: 'Tipo del vehículo',
    example: 'Sedán',
    maxLength: 20,
  })
  @IsString({ message: 'El tipo del vehículo debe ser una cadena de texto' })
  @MaxLength(20, {
    message: 'El tipo del vehículo no puede exceder 20 caracteres',
  })
  @IsOptional()
  tipoVehiculo?: string;

  @ApiPropertyOptional({
    description: 'Observaciones de verificación',
    example: 'Documentos verificados correctamente',
  })
  @IsString({ message: 'Las observaciones deben ser una cadena de texto' })
  @IsOptional()
  observacionesVerificacion?: string;

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

  @ApiPropertyOptional({
    description:
      'ID del usuario asociado (se genera automáticamente si no se proporciona)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID('4', { message: 'El ID del usuario debe ser un UUID válido' })
  @IsOptional()
  idUsuario?: string;

  @ApiPropertyOptional({
    description: 'ID del usuario que registra (se asigna automáticamente)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID('4', { message: 'El ID de quien registra debe ser un UUID válido' })
  @IsOptional()
  registradoPor?: string;
}

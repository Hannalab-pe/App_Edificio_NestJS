import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsUUID, IsOptional, IsDecimal, IsDateString, IsEnum, IsUrl } from 'class-validator';
import { Transform } from 'class-transformer';
import { EstadoPago, MetodoPago } from 'src/Enums/globales.enum'; 

export class UpdatePagoDto {

    @ApiPropertyOptional({
        description: 'Monto del pago',
        example: 350.75,
        type: Number,
    })
    @IsOptional()
    @Transform(({ value }) => parseFloat(value))
    @IsDecimal({ decimal_digits: '1,2' }, { message: 'El monto debe ser un número decimal válido' })
    monto?: number;

    @ApiPropertyOptional({
        description: 'Fecha de vencimiento del pago',
        example: '2025-10-15',
        type: String,
        format: 'date',
    })
    @IsOptional()
    @IsDateString({}, { message: 'La fecha de vencimiento debe ser una fecha válida' })
    fechaVencimiento?: string;

    @ApiPropertyOptional({
        description: 'Fecha en que se realizó el pago',
        example: '2025-10-10',
        type: String,
        format: 'date',
    })
    @IsOptional()
    @IsDateString({}, { message: 'La fecha de pago debe ser una fecha válida' })
    fechaPago?: string;

    @ApiPropertyOptional({
        description: 'Estado del pago',
        example: EstadoPago.PAGADO,
        enum: EstadoPago,
    })
    @IsOptional()
    @IsEnum(EstadoPago, { message: 'El estado debe ser uno de los valores válidos' })
    estado?: EstadoPago;

    @ApiPropertyOptional({
        description: 'Descripción del pago',
        example: 'Pago de mantenimiento del mes de octubre',
        type: String,
    })
    @IsOptional()
    @IsString({ message: 'La descripción debe ser una cadena de texto' })
    descripcion?: string;

    @ApiPropertyOptional({
        description: 'Método de pago utilizado',
        example: MetodoPago.TRANSFERENCIA,
        enum: MetodoPago,
    })
    @IsOptional()
    @IsEnum(MetodoPago, { message: 'El método de pago debe ser uno de los valores válidos' })
    metodoPago?: MetodoPago;

    @ApiPropertyOptional({
        description: 'Referencia del pago (número de transacción, etc.)',
        example: 'TXN-20250923-001',
        type: String,
    })
    @IsOptional()
    @IsString({ message: 'La referencia de pago debe ser una cadena de texto' })
    referenciaPago?: string;

    @ApiPropertyOptional({
        description: 'URL del comprobante de pago',
        example: 'https://ejemplo.com/comprobantes/pago-001.pdf',
        type: String,
    })
    @IsOptional()
    @IsUrl({}, { message: 'La URL del comprobante debe ser una URL válida' })
    comprobanteUrl?: string;

    @ApiPropertyOptional({
        description: 'ID del concepto de pago',
        example: '123e4567-e89b-12d3-a456-426614174000',
        type: String,
    })
    @IsOptional()
    @IsUUID('4', { message: 'El ID del concepto de pago debe ser un UUID válido' })
    idConceptoPago?: string;

    @ApiPropertyOptional({
        description: 'ID de la residencia asociada',
        example: '123e4567-e89b-12d3-a456-426614174000',
        type: String,
    })
    @IsOptional()
    @IsUUID('4', { message: 'El ID de la residencia debe ser un UUID válido' })
    idResidencia?: string;

    @ApiPropertyOptional({
        description: 'ID del arrendamiento asociado',
        example: '123e4567-e89b-12d3-a456-426614174000',
        type: String,
    })
    @IsOptional()
    @IsUUID('4', { message: 'El ID del arrendamiento debe ser un UUID válido' })
    idArrendamiento?: string;
}
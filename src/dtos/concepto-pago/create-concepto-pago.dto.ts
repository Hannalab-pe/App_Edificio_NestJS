import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateConceptoPagoDto {
    @ApiProperty({
        description: 'Nombre del concepto de pago',
        example: 'Mantenimiento Mensual'
    })
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    @IsString({ message: 'El nombre debe ser un texto' })
    nombre: string;

    @ApiProperty({
        description: 'Descripción detallada del concepto de pago',
        example: 'Pago mensual por mantenimiento de áreas comunes',
        required: false
    })
    @IsOptional()
    @IsString({ message: 'La descripción debe ser un texto' })
    descripcion?: string;

    @ApiProperty({
        description: 'Monto base del concepto de pago',
        example: 150.00
    })
    @IsNotEmpty({ message: 'El monto base es obligatorio' })
    @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El monto base debe ser un número válido con máximo 2 decimales' })
    @Min(0, { message: 'El monto base debe ser mayor o igual a 0' })
    montoBase: number;

    @ApiProperty({
        description: 'Indica si el monto es variable',
        example: false,
        default: false
    })
    @IsOptional()
    @IsBoolean({ message: 'esVariable debe ser un valor booleano' })
    esVariable?: boolean;

    @ApiProperty({
        description: 'Frecuencia del pago',
        example: 'Ordinario (Pagos Mensuales) o Extraordinario (Pagos Únicos)',

    })
    @IsNotEmpty({ message: 'La frecuencia es obligatoria' })
    @IsString({ message: 'La frecuencia debe ser un texto' })
    frecuencia: string;

    @ApiProperty({
        description: 'Indica si el pago es obligatorio',
        example: true,
        default: true
    })
    @IsOptional()
    @IsBoolean({ message: 'obligatorio debe ser un valor booleano' })
    obligatorio?: boolean;

    @ApiProperty({
        description: 'Indica si el concepto está activo',
        example: true,
        default: true
    })
    @IsOptional()
    @IsBoolean({ message: 'estaActivo debe ser un valor booleano' })
    estaActivo?: boolean;
}
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional, Min, Max, IsDecimal, Length, IsBoolean } from 'class-validator';
import { EstadosGlobales } from 'src/Enums/globales.enum';

export class CreatePresupuestoDto {

    @ApiProperty({
        description: 'Año del presupuesto',
        example: 2024,
        minimum: 2020,
        maximum: 2100
    })
    @IsNumber({}, { message: 'El año debe ser un número válido' })
    @IsNotEmpty({ message: 'El año es obligatorio' })
    @Min(2020, { message: 'El año debe ser mayor o igual a 2020' })
    @Max(2100, { message: 'El año debe ser menor o igual a 2100' })
    anio: number;

    @ApiProperty({
        description: 'Mes del presupuesto',
        example: 3,
        minimum: 1,
        maximum: 12
    })
    @IsNumber({}, { message: 'El mes debe ser un número válido' })
    @IsNotEmpty({ message: 'El mes es obligatorio' })
    @Min(1, { message: 'El mes debe ser entre 1 y 12' })
    @Max(12, { message: 'El mes debe ser entre 1 y 12' })
    mes: number;

    @ApiProperty({
        description: 'Concepto del presupuesto',
        example: 'Mantenimiento de ascensores',
        maxLength: 255
    })
    @IsString({ message: 'El concepto debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'El concepto es obligatorio' })
    @Length(1, 255, { message: 'El concepto debe tener entre 1 y 255 caracteres' })
    concepto: string;

    @ApiProperty({
        description: 'Monto presupuestado en formato decimal',
        example: '15000.50',
        type: 'string'
    })
    @IsString({ message: 'El monto presupuestado debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'El monto presupuestado es obligatorio' })
    @IsDecimal({ decimal_digits: '0,2' }, { message: 'El monto presupuestado debe ser un decimal válido con máximo 2 decimales' })
    montoPresupuestado: string;

    @ApiProperty({
        description: 'Monto ejecutado en formato decimal (opcional)',
        example: '8500.75',
        type: 'string',
        required: false
    })
    @IsOptional()
    @IsString({ message: 'El monto ejecutado debe ser una cadena de texto' })
    @IsDecimal({ decimal_digits: '0,2' }, { message: 'El monto ejecutado debe ser un decimal válido con máximo 2 decimales' })
    montoEjecutado?: string;

    @ApiProperty({
        description: 'Estado activo del presupuesto (opcional, por defecto true)',
        example: true,
        required: false,
        default: true
    })
    @IsOptional()
    @IsBoolean({ message: 'El estado activo debe ser un valor booleano' })
    estaActivo?: boolean;

    @ApiProperty({
        description: 'Descripción adicional del presupuesto (opcional)',
        example: 'Presupuesto para el mantenimiento preventivo y correctivo de los ascensores del edificio',
        required: false
    })
    @IsOptional()
    @IsString({ message: 'La descripción debe ser una cadena de texto' })
    descripcion?: string;
}
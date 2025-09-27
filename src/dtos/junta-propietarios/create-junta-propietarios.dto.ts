import { ApiProperty } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsString,
    IsUUID,
    IsDateString,
    IsOptional,
    IsInt,
    IsBoolean,
    Min,
    IsUrl
} from 'class-validator';

export class CreateJuntaPropietariosDto {
    @ApiProperty({
        description: 'Número único del acta de la junta',
        example: 'ACTA-2024-001',
        type: String,
    })
    @IsString({ message: 'El número de acta debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'El número de acta es obligatorio' })
    numeroActa: string;

    @ApiProperty({
        description: 'Fecha de realización de la junta',
        example: '2024-09-26',
        type: String,
    })
    @IsDateString({}, { message: 'La fecha de junta debe ser una fecha válida' })
    @IsNotEmpty({ message: 'La fecha de junta es obligatoria' })
    fechaJunta: string;

    @ApiProperty({
        description: 'Tipo de junta de propietarios',
        example: 'Ordinaria',
        enum: ['Ordinaria', 'Extraordinaria', 'Constitutiva'],
    })
    @IsString({ message: 'El tipo de junta debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'El tipo de junta es obligatorio' })
    tipoJunta: string;

    @ApiProperty({
        description: 'Número de asistentes a la junta',
        example: 15,
        type: Number,
        required: false,
    })
    @IsOptional()
    @IsInt({ message: 'El número de asistentes debe ser un número entero' })
    @Min(0, { message: 'El número de asistentes no puede ser negativo' })
    asistentesCount?: number;

    @ApiProperty({
        description: 'Indica si se alcanzó el quórum necesario',
        example: true,
        type: Boolean,
        required: false,
    })
    @IsOptional()
    @IsBoolean({ message: 'El quórum alcanzado debe ser un valor booleano' })
    quorumAlcanzado?: boolean;

    @ApiProperty({
        description: 'Estado actual de la junta',
        example: 'Programada',
        enum: ['Programada', 'En Curso', 'Finalizada', 'Cancelada'],
    })
    @IsString({ message: 'El estado debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'El estado es obligatorio' })
    estado: string;

    @ApiProperty({
        description: 'Resumen de la junta y acuerdos tomados',
        example: 'Junta ordinaria para aprobación del presupuesto anual...',
        type: String,
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'El resumen debe ser una cadena de texto' })
    resumen?: string;

    @ApiProperty({
        description: 'ID del usuario que creó la junta (encargado)',
        example: '123e4567-e89b-12d3-a456-426614174000',
        type: String,
    })
    @IsUUID('4', { message: 'El ID del creador debe ser un UUID válido' })
    @IsNotEmpty({ message: 'El ID del creador es obligatorio' })
    creadoPor: string;

    // Datos del documento asociado
    @ApiProperty({
        description: 'URL del documento de la junta (acta, anexos, etc.)',
        example: 'https://storage.example.com/documents/acta-junta-001.pdf',
        type: String,
    })
    @IsUrl({}, { message: 'La URL del documento debe ser una URL válida' })
    @IsNotEmpty({ message: 'La URL del documento es obligatoria' })
    urlDocumento: string;

    @ApiProperty({
        description: 'Descripción del documento subido',
        example: 'Acta de junta ordinaria con acuerdos y votaciones',
        type: String,
    })
    @IsString({ message: 'La descripción del documento debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'La descripción del documento es obligatoria' })
    descripcionDocumento: string;

    @ApiProperty({
        description: 'ID del tipo de documento',
        example: '123e4567-e89b-12d3-a456-426614174001',
        type: String,
    })
    @IsUUID('4', { message: 'El ID del tipo de documento debe ser un UUID válido' })
    @IsNotEmpty({ message: 'El ID del tipo de documento es obligatorio' })
    idTipoDocumento: string;

    @ApiProperty({
        description: 'ID del trabajador que procesa el documento',
        example: '123e4567-e89b-12d3-a456-426614174002',
        type: String,
    })
    @IsUUID('4', { message: 'El ID del trabajador debe ser un UUID válido' })
    @IsNotEmpty({ message: 'El ID del trabajador es obligatorio' })
    idTrabajador: string;
}
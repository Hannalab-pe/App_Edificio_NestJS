import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateJuntaPropietariosDto } from './create-junta-propietarios.dto';
import {
    IsOptional,
    IsString,
    IsUUID,
    IsDateString,
    IsInt,
    IsBoolean,
    Min,
    IsUrl
} from 'class-validator';

export class UpdateJuntaPropietariosDto extends PartialType(CreateJuntaPropietariosDto) {
    @ApiProperty({
        description: 'Número único del acta de la junta',
        example: 'ACTA-2024-001',
        type: String,
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'El número de acta debe ser una cadena de texto' })
    numeroActa?: string;

    @ApiProperty({
        description: 'Fecha de realización de la junta',
        example: '2024-09-26',
        type: String,
        required: false,
    })
    @IsOptional()
    @IsDateString({}, { message: 'La fecha de junta debe ser una fecha válida' })
    fechaJunta?: string;

    @ApiProperty({
        description: 'Tipo de junta de propietarios',
        example: 'Ordinaria',
        enum: ['Ordinaria', 'Extraordinaria', 'Constitutiva'],
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'El tipo de junta debe ser una cadena de texto' })
    tipoJunta?: string;

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
        example: 'Finalizada',
        enum: ['Programada', 'En Curso', 'Finalizada', 'Cancelada'],
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'El estado debe ser una cadena de texto' })
    estado?: string;

    @ApiProperty({
        description: 'Resumen de la junta y acuerdos tomados',
        example: 'Junta ordinaria finalizada con aprobación del presupuesto...',
        type: String,
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'El resumen debe ser una cadena de texto' })
    resumen?: string;

    // Campos opcionales para actualizar documento
    @ApiProperty({
        description: 'Nueva URL del documento (opcional)',
        example: 'https://storage.example.com/documents/acta-junta-001-final.pdf',
        type: String,
        required: false,
    })
    @IsOptional()
    @IsUrl({}, { message: 'La URL del documento debe ser una URL válida' })
    urlDocumento?: string;

    @ApiProperty({
        description: 'Nueva descripción del documento (opcional)',
        example: 'Acta final de junta con firmas y anexos',
        type: String,
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'La descripción del documento debe ser una cadena de texto' })
    descripcionDocumento?: string;

    @ApiProperty({
        description: 'Nuevo ID del tipo de documento (opcional)',
        example: '123e4567-e89b-12d3-a456-426614174001',
        type: String,
        required: false,
    })
    @IsOptional()
    @IsUUID('4', { message: 'El ID del tipo de documento debe ser un UUID válido' })
    idTipoDocumento?: string;
}
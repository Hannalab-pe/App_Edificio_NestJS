import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsEnum } from 'class-validator';
import { TipoDocumentoIdentidad } from '../../Enums/documento-identidad.enum';

export class UpdateDocumentoIdentidadDto {
    @ApiPropertyOptional({
        description: 'Tipo de documento de identidad',
        example: TipoDocumentoIdentidad.DNI,
        enum: TipoDocumentoIdentidad,
    })
    @IsOptional()
    @IsEnum(TipoDocumentoIdentidad, { message: 'El tipo de documento debe ser uno de los valores válidos' })
    tipoDocumento?: TipoDocumentoIdentidad;

    @ApiPropertyOptional({
        description: 'Número del documento de identidad',
        example: 12345678,
        type: Number,
    })
    @IsOptional()
    @IsNumber({}, { message: 'El número debe ser un valor numérico' })
    numero?: number;
}
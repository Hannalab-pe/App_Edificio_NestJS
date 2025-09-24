import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsEnum } from 'class-validator';
import { TipoDocumentoIdentidad } from 'src/Enums/documento-identidad.enum';

export class CreateDocumentoIdentidadDto {
  @ApiProperty({
    description: 'Tipo de documento de identidad',
    example: TipoDocumentoIdentidad.DNI,
    enum: TipoDocumentoIdentidad,
  })
  @IsEnum(TipoDocumentoIdentidad, {
    message: 'El tipo de documento debe ser uno de los valores válidos',
  })
  @IsNotEmpty({ message: 'El tipo de documento es obligatorio' })
  tipoDocumento: TipoDocumentoIdentidad;

  @ApiProperty({
    description: 'Número del documento de identidad',
    example: 12345678,
    type: Number,
  })
  @IsNumber({}, { message: 'El número debe ser un valor numérico' })
  @IsNotEmpty({ message: 'El número del documento es obligatorio' })
  numero: number;
}

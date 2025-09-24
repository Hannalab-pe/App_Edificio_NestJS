import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsUUID, IsOptional, IsUrl } from 'class-validator';

export class UpdateDocumentoDto {
  @ApiPropertyOptional({
    description: 'URL donde se encuentra almacenado el documento',
    example: 'https://storage.example.com/documents/doc-123.pdf',
    type: String,
  })
  @IsOptional()
  @IsUrl({}, { message: 'La URL del documento debe ser una URL válida' })
  urlDocumento?: string;

  @ApiPropertyOptional({
    description: 'Descripción del documento',
    example: 'Contrato de arrendamiento firmado',
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  descripcion?: string;

  @ApiPropertyOptional({
    description: 'ID del tipo de documento',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsOptional()
  @IsUUID('4', {
    message: 'El ID del tipo de documento debe ser un UUID válido',
  })
  idTipoDocumento?: string;

  @ApiPropertyOptional({
    description: 'ID del trabajador que gestiona el documento',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsOptional()
  @IsUUID('4', { message: 'El ID del trabajador debe ser un UUID válido' })
  idTrabajador?: string;
}

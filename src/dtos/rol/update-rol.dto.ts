import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateRolDto {
  @ApiPropertyOptional({
    description: 'Nombre del rol',
    example: 'Administrador',
    type: String,
  })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsOptional()
  nombre?: string;

  @ApiPropertyOptional({
    description: 'Descripción del rol',
    example: 'Rol con permisos completos de administración',
    type: String,
  })
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @IsOptional()
  descripcion?: string;
}

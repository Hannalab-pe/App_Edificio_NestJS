import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../baseResponse/baseResponse.dto';

// DTO para datos del perfil de usuario (simplificado)
export class ProfileDataDto {
  @ApiProperty({
    description: 'ID único del usuario',
    example: 'uuid-del-usuario',
  })
  idUsuario: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'admin@viveconecta.com',
  })
  correo: string;

  @ApiProperty({
    description: 'Estado activo del usuario',
    example: true,
  })
  estaActivo: boolean;

  @ApiProperty({
    description: 'Información del rol del usuario',
    example: {
      idRol: 'uuid-del-rol',
      nombre: 'Administrador',
      descripcion: 'Administrador del sistema'
    }
  })
  idRol: any;
}

// DTO de respuesta del perfil usando BaseResponseDto
export class ProfileResponseDto extends BaseResponseDto<ProfileDataDto> {
  @ApiProperty({
    description: 'Datos del perfil del usuario',
    type: ProfileDataDto,
  })
  declare data: ProfileDataDto;
}
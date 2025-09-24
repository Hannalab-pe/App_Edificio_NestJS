import { ApiProperty } from '@nestjs/swagger';
import { Usuario } from '../../entities/Usuario';
import { BaseResponseDto } from '../baseResponse/baseResponse.dto';

// DTO para los datos del login
export class LoginDataDto {
  @ApiProperty({
    description: 'Token JWT para autenticación',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  @ApiProperty({
    description: 'Información del usuario autenticado',
    type: () => Usuario,
  })
  user: Usuario;
}

// DTO principal de respuesta del login usando BaseResponseDto
export class LoginResponseDto extends BaseResponseDto<LoginDataDto> {
  @ApiProperty({
    description: 'Datos de la respuesta del login',
    type: LoginDataDto,
  })
  declare data: LoginDataDto;
}

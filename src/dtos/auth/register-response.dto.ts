import { ApiProperty } from '@nestjs/swagger';
import { Usuario } from '../../entities/Usuario';
import { BaseResponseDto } from '../baseResponse/baseResponse.dto';

// DTO para los datos del registro
export class RegisterDataDto {
  @ApiProperty({
    description: 'Token JWT para autenticación automática tras registro',
    example: 'eyJhbGciOiJIUz9...',
  })
  access_token: string;

  @ApiProperty({
    description: 'Información del usuario recién creado',
    type: Usuario,
  })
  user: Usuario;
}

// DTO principal de respuesta del registro usando BaseResponseDto
export class RegisterResponseDto extends BaseResponseDto<RegisterDataDto> {
  @ApiProperty({
    description: 'Datos de la respuesta del registro',
    type: RegisterDataDto,
  })
  declare data: RegisterDataDto;
}

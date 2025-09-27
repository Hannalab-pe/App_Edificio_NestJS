import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../baseResponse/baseResponse.dto';
import { UsuarioResponseDto } from './usuario-response.dto';

export declare class UsuarioSingleResponseDto extends BaseResponseDto<UsuarioResponseDto> {
  @ApiProperty({
    description: 'Datos del usuario',
    type: UsuarioResponseDto
  })
  data: UsuarioResponseDto;
}
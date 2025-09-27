import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../baseResponse/baseResponse.dto';
import { UsuarioResponseDto } from './usuario-response.dto';

export declare class UsuarioArrayResponseDto extends BaseResponseDto<
  UsuarioResponseDto[]
> {
  @ApiProperty({
    description: 'Lista de usuarios',
    type: [UsuarioResponseDto],
  })
  data: UsuarioResponseDto[];
}

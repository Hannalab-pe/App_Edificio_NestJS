import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../baseResponse/baseResponse.dto';
import { PropietarioResponseDto } from './propietario-response.dto';

export class PropietarioSingleResponseDto extends BaseResponseDto<PropietarioResponseDto> {
  @ApiProperty({
    description: 'Datos del propietario',
    type: PropietarioResponseDto,
  })
  declare data: PropietarioResponseDto;
}

export class PropietarioArrayResponseDto extends BaseResponseDto<
  PropietarioResponseDto[]
> {
  @ApiProperty({
    description: 'Lista de propietarios',
    type: [PropietarioResponseDto],
    isArray: true,
  })
  declare data: PropietarioResponseDto[];
}

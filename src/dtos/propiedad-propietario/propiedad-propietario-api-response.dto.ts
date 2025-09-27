import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../baseResponse/baseResponse.dto';
import { PropiedadPropietarioResponseDto } from './propiedad-propietario-response.dto';

export class PropiedadPropietarioSingleResponseDto extends BaseResponseDto<PropiedadPropietarioResponseDto> {
  @ApiProperty({
    description: 'Datos de la relación propiedad-propietario',
    type: PropiedadPropietarioResponseDto,
  })
  declare data: PropiedadPropietarioResponseDto;
}

export class PropiedadPropietarioArrayResponseDto extends BaseResponseDto<
  PropiedadPropietarioResponseDto[]
> {
  @ApiProperty({
    description: 'Lista de relaciones propiedad-propietario',
    type: [PropiedadPropietarioResponseDto],
    isArray: true,
  })
  declare data: PropiedadPropietarioResponseDto[];
}

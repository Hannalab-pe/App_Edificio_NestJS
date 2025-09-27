import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../baseResponse/baseResponse.dto';
import { ResidenciaResponseDto } from './residencia-response.dto';

export class ResidenciaSingleResponseDto extends BaseResponseDto<ResidenciaResponseDto> {
  @ApiProperty({
    description: 'Datos de la residencia',
    type: ResidenciaResponseDto,
  })
  declare data: ResidenciaResponseDto;
}

export class ResidenciaArrayResponseDto extends BaseResponseDto<ResidenciaResponseDto[]> {
  @ApiProperty({
    description: 'Lista de residencias',
    type: [ResidenciaResponseDto],
    isArray: true,
  })
  declare data: ResidenciaResponseDto[];
}
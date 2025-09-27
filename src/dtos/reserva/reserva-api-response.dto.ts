import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../baseResponse/baseResponse.dto';
import { ReservaResponseDto } from './reserva-response.dto';

export class ReservaSingleResponseDto extends BaseResponseDto<ReservaResponseDto> {
  @ApiProperty({
    description: 'Datos de la reserva',
    type: ReservaResponseDto,
  })
  declare data: ReservaResponseDto;
}

export class ReservaArrayResponseDto extends BaseResponseDto<ReservaResponseDto[]> {
  @ApiProperty({
    description: 'Array de reservas',
    type: [ReservaResponseDto],
  })
  declare data: ReservaResponseDto[];
}
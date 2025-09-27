import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../baseResponse/baseResponse.dto';
import { ResidenteResponseDto } from './residente-response.dto';

export class ResidenteSingleResponseDto extends BaseResponseDto<ResidenteResponseDto> {
  @ApiProperty({
    description: 'Datos del residente',
    type: ResidenteResponseDto,
  })
  declare data: ResidenteResponseDto;
}

export class ResidenteArrayResponseDto extends BaseResponseDto<ResidenteResponseDto[]> {
  @ApiProperty({
    description: 'Lista de residentes',
    type: [ResidenteResponseDto],
    isArray: true,
  })
  declare data: ResidenteResponseDto[];
}

// DTO específico para el registro completo de residente
export class ResidenteRegisterCompleteResponseDto extends BaseResponseDto<{
  residente: ResidenteResponseDto;
  accessToken: string;
}> {
  @ApiProperty({
    description: 'Datos del residente registrado y token de acceso',
    example: {
      residente: {
        idResidente: '123e4567-e89b-12d3-a456-426614174000',
        nombre: 'María Elena',
        apellido: 'López Martínez',
        correo: 'residente@viveconecta.com'
      },
      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
    }
  })
  declare data: {
    residente: ResidenteResponseDto;
    accessToken: string;
  };
}
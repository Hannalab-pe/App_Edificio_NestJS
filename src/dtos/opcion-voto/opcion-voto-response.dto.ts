import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../baseResponse/baseResponse.dto';

export class OpcionVotoResponseDto {
  @ApiProperty({
    description: 'ID único de la opción de voto',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  idOpcionVoto: string;

  @ApiProperty({
    description: 'Texto de la opción de voto',
    example: 'Apruebo',
  })
  opcion: string;

  @ApiProperty({
    description: 'Descripción detallada de la opción',
    example: 'Apruebo la propuesta de mejoras en las áreas comunes',
    required: false,
  })
  descripcion?: string | null;

  @ApiProperty({
    description: 'Orden de presentación de la opción',
    example: 1,
  })
  ordenPresentacion: number;

  @ApiProperty({
    description: 'ID de la votación a la que pertenece',
    example: '456e7890-e12b-34d5-a678-901234567890',
  })
  idVotacion: string;

  @ApiProperty({
    description: 'Cantidad de votos recibidos por esta opción',
    example: 15,
    required: false,
  })
  cantidadVotos?: number;
}

export class CreateOpcionVotoResponseDto extends BaseResponseDto<OpcionVotoResponseDto> {}

export class GetOpcionVotoResponseDto extends BaseResponseDto<OpcionVotoResponseDto> {}

export class GetOpcionesVotoResponseDto extends BaseResponseDto<
  OpcionVotoResponseDto[]
> {}

export class UpdateOpcionVotoResponseDto extends BaseResponseDto<OpcionVotoResponseDto> {}

export class DeleteOpcionVotoResponseDto extends BaseResponseDto<null> {}

import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../baseResponse/baseResponse.dto';

// DTO para respuestas de error estandarizadas
export class ErrorResponseDto extends BaseResponseDto<null> {
  @ApiProperty({
    description: 'Datos (siempre null en errores)',
    example: null,
  })
  declare data: null;

  @ApiProperty({
    description: 'Información detallada del error',
    example: {
      code: 'INVALID_CREDENTIALS',
      timestamp: '2024-01-01T12:00:00.000Z',
      path: '/api/v1/auth/login'
    }
  })
  declare error: any;
}
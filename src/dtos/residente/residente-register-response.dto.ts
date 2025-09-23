import { ApiProperty } from '@nestjs/swagger';
import { Residente } from '../../entities/Residente';

export class ResidenteRegisterResponseDto {
  @ApiProperty({
    description: 'Indica si el registro fue exitoso',
    example: true,
    type: Boolean,
  })
  success: boolean;

  @ApiProperty({
    description: 'Mensaje descriptivo del resultado',
    example: 'Residente registrado exitosamente',
    type: String,
  })
  message: string;

  @ApiProperty({
    description: 'Datos del residente registrado',
    type: Residente,
  })
  residente: Residente;

  @ApiProperty({
    description: 'Token de acceso JWT',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    type: String,
  })
  accessToken: string;
}
import { ApiProperty } from '@nestjs/swagger';
import { Trabajador } from '../../entities/Trabajador';
import { Usuario } from '../../entities/Usuario';

export class TrabajadorRegisterResponseDto {
  @ApiProperty({ description: 'Token de acceso JWT' })
  access_token: string;

  @ApiProperty({
    description: 'Información del trabajador creado',
    type: () => Trabajador,
  })
  trabajador: Trabajador;

  @ApiProperty({
    description: 'Información del usuario creado',
    type: () => Usuario,
  })
  usuario: Usuario;
}

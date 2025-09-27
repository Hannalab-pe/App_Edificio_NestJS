import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../baseResponse/baseResponse.dto';
import { TrabajadorResponseDto } from './trabajador-response.dto';

/**
 * DTO para respuestas que contienen un único trabajador
 * Utiliza BaseResponseDto como estructura base
 */
export declare class TrabajadorSingleResponseDto extends BaseResponseDto<TrabajadorResponseDto> {
  @ApiProperty({
    description: 'Datos del trabajador',
    type: TrabajadorResponseDto,
    nullable: true,
    example: {
      idTrabajador: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      nombre: 'Juan Carlos',
      apellido: 'Pérez García',
      correo: 'trabajador@viveconecta.com',
      estaActivo: true,
      telefono: '+51987654321',
      fechaNacimiento: '1990-05-15',
      fechaIngreso: '2024-01-15',
      salarioActual: '2500.00',
      documentoIdentidad: {
        idDocumentoIdentidad: 'doc-uuid-123',
        tipo: 'DNI',
        numero: 12345678,
      },
      usuario: {
        idUsuario: 'user-uuid-123',
        nombreUsuario: 'jperez',
        rol: {
          idRol: 'rol-uuid-123',
          nombre: 'Trabajador',
        },
      },
    },
  })
  data: TrabajadorResponseDto | null;
}

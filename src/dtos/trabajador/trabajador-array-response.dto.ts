import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../baseResponse/baseResponse.dto';
import { TrabajadorResponseDto } from './trabajador-response.dto';

/**
 * DTO para respuestas que contienen una lista de trabajadores
 * Utiliza BaseResponseDto como estructura base
 */
export declare class TrabajadorArrayResponseDto extends BaseResponseDto<TrabajadorResponseDto[]> {
  @ApiProperty({
    description: 'Lista de trabajadores',
    type: [TrabajadorResponseDto],
    nullable: true,
    example: [
      {
        idTrabajador: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        nombre: 'Juan Carlos',
        apellido: 'Pérez García',
        correo: 'trabajador1@viveconecta.com',
        estaActivo: true,
        telefono: '+51987654321',
        fechaNacimiento: '1990-05-15',
        fechaIngreso: '2024-01-15',
        salarioActual: '2500.00',
        documentoIdentidad: {
          idDocumentoIdentidad: 'doc-uuid-123',
          tipo: 'DNI',
          numero: 12345678
        },
        usuario: {
          idUsuario: 'user-uuid-123',
          nombreUsuario: 'jperez',
          rol: {
            idRol: 'rol-uuid-123',
            nombre: 'Trabajador'
          }
        }
      },
      {
        idTrabajador: 'b2c3d4e5-f6g7-8901-bcde-f23456789012',
        nombre: 'María Elena',
        apellido: 'González López',
        correo: 'trabajadora2@viveconecta.com',
        estaActivo: true,
        telefono: '+51912345678',
        fechaNacimiento: '1988-03-22',
        fechaIngreso: '2023-11-01',
        salarioActual: '3000.00',
        documentoIdentidad: {
          idDocumentoIdentidad: 'doc-uuid-456',
          tipo: 'DNI',
          numero: 87654321
        },
        usuario: {
          idUsuario: 'user-uuid-456',
          nombreUsuario: 'mgonzalez',
          rol: {
            idRol: 'rol-uuid-456',
            nombre: 'Supervisor'
          }
        }
      }
    ]
  })
  data: TrabajadorResponseDto[] | null;
}
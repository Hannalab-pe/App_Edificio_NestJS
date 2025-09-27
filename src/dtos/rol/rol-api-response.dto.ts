import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../baseResponse/baseResponse.dto';

declare module '../baseResponse/baseResponse.dto' {
  namespace BaseResponseDto {
    interface RolData {
      idRol: string;
      nombre: string;
      descripcion?: string;
      usuarios?: any[];
      notificaciones?: any[];
    }
  }
}

/**
 * DTO de respuesta para un solo rol usando BaseResponseDto
 */
export class RolSingleResponseDto extends BaseResponseDto<BaseResponseDto.RolData> {
  @ApiProperty({
    description: 'Datos del rol',
    type: 'object',
    properties: {
      idRol: {
        type: 'string',
        format: 'uuid',
        description: 'ID único del rol',
      },
      nombre: { type: 'string', description: 'Nombre del rol' },
      descripcion: { type: 'string', description: 'Descripción del rol' },
      usuarios: {
        type: 'array',
        description: 'Lista de usuarios que tienen este rol',
        items: {
          type: 'object',
          properties: {
            idUsuario: { type: 'string', format: 'uuid' },
            nombreUsuario: { type: 'string' },
            correo: { type: 'string' },
            estaActivo: { type: 'boolean' },
          },
        },
      },
      notificaciones: {
        type: 'array',
        description: 'Lista de notificaciones asociadas a este rol',
        items: {
          type: 'object',
          properties: {
            idNotificacion: { type: 'string', format: 'uuid' },
            titulo: { type: 'string' },
            mensaje: { type: 'string' },
            fechaEnvio: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  })
  declare data: BaseResponseDto.RolData;

  @ApiProperty({
    description: 'Mensaje descriptivo de la operación',
    example: 'Rol obtenido exitosamente',
  })
  declare message: string;

  @ApiProperty({
    description: 'Indica si la operación fue exitosa',
    example: true,
  })
  declare success: boolean;

  @ApiProperty({
    description: 'Código de estado HTTP',
    example: 200,
  })
  declare statusCode: number;
}

/**
 * DTO de respuesta para múltiples roles usando BaseResponseDto
 */
export class RolArrayResponseDto extends BaseResponseDto<
  BaseResponseDto.RolData[]
> {
  @ApiProperty({
    description: 'Lista de roles',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        idRol: {
          type: 'string',
          format: 'uuid',
          description: 'ID único del rol',
        },
        nombre: { type: 'string', description: 'Nombre del rol' },
        descripcion: { type: 'string', description: 'Descripción del rol' },
        usuarios: {
          type: 'array',
          description: 'Lista de usuarios que tienen este rol',
          items: {
            type: 'object',
            properties: {
              idUsuario: { type: 'string', format: 'uuid' },
              nombreUsuario: { type: 'string' },
              correo: { type: 'string' },
              estaActivo: { type: 'boolean' },
            },
          },
        },
        notificaciones: {
          type: 'array',
          description: 'Lista de notificaciones asociadas a este rol',
          items: {
            type: 'object',
            properties: {
              idNotificacion: { type: 'string', format: 'uuid' },
              titulo: { type: 'string' },
              mensaje: { type: 'string' },
              fechaEnvio: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
    },
  })
  declare data: BaseResponseDto.RolData[];

  @ApiProperty({
    description: 'Mensaje descriptivo de la operación',
    example: 'Roles obtenidos exitosamente',
  })
  declare message: string;

  @ApiProperty({
    description: 'Indica si la operación fue exitosa',
    example: true,
  })
  declare success: boolean;

  @ApiProperty({
    description: 'Código de estado HTTP',
    example: 200,
  })
  declare statusCode: number;
}

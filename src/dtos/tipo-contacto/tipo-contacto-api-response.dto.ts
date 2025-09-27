import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../baseResponse/baseResponse.dto';

declare module '../baseResponse/baseResponse.dto' {
  namespace BaseResponseDto {
    interface TipoContactoData {
      idTipoContacto: string;
      nombre: string;
      descripcion?: string;
      contactos?: any[];
    }
  }
}

/**
 * DTO de respuesta para un solo tipo de contacto usando BaseResponseDto
 */
export class TipoContactoSingleResponseDto extends BaseResponseDto<BaseResponseDto.TipoContactoData> {
  @ApiProperty({
    description: 'Datos del tipo de contacto',
    type: 'object',
    properties: {
      idTipoContacto: {
        type: 'string',
        format: 'uuid',
        description: 'ID único del tipo de contacto',
      },
      nombre: { type: 'string', description: 'Nombre del tipo de contacto' },
      descripcion: {
        type: 'string',
        description: 'Descripción del tipo de contacto',
      },
      contactos: {
        type: 'array',
        description: 'Lista de contactos que usan este tipo',
        items: {
          type: 'object',
          properties: {
            idContacto: { type: 'string', format: 'uuid' },
            valor: { type: 'string' },
            esPrincipal: { type: 'boolean' },
            estaActivo: { type: 'boolean' },
          },
        },
      },
    },
  })
  declare data: BaseResponseDto.TipoContactoData;

  @ApiProperty({
    description: 'Mensaje descriptivo de la operación',
    example: 'Tipo de contacto obtenido exitosamente',
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
 * DTO de respuesta para múltiples tipos de contacto usando BaseResponseDto
 */
export class TipoContactoArrayResponseDto extends BaseResponseDto<
  BaseResponseDto.TipoContactoData[]
> {
  @ApiProperty({
    description: 'Lista de tipos de contacto',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        idTipoContacto: {
          type: 'string',
          format: 'uuid',
          description: 'ID único del tipo de contacto',
        },
        nombre: { type: 'string', description: 'Nombre del tipo de contacto' },
        descripcion: {
          type: 'string',
          description: 'Descripción del tipo de contacto',
        },
        contactos: {
          type: 'array',
          description: 'Lista de contactos que usan este tipo',
          items: {
            type: 'object',
            properties: {
              idContacto: { type: 'string', format: 'uuid' },
              valor: { type: 'string' },
              esPrincipal: { type: 'boolean' },
              estaActivo: { type: 'boolean' },
            },
          },
        },
      },
    },
  })
  declare data: BaseResponseDto.TipoContactoData[];

  @ApiProperty({
    description: 'Mensaje descriptivo de la operación',
    example: 'Tipos de contacto obtenidos exitosamente',
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

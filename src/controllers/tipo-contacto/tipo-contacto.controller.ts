import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Res,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { Response } from 'express';
import { CreateTipoContactoDto, UpdateTipoContactoDto } from '../../dtos';
import { TipoContactoService } from '../../services/implementations/tipo-contacto/tipo-contacto.service';

@ApiTags('Tipos de Contacto')
@Controller('tipo-contacto')
export class TipoContactoController {
  constructor(private readonly tipoContactoService: TipoContactoService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo tipo de contacto',
    description: 'Registra un nuevo tipo de contacto en el sistema',
  })
  @ApiBody({
    type: CreateTipoContactoDto,
    description: 'Datos del tipo de contacto a crear',
  })
  @ApiResponse({
    status: 201,
    description: 'Tipo de contacto creado exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Error en los datos de entrada',
  })
  async create(
    @Body() createTipoContactoDto: CreateTipoContactoDto,
    @Res() res: Response,
  ) {
    try {
      const result = await this.tipoContactoService.create(
        createTipoContactoDto,
      );

      if (result.success) {
        return res.status(HttpStatus.CREATED).json(result);
      } else {
        return res.status(HttpStatus.BAD_REQUEST).json(result);
      }
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error interno del servidor',
        data: null,
        error: error.message,
      });
    }
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los tipos de contacto',
    description: 'Retorna una lista de todos los tipos de contacto',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de tipos de contacto obtenida exitosamente',
  })
  async findAll(@Res() res: Response) {
    try {
      const result = await this.tipoContactoService.findAll();

      if (result.success) {
        return res.status(HttpStatus.OK).json(result);
      } else {
        return res.status(HttpStatus.BAD_REQUEST).json(result);
      }
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error interno del servidor',
        data: [],
        error: error.message,
      });
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un tipo de contacto por ID',
    description: 'Retorna un tipo de contacto específico basado en su ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del tipo de contacto',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de contacto encontrado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Tipo de contacto no encontrado',
  })
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const result = await this.tipoContactoService.findOne(id);

      if (result.success) {
        return res.status(HttpStatus.OK).json(result);
      } else {
        return res.status(HttpStatus.NOT_FOUND).json(result);
      }
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error interno del servidor',
        data: null,
        error: error.message,
      });
    }
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Actualizar un tipo de contacto',
    description: 'Actualiza los datos de un tipo de contacto existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del tipo de contacto a actualizar',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    type: UpdateTipoContactoDto,
    description: 'Datos del tipo de contacto a actualizar',
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de contacto actualizado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Tipo de contacto no encontrado',
  })
  async update(
    @Param('id') id: string,
    @Body() updateTipoContactoDto: UpdateTipoContactoDto,
    @Res() res: Response,
  ) {
    try {
      const result = await this.tipoContactoService.update(
        id,
        updateTipoContactoDto,
      );

      if (result.success) {
        return res.status(HttpStatus.OK).json(result);
      } else {
        return res.status(HttpStatus.BAD_REQUEST).json(result);
      }
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error interno del servidor',
        data: null,
        error: error.message,
      });
    }
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar un tipo de contacto',
    description: 'Elimina un tipo de contacto del sistema (eliminación física)',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del tipo de contacto a eliminar',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de contacto eliminado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Tipo de contacto no encontrado',
  })
  @ApiResponse({
    status: 400,
    description:
      'No se puede eliminar el tipo de contacto porque tiene contactos asociados',
  })
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      const result = await this.tipoContactoService.remove(id);

      if (result.success) {
        return res.status(HttpStatus.OK).json(result);
      } else {
        return res.status(HttpStatus.BAD_REQUEST).json(result);
      }
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error interno del servidor',
        data: undefined,
        error: error.message,
      });
    }
  }

  @Get('nombre/:nombre')
  @ApiOperation({
    summary: 'Obtener tipo de contacto por nombre',
    description: 'Retorna un tipo de contacto específico basado en su nombre',
  })
  @ApiParam({
    name: 'nombre',
    description: 'Nombre del tipo de contacto',
    example: 'Teléfono móvil',
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de contacto encontrado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Tipo de contacto no encontrado',
  })
  async findByNombre(@Param('nombre') nombre: string, @Res() res: Response) {
    try {
      const result = await this.tipoContactoService.findByNombre(nombre);

      if (result.success) {
        return res.status(HttpStatus.OK).json(result);
      } else {
        return res.status(HttpStatus.NOT_FOUND).json(result);
      }
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error interno del servidor',
        data: null,
        error: error.message,
      });
    }
  }
}

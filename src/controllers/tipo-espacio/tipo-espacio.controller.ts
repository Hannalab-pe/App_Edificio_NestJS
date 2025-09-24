import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CreateTipoEspacioDto, UpdateTipoEspacioDto } from 'src/dtos';
import { TipoEspacioService } from 'src/services/implementations';

@ApiTags('Tipos de Espacio')
@Controller('tipo-espacio')
export class TipoEspacioController {
  constructor(private readonly tipoEspacioService: TipoEspacioService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo tipo de espacio',
    description: 'Crea un nuevo tipo de espacio en el sistema',
  })
  @ApiResponse({
    status: 201,
    description: 'Tipo de espacio creado exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos',
  })
  async create(
    @Body() createTipoEspacioDto: CreateTipoEspacioDto,
    @Res() res: Response,
  ) {
    try {
      const result = await this.tipoEspacioService.create(createTipoEspacioDto);

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
    summary: 'Obtener todos los tipos de espacio',
    description: 'Retorna una lista de todos los tipos de espacio del sistema',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de tipos de espacio obtenida exitosamente',
  })
  async findAll(@Res() res: Response) {
    try {
      const result = await this.tipoEspacioService.findAll();

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

  @Get('nombre/:nombre')
  @ApiOperation({
    summary: 'Obtener tipo de espacio por nombre',
    description: 'Retorna un tipo de espacio específico por su nombre',
  })
  @ApiParam({
    name: 'nombre',
    type: 'string',
    description: 'Nombre del tipo de espacio',
    example: 'Salón de eventos',
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de espacio encontrado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Tipo de espacio no encontrado',
  })
  async findByNombre(@Param('nombre') nombre: string, @Res() res: Response) {
    try {
      const result = await this.tipoEspacioService.findByNombre(nombre);

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

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un tipo de espacio por ID',
    description: 'Retorna un tipo de espacio específico por su ID',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID único del tipo de espacio',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de espacio encontrado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Tipo de espacio no encontrado',
  })
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const result = await this.tipoEspacioService.findOne(id);

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

  @Put(':id')
  @ApiOperation({
    summary: 'Actualizar un tipo de espacio',
    description: 'Actualiza los datos de un tipo de espacio existente',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID único del tipo de espacio',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de espacio actualizado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Tipo de espacio no encontrado',
  })
  async update(
    @Param('id') id: string,
    @Body() updateTipoEspacioDto: UpdateTipoEspacioDto,
    @Res() res: Response,
  ) {
    try {
      const result = await this.tipoEspacioService.update(
        id,
        updateTipoEspacioDto,
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
    summary: 'Eliminar un tipo de espacio',
    description: 'Elimina físicamente un tipo de espacio del sistema',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID único del tipo de espacio',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de espacio eliminado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Tipo de espacio no encontrado',
  })
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      const result = await this.tipoEspacioService.remove(id);

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
}

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import {
  CreatePresupuestoDto,
  UpdatePresupuestoDto,
  PresupuestoResponseDto,
  PresupuestoListResponseDto,
  PresupuestoDeleteResponseDto,
} from 'src/dtos';
import { PresupuestoService } from 'src/services/implementations/presupuesto/presupuesto.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('Presupuestos')
@Controller('presupuesto')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class PresupuestoController {
  constructor(private readonly presupuestoService: PresupuestoService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo presupuesto',
    description: 'Crea un nuevo presupuesto en el sistema',
  })
  @ApiResponse({
    status: 201,
    description: 'Presupuesto creado exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos',
  })
  @ApiResponse({
    status: 409,
    description: 'Ya existe un presupuesto con el mismo año, mes y concepto',
  })
  async create(
    @Body() createPresupuestoDto: CreatePresupuestoDto,
    @Res() res: Response,
  ) {
    try {
      const result = await this.presupuestoService.create(createPresupuestoDto);

      if (result.success) {
        return res.status(HttpStatus.CREATED).json(result);
      } else {
        const statusCode =
          result.error?.statusCode === 409
            ? HttpStatus.CONFLICT
            : HttpStatus.BAD_REQUEST;
        return res.status(statusCode).json(result);
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
    summary: 'Obtener todos los presupuestos',
    description:
      'Retorna una lista de todos los presupuestos del sistema ordenados por año y mes',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de presupuestos obtenida exitosamente',
  })
  async findAll(@Res() res: Response) {
    try {
      const result = await this.presupuestoService.findAll();

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

  @Get('activos')
  @ApiOperation({
    summary: 'Obtener presupuestos activos',
    description:
      'Retorna una lista de todos los presupuestos activos del sistema',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de presupuestos activos obtenida exitosamente',
  })
  async findActivos(@Res() res: Response) {
    try {
      const result = await this.presupuestoService.findAll();

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

  @Get('anio/:anio')
  @ApiOperation({
    summary: 'Obtener presupuestos por año',
    description:
      'Retorna una lista de presupuestos filtrados por año específico',
  })
  @ApiParam({
    name: 'anio',
    type: 'number',
    description: 'Año del presupuesto',
    example: 2024,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de presupuestos por año obtenida exitosamente',
  })
  async findByAnio(@Param('anio') anio: number, @Res() res: Response) {
    try {
      const result = await this.presupuestoService.findByAnio(Number(anio));

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

  @Get('mes/:mes')
  @ApiOperation({
    summary: 'Obtener presupuestos por mes del año actual',
    description:
      'Retorna una lista de presupuestos filtrados por mes del año actual',
  })
  @ApiParam({
    name: 'mes',
    type: 'number',
    description: 'Mes del presupuesto (1-12)',
    example: 3,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de presupuestos por mes obtenida exitosamente',
  })
  async findByMes(@Param('mes') mes: number, @Res() res: Response) {
    try {
      const currentYear = new Date().getFullYear();
      const presupuestos = await this.presupuestoService.findAll();

      if (presupuestos.success && presupuestos.data) {
        const presupuestosFiltrados = presupuestos.data.filter(
          (p) => p.mes === Number(mes) && p.anio === currentYear,
        );

        return res.status(HttpStatus.OK).json({
          success: true,
          message: `Presupuestos del mes ${mes} del año ${currentYear} obtenidos exitosamente`,
          data: presupuestosFiltrados,
        });
      } else {
        return res.status(HttpStatus.BAD_REQUEST).json(presupuestos);
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

  @Get('concepto')
  @ApiOperation({
    summary: 'Obtener presupuestos por concepto',
    description:
      'Retorna una lista de presupuestos filtrados por concepto específico',
  })
  @ApiQuery({
    name: 'concepto',
    type: 'string',
    description: 'Concepto del presupuesto',
    example: 'Mantenimiento de ascensores',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de presupuestos por concepto obtenida exitosamente',
  })
  async findByConcepto(
    @Query('concepto') concepto: string,
    @Res() res: Response,
  ) {
    try {
      const result = await this.presupuestoService.findByConcepto(concepto);

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
    summary: 'Obtener un presupuesto por ID',
    description: 'Retorna un presupuesto específico por su ID',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID único del presupuesto',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Presupuesto encontrado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Presupuesto no encontrado',
  })
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const result = await this.presupuestoService.findOne(id);

      if (result.success) {
        return res.status(HttpStatus.OK).json(result);
      } else {
        const statusCode =
          result.error?.statusCode === 404
            ? HttpStatus.NOT_FOUND
            : HttpStatus.BAD_REQUEST;
        return res.status(statusCode).json(result);
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

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un presupuesto',
    description: 'Actualiza los datos de un presupuesto existente',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID único del presupuesto',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Presupuesto actualizado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Presupuesto no encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'Ya existe un presupuesto con el mismo año, mes y concepto',
  })
  async update(
    @Param('id') id: string,
    @Body() updatePresupuestoDto: UpdatePresupuestoDto,
    @Res() res: Response,
  ) {
    try {
      const result = await this.presupuestoService.update(
        id,
        updatePresupuestoDto,
      );

      if (result.success) {
        return res.status(HttpStatus.OK).json(result);
      } else {
        let statusCode = HttpStatus.BAD_REQUEST;
        if (result.error?.statusCode === 404) statusCode = HttpStatus.NOT_FOUND;
        if (result.error?.statusCode === 409) statusCode = HttpStatus.CONFLICT;
        return res.status(statusCode).json(result);
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
    summary: 'Eliminar un presupuesto',
    description: 'Elimina físicamente un presupuesto del sistema',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID único del presupuesto',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Presupuesto eliminado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Presupuesto no encontrado',
  })
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      const result = await this.presupuestoService.remove(id);

      if (result.success) {
        return res.status(HttpStatus.OK).json(result);
      } else {
        const statusCode =
          result.error?.statusCode === 404
            ? HttpStatus.NOT_FOUND
            : HttpStatus.BAD_REQUEST;
        return res.status(statusCode).json(result);
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

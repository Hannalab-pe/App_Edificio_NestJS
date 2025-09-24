import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { CreateConceptoPagoDto, UpdateConceptoPagoDto } from 'src/dtos';
import { ConceptoPagoService } from 'src/services/implementations';

@ApiTags('Conceptos de Pago')
@Controller('concepto-pago')
export class ConceptoPagoController {
  constructor(private readonly conceptoPagoService: ConceptoPagoService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo concepto de pago',
    description: 'Crea un nuevo concepto de pago en el sistema',
  })
  @ApiResponse({
    status: 201,
    description: 'Concepto de pago creado exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos',
  })
  async create(
    @Body() createConceptoPagoDto: CreateConceptoPagoDto,
    @Res() res: Response,
  ) {
    try {
      const result = await this.conceptoPagoService.create(
        createConceptoPagoDto,
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
    summary: 'Obtener todos los conceptos de pago',
    description: 'Retorna una lista de todos los conceptos de pago del sistema',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de conceptos de pago obtenida exitosamente',
  })
  async findAll(@Res() res: Response) {
    try {
      const result = await this.conceptoPagoService.findAll();

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
    summary: 'Obtener concepto de pago por nombre',
    description: 'Retorna un concepto de pago específico por su nombre',
  })
  @ApiParam({
    name: 'nombre',
    type: 'string',
    description: 'Nombre del concepto de pago',
    example: 'Mantenimiento Mensual',
  })
  @ApiResponse({
    status: 200,
    description: 'Concepto de pago encontrado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Concepto de pago no encontrado',
  })
  async findByNombre(@Param('nombre') nombre: string, @Res() res: Response) {
    try {
      const result = await this.conceptoPagoService.findByNombre(nombre);

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

  @Get('tipo')
  @ApiOperation({
    summary: 'Obtener conceptos de pago por tipo',
    description:
      'Retorna una lista de conceptos de pago filtrados por tipo/frecuencia',
  })
  @ApiQuery({
    name: 'tipo',
    type: 'string',
    description: 'Tipo/frecuencia del concepto de pago',
    example: 'Mensual',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de conceptos de pago por tipo obtenida exitosamente',
  })
  async findByTipo(@Query('tipo') tipo: string, @Res() res: Response) {
    try {
      const result = await this.conceptoPagoService.findByTipo(tipo);

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
    summary: 'Obtener un concepto de pago por ID',
    description: 'Retorna un concepto de pago específico por su ID',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID único del concepto de pago',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Concepto de pago encontrado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Concepto de pago no encontrado',
  })
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const result = await this.conceptoPagoService.findOne(id);

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
    summary: 'Actualizar un concepto de pago',
    description: 'Actualiza los datos de un concepto de pago existente',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID único del concepto de pago',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Concepto de pago actualizado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Concepto de pago no encontrado',
  })
  async update(
    @Param('id') id: string,
    @Body() updateConceptoPagoDto: UpdateConceptoPagoDto,
    @Res() res: Response,
  ) {
    try {
      const result = await this.conceptoPagoService.update(
        id,
        updateConceptoPagoDto,
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
    summary: 'Eliminar un concepto de pago (eliminación lógica)',
    description:
      'Elimina lógicamente un concepto de pago marcándolo como inactivo',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID único del concepto de pago',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Concepto de pago eliminado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Concepto de pago no encontrado',
  })
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      const result = await this.conceptoPagoService.remove(id);

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

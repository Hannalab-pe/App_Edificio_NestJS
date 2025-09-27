import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  HttpStatus,
  HttpException,
  UseGuards,
  Query,
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ReciboService } from 'src/services/implementations/recibo/recibo.service';
import { 
  CreateReciboDto,
  UpdateReciboDto,
  ReciboSingleResponseDto,
  ReciboArrayResponseDto,
} from 'src/dtos';
import { BaseResponseDto } from 'src/dtos/baseResponse/baseResponse.dto';

@ApiTags('Recibos')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('recibo')
export class ReciboController {
  constructor(
    private readonly reciboService: ReciboService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Crear nuevo recibo',
    description: 'Crea un nuevo recibo asociado a un pago existente',
  })
  @ApiResponse({
    status: 201,
    description: 'Recibo creado exitosamente',
    type: ReciboSingleResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
  })
  @ApiResponse({
    status: 404,
    description: 'Pago no encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'Número de recibo ya existe',
  })
  async create(@Body() createReciboDto: CreateReciboDto): Promise<BaseResponseDto<any>> {
    try {
      return await this.reciboService.create(createReciboDto);
    } catch (error) {
      throw new HttpException(
        `Error al crear el recibo: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los recibos',
    description: 'Retorna una lista de todos los recibos registrados en el sistema',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de recibos obtenida exitosamente',
    type: ReciboArrayResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async findAll(): Promise<BaseResponseDto<any[]>> {
    try {
      return await this.reciboService.findAll();
    } catch (error) {
      throw new HttpException(
        `Error al obtener los recibos: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener recibo por ID',
    description: 'Retorna un recibo específico identificado por su UUID',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID único del recibo',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Recibo encontrado exitosamente',
    type: ReciboSingleResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Recibo no encontrado',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async findOne(@Param('id') id: string): Promise<BaseResponseDto<any>> {
    try {
      return await this.reciboService.findOne(id);
    } catch (error) {
      throw new HttpException(
        `Error al buscar el recibo: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar recibo',
    description: 'Actualiza parcialmente un recibo existente identificado por su UUID',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID único del recibo a actualizar',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Recibo actualizado exitosamente',
    type: ReciboSingleResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
  })
  @ApiResponse({
    status: 404,
    description: 'Recibo o pago no encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'Número de recibo ya existe',
  })
  async update(
    @Param('id') id: string, 
    @Body() updateReciboDto: UpdateReciboDto
  ): Promise<BaseResponseDto<any>> {
    try {
      return await this.reciboService.update(id, updateReciboDto);
    } catch (error) {
      throw new HttpException(
        `Error al actualizar el recibo: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar recibo',
    description: 'Elimina un recibo específico del sistema identificado por su UUID',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID único del recibo a eliminar',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Recibo eliminado exitosamente',
    type: ReciboSingleResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Recibo no encontrado',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async remove(@Param('id') id: string): Promise<BaseResponseDto<any>> {
    try {
      return await this.reciboService.remove(id);
    } catch (error) {
      throw new HttpException(
        `Error al eliminar el recibo: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('numero/:numeroRecibo')
  @ApiOperation({
    summary: 'Buscar recibo por número',
    description: 'Encuentra un recibo específico usando su número único de recibo',
  })
  @ApiParam({
    name: 'numeroRecibo',
    description: 'Número único del recibo',
    example: 'REC-2025-001',
  })
  @ApiResponse({
    status: 200,
    description: 'Recibo encontrado por número exitosamente',
    type: ReciboSingleResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Recibo no encontrado con ese número',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async findByNumeroRecibo(@Param('numeroRecibo') numeroRecibo: string): Promise<BaseResponseDto<any>> {
    try {
      return await this.reciboService.findByNumeroRecibo(numeroRecibo);
    } catch (error) {
      throw new HttpException(
        `Error al buscar el recibo por número: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('pago/:pagoId')
  @ApiOperation({
    summary: 'Obtener recibos por pago',
    description: 'Retorna todos los recibos asociados a un pago específico',
  })
  @ApiParam({
    name: 'pagoId',
    description: 'UUID del pago para buscar sus recibos',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Recibos encontrados para el pago exitosamente',
    type: ReciboArrayResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async findByPago(@Param('pagoId') pagoId: string): Promise<BaseResponseDto<any[]>> {
    try {
      return await this.reciboService.findByPago(pagoId);
    } catch (error) {
      throw new HttpException(
        `Error al buscar recibos por pago: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

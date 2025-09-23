import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    HttpStatus,
    HttpCode
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { TipoCronogramaService } from '../../services/implementations/tipo-cronograma/tipo-cronograma.service';

import { BaseResponseDto } from '../../dtos/baseResponse/baseResponse.dto';
import { CreateTipoCronogramaDto, UpdateTipoCronogramaDto } from 'src/dtos';

@ApiTags('Tipo Cronograma')
@Controller('tipo-cronograma')
export class TipoCronogramaController {
    constructor(private readonly tipoCronogramaService: TipoCronogramaService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Crear un nuevo tipo de cronograma' })
    @ApiResponse({
        status: 201,
        description: 'Tipo de cronograma creado exitosamente.',
    })
    @ApiResponse({
        status: 400,
        description: 'Datos de entrada inválidos.'
    })
    @ApiResponse({
        status: 409,
        description: 'Ya existe un tipo de cronograma con ese tipo.'
    })
    async create(@Body() createTipoCronogramaDto: CreateTipoCronogramaDto): Promise<BaseResponseDto<any>> {
        return await this.tipoCronogramaService.create(createTipoCronogramaDto);
    }

    @Get()
    @ApiOperation({ summary: 'Obtener todos los tipos de cronograma' })
    @ApiResponse({
        status: 200,
        description: 'Lista de tipos de cronograma obtenida exitosamente.',
    })
    async findAll(): Promise<BaseResponseDto<any[]>> {
        return await this.tipoCronogramaService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener un tipo de cronograma por ID' })
    @ApiParam({
        name: 'id',
        description: 'ID único del tipo de cronograma',
        example: '550e8400-e29b-41d4-a716-446655440000'
    })
    @ApiResponse({
        status: 200,
        description: 'Tipo de cronograma encontrado exitosamente.',
    })
    @ApiResponse({
        status: 404,
        description: 'Tipo de cronograma no encontrado.'
    })
    async findOne(@Param('id') id: string): Promise<BaseResponseDto<any>> {
        return await this.tipoCronogramaService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Actualizar un tipo de cronograma' })
    @ApiParam({
        name: 'id',
        description: 'ID único del tipo de cronograma',
        example: '550e8400-e29b-41d4-a716-446655440000'
    })
    @ApiResponse({
        status: 200,
        description: 'Tipo de cronograma actualizado exitosamente.',
    })
    @ApiResponse({
        status: 400,
        description: 'Datos de entrada inválidos.'
    })
    @ApiResponse({
        status: 404,
        description: 'Tipo de cronograma no encontrado.'
    })
    @ApiResponse({
        status: 409,
        description: 'Ya existe otro tipo de cronograma con ese tipo.'
    })
    async update(
        @Param('id') id: string,
        @Body() updateTipoCronogramaDto: UpdateTipoCronogramaDto
    ): Promise<BaseResponseDto<any>> {
        return await this.tipoCronogramaService.update(id, updateTipoCronogramaDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Eliminar un tipo de cronograma' })
    @ApiParam({
        name: 'id',
        description: 'ID único del tipo de cronograma',
        example: '550e8400-e29b-41d4-a716-446655440000'
    })
    @ApiResponse({
        status: 204,
        description: 'Tipo de cronograma eliminado exitosamente.'
    })
    @ApiResponse({
        status: 404,
        description: 'Tipo de cronograma no encontrado.'
    })
    @ApiResponse({
        status: 409,
        description: 'No se puede eliminar el tipo de cronograma porque tiene cronogramas asociados.'
    })
    async remove(@Param('id') id: string): Promise<BaseResponseDto<void>> {
        return await this.tipoCronogramaService.remove(id);
    }

    @Get('tipo/:tipo')
    @ApiOperation({ summary: 'Buscar tipo de cronograma por tipo específico' })
    @ApiParam({
        name: 'tipo',
        description: 'Tipo específico del cronograma',
        example: 'MANTENIMIENTO'
    })
    @ApiResponse({
        status: 200,
        description: 'Tipo de cronograma encontrado por tipo exitosamente.',
    })
    @ApiResponse({
        status: 404,
        description: 'No se encontró un tipo de cronograma con ese tipo.'
    })
    async findByTipo(@Param('tipo') tipo: string): Promise<BaseResponseDto<any>> {
        return await this.tipoCronogramaService.findByTipo(tipo);
    }
}

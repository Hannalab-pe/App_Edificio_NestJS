import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { EspacioArrendableService } from 'src/services/implementations/espacio-arrendable/espacio-arrendable.service';
import { CreateEspacioArrendableDto, UpdateEspacioArrendableDto, EspacioArrendableResponseDto } from 'src/dtos/espacio-arrendable';
import { BaseResponseDto } from 'src/dtos/baseResponse/baseResponse.dto';

@ApiTags('Espacios Arrendables')
@Controller('espacio-arrendable')
export class EspacioArrendableController {
    constructor(private readonly espacioArrendableService: EspacioArrendableService) { }

    @Post()
    @ApiOperation({
        summary: 'Crear un nuevo espacio arrendable',
        description: 'Crea un nuevo espacio arrendable con la información proporcionada'
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Espacio arrendable creado exitosamente',
        type: EspacioArrendableResponseDto
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Datos inválidos o código duplicado'
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'Ya existe un espacio arrendable con ese código'
    })
    create(@Body() createEspacioArrendableDto: CreateEspacioArrendableDto): Promise<BaseResponseDto<EspacioArrendableResponseDto>> {
        return this.espacioArrendableService.create(createEspacioArrendableDto);
    }

    @Get()
    @ApiOperation({
        summary: 'Obtener todos los espacios arrendables',
        description: 'Retorna una lista de todos los espacios arrendables registrados'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Lista de espacios arrendables obtenida exitosamente',
        type: [EspacioArrendableResponseDto]
    })
    findAll(): Promise<BaseResponseDto<EspacioArrendableResponseDto[]>> {
        return this.espacioArrendableService.findAll();
    }

    @Get('activos')
    @ApiOperation({
        summary: 'Obtener espacios arrendables activos',
        description: 'Retorna una lista de todos los espacios arrendables que están activos'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Lista de espacios arrendables activos obtenida exitosamente',
        type: [EspacioArrendableResponseDto]
    })
    findActivos(): Promise<BaseResponseDto<EspacioArrendableResponseDto[]>> {
        return this.espacioArrendableService.findActivos();
    }

    @Get('disponibles')
    @ApiOperation({
        summary: 'Obtener espacios arrendables disponibles',
        description: 'Retorna una lista de todos los espacios arrendables que están disponibles para arrendar'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Lista de espacios arrendables disponibles obtenida exitosamente',
        type: [EspacioArrendableResponseDto]
    })
    findDisponibles(): Promise<BaseResponseDto<EspacioArrendableResponseDto[]>> {
        return this.espacioArrendableService.findDisponibles();
    }

    @Get('by-codigo/:codigo')
    @ApiOperation({
        summary: 'Buscar espacio arrendable por código',
        description: 'Busca un espacio arrendable específico por su código único'
    })
    @ApiParam({
        name: 'codigo',
        description: 'Código único del espacio arrendable',
        example: 'ESP-001'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Espacio arrendable encontrado exitosamente',
        type: EspacioArrendableResponseDto
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Espacio arrendable no encontrado'
    })
    findByCodigo(@Param('codigo') codigo: string): Promise<BaseResponseDto<EspacioArrendableResponseDto>> {
        return this.espacioArrendableService.findByCodigo(codigo);
    }

    @Get('by-estado')
    @ApiOperation({
        summary: 'Buscar espacios arrendables por estado',
        description: 'Busca espacios arrendables que coincidan con el estado especificado'
    })
    @ApiQuery({
        name: 'estado',
        description: 'Estado del espacio arrendable',
        example: 'DISPONIBLE'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Lista de espacios arrendables por estado obtenida exitosamente',
        type: [EspacioArrendableResponseDto]
    })
    findByEstado(@Query('estado') estado: string): Promise<BaseResponseDto<EspacioArrendableResponseDto[]>> {
        return this.espacioArrendableService.findByEstado(estado);
    }

    @Get('by-tipo/:idTipoEspacio')
    @ApiOperation({
        summary: 'Buscar espacios arrendables por tipo de espacio',
        description: 'Busca espacios arrendables que pertenezcan al tipo de espacio especificado'
    })
    @ApiParam({
        name: 'idTipoEspacio',
        description: 'ID del tipo de espacio',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Lista de espacios arrendables por tipo obtenida exitosamente',
        type: [EspacioArrendableResponseDto]
    })
    findByTipoEspacio(@Param('idTipoEspacio') idTipoEspacio: string): Promise<BaseResponseDto<EspacioArrendableResponseDto[]>> {
        return this.espacioArrendableService.findByTipoEspacio(idTipoEspacio);
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Obtener un espacio arrendable por ID',
        description: 'Retorna la información detallada de un espacio arrendable específico'
    })
    @ApiParam({
        name: 'id',
        description: 'ID único del espacio arrendable',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Espacio arrendable obtenido exitosamente',
        type: EspacioArrendableResponseDto
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Espacio arrendable no encontrado'
    })
    findOne(@Param('id') id: string): Promise<BaseResponseDto<EspacioArrendableResponseDto>> {
        return this.espacioArrendableService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({
        summary: 'Actualizar un espacio arrendable',
        description: 'Actualiza la información de un espacio arrendable existente'
    })
    @ApiParam({
        name: 'id',
        description: 'ID único del espacio arrendable',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Espacio arrendable actualizado exitosamente',
        type: EspacioArrendableResponseDto
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Espacio arrendable no encontrado'
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Datos inválidos'
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'Código duplicado'
    })
    update(
        @Param('id') id: string,
        @Body() updateEspacioArrendableDto: UpdateEspacioArrendableDto,
    ): Promise<BaseResponseDto<EspacioArrendableResponseDto>> {
        return this.espacioArrendableService.update(id, updateEspacioArrendableDto);
    }

    @Delete(':id')
    @ApiOperation({
        summary: 'Eliminar un espacio arrendable',
        description: 'Realiza una eliminación lógica de un espacio arrendable (cambia estado a inactivo)'
    })
    @ApiParam({
        name: 'id',
        description: 'ID único del espacio arrendable',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Espacio arrendable eliminado exitosamente'
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Espacio arrendable no encontrado'
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'No se puede eliminar el espacio porque tiene arrendamientos asociados'
    })
    remove(@Param('id') id: string): Promise<BaseResponseDto<void>> {
        return this.espacioArrendableService.remove(id);
    }
}

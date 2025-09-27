import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    HttpCode,
    HttpStatus,
    ParseUUIDPipe,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiBody,
} from '@nestjs/swagger';
import { AsignacionAreaEdificioService } from '../../services/asignacion-area-edificio/asignacion-area-edificio.service';
import {
    CreateAsignacionAreaEdificioDto,
    UpdateAsignacionAreaEdificioDto,
    AsignacionAreaEdificioResponseDto,
    CreateMultipleAsignacionAreaEdificioDto,
} from '../../dtos/asignacion-area-edificio';
import { BaseResponseDto } from '../../dtos/baseResponse/baseResponse.dto';

@ApiTags('Asignación Área-Edificio')
@Controller('asignacion-area-edificio')
export class AsignacionAreaEdificioController {
    constructor(
        private readonly asignacionAreaEdificioService: AsignacionAreaEdificioService,
    ) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: 'Crear nueva asignación de área común a edificio',
        description: 'Crea una nueva asignación entre un área común y un edificio',
    })
    @ApiBody({
        type: CreateAsignacionAreaEdificioDto,
        description: 'Datos para crear la asignación',
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Asignación creada exitosamente',
        type: BaseResponseDto<AsignacionAreaEdificioResponseDto>,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Datos inválidos',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Edificio o área común no encontrada',
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'Ya existe una asignación para este edificio y área común',
    })
    async create(
        @Body() createAsignacionAreaEdificioDto: CreateAsignacionAreaEdificioDto,
    ): Promise<BaseResponseDto<AsignacionAreaEdificioResponseDto>> {
        return await this.asignacionAreaEdificioService.create(
            createAsignacionAreaEdificioDto,
        );
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Obtener todas las asignaciones',
        description: 'Obtiene todas las asignaciones de áreas comunes a edificios',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Lista de asignaciones',
        type: [BaseResponseDto<AsignacionAreaEdificioResponseDto[]>],
    })
    async findAll(): Promise<BaseResponseDto<AsignacionAreaEdificioResponseDto[]>> {
        return await this.asignacionAreaEdificioService.findAll();
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Obtener asignación por ID',
        description: 'Obtiene una asignación específica por su ID',
    })
    @ApiParam({
        name: 'id',
        type: 'string',
        description: 'ID único de la asignación',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Asignación encontrada',
        type: BaseResponseDto<AsignacionAreaEdificioResponseDto>,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Asignación no encontrada',
    })
    async findOne(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<BaseResponseDto<AsignacionAreaEdificioResponseDto>> {
        return await this.asignacionAreaEdificioService.findOne(id);
    }

    @Get('edificio/:idEdificio')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Obtener asignaciones por edificio',
        description: 'Obtiene todas las asignaciones de un edificio específico',
    })
    @ApiParam({
        name: 'idEdificio',
        type: 'string',
        description: 'ID del edificio',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Asignaciones del edificio',
        type: [BaseResponseDto<AsignacionAreaEdificioResponseDto[]>],
    })
    async findByEdificio(
        @Param('idEdificio', ParseUUIDPipe) idEdificio: string,
    ): Promise<BaseResponseDto<AsignacionAreaEdificioResponseDto[]>> {
        return await this.asignacionAreaEdificioService.findByEdificio(idEdificio);
    }

    @Get('area-comun/:idAreaComun')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Obtener asignaciones por área común',
        description: 'Obtiene todas las asignaciones de un área común específica',
    })
    @ApiParam({
        name: 'idAreaComun',
        type: 'string',
        description: 'ID del área común',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Asignaciones del área común',
        type: [BaseResponseDto<AsignacionAreaEdificioResponseDto[]>],
    })
    async findByAreaComun(
        @Param('idAreaComun', ParseUUIDPipe) idAreaComun: string,
    ): Promise<BaseResponseDto<AsignacionAreaEdificioResponseDto[]>> {
        return await this.asignacionAreaEdificioService.findByAreaComun(idAreaComun);
    }

    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Actualizar asignación',
        description: 'Actualiza una asignación existente',
    })
    @ApiParam({
        name: 'id',
        type: 'string',
        description: 'ID único de la asignación',
    })
    @ApiBody({
        type: UpdateAsignacionAreaEdificioDto,
        description: 'Datos para actualizar la asignación',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Asignación actualizada exitosamente',
        type: BaseResponseDto<AsignacionAreaEdificioResponseDto>,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Asignación no encontrada',
    })
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateAsignacionAreaEdificioDto: UpdateAsignacionAreaEdificioDto,
    ): Promise<BaseResponseDto<AsignacionAreaEdificioResponseDto>> {
        return await this.asignacionAreaEdificioService.update(
            id,
            updateAsignacionAreaEdificioDto,
        );
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Eliminar asignación',
        description: 'Elimina una asignación específica',
    })
    @ApiParam({
        name: 'id',
        type: 'string',
        description: 'ID único de la asignación',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Asignación eliminada exitosamente',
        type: BaseResponseDto<string>,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Asignación no encontrada',
    })
    async remove(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<BaseResponseDto<string>> {
        return await this.asignacionAreaEdificioService.remove(id);
    }

    @Patch(':id/toggle-status')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Cambiar estado de asignación',
        description: 'Activa o desactiva una asignación',
    })
    @ApiParam({
        name: 'id',
        type: 'string',
        description: 'ID único de la asignación',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Estado de asignación cambiado exitosamente',
        type: BaseResponseDto<AsignacionAreaEdificioResponseDto>,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Asignación no encontrada',
    })
    async toggleStatus(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<BaseResponseDto<AsignacionAreaEdificioResponseDto>> {
        return await this.asignacionAreaEdificioService.toggleStatus(id);
    }
}
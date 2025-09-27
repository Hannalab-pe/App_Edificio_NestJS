import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    HttpStatus,
    Patch,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiQuery,
    ApiBody,
} from '@nestjs/swagger';
import { JuntaPropietariosService } from '../../services/implementations/junta-propietarios/junta-propietarios.service';
import { CreateJuntaPropietariosDto } from '../../dtos/junta-propietarios/create-junta-propietarios.dto';
import { UpdateJuntaPropietariosDto } from '../../dtos/junta-propietarios/update-junta-propietarios.dto';
import { JuntaPropietariosResponseDto } from '../../dtos/junta-propietarios/junta-propietarios-response.dto';
import { BaseResponseDto } from '../../dtos/baseResponse/baseResponse.dto';

@ApiTags('Junta de Propietarios')
@Controller('junta-propietarios')
export class JuntaPropietariosController {
    constructor(
        private readonly juntaPropietariosService: JuntaPropietariosService,
    ) { }

    @Post()
    @ApiOperation({
        summary: 'Crear una nueva junta de propietarios',
        description:
            'Crea una nueva junta de propietarios junto con su documento asociado en una transacción segura',
    })
    @ApiBody({
        type: CreateJuntaPropietariosDto,
        description: 'Datos de la junta y documento a crear',
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Junta de propietarios creada exitosamente',
        type: JuntaPropietariosResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Datos inválidos o número de acta duplicado',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Usuario, tipo de documento o trabajador no encontrado',
    })
    async create(
        @Body() createJuntaPropietariosDto: CreateJuntaPropietariosDto,
    ): Promise<BaseResponseDto<JuntaPropietariosResponseDto>> {
        return this.juntaPropietariosService.create(createJuntaPropietariosDto);
    }

    @Get()
    @ApiOperation({
        summary: 'Obtener todas las juntas de propietarios',
        description:
            'Retorna lista completa de juntas ordenadas por fecha descendente',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Juntas obtenidas exitosamente',
        type: [JuntaPropietariosResponseDto],
    })
    async findAll(): Promise<BaseResponseDto<JuntaPropietariosResponseDto[]>> {
        return this.juntaPropietariosService.findAll();
    }

    @Get('estado/:estado')
    @ApiOperation({
        summary: 'Obtener juntas por estado',
        description: 'Filtra juntas por su estado actual',
    })
    @ApiParam({
        name: 'estado',
        description: 'Estado de la junta',
        example: 'Finalizada',
        enum: ['Programada', 'En Curso', 'Finalizada', 'Cancelada'],
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Juntas filtradas por estado',
        type: [JuntaPropietariosResponseDto],
    })
    async findByEstado(
        @Param('estado') estado: string,
    ): Promise<BaseResponseDto<JuntaPropietariosResponseDto[]>> {
        return this.juntaPropietariosService.findByEstado(estado);
    }

    @Get('tipo/:tipoJunta')
    @ApiOperation({
        summary: 'Obtener juntas por tipo',
        description: 'Filtra juntas por su tipo',
    })
    @ApiParam({
        name: 'tipoJunta',
        description: 'Tipo de junta',
        example: 'Ordinaria',
        enum: ['Ordinaria', 'Extraordinaria', 'Constitutiva'],
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Juntas filtradas por tipo',
        type: [JuntaPropietariosResponseDto],
    })
    async findByTipoJunta(
        @Param('tipoJunta') tipoJunta: string,
    ): Promise<BaseResponseDto<JuntaPropietariosResponseDto[]>> {
        return this.juntaPropietariosService.findByTipoJunta(tipoJunta);
    }

    @Get('acta/:numeroActa')
    @ApiOperation({
        summary: 'Obtener junta por número de acta',
        description: 'Busca una junta específica por su número de acta único',
    })
    @ApiParam({
        name: 'numeroActa',
        description: 'Número de acta de la junta',
        example: 'ACTA-2024-001',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Junta encontrada exitosamente',
        type: JuntaPropietariosResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Junta no encontrada con ese número de acta',
    })
    async findByNumeroActa(
        @Param('numeroActa') numeroActa: string,
    ): Promise<BaseResponseDto<JuntaPropietariosResponseDto>> {
        return this.juntaPropietariosService.findByNumeroActa(numeroActa);
    }

    @Get('fecha-rango')
    @ApiOperation({
        summary: 'Obtener juntas por rango de fechas',
        description: 'Filtra juntas dentro de un rango de fechas específico',
    })
    @ApiQuery({
        name: 'fechaInicio',
        description: 'Fecha de inicio del rango (YYYY-MM-DD)',
        example: '2024-01-01',
    })
    @ApiQuery({
        name: 'fechaFin',
        description: 'Fecha de fin del rango (YYYY-MM-DD)',
        example: '2024-12-31',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Juntas en el rango de fechas',
        type: [JuntaPropietariosResponseDto],
    })
    async findByFechaRange(
        @Query('fechaInicio') fechaInicio: string,
        @Query('fechaFin') fechaFin: string,
    ): Promise<BaseResponseDto<JuntaPropietariosResponseDto[]>> {
        return this.juntaPropietariosService.findByFechaRange(
            fechaInicio,
            fechaFin,
        );
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Obtener una junta por ID',
        description: 'Retorna información detallada de una junta específica',
    })
    @ApiParam({
        name: 'id',
        description: 'ID único de la junta',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Junta obtenida exitosamente',
        type: JuntaPropietariosResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Junta no encontrada',
    })
    async findOne(
        @Param('id') id: string,
    ): Promise<BaseResponseDto<JuntaPropietariosResponseDto>> {
        return this.juntaPropietariosService.findOne(id);
    }

    @Put(':id')
    @ApiOperation({
        summary: 'Actualizar una junta de propietarios',
        description:
            'Actualiza los datos de una junta y opcionalmente su documento asociado',
    })
    @ApiParam({
        name: 'id',
        description: 'ID único de la junta',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @ApiBody({
        type: UpdateJuntaPropietariosDto,
        description: 'Datos de la junta a actualizar',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Junta actualizada exitosamente',
        type: JuntaPropietariosResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Junta no encontrada',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Datos inválidos o número de acta duplicado',
    })
    async update(
        @Param('id') id: string,
        @Body() updateJuntaPropietariosDto: UpdateJuntaPropietariosDto,
    ): Promise<BaseResponseDto<JuntaPropietariosResponseDto>> {
        return this.juntaPropietariosService.update(id, updateJuntaPropietariosDto);
    }

    @Patch(':id/documento')
    @ApiOperation({
        summary: 'Actualizar solo el documento de una junta',
        description:
            'Permite actualizar únicamente el documento asociado a una junta existente',
    })
    @ApiParam({
        name: 'id',
        description: 'ID único de la junta',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                urlDocumento: {
                    type: 'string',
                    description: 'Nueva URL del documento',
                    example: 'https://storage.example.com/documents/nueva-acta.pdf',
                },
                descripcion: {
                    type: 'string',
                    description: 'Nueva descripción del documento',
                    example: 'Acta final firmada por todos los participantes',
                },
                idTipoDocumento: {
                    type: 'string',
                    description: 'ID del tipo de documento',
                    example: '123e4567-e89b-12d3-a456-426614174001',
                },
            },
            required: ['urlDocumento', 'descripcion', 'idTipoDocumento'],
        },
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Documento actualizado exitosamente',
        type: JuntaPropietariosResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Junta o tipo de documento no encontrado',
    })
    async updateDocumento(
        @Param('id') id: string,
        @Body()
        updateDocumentoDto: {
            urlDocumento: string;
            descripcion: string;
            idTipoDocumento: string;
        },
    ): Promise<BaseResponseDto<JuntaPropietariosResponseDto>> {
        return this.juntaPropietariosService.updateDocumento(
            id,
            updateDocumentoDto.urlDocumento,
            updateDocumentoDto.descripcion,
            updateDocumentoDto.idTipoDocumento,
        );
    }

    @Delete(':id')
    @ApiOperation({
        summary: 'Eliminar una junta de propietarios',
        description:
            'Elimina una junta y su documento asociado del sistema de forma permanente',
    })
    @ApiParam({
        name: 'id',
        description: 'ID único de la junta',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Junta eliminada exitosamente',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Junta no encontrada',
    })
    async remove(@Param('id') id: string): Promise<BaseResponseDto<void>> {
        return this.juntaPropietariosService.remove(id);
    }
}

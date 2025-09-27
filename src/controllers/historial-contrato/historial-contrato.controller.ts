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
    Res,
    ParseEnumPipe
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiBody,
    ApiQuery
} from '@nestjs/swagger';
import { Response } from 'express';
import { HistorialContratoService } from '../../services/implementations/historial-contrato/historial-contrato.service';
import {
    CreateHistorialContratoDto,
    UpdateHistorialContratoDto,
    HistorialContratoResponseDto
} from '../../dtos/index';
import { TipoAccionHistorial } from '../../Enums/TipoAccionHistorial';

@ApiTags('Historial de Contratos')
@Controller('historial-contrato')
export class HistorialContratoController {
    constructor(private readonly historialContratoService: HistorialContratoService) { }

    @Post()
    @ApiOperation({
        summary: 'Crear un nuevo registro de historial',
        description: 'Registra una nueva acción en el historial de un contrato'
    })
    @ApiBody({
        type: CreateHistorialContratoDto,
        description: 'Datos del registro de historial a crear'
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Registro de historial creado exitosamente',
        type: HistorialContratoResponseDto
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Error en los datos de entrada'
    })
    async create(
        @Body() createHistorialContratoDto: CreateHistorialContratoDto,
        @Res() res: Response
    ) {
        try {
            const result = await this.historialContratoService.create(createHistorialContratoDto);

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
                error: error.message
            });
        }
    }

    @Get()
    @ApiOperation({
        summary: 'Obtener todos los registros de historial',
        description: 'Retorna una lista de todos los registros de historial de contratos'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Lista de registros obtenida exitosamente',
        type: [HistorialContratoResponseDto]
    })
    async findAll(@Res() res: Response) {
        try {
            const result = await this.historialContratoService.findAll();

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
                error: error.message
            });
        }
    }

    @Get('contrato/:contratoId')
    @ApiOperation({
        summary: 'Obtener historial por contrato',
        description: 'Retorna todos los registros de historial de un contrato específico'
    })
    @ApiParam({
        name: 'contratoId',
        description: 'ID del contrato',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Historial del contrato obtenido exitosamente',
        type: [HistorialContratoResponseDto]
    })
    async findByContrato(
        @Param('contratoId') contratoId: string,
        @Res() res: Response
    ) {
        try {
            const result = await this.historialContratoService.findByContrato(contratoId);

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
                error: error.message
            });
        }
    }

    @Get('contrato/:contratoId/cronologico')
    @ApiOperation({
        summary: 'Obtener historial cronológico por contrato',
        description: 'Retorna el historial de un contrato ordenado cronológicamente'
    })
    @ApiParam({
        name: 'contratoId',
        description: 'ID del contrato',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Historial cronológico obtenido exitosamente',
        type: [HistorialContratoResponseDto]
    })
    async findByContratoOrdenado(
        @Param('contratoId') contratoId: string,
        @Res() res: Response
    ) {
        try {
            const result = await this.historialContratoService.findByContratoOrdenado(contratoId);

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
                error: error.message
            });
        }
    }

    @Get('trabajador/:trabajadorId')
    @ApiOperation({
        summary: 'Obtener historial por trabajador',
        description: 'Retorna todos los registros de historial de contratos de un trabajador'
    })
    @ApiParam({
        name: 'trabajadorId',
        description: 'ID del trabajador',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Historial del trabajador obtenido exitosamente',
        type: [HistorialContratoResponseDto]
    })
    async findByTrabajador(
        @Param('trabajadorId') trabajadorId: string,
        @Res() res: Response
    ) {
        try {
            const result = await this.historialContratoService.findByTrabajador(trabajadorId);

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
                error: error.message
            });
        }
    }

    @Get('trabajador/:trabajadorId/completo')
    @ApiOperation({
        summary: 'Obtener historial completo por trabajador',
        description: 'Retorna el historial completo de todos los contratos de un trabajador'
    })
    @ApiParam({
        name: 'trabajadorId',
        description: 'ID del trabajador',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Historial completo del trabajador obtenido exitosamente',
        type: [HistorialContratoResponseDto]
    })
    async findHistorialCompletoTrabajador(
        @Param('trabajadorId') trabajadorId: string,
        @Res() res: Response
    ) {
        try {
            const result = await this.historialContratoService.findHistorialCompletoTrabajador(trabajadorId);

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
                error: error.message
            });
        }
    }

    @Get('tipo-accion/:tipoAccion')
    @ApiOperation({
        summary: 'Obtener historial por tipo de acción',
        description: 'Retorna todos los registros de historial de un tipo de acción específico'
    })
    @ApiParam({
        name: 'tipoAccion',
        description: 'Tipo de acción',
        enum: TipoAccionHistorial,
        example: TipoAccionHistorial.MODIFICACION
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Historial por tipo de acción obtenido exitosamente',
        type: [HistorialContratoResponseDto]
    })
    async findByTipoAccion(
        @Param('tipoAccion', new ParseEnumPipe(TipoAccionHistorial)) tipoAccion: TipoAccionHistorial,
        @Res() res: Response
    ) {
        try {
            const result = await this.historialContratoService.findByTipoAccion(tipoAccion);

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
                error: error.message
            });
        }
    }

    @Get('recientes')
    @ApiOperation({
        summary: 'Obtener acciones recientes',
        description: 'Retorna las acciones realizadas en los últimos días'
    })
    @ApiQuery({
        name: 'dias',
        description: 'Número de días hacia atrás (por defecto 30)',
        required: false,
        type: Number,
        example: 30
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Acciones recientes obtenidas exitosamente',
        type: [HistorialContratoResponseDto]
    })
    async findAccionesRecientes(
        @Res() res: Response,
        @Query('dias') dias?: number
    ) {
        try {
            const result = await this.historialContratoService.findAccionesRecientes(dias);

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
                error: error.message
            });
        }
    }

    @Get('rango-fechas')
    @ApiOperation({
        summary: 'Obtener historial por rango de fechas',
        description: 'Retorna registros de historial dentro de un rango de fechas'
    })
    @ApiQuery({
        name: 'fechaInicio',
        description: 'Fecha de inicio (YYYY-MM-DD)',
        required: true,
        type: String,
        example: '2024-01-01'
    })
    @ApiQuery({
        name: 'fechaFin',
        description: 'Fecha de fin (YYYY-MM-DD)',
        required: true,
        type: String,
        example: '2024-12-31'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Historial por rango de fechas obtenido exitosamente',
        type: [HistorialContratoResponseDto]
    })
    async findByFechaRange(
        @Query('fechaInicio') fechaInicio: string,
        @Query('fechaFin') fechaFin: string,
        @Res() res: Response
    ) {
        try {
            const fechaInicioDate = new Date(fechaInicio);
            const fechaFinDate = new Date(fechaFin);

            if (isNaN(fechaInicioDate.getTime()) || isNaN(fechaFinDate.getTime())) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    success: false,
                    message: 'Formato de fecha inválido. Use YYYY-MM-DD',
                    data: []
                });
            }

            const result = await this.historialContratoService.findByFechaRange(fechaInicioDate, fechaFinDate);

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
                error: error.message
            });
        }
    }

    @Post('registrar-accion')
    @ApiOperation({
        summary: 'Registrar una acción manualmente',
        description: 'Registra una acción específica en el historial de un contrato'
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                contratoId: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
                tipoAccion: { enum: Object.values(TipoAccionHistorial), example: TipoAccionHistorial.MODIFICACION },
                descripcion: { type: 'string', example: 'Cambio de salario realizado' },
                estadoAnterior: { type: 'object', example: { salario: 2000 } },
                estadoNuevo: { type: 'object', example: { salario: 2500 } },
                usuarioAccion: { type: 'string', example: 'admin@empresa.com' },
                observaciones: { type: 'string', example: 'Aprobado por RRHH' }
            },
            required: ['contratoId', 'tipoAccion', 'descripcion']
        }
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Acción registrada exitosamente',
        type: HistorialContratoResponseDto
    })
    async registrarAccion(
        @Body() body: {
            contratoId: string;
            tipoAccion: TipoAccionHistorial;
            descripcion: string;
            estadoAnterior?: any;
            estadoNuevo?: any;
            usuarioAccion?: string;
            observaciones?: string;
        },
        @Res() res: Response
    ) {
        try {
            const result = await this.historialContratoService.registrarAccion(
                body.contratoId,
                body.tipoAccion,
                body.descripcion,
                body.estadoAnterior,
                body.estadoNuevo,
                body.usuarioAccion,
                body.observaciones
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
                error: error.message
            });
        }
    }

    @Get('contrato/:contratoId/ultima-accion')
    @ApiOperation({
        summary: 'Obtener última acción de un contrato',
        description: 'Retorna la última acción registrada para un contrato específico'
    })
    @ApiParam({
        name: 'contratoId',
        description: 'ID del contrato',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Última acción obtenida exitosamente',
        type: HistorialContratoResponseDto
    })
    async obtenerUltimaAccion(
        @Param('contratoId') contratoId: string,
        @Res() res: Response
    ) {
        try {
            const result = await this.historialContratoService.obtenerUltimaAccion(contratoId);

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
                error: error.message
            });
        }
    }

    @Get('contrato/:contratoId/resumen')
    @ApiOperation({
        summary: 'Obtener resumen de actividad de un contrato',
        description: 'Retorna estadísticas y resumen de actividad de un contrato'
    })
    @ApiParam({
        name: 'contratoId',
        description: 'ID del contrato',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Resumen de actividad obtenido exitosamente'
    })
    async obtenerResumenActividad(
        @Param('contratoId') contratoId: string,
        @Res() res: Response
    ) {
        try {
            const result = await this.historialContratoService.obtenerResumenActividad(contratoId);

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
                error: error.message
            });
        }
    }

    @Get('estadisticas')
    @ApiOperation({
        summary: 'Obtener estadísticas generales',
        description: 'Retorna estadísticas generales de las acciones del historial'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Estadísticas obtenidas exitosamente'
    })
    async obtenerEstadisticasAcciones(@Res() res: Response) {
        try {
            const result = await this.historialContratoService.obtenerEstadisticasAcciones();

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
                error: error.message
            });
        }
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Obtener un registro de historial por ID',
        description: 'Retorna un registro específico del historial'
    })
    @ApiParam({
        name: 'id',
        description: 'ID del registro de historial',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Registro encontrado exitosamente',
        type: HistorialContratoResponseDto
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Registro no encontrado'
    })
    async findOne(@Param('id') id: string, @Res() res: Response) {
        try {
            const result = await this.historialContratoService.findOne(id);

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
                error: error.message
            });
        }
    }

    @Patch(':id')
    @ApiOperation({
        summary: 'Actualizar un registro de historial',
        description: 'Actualiza los datos de un registro de historial existente'
    })
    @ApiParam({
        name: 'id',
        description: 'ID del registro de historial',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiBody({
        type: UpdateHistorialContratoDto,
        description: 'Datos a actualizar'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Registro actualizado exitosamente',
        type: HistorialContratoResponseDto
    })
    async update(
        @Param('id') id: string,
        @Body() updateHistorialContratoDto: UpdateHistorialContratoDto,
        @Res() res: Response
    ) {
        try {
            const result = await this.historialContratoService.update(id, updateHistorialContratoDto);

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
                error: error.message
            });
        }
    }

    @Delete(':id')
    @ApiOperation({
        summary: 'Eliminar un registro de historial',
        description: 'Elimina un registro de historial del sistema'
    })
    @ApiParam({
        name: 'id',
        description: 'ID del registro de historial',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Registro eliminado exitosamente'
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Registro no encontrado'
    })
    async remove(@Param('id') id: string, @Res() res: Response) {
        try {
            const result = await this.historialContratoService.remove(id);

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
                error: error.message
            });
        }
    }
}

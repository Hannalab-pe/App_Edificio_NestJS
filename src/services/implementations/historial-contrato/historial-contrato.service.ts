import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual } from 'typeorm';
import { HistorialContrato } from 'src/entities/HistorialContrato';
import { Contrato } from 'src/entities/Contrato';
import { BaseResponseDto } from 'src/dtos/baseResponse/baseResponse.dto';
import {
    CreateHistorialContratoDto,
    UpdateHistorialContratoDto,
    HistorialContratoResponseDto,
    ContratoInfoDto,
    TrabajadorInfoHistorialDto
} from 'src/dtos/index';
import { IHistorialContratoService } from 'src/services/interfaces/historial-contrato.interface';
import { TipoAccionHistorial } from '../../../Enums/TipoAccionHistorial';

@Injectable()
export class HistorialContratoService implements IHistorialContratoService {
    constructor(
        @InjectRepository(HistorialContrato)
        private historialContratoRepository: Repository<HistorialContrato>,
        @InjectRepository(Contrato)
        private contratoRepository: Repository<Contrato>,
    ) { }

    // Operaciones básicas CRUD
    async create(createHistorialContratoDto: CreateHistorialContratoDto): Promise<BaseResponseDto<HistorialContratoResponseDto>> {
        try {
            // Validar que el contrato existe
            const contrato = await this.contratoRepository.findOne({
                where: { idContrato: createHistorialContratoDto.idContrato },
                relations: ['idTrabajador', 'idTipoContrato']
            });

            if (!contrato) {
                return {
                    success: false,
                    message: 'Contrato no encontrado',
                    data: null
                };
            }

            // Crear el registro de historial
            const historial = this.historialContratoRepository.create({
                ...createHistorialContratoDto,
                idContrato: contrato,
                fechaRegistro: new Date()
            });

            const savedHistorial = await this.historialContratoRepository.save(historial);

            // Obtener el historial completo con relaciones para la respuesta
            const historialCompleto = await this.historialContratoRepository.findOne({
                where: { idHistorialContrato: savedHistorial.idHistorialContrato },
                relations: ['idContrato', 'idContrato.idTrabajador', 'idContrato.idTipoContrato']
            });

            const response = historialCompleto ? this.mapToResponseDto(historialCompleto) : null;

            return {
                success: true,
                message: 'Registro de historial creado exitosamente',
                data: response
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al crear registro de historial',
                data: null,
                error: error.message
            };
        }
    }

    async findAll(): Promise<BaseResponseDto<HistorialContratoResponseDto[]>> {
        try {
            const historiales = await this.historialContratoRepository.find({
                relations: ['idContrato', 'idContrato.idTrabajador', 'idContrato.idTipoContrato'],
                order: { fechaRegistro: 'DESC' }
            });

            const response = historiales.map(historial => this.mapToResponseDto(historial));

            return {
                success: true,
                message: 'Historiales obtenidos exitosamente',
                data: response
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al obtener historiales',
                data: [],
                error: error.message
            };
        }
    }

    async findOne(id: string): Promise<BaseResponseDto<HistorialContratoResponseDto>> {
        try {
            const historial = await this.historialContratoRepository.findOne({
                where: { idHistorialContrato: id },
                relations: ['idContrato', 'idContrato.idTrabajador', 'idContrato.idTipoContrato']
            });

            if (!historial) {
                return {
                    success: false,
                    message: 'Registro de historial no encontrado',
                    data: null
                };
            }

            const response = this.mapToResponseDto(historial);

            return {
                success: true,
                message: 'Registro de historial obtenido exitosamente',
                data: response
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al obtener registro de historial',
                data: null,
                error: error.message
            };
        }
    }

    async update(id: string, updateHistorialContratoDto: UpdateHistorialContratoDto): Promise<BaseResponseDto<HistorialContratoResponseDto>> {
        try {
            const historial = await this.historialContratoRepository.findOne({
                where: { idHistorialContrato: id }
            });

            if (!historial) {
                return {
                    success: false,
                    message: 'Registro de historial no encontrado',
                    data: null
                };
            }

            // Si se está cambiando el contrato, validar que existe
            if (updateHistorialContratoDto.idContrato) {
                const contrato = await this.contratoRepository.findOne({
                    where: { idContrato: updateHistorialContratoDto.idContrato }
                });

                if (!contrato) {
                    return {
                        success: false,
                        message: 'Contrato no encontrado',
                        data: null
                    };
                }
            }

            // Preparar datos para actualización
            const updateData: any = { ...updateHistorialContratoDto };
            if (updateData.idContrato) {
                delete updateData.idContrato; // No actualizar la relación directamente
            }

            await this.historialContratoRepository.update(id, updateData);

            const updatedHistorial = await this.historialContratoRepository.findOne({
                where: { idHistorialContrato: id },
                relations: ['idContrato', 'idContrato.idTrabajador', 'idContrato.idTipoContrato']
            });

            const response = updatedHistorial ? this.mapToResponseDto(updatedHistorial) : null;

            return {
                success: true,
                message: 'Registro de historial actualizado exitosamente',
                data: response
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al actualizar registro de historial',
                data: null,
                error: error.message
            };
        }
    }

    async remove(id: string): Promise<BaseResponseDto<void>> {
        try {
            const historial = await this.historialContratoRepository.findOne({
                where: { idHistorialContrato: id }
            });

            if (!historial) {
                return {
                    success: false,
                    message: 'Registro de historial no encontrado',
                    data: null
                };
            }

            await this.historialContratoRepository.remove(historial);

            return {
                success: true,
                message: 'Registro de historial eliminado exitosamente',
                data: null
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al eliminar registro de historial',
                data: null,
                error: error.message
            };
        }
    }

    // Operaciones específicas por contrato
    async findByContrato(contratoId: string): Promise<BaseResponseDto<HistorialContratoResponseDto[]>> {
        try {
            const historiales = await this.historialContratoRepository
                .createQueryBuilder('historial')
                .leftJoinAndSelect('historial.idContrato', 'contrato')
                .leftJoinAndSelect('contrato.idTrabajador', 'trabajador')
                .leftJoinAndSelect('contrato.idTipoContrato', 'tipoContrato')
                .where('contrato.id_contrato = :contratoId', { contratoId })
                .orderBy('historial.fecha_registro', 'DESC')
                .getMany();

            const response = historiales.map(historial => this.mapToResponseDto(historial));

            return {
                success: true,
                message: 'Historial del contrato obtenido exitosamente',
                data: response
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al obtener historial del contrato',
                data: [],
                error: error.message
            };
        }
    }

    async findByContratoOrdenado(contratoId: string): Promise<BaseResponseDto<HistorialContratoResponseDto[]>> {
        try {
            const historiales = await this.historialContratoRepository
                .createQueryBuilder('historial')
                .leftJoinAndSelect('historial.idContrato', 'contrato')
                .leftJoinAndSelect('contrato.idTrabajador', 'trabajador')
                .leftJoinAndSelect('contrato.idTipoContrato', 'tipoContrato')
                .where('contrato.id_contrato = :contratoId', { contratoId })
                .orderBy('historial.fecha_registro', 'ASC')
                .getMany();

            const response = historiales.map(historial => this.mapToResponseDto(historial));

            return {
                success: true,
                message: 'Historial cronológico del contrato obtenido exitosamente',
                data: response
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al obtener historial cronológico del contrato',
                data: [],
                error: error.message
            };
        }
    }

    // Operaciones por trabajador
    async findByTrabajador(trabajadorId: string): Promise<BaseResponseDto<HistorialContratoResponseDto[]>> {
        try {
            const historiales = await this.historialContratoRepository
                .createQueryBuilder('historial')
                .leftJoinAndSelect('historial.idContrato', 'contrato')
                .leftJoinAndSelect('contrato.idTrabajador', 'trabajador')
                .leftJoinAndSelect('contrato.idTipoContrato', 'tipoContrato')
                .where('contrato.id_trabajador = :trabajadorId', { trabajadorId })
                .orderBy('historial.fecha_registro', 'DESC')
                .getMany();

            const response = historiales.map(historial => this.mapToResponseDto(historial));

            return {
                success: true,
                message: 'Historial del trabajador obtenido exitosamente',
                data: response
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al obtener historial del trabajador',
                data: [],
                error: error.message
            };
        }
    }

    async findHistorialCompletoTrabajador(trabajadorId: string): Promise<BaseResponseDto<HistorialContratoResponseDto[]>> {
        try {
            const historiales = await this.historialContratoRepository
                .createQueryBuilder('historial')
                .leftJoinAndSelect('historial.idContrato', 'contrato')
                .leftJoinAndSelect('contrato.idTrabajador', 'trabajador')
                .leftJoinAndSelect('contrato.idTipoContrato', 'tipoContrato')
                .where('trabajador.idTrabajador = :trabajadorId', { trabajadorId })
                .orderBy('historial.fechaRegistro', 'DESC')
                .getMany();

            const response = historiales.map(historial => this.mapToResponseDto(historial));

            return {
                success: true,
                message: 'Historial completo del trabajador obtenido exitosamente',
                data: response
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al obtener historial completo del trabajador',
                data: [],
                error: error.message
            };
        }
    }

    // Operaciones por tipo de acción
    async findByTipoAccion(tipoAccion: TipoAccionHistorial): Promise<BaseResponseDto<HistorialContratoResponseDto[]>> {
        try {
            const historiales = await this.historialContratoRepository.find({
                where: { tipoAccion },
                relations: ['idContrato', 'idContrato.idTrabajador', 'idContrato.idTipoContrato'],
                order: { fechaRegistro: 'DESC' }
            });

            const response = historiales.map(historial => this.mapToResponseDto(historial));

            return {
                success: true,
                message: `Historial de acciones ${tipoAccion} obtenido exitosamente`,
                data: response
            };
        } catch (error) {
            return {
                success: false,
                message: `Error al obtener historial de acciones ${tipoAccion}`,
                data: [],
                error: error.message
            };
        }
    }

    async findAccionesRecientes(dias: number = 30): Promise<BaseResponseDto<HistorialContratoResponseDto[]>> {
        try {
            const fechaLimite = new Date();
            fechaLimite.setDate(fechaLimite.getDate() - dias);

            const historiales = await this.historialContratoRepository.find({
                where: { fechaRegistro: LessThanOrEqual(fechaLimite) },
                relations: ['idContrato', 'idContrato.idTrabajador', 'idContrato.idTipoContrato'],
                order: { fechaRegistro: 'DESC' }
            });

            const response = historiales.map(historial => this.mapToResponseDto(historial));

            return {
                success: true,
                message: `Acciones recientes de los últimos ${dias} días obtenidas exitosamente`,
                data: response
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al obtener acciones recientes',
                data: [],
                error: error.message
            };
        }
    }

    // Operaciones por rango de fechas
    async findByFechaRange(fechaInicio: Date, fechaFin: Date): Promise<BaseResponseDto<HistorialContratoResponseDto[]>> {
        try {
            const historiales = await this.historialContratoRepository.find({
                where: { fechaRegistro: Between(fechaInicio, fechaFin) },
                relations: ['idContrato', 'idContrato.idTrabajador', 'idContrato.idTipoContrato'],
                order: { fechaRegistro: 'DESC' }
            });

            const response = historiales.map(historial => this.mapToResponseDto(historial));

            return {
                success: true,
                message: 'Historial por rango de fechas obtenido exitosamente',
                data: response
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al obtener historial por rango de fechas',
                data: [],
                error: error.message
            };
        }
    }

    async findByFechaRangeAndContrato(fechaInicio: Date, fechaFin: Date, contratoId: string): Promise<BaseResponseDto<HistorialContratoResponseDto[]>> {
        try {
            const historiales = await this.historialContratoRepository
                .createQueryBuilder('historial')
                .leftJoinAndSelect('historial.idContrato', 'contrato')
                .leftJoinAndSelect('contrato.idTrabajador', 'trabajador')
                .leftJoinAndSelect('contrato.idTipoContrato', 'tipoContrato')
                .where('historial.fecha_registro BETWEEN :fechaInicio AND :fechaFin', { fechaInicio, fechaFin })
                .andWhere('contrato.id_contrato = :contratoId', { contratoId })
                .orderBy('historial.fecha_registro', 'DESC')
                .getMany();

            const response = historiales.map(historial => this.mapToResponseDto(historial));

            return {
                success: true,
                message: 'Historial del contrato por rango de fechas obtenido exitosamente',
                data: response
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al obtener historial del contrato por rango de fechas',
                data: [],
                error: error.message
            };
        }
    }

    // Operaciones especializadas
    async registrarAccion(
        contratoId: string,
        tipoAccion: TipoAccionHistorial,
        descripcion: string,
        estadoAnterior?: any,
        estadoNuevo?: any,
        usuarioAccion?: string,
        observaciones?: string
    ): Promise<BaseResponseDto<HistorialContratoResponseDto>> {
        try {
            const contrato = await this.contratoRepository.findOne({
                where: { idContrato: contratoId },
                relations: ['idTrabajador', 'idTipoContrato']
            });

            if (!contrato) {
                return {
                    success: false,
                    message: 'Contrato no encontrado',
                    data: null
                };
            }

            const historial = this.historialContratoRepository.create({
                idContrato: contrato,
                tipoAccion,
                descripcionAccion: descripcion,
                estadoAnterior,
                estadoNuevo,
                usuarioAccion,
                observaciones,
                fechaRegistro: new Date()
            });

            const savedHistorial = await this.historialContratoRepository.save(historial);

            const historialCompleto = await this.historialContratoRepository.findOne({
                where: { idHistorialContrato: savedHistorial.idHistorialContrato },
                relations: ['idContrato', 'idContrato.idTrabajador', 'idContrato.idTipoContrato']
            });

            const response = historialCompleto ? this.mapToResponseDto(historialCompleto) : null;

            return {
                success: true,
                message: 'Acción registrada exitosamente',
                data: response
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al registrar acción',
                data: null,
                error: error.message
            };
        }
    }

    async obtenerUltimaAccion(contratoId: string): Promise<BaseResponseDto<HistorialContratoResponseDto>> {
        try {
            const historial = await this.historialContratoRepository
                .createQueryBuilder('historial')
                .leftJoinAndSelect('historial.idContrato', 'contrato')
                .leftJoinAndSelect('contrato.idTrabajador', 'trabajador')
                .leftJoinAndSelect('contrato.idTipoContrato', 'tipoContrato')
                .where('contrato.id_contrato = :contratoId', { contratoId })
                .orderBy('historial.fecha_registro', 'DESC')
                .getOne();

            if (!historial) {
                return {
                    success: false,
                    message: 'No se encontraron acciones para este contrato',
                    data: null
                };
            }

            const response = this.mapToResponseDto(historial);

            return {
                success: true,
                message: 'Última acción obtenida exitosamente',
                data: response
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al obtener última acción',
                data: null,
                error: error.message
            };
        }
    }

    async obtenerResumenActividad(contratoId: string): Promise<BaseResponseDto<any>> {
        try {
            const historial = await this.historialContratoRepository
                .createQueryBuilder('historial')
                .select([
                    'historial.tipoAccion as tipo_accion',
                    'COUNT(*) as cantidad',
                    'MIN(historial.fechaRegistro) as primera_accion',
                    'MAX(historial.fechaRegistro) as ultima_accion'
                ])
                .where('historial.idContrato = :contratoId', { contratoId })
                .groupBy('historial.tipoAccion')
                .getRawMany();

            const totalAcciones = await this.historialContratoRepository
                .createQueryBuilder('historial')
                .leftJoin('historial.idContrato', 'contrato')
                .where('contrato.id_contrato = :contratoId', { contratoId })
                .getCount();

            const resumen = {
                totalAcciones,
                accionesPorTipo: historial,
                ultimaActividad: historial.length > 0 ?
                    Math.max(...historial.map(h => new Date(h.ultima_accion).getTime())) : null
            };

            return {
                success: true,
                message: 'Resumen de actividad obtenido exitosamente',
                data: resumen
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al obtener resumen de actividad',
                data: null,
                error: error.message
            };
        }
    }

    async obtenerEstadisticasAcciones(): Promise<BaseResponseDto<any>> {
        try {
            const estadisticas = await this.historialContratoRepository
                .createQueryBuilder('historial')
                .select([
                    'historial.tipoAccion as tipo_accion',
                    'COUNT(*) as total',
                    'COUNT(DISTINCT historial.idContrato) as contratos_afectados'
                ])
                .groupBy('historial.tipoAccion')
                .getRawMany();

            const totalAcciones = await this.historialContratoRepository.count();
            const contratosConHistorial = await this.historialContratoRepository
                .createQueryBuilder('historial')
                .select('COUNT(DISTINCT historial.idContrato)', 'total')
                .getRawOne();

            const resumen = {
                totalAcciones,
                contratosConHistorial: parseInt(contratosConHistorial.total),
                estadisticasPorTipo: estadisticas
            };

            return {
                success: true,
                message: 'Estadísticas de acciones obtenidas exitosamente',
                data: resumen
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al obtener estadísticas de acciones',
                data: null,
                error: error.message
            };
        }
    }

    // Método auxiliar para mapear entidad a DTO de respuesta
    private mapToResponseDto(historial: HistorialContrato): HistorialContratoResponseDto {
        const contrato: ContratoInfoDto = {
            idContrato: historial.idContrato.idContrato,
            documentourl: historial.idContrato.documentourl,
            remuneracion: historial.idContrato.remuneracion,
            fechaInicio: historial.idContrato.fechaInicio,
            fechaFin: historial.idContrato.fechaFin,
            estado: (historial.idContrato as any).estado || 'N/A'
        };

        const trabajador: TrabajadorInfoHistorialDto = {
            idTrabajador: historial.idContrato.idTrabajador.idTrabajador,
            nombreCompleto: `${historial.idContrato.idTrabajador.nombre} ${historial.idContrato.idTrabajador.apellido}`,
            correo: historial.idContrato.idTrabajador.correo,
            salarioActual: historial.idContrato.idTrabajador.salarioActual ? parseFloat(historial.idContrato.idTrabajador.salarioActual) : undefined
        };

        return {
            idHistorialContrato: historial.idHistorialContrato,
            fechaRegistro: historial.fechaRegistro,
            tipoAccion: historial.tipoAccion,
            descripcionAccion: historial.descripcionAccion,
            estadoAnterior: historial.estadoAnterior,
            estadoNuevo: historial.estadoNuevo,
            observaciones: historial.observaciones || undefined,
            usuarioAccion: historial.usuarioAccion || undefined,
            ipUsuario: historial.ipUsuario || undefined,
            contrato,
            trabajador
        };
    }
}

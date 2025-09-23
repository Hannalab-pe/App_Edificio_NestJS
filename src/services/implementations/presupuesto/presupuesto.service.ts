import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseResponseDto } from 'src/dtos/baseResponse/baseResponse.dto';
import { CreatePresupuestoDto, UpdatePresupuestoDto } from 'src/dtos';
import { Presupuesto } from 'src/entities/Presupuesto';
import { IPresupuestoService } from 'src/services/interfaces/presupuesto.interface';

@Injectable()
export class PresupuestoService implements IPresupuestoService {

    constructor(
        @InjectRepository(Presupuesto)
        private readonly presupuestoRepository: Repository<Presupuesto>
    ) { }

    async create(createPresupuestoDto: CreatePresupuestoDto): Promise<BaseResponseDto<Presupuesto>> {
        try {
            // Verificar si ya existe un presupuesto con el mismo año, mes y concepto (solo activos)
            const existingPresupuesto = await this.presupuestoRepository.findOne({
                where: {
                    anio: createPresupuestoDto.anio,
                    mes: createPresupuestoDto.mes,
                    concepto: createPresupuestoDto.concepto,
                    estaActivo: true
                }
            });

            if (existingPresupuesto) {
                return {
                    success: false,
                    message: 'Ya existe un presupuesto con el mismo año, mes y concepto',
                    data: null,
                    error: {
                        statusCode: 409,
                        message: 'Conflicto de datos únicos'
                    }
                };
            }

            const nuevoPresupuesto = this.presupuestoRepository.create(createPresupuestoDto);
            const presupuestoGuardado = await this.presupuestoRepository.save(nuevoPresupuesto);

            return {
                success: true,
                message: 'Presupuesto creado exitosamente',
                data: presupuestoGuardado
            };

        } catch (error) {
            return {
                success: false,
                message: 'Error al crear el presupuesto',
                data: null,
                error: {
                    statusCode: 500,
                    message: error.message
                }
            };
        }
    }

    async findAll(): Promise<BaseResponseDto<Presupuesto[]>> {
        try {
            const presupuestos = await this.presupuestoRepository.find({
                where: { estaActivo: true },
                order: {
                    anio: 'DESC',
                    mes: 'ASC'
                }
            });

            return {
                success: true,
                message: 'Presupuestos obtenidos exitosamente',
                data: presupuestos
            };

        } catch (error) {
            return {
                success: false,
                message: 'Error al obtener los presupuestos',
                data: [],
                error: {
                    statusCode: 500,
                    message: error.message
                }
            };
        }
    }

    async findOne(id: string): Promise<BaseResponseDto<Presupuesto>> {
        try {
            const presupuesto = await this.presupuestoRepository.findOne({
                where: {
                    idPresupuesto: id,
                    estaActivo: true
                }
            });

            if (!presupuesto) {
                return {
                    success: false,
                    message: 'Presupuesto no encontrado',
                    data: null,
                    error: {
                        statusCode: 404,
                        message: 'Recurso no encontrado'
                    }
                };
            }

            return {
                success: true,
                message: 'Presupuesto encontrado exitosamente',
                data: presupuesto
            };

        } catch (error) {
            return {
                success: false,
                message: 'Error al buscar el presupuesto',
                data: null,
                error: {
                    statusCode: 500,
                    message: error.message
                }
            };
        }
    }

    async update(id: string, updatePresupuestoDto: UpdatePresupuestoDto): Promise<BaseResponseDto<Presupuesto>> {
        try {
            const presupuestoExistente = await this.presupuestoRepository.findOne({
                where: {
                    idPresupuesto: id,
                    estaActivo: true
                }
            });

            if (!presupuestoExistente) {
                return {
                    success: false,
                    message: 'Presupuesto no encontrado',
                    data: null,
                    error: {
                        statusCode: 404,
                        message: 'Recurso no encontrado'
                    }
                };
            }

            // Verificar unicidad si se está cambiando año, mes o concepto
            if (updatePresupuestoDto.anio || updatePresupuestoDto.mes || updatePresupuestoDto.concepto) {
                const anio = updatePresupuestoDto.anio ?? presupuestoExistente.anio;
                const mes = updatePresupuestoDto.mes ?? presupuestoExistente.mes;
                const concepto = updatePresupuestoDto.concepto ?? presupuestoExistente.concepto;

                const duplicado = await this.presupuestoRepository.findOne({
                    where: {
                        anio,
                        mes,
                        concepto,
                        estaActivo: true
                    }
                });

                if (duplicado && duplicado.idPresupuesto !== id) {
                    return {
                        success: false,
                        message: 'Ya existe un presupuesto con el mismo año, mes y concepto',
                        data: null,
                        error: {
                            statusCode: 409,
                            message: 'Conflicto de datos únicos'
                        }
                    };
                }
            }

            await this.presupuestoRepository.update(id, updatePresupuestoDto);
            const presupuestoActualizado = await this.presupuestoRepository.findOne({
                where: {
                    idPresupuesto: id,
                    estaActivo: true
                }
            });

            return {
                success: true,
                message: 'Presupuesto actualizado exitosamente',
                data: presupuestoActualizado
            };

        } catch (error) {
            return {
                success: false,
                message: 'Error al actualizar el presupuesto',
                data: null,
                error: {
                    statusCode: 500,
                    message: error.message
                }
            };
        }
    }

    async remove(id: string): Promise<BaseResponseDto<undefined>> {
        try {
            const presupuesto = await this.presupuestoRepository.findOne({
                where: {
                    idPresupuesto: id,
                    estaActivo: true
                }
            });

            if (!presupuesto) {
                return {
                    success: false,
                    message: 'Presupuesto no encontrado',
                    data: undefined,
                    error: {
                        statusCode: 404,
                        message: 'Recurso no encontrado'
                    }
                };
            }

            // Eliminación lógica: cambiar estaActivo a false
            presupuesto.estaActivo = false;
            await this.presupuestoRepository.save(presupuesto);

            return {
                success: true,
                message: 'Presupuesto eliminado exitosamente',
                data: undefined
            };

        } catch (error) {
            return {
                success: false,
                message: 'Error al eliminar el presupuesto',
                data: undefined,
                error: {
                    statusCode: 500,
                    message: error.message
                }
            };
        }
    }

    async findByAnio(anio: number): Promise<BaseResponseDto<Presupuesto[]>> {
        try {
            const presupuestos = await this.presupuestoRepository.find({
                where: {
                    anio,
                    estaActivo: true
                },
                order: {
                    mes: 'ASC'
                }
            });

            return {
                success: true,
                message: `Presupuestos del año ${anio} obtenidos exitosamente`,
                data: presupuestos
            };

        } catch (error) {
            return {
                success: false,
                message: 'Error al obtener los presupuestos por año',
                data: [],
                error: {
                    statusCode: 500,
                    message: error.message
                }
            };
        }
    }

    async findByConcepto(concepto: string): Promise<BaseResponseDto<Presupuesto[]>> {
        try {
            const presupuestos = await this.presupuestoRepository.find({
                where: {
                    concepto,
                    estaActivo: true
                },
                order: {
                    anio: 'DESC',
                    mes: 'ASC'
                }
            });

            return {
                success: true,
                message: `Presupuestos con concepto '${concepto}' obtenidos exitosamente`,
                data: presupuestos
            };

        } catch (error) {
            return {
                success: false,
                message: 'Error al obtener los presupuestos por concepto',
                data: [],
                error: {
                    statusCode: 500,
                    message: error.message
                }
            };
        }
    }
}
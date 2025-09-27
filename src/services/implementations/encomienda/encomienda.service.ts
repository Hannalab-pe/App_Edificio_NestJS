import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Encomienda } from 'src/entities/Encomienda';
import { Propiedad } from 'src/entities/Propiedad';
import { Trabajador } from 'src/entities/Trabajador';
import { IEncomiendaService } from 'src/services/interfaces/encomienda/encomienda.interface';
import { CreateEncomiendaDto, UpdateEncomiendaDto, EncomiendaResponseDto } from 'src/dtos/encomienda';
import { BaseResponseDto } from 'src/dtos/baseResponse/baseResponse.dto';
import { EstadoEncomienda } from 'src/Enums/encomienda.enum';

@Injectable()
export class EncomiendaService implements IEncomiendaService {
    constructor(
        @InjectRepository(Encomienda)
        private encomiendaRepository: Repository<Encomienda>,
        @InjectRepository(Propiedad)
        private propiedadRepository: Repository<Propiedad>,
        @InjectRepository(Trabajador)
        private trabajadorRepository: Repository<Trabajador>,
    ) { }

    async create(createEncomiendaDto: CreateEncomiendaDto): Promise<BaseResponseDto<EncomiendaResponseDto>> {
        try {
            // Validar que existe la propiedad
            const propiedad = await this.propiedadRepository.findOne({
                where: { idPropiedad: createEncomiendaDto.idPropiedad }
            });

            if (!propiedad) {
                return {
                    success: false,
                    message: 'Propiedad no encontrada',
                    data: null
                };
            }

            // Validar que existe el trabajador y está activo
            const trabajador = await this.trabajadorRepository.findOne({
                where: { idTrabajador: createEncomiendaDto.recibidoPorTrabajador }
            });

            if (!trabajador) {
                return {
                    success: false,
                    message: 'Trabajador no encontrado',
                    data: null
                };
            }

            if (!trabajador.estaActivo) {
                return {
                    success: false,
                    message: 'El trabajador no está activo',
                    data: null
                };
            }

            // Verificar que no existe otra encomienda con el mismo código de seguimiento
            if (createEncomiendaDto.codigoSeguimiento) {
                const encomiendaExistente = await this.encomiendaRepository.findOne({
                    where: { codigoSeguimiento: createEncomiendaDto.codigoSeguimiento }
                });

                if (encomiendaExistente) {
                    return {
                        success: false,
                        message: 'Ya existe una encomienda con este código de seguimiento',
                        data: null
                    };
                }
            }

            const encomienda = this.encomiendaRepository.create({
                codigoSeguimiento: createEncomiendaDto.codigoSeguimiento,
                remitente: createEncomiendaDto.remitente,
                empresaCourier: createEncomiendaDto.empresaCourier,
                fechaLlegada: createEncomiendaDto.fechaLlegada ? new Date(createEncomiendaDto.fechaLlegada) : new Date(),
                estado: createEncomiendaDto.estado,
                descripcion: createEncomiendaDto.descripcion,
                fotoEvidenciaUrl: createEncomiendaDto.fotoEvidenciaUrl,
                observaciones: createEncomiendaDto.observaciones,
                idPropiedad: propiedad,
                recibidoPorTrabajador: trabajador,
            });

            const encomiendaGuardada = await this.encomiendaRepository.save(encomienda);
            const encomiendaCompleta = await this.findOneEntity(encomiendaGuardada.idEncomienda);

            return {
                success: true,
                message: 'Encomienda creada exitosamente',
                data: this.mapToResponseDto(encomiendaCompleta!)
            };
        } catch (error) {
            return {
                success: false,
                message: `Error al crear encomienda: ${error.message}`,
                data: null
            };
        }
    }

    async findAll(): Promise<BaseResponseDto<EncomiendaResponseDto[]>> {
        try {
            const encomiendas = await this.encomiendaRepository.find({
                relations: ['idPropiedad', 'recibidoPorTrabajador'],
                order: { fechaLlegada: 'DESC' }
            });

            const encomiendasResponse = encomiendas.map(enc => this.mapToResponseDto(enc));

            return {
                success: true,
                message: 'Encomiendas obtenidas exitosamente',
                data: encomiendasResponse
            };
        } catch (error) {
            return {
                success: false,
                message: `Error al obtener encomiendas: ${error.message}`,
                data: []
            };
        }
    }

    async findOne(id: string): Promise<BaseResponseDto<EncomiendaResponseDto>> {
        try {
            const encomienda = await this.findOneEntity(id);

            if (!encomienda) {
                return {
                    success: false,
                    message: 'Encomienda no encontrada',
                    data: null
                };
            }

            return {
                success: true,
                message: 'Encomienda obtenida exitosamente',
                data: this.mapToResponseDto(encomienda)
            };
        } catch (error) {
            return {
                success: false,
                message: `Error al obtener encomienda: ${error.message}`,
                data: null
            };
        }
    }

    async update(id: string, updateEncomiendaDto: UpdateEncomiendaDto): Promise<BaseResponseDto<EncomiendaResponseDto>> {
        try {
            const encomienda = await this.encomiendaRepository.findOne({
                where: { idEncomienda: id }
            });

            if (!encomienda) {
                return {
                    success: false,
                    message: 'Encomienda no encontrada',
                    data: null
                };
            }

            // Validaciones opcionales si se están actualizando
            if (updateEncomiendaDto.idPropiedad) {
                const propiedad = await this.propiedadRepository.findOne({
                    where: { idPropiedad: updateEncomiendaDto.idPropiedad }
                });

                if (!propiedad) {
                    return {
                        success: false,
                        message: 'Propiedad no encontrada',
                        data: null
                    };
                }
            }

            if (updateEncomiendaDto.recibidoPorTrabajador) {
                const trabajador = await this.trabajadorRepository.findOne({
                    where: { idTrabajador: updateEncomiendaDto.recibidoPorTrabajador }
                });

                if (!trabajador) {
                    return {
                        success: false,
                        message: 'Trabajador no encontrado',
                        data: null
                    };
                }

                if (!trabajador.estaActivo) {
                    return {
                        success: false,
                        message: 'El trabajador no está activo',
                        data: null
                    };
                }
            }

            // Verificar código de seguimiento único (si se está actualizando)
            if (updateEncomiendaDto.codigoSeguimiento) {
                const encomiendaExistente = await this.encomiendaRepository.findOne({
                    where: { codigoSeguimiento: updateEncomiendaDto.codigoSeguimiento }
                });

                if (encomiendaExistente && encomiendaExistente.idEncomienda !== id) {
                    return {
                        success: false,
                        message: 'Ya existe otra encomienda con este código de seguimiento',
                        data: null
                    };
                }
            }

            const updateData: any = {};

            if (updateEncomiendaDto.codigoSeguimiento !== undefined) {
                updateData.codigoSeguimiento = updateEncomiendaDto.codigoSeguimiento;
            }
            if (updateEncomiendaDto.remitente) {
                updateData.remitente = updateEncomiendaDto.remitente;
            }
            if (updateEncomiendaDto.empresaCourier !== undefined) {
                updateData.empresaCourier = updateEncomiendaDto.empresaCourier;
            }
            if (updateEncomiendaDto.fechaLlegada) {
                updateData.fechaLlegada = new Date(updateEncomiendaDto.fechaLlegada);
            }
            if (updateEncomiendaDto.fechaEntrega) {
                updateData.fechaEntrega = new Date(updateEncomiendaDto.fechaEntrega);
            }
            if (updateEncomiendaDto.estado) {
                updateData.estado = updateEncomiendaDto.estado;
                // Si se marca como entregada, establecer fecha de entrega automáticamente
                if (updateEncomiendaDto.estado === EstadoEncomienda.ENTREGADA && !updateEncomiendaDto.fechaEntrega) {
                    updateData.fechaEntrega = new Date();
                }
            }
            if (updateEncomiendaDto.descripcion !== undefined) {
                updateData.descripcion = updateEncomiendaDto.descripcion;
            }
            if (updateEncomiendaDto.fotoEvidenciaUrl !== undefined) {
                updateData.fotoEvidenciaUrl = updateEncomiendaDto.fotoEvidenciaUrl;
            }
            if (updateEncomiendaDto.observaciones !== undefined) {
                updateData.observaciones = updateEncomiendaDto.observaciones;
            }
            if (updateEncomiendaDto.idPropiedad) {
                updateData.idPropiedad = { idPropiedad: updateEncomiendaDto.idPropiedad };
            }
            if (updateEncomiendaDto.recibidoPorTrabajador) {
                updateData.recibidoPorTrabajador = { idTrabajador: updateEncomiendaDto.recibidoPorTrabajador };
            }

            await this.encomiendaRepository.update(id, updateData);

            const encomiendaActualizada = await this.findOneEntity(id);

            return {
                success: true,
                message: 'Encomienda actualizada exitosamente',
                data: this.mapToResponseDto(encomiendaActualizada!)
            };
        } catch (error) {
            return {
                success: false,
                message: `Error al actualizar encomienda: ${error.message}`,
                data: null
            };
        }
    }

    async remove(id: string): Promise<BaseResponseDto<void>> {
        try {
            const encomienda = await this.encomiendaRepository.findOne({
                where: { idEncomienda: id }
            });

            if (!encomienda) {
                return {
                    success: false,
                    message: 'Encomienda no encontrada',
                    data: null
                };
            }

            await this.encomiendaRepository.remove(encomienda);

            return {
                success: true,
                message: 'Encomienda eliminada exitosamente',
                data: null
            };
        } catch (error) {
            return {
                success: false,
                message: `Error al eliminar encomienda: ${error.message}`,
                data: null
            };
        }
    }

    async findByPropiedad(idPropiedad: string): Promise<BaseResponseDto<EncomiendaResponseDto[]>> {
        try {
            const encomiendas = await this.encomiendaRepository.find({
                where: { idPropiedad: { idPropiedad } },
                relations: ['idPropiedad', 'recibidoPorTrabajador'],
                order: { fechaLlegada: 'DESC' }
            });

            const encomiendasResponse = encomiendas.map(enc => this.mapToResponseDto(enc));

            return {
                success: true,
                message: 'Encomiendas por propiedad obtenidas exitosamente',
                data: encomiendasResponse
            };
        } catch (error) {
            return {
                success: false,
                message: `Error al obtener encomiendas por propiedad: ${error.message}`,
                data: []
            };
        }
    }

    async findByTrabajador(idTrabajador: string): Promise<BaseResponseDto<EncomiendaResponseDto[]>> {
        try {
            const encomiendas = await this.encomiendaRepository.find({
                where: { recibidoPorTrabajador: { idTrabajador } },
                relations: ['idPropiedad', 'recibidoPorTrabajador'],
                order: { fechaLlegada: 'DESC' }
            });

            const encomiendasResponse = encomiendas.map(enc => this.mapToResponseDto(enc));

            return {
                success: true,
                message: 'Encomiendas por trabajador obtenidas exitosamente',
                data: encomiendasResponse
            };
        } catch (error) {
            return {
                success: false,
                message: `Error al obtener encomiendas por trabajador: ${error.message}`,
                data: []
            };
        }
    }

    async findByEstado(estado: EstadoEncomienda): Promise<BaseResponseDto<EncomiendaResponseDto[]>> {
        try {
            const encomiendas = await this.encomiendaRepository.find({
                where: { estado },
                relations: ['idPropiedad', 'recibidoPorTrabajador'],
                order: { fechaLlegada: 'DESC' }
            });

            const encomiendasResponse = encomiendas.map(enc => this.mapToResponseDto(enc));

            return {
                success: true,
                message: `Encomiendas con estado ${estado} obtenidas exitosamente`,
                data: encomiendasResponse
            };
        } catch (error) {
            return {
                success: false,
                message: `Error al obtener encomiendas por estado: ${error.message}`,
                data: []
            };
        }
    }

    async findByRemitente(remitente: string): Promise<BaseResponseDto<EncomiendaResponseDto[]>> {
        try {
            const encomiendas = await this.encomiendaRepository
                .createQueryBuilder('encomienda')
                .leftJoinAndSelect('encomienda.idPropiedad', 'propiedad')
                .leftJoinAndSelect('encomienda.recibidoPorTrabajador', 'trabajador')
                .where('encomienda.remitente ILIKE :remitente', { remitente: `%${remitente}%` })
                .orderBy('encomienda.fechaLlegada', 'DESC')
                .getMany();

            const encomiendasResponse = encomiendas.map(enc => this.mapToResponseDto(enc));

            return {
                success: true,
                message: 'Encomiendas encontradas por remitente',
                data: encomiendasResponse
            };
        } catch (error) {
            return {
                success: false,
                message: `Error al buscar encomiendas por remitente: ${error.message}`,
                data: []
            };
        }
    }

    async findByCodigo(codigoSeguimiento: string): Promise<BaseResponseDto<EncomiendaResponseDto>> {
        try {
            const encomienda = await this.encomiendaRepository.findOne({
                where: { codigoSeguimiento },
                relations: ['idPropiedad', 'recibidoPorTrabajador']
            });

            if (!encomienda) {
                return {
                    success: false,
                    message: 'Encomienda no encontrada con este código de seguimiento',
                    data: null
                };
            }

            return {
                success: true,
                message: 'Encomienda encontrada por código de seguimiento',
                data: this.mapToResponseDto(encomienda)
            };
        } catch (error) {
            return {
                success: false,
                message: `Error al buscar encomienda por código: ${error.message}`,
                data: null
            };
        }
    }

    async marcarComoEntregada(id: string): Promise<BaseResponseDto<EncomiendaResponseDto>> {
        try {
            const encomienda = await this.encomiendaRepository.findOne({
                where: { idEncomienda: id }
            });

            if (!encomienda) {
                return {
                    success: false,
                    message: 'Encomienda no encontrada',
                    data: null
                };
            }

            await this.encomiendaRepository.update(id, {
                estado: EstadoEncomienda.ENTREGADA,
                fechaEntrega: new Date()
            });

            const encomiendaActualizada = await this.findOneEntity(id);

            return {
                success: true,
                message: 'Encomienda marcada como entregada exitosamente',
                data: this.mapToResponseDto(encomiendaActualizada!)
            };
        } catch (error) {
            return {
                success: false,
                message: `Error al marcar encomienda como entregada: ${error.message}`,
                data: null
            };
        }
    }

    async obtenerEncomiendasPendientes(): Promise<BaseResponseDto<EncomiendaResponseDto[]>> {
        return this.findByEstado(EstadoEncomienda.PENDIENTE);
    }

    private async findOneEntity(id: string): Promise<Encomienda | null> {
        return await this.encomiendaRepository.findOne({
            where: { idEncomienda: id },
            relations: ['idPropiedad', 'recibidoPorTrabajador']
        });
    }

    private mapToResponseDto(encomienda: Encomienda): EncomiendaResponseDto {
        return {
            idEncomienda: encomienda.idEncomienda,
            codigoSeguimiento: encomienda.codigoSeguimiento || undefined,
            remitente: encomienda.remitente,
            empresaCourier: encomienda.empresaCourier || undefined,
            fechaLlegada: encomienda.fechaLlegada || undefined,
            fechaEntrega: encomienda.fechaEntrega || undefined,
            estado: encomienda.estado as EstadoEncomienda,
            descripcion: encomienda.descripcion || undefined,
            fotoEvidenciaUrl: encomienda.fotoEvidenciaUrl || undefined,
            observaciones: encomienda.observaciones || undefined,
            propiedad: {
                idPropiedad: encomienda.idPropiedad.idPropiedad,
                numeroDepartamento: encomienda.idPropiedad.numeroDepartamento,
                tipoPropiedad: encomienda.idPropiedad.tipoPropiedad,
                piso: encomienda.idPropiedad.piso,
            },
            trabajador: {
                idTrabajador: encomienda.recibidoPorTrabajador.idTrabajador,
                nombreCompleto: `${encomienda.recibidoPorTrabajador.nombre} ${encomienda.recibidoPorTrabajador.apellido}`,
                correo: encomienda.recibidoPorTrabajador.correo,
                estaActivo: encomienda.recibidoPorTrabajador.estaActivo,
            },
        };
    }
}

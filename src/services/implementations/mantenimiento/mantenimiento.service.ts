import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Between } from 'typeorm';
import { Mantenimiento } from '../../../entities/Mantenimiento';
import { AreaComun } from '../../../entities/AreaComun';
import { Contacto } from '../../../entities/Contacto';
import { IMantenimientoService } from '../../interfaces/mantenimiento.interface';
import { CreateMantenimientoDto } from '../../../dtos/mantenimiento/create-mantenimiento.dto';
import { UpdateMantenimientoDto } from '../../../dtos/mantenimiento/update-mantenimiento.dto';
import { MantenimientoResponseDto } from '../../../dtos/mantenimiento/mantenimiento-response.dto';
import { BaseResponseDto } from '../../../dtos/baseResponse/baseResponse.dto';

@Injectable()
export class MantenimientoService implements IMantenimientoService {
    constructor(
        @InjectRepository(Mantenimiento)
        private readonly mantenimientoRepository: Repository<Mantenimiento>,
        @InjectRepository(AreaComun)
        private readonly areaComunRepository: Repository<AreaComun>,
        @InjectRepository(Contacto)
        private readonly contactoRepository: Repository<Contacto>,
        private readonly dataSource: DataSource,
    ) { }

    async create(createMantenimientoDto: CreateMantenimientoDto): Promise<BaseResponseDto<MantenimientoResponseDto>> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // Validar que el área común existe y está activa
            const areaComun = await this.areaComunRepository.findOne({
                where: { idAreaComun: createMantenimientoDto.idAreaComun, estaActivo: true }
            });
            if (!areaComun) {
                throw new NotFoundException('Área común no encontrada o no está activa');
            }

            // Validar que el contacto existe y está activo
            const contacto = await this.contactoRepository.findOne({
                where: { idContacto: createMantenimientoDto.idContacto, estaActivo: true },
                relations: { idTipoContacto: true }
            });
            if (!contacto) {
                throw new NotFoundException('Contacto no encontrado o no está activo');
            }

            // Validar fechas
            const fechaInicio = new Date(createMantenimientoDto.fechaInicio);
            const fechaFin = new Date(createMantenimientoDto.fechaFin);

            if (fechaInicio >= fechaFin) {
                throw new BadRequestException('La fecha de inicio debe ser anterior a la fecha de finalización');
            }

            if (fechaInicio < new Date()) {
                throw new BadRequestException('La fecha de inicio no puede ser en el pasado');
            }

            // Verificar conflictos de horario en la misma área común
            const conflictos = await this.mantenimientoRepository.find({
                where: {
                    idAreaComun: { idAreaComun: createMantenimientoDto.idAreaComun },
                    estado: 'Programado'
                }
            });

            const hayConflicto = conflictos.some(m => {
                const inicioExistente = new Date(m.fechaInicio);
                const finExistente = new Date(m.fechaFin);

                return (
                    (fechaInicio >= inicioExistente && fechaInicio < finExistente) ||
                    (fechaFin > inicioExistente && fechaFin <= finExistente) ||
                    (fechaInicio <= inicioExistente && fechaFin >= finExistente)
                );
            });

            if (hayConflicto) {
                throw new BadRequestException('Ya existe un mantenimiento programado en esa área común durante el horario especificado');
            }

            // Crear el mantenimiento
            const mantenimiento = this.mantenimientoRepository.create({
                descripcion: createMantenimientoDto.descripcion,
                fechaInicio: fechaInicio,
                fechaFin: fechaFin,
                estado: createMantenimientoDto.estado,
                idAreaComun: areaComun,
                idContacto: contacto,
            });

            const mantenimientoCreado = await queryRunner.manager.save(mantenimiento);
            await queryRunner.commitTransaction();

            // Obtener el mantenimiento completo con sus relaciones
            const mantenimientoCompleto = await this.findOne(mantenimientoCreado.idMantenimiento);

            return {
                success: true,
                message: 'Mantenimiento programado exitosamente',
                data: mantenimientoCompleto.data,
            };

        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async findAll(): Promise<BaseResponseDto<MantenimientoResponseDto[]>> {
        try {
            const mantenimientos = await this.mantenimientoRepository.find({
                relations: {
                    idAreaComun: true,
                    idContacto: {
                        idTipoContacto: true,
                    },
                },
                order: { fechaInicio: 'DESC' },
            });

            const mantenimientosFormateados = mantenimientos.map(m => this.formatMantenimientoForResponse(m));

            return {
                success: true,
                message: 'Mantenimientos obtenidos exitosamente',
                data: mantenimientosFormateados,
            };
        } catch (error) {
            throw new BadRequestException('Error al obtener los mantenimientos');
        }
    }

    async findOne(id: string): Promise<BaseResponseDto<MantenimientoResponseDto>> {
        try {
            const mantenimiento = await this.mantenimientoRepository.findOne({
                where: { idMantenimiento: id },
                relations: {
                    idAreaComun: true,
                    idContacto: {
                        idTipoContacto: true,
                    },
                },
            });

            if (!mantenimiento) {
                throw new NotFoundException('Mantenimiento no encontrado');
            }

            return {
                success: true,
                message: 'Mantenimiento obtenido exitosamente',
                data: this.formatMantenimientoForResponse(mantenimiento),
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException('Error al obtener el mantenimiento');
        }
    }

    async update(id: string, updateMantenimientoDto: UpdateMantenimientoDto): Promise<BaseResponseDto<MantenimientoResponseDto>> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const mantenimiento = await this.mantenimientoRepository.findOne({
                where: { idMantenimiento: id },
                relations: { idAreaComun: true, idContacto: true },
            });

            if (!mantenimiento) {
                throw new NotFoundException('Mantenimiento no encontrado');
            }

            // Validar área común si se está cambiando
            if (updateMantenimientoDto.idAreaComun && updateMantenimientoDto.idAreaComun !== mantenimiento.idAreaComun.idAreaComun) {
                const nuevaAreaComun = await this.areaComunRepository.findOne({
                    where: { idAreaComun: updateMantenimientoDto.idAreaComun, estaActivo: true }
                });
                if (!nuevaAreaComun) {
                    throw new NotFoundException('Nueva área común no encontrada o no está activa');
                }
                mantenimiento.idAreaComun = nuevaAreaComun;
            }

            // Validar contacto si se está cambiando
            if (updateMantenimientoDto.idContacto && updateMantenimientoDto.idContacto !== mantenimiento.idContacto.idContacto) {
                const nuevoContacto = await this.contactoRepository.findOne({
                    where: { idContacto: updateMantenimientoDto.idContacto, estaActivo: true },
                    relations: { idTipoContacto: true }
                });
                if (!nuevoContacto) {
                    throw new NotFoundException('Nuevo contacto no encontrado o no está activo');
                }
                mantenimiento.idContacto = nuevoContacto;
            }

            // Validar fechas si se están cambiando
            if (updateMantenimientoDto.fechaInicio || updateMantenimientoDto.fechaFin) {
                const fechaInicio = updateMantenimientoDto.fechaInicio ?
                    new Date(updateMantenimientoDto.fechaInicio) : mantenimiento.fechaInicio;
                const fechaFin = updateMantenimientoDto.fechaFin ?
                    new Date(updateMantenimientoDto.fechaFin) : mantenimiento.fechaFin;

                if (fechaInicio >= fechaFin) {
                    throw new BadRequestException('La fecha de inicio debe ser anterior a la fecha de finalización');
                }

                mantenimiento.fechaInicio = fechaInicio;
                mantenimiento.fechaFin = fechaFin;
            }

            // Actualizar otros campos
            Object.assign(mantenimiento, {
                descripcion: updateMantenimientoDto.descripcion ?? mantenimiento.descripcion,
                estado: updateMantenimientoDto.estado ?? mantenimiento.estado,
            });

            await queryRunner.manager.save(mantenimiento);
            await queryRunner.commitTransaction();

            // Obtener el mantenimiento actualizado
            const mantenimientoActualizado = await this.findOne(id);

            return {
                success: true,
                message: 'Mantenimiento actualizado exitosamente',
                data: mantenimientoActualizado.data,
            };

        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async remove(id: string): Promise<BaseResponseDto<void>> {
        try {
            const mantenimiento = await this.mantenimientoRepository.findOne({
                where: { idMantenimiento: id }
            });

            if (!mantenimiento) {
                throw new NotFoundException('Mantenimiento no encontrado');
            }

            if (mantenimiento.estado === 'En Progreso') {
                throw new BadRequestException('No se puede eliminar un mantenimiento que está en progreso');
            }

            await this.mantenimientoRepository.remove(mantenimiento);

            return {
                success: true,
                message: 'Mantenimiento eliminado exitosamente',
                data: undefined,
            };
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }
            throw new BadRequestException('Error al eliminar el mantenimiento');
        }
    }

    async findByEstado(estado: string): Promise<BaseResponseDto<MantenimientoResponseDto[]>> {
        try {
            const mantenimientos = await this.mantenimientoRepository.find({
                where: { estado },
                relations: {
                    idAreaComun: true,
                    idContacto: {
                        idTipoContacto: true,
                    },
                },
                order: { fechaInicio: 'ASC' },
            });

            const mantenimientosFormateados = mantenimientos.map(m => this.formatMantenimientoForResponse(m));

            return {
                success: true,
                message: `Mantenimientos con estado '${estado}' obtenidos exitosamente`,
                data: mantenimientosFormateados,
            };
        } catch (error) {
            throw new BadRequestException('Error al obtener los mantenimientos por estado');
        }
    }

    async findByAreaComun(areaComunId: string): Promise<BaseResponseDto<MantenimientoResponseDto[]>> {
        try {
            // Verificar que el área común existe
            const areaComun = await this.areaComunRepository.findOne({
                where: { idAreaComun: areaComunId }
            });
            if (!areaComun) {
                throw new NotFoundException('Área común no encontrada');
            }

            const mantenimientos = await this.mantenimientoRepository.find({
                where: { idAreaComun: { idAreaComun: areaComunId } },
                relations: {
                    idAreaComun: true,
                    idContacto: {
                        idTipoContacto: true,
                    },
                },
                order: { fechaInicio: 'DESC' },
            });

            const mantenimientosFormateados = mantenimientos.map(m => this.formatMantenimientoForResponse(m));

            return {
                success: true,
                message: `Mantenimientos del área '${areaComun.nombre}' obtenidos exitosamente`,
                data: mantenimientosFormateados,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException('Error al obtener los mantenimientos por área común');
        }
    }

    async findByContacto(contactoId: string): Promise<BaseResponseDto<MantenimientoResponseDto[]>> {
        try {
            // Verificar que el contacto existe
            const contacto = await this.contactoRepository.findOne({
                where: { idContacto: contactoId }
            });
            if (!contacto) {
                throw new NotFoundException('Contacto no encontrado');
            }

            const mantenimientos = await this.mantenimientoRepository.find({
                where: { idContacto: { idContacto: contactoId } },
                relations: {
                    idAreaComun: true,
                    idContacto: {
                        idTipoContacto: true,
                    },
                },
                order: { fechaInicio: 'DESC' },
            });

            const mantenimientosFormateados = mantenimientos.map(m => this.formatMantenimientoForResponse(m));

            return {
                success: true,
                message: `Mantenimientos asignados a '${contacto.nombre}' obtenidos exitosamente`,
                data: mantenimientosFormateados,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException('Error al obtener los mantenimientos por contacto');
        }
    }

    async findByFechaRange(fechaInicio: string, fechaFin: string): Promise<BaseResponseDto<MantenimientoResponseDto[]>> {
        try {
            const inicio = new Date(fechaInicio);
            const fin = new Date(fechaFin);

            if (inicio >= fin) {
                throw new BadRequestException('La fecha de inicio debe ser anterior a la fecha de fin');
            }

            const mantenimientos = await this.mantenimientoRepository.find({
                where: {
                    fechaInicio: Between(inicio, fin),
                },
                relations: {
                    idAreaComun: true,
                    idContacto: {
                        idTipoContacto: true,
                    },
                },
                order: { fechaInicio: 'ASC' },
            });

            const mantenimientosFormateados = mantenimientos.map(m => this.formatMantenimientoForResponse(m));

            return {
                success: true,
                message: 'Mantenimientos en el rango de fechas obtenidos exitosamente',
                data: mantenimientosFormateados,
            };
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new BadRequestException('Error al obtener los mantenimientos por rango de fechas');
        }
    }

    async findMantenimientosActivos(): Promise<BaseResponseDto<MantenimientoResponseDto[]>> {
        const ahora = new Date();

        try {
            const mantenimientos = await this.mantenimientoRepository.find({
                where: { estado: 'En Progreso' },
                relations: {
                    idAreaComun: true,
                    idContacto: {
                        idTipoContacto: true,
                    },
                },
                order: { fechaInicio: 'ASC' },
            });

            const mantenimientosFormateados = mantenimientos.map(m => this.formatMantenimientoForResponse(m));

            return {
                success: true,
                message: 'Mantenimientos activos obtenidos exitosamente',
                data: mantenimientosFormateados,
            };
        } catch (error) {
            throw new BadRequestException('Error al obtener los mantenimientos activos');
        }
    }

    async findMantenimientosProgramados(): Promise<BaseResponseDto<MantenimientoResponseDto[]>> {
        try {
            const mantenimientos = await this.mantenimientoRepository.find({
                where: { estado: 'Programado' },
                relations: {
                    idAreaComun: true,
                    idContacto: {
                        idTipoContacto: true,
                    },
                },
                order: { fechaInicio: 'ASC' },
            });

            const mantenimientosFormateados = mantenimientos.map(m => this.formatMantenimientoForResponse(m));

            return {
                success: true,
                message: 'Mantenimientos programados obtenidos exitosamente',
                data: mantenimientosFormateados,
            };
        } catch (error) {
            throw new BadRequestException('Error al obtener los mantenimientos programados');
        }
    }

    async cambiarEstado(id: string, nuevoEstado: string): Promise<BaseResponseDto<MantenimientoResponseDto>> {
        try {
            const mantenimiento = await this.mantenimientoRepository.findOne({
                where: { idMantenimiento: id }
            });

            if (!mantenimiento) {
                throw new NotFoundException('Mantenimiento no encontrado');
            }

            const estadosValidos = ['Programado', 'En Progreso', 'Completado', 'Cancelado', 'Pendiente'];
            if (!estadosValidos.includes(nuevoEstado)) {
                throw new BadRequestException('Estado no válido');
            }

            mantenimiento.estado = nuevoEstado;
            await this.mantenimientoRepository.save(mantenimiento);

            const mantenimientoActualizado = await this.findOne(id);

            return {
                success: true,
                message: `Estado del mantenimiento cambiado a '${nuevoEstado}' exitosamente`,
                data: mantenimientoActualizado.data,
            };
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }
            throw new BadRequestException('Error al cambiar el estado del mantenimiento');
        }
    }

    private formatMantenimientoForResponse(mantenimiento: Mantenimiento): MantenimientoResponseDto {
        const duracionMs = new Date(mantenimiento.fechaFin).getTime() - new Date(mantenimiento.fechaInicio).getTime();
        const duracionHoras = Math.round(duracionMs / (1000 * 60 * 60));

        const ahora = new Date();
        const enCurso = mantenimiento.estado === 'En Progreso' &&
            new Date(mantenimiento.fechaInicio) <= ahora &&
            new Date(mantenimiento.fechaFin) >= ahora;

        return {
            idMantenimiento: mantenimiento.idMantenimiento,
            descripcion: mantenimiento.descripcion,
            fechaInicio: mantenimiento.fechaInicio,
            fechaFin: mantenimiento.fechaFin,
            estado: mantenimiento.estado,
            areaComun: {
                idAreaComun: mantenimiento.idAreaComun.idAreaComun,
                nombre: mantenimiento.idAreaComun.nombre,
                descripcion: mantenimiento.idAreaComun.descripcion,
                capacidadMaxima: mantenimiento.idAreaComun.capacidadMaxima,
                estaActivo: mantenimiento.idAreaComun.estaActivo,
            },
            contacto: {
                idContacto: mantenimiento.idContacto.idContacto,
                nombre: mantenimiento.idContacto.nombre,
                descripcion: mantenimiento.idContacto.descripcion,
                correo: mantenimiento.idContacto.correo,
                telefono: mantenimiento.idContacto.telefono,
                tipoContacto: {
                    idTipoContacto: mantenimiento.idContacto.idTipoContacto.idTipoContacto,
                    tipoContacto: mantenimiento.idContacto.idTipoContacto.nombre,
                    descripcion: mantenimiento.idContacto.idTipoContacto.descripcion || '',
                },
            },
            duracionHoras,
            enCurso,
        };
    }
}

import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { AsignacionAreaEdificio } from '../../entities/AsignacionAreaEdificio';
import { Edificio } from '../../entities/Edificio';
import { AreaComun } from '../../entities/AreaComun';
import { BaseResponseDto } from '../../dtos/baseResponse/baseResponse.dto';
import {
    CreateAsignacionAreaEdificioDto,
    UpdateAsignacionAreaEdificioDto,
    AsignacionAreaEdificioResponseDto,
    CreateMultipleAsignacionAreaEdificioDto
} from '../../dtos/asignacion-area-edificio';
import { IAsignacionAreaEdificioService } from '../interfaces/asignacion-area-edificio.service.interface';
import { AreaComunService, EdificioService } from '../implementations';

@Injectable()
export class AsignacionAreaEdificioService implements IAsignacionAreaEdificioService {
    constructor(
        @InjectRepository(AsignacionAreaEdificio)
        private readonly asignacionRepository: Repository<AsignacionAreaEdificio>,
        private readonly edificioRepository: EdificioService,
        private readonly areaComunRepository: AreaComunService,
    ) { }

    async create(
        createAsignacionDto: CreateAsignacionAreaEdificioDto,
    ): Promise<BaseResponseDto<AsignacionAreaEdificioResponseDto>> {
        try {
            if (!createAsignacionDto || !createAsignacionDto.idEdificio || !createAsignacionDto.idAreaComun) {
                return BaseResponseDto.error(
                    'Ingrese datos válidos, Intente de Nuevo.',
                    HttpStatus.BAD_REQUEST,
                );
            }

            // Verificar que el edificio existe usando el servicio
            const edificioResponse = await this.edificioRepository.findOne(createAsignacionDto.idEdificio);
            if (!edificioResponse.success || !edificioResponse.data) {
                return BaseResponseDto.error('Edificio no encontrado', HttpStatus.NOT_FOUND);
            }
            const edificio = edificioResponse.data;

            // Verificar que el área común existe usando el servicio
            let areaComun;
            try {
                areaComun = await this.areaComunRepository.findOne(createAsignacionDto.idAreaComun);
            } catch (error) {
                return BaseResponseDto.error('Área común no encontrada', HttpStatus.NOT_FOUND);
            }

            // Verificar si ya existe la asignación
            const asignacionExistente = await this.asignacionRepository.findOne({
                where: {
                    idEdificioUuid: createAsignacionDto.idEdificio,
                    idAreaComunUuid: createAsignacionDto.idAreaComun,
                },
            });

            if (asignacionExistente) {
                return BaseResponseDto.error(
                    'Ya existe una asignación para este edificio y área común',
                    HttpStatus.CONFLICT,
                );
            }

            const nuevaAsignacion = this.asignacionRepository.create({
                idEdificioUuid: createAsignacionDto.idEdificio,
                idAreaComunUuid: createAsignacionDto.idAreaComun,
                observaciones: createAsignacionDto.observaciones || null,
                estaActivo: createAsignacionDto.estaActivo ?? true,
                fechaAsignacion: new Date(),
            });

            const asignacionGuardada = await this.asignacionRepository.save(nuevaAsignacion);

            const response: AsignacionAreaEdificioResponseDto = {
                idAsignacion: asignacionGuardada.idAsignacion,
                idEdificioUuid: asignacionGuardada.idEdificioUuid,
                idAreaComunUuid: asignacionGuardada.idAreaComunUuid,
                fechaAsignacion: asignacionGuardada.fechaAsignacion,
                estaActivo: asignacionGuardada.estaActivo,
                observaciones: asignacionGuardada.observaciones,
                idEdificio: {
                    idEdificio: edificio.idEdificio,
                    nombreEdificio: edificio.nombreEdificio,
                    direccion: edificio.direccion,
                },
                idAreaComun: {
                    idAreaComun: areaComun.idAreaComun,
                    nombre: areaComun.nombre,
                    descripcion: areaComun.descripcion,
                },
            };

            return BaseResponseDto.success(
                response,
                'Asignación creada exitosamente.',
                HttpStatus.CREATED,
            );
        } catch (error) {
            return BaseResponseDto.error(
                'Error al crear la asignación: ' + error.message,
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    async createMultiple(
        createMultipleDto: CreateMultipleAsignacionAreaEdificioDto,
    ): Promise<BaseResponseDto<AsignacionAreaEdificioResponseDto[]>> {
        try {
            if (!createMultipleDto || !createMultipleDto.idEdificio || !createMultipleDto.asignaciones || createMultipleDto.asignaciones.length === 0) {
                return BaseResponseDto.error(
                    'Ingrese datos válidos con al menos una asignación.',
                    HttpStatus.BAD_REQUEST,
                );
            }

            // Verificar que el edificio existe
            const edificioResponse = await this.edificioRepository.findOne(createMultipleDto.idEdificio);
            if (!edificioResponse.success || !edificioResponse.data) {
                return BaseResponseDto.error('Edificio no encontrado', HttpStatus.NOT_FOUND);
            }
            const edificio = edificioResponse.data;

            // Verificar que todas las áreas comunes existen
            const areasComunes = new Map<string, any>();
            const areasNoEncontradas: string[] = [];

            for (const asignacion of createMultipleDto.asignaciones) {
                try {
                    const areaComun = await this.areaComunRepository.findOne(asignacion.idAreaComun);
                    areasComunes.set(asignacion.idAreaComun, areaComun);
                } catch (error) {
                    areasNoEncontradas.push(asignacion.idAreaComun);
                }
            }

            if (areasNoEncontradas.length > 0) {
                return BaseResponseDto.error(
                    `Áreas comunes no encontradas: ${areasNoEncontradas.join(', ')}`,
                    HttpStatus.NOT_FOUND,
                );
            }

            // Verificar duplicados existentes
            const idsAreasComunes = createMultipleDto.asignaciones.map(a => a.idAreaComun);
            const asignacionesExistentes = await this.asignacionRepository.find({
                where: {
                    idEdificioUuid: createMultipleDto.idEdificio,
                    idAreaComunUuid: In(idsAreasComunes),
                },
            });

            if (asignacionesExistentes.length > 0) {
                const duplicados = asignacionesExistentes.map(a => a.idAreaComunUuid);
                return BaseResponseDto.error(
                    `Ya existen asignaciones para las áreas comunes: ${duplicados.join(', ')}`,
                    HttpStatus.CONFLICT,
                );
            }

            // Crear todas las asignaciones
            const nuevasAsignaciones = createMultipleDto.asignaciones.map(asignacion => {
                return this.asignacionRepository.create({
                    idEdificioUuid: createMultipleDto.idEdificio,
                    idAreaComunUuid: asignacion.idAreaComun,
                    observaciones: asignacion.observaciones || null,
                    estaActivo: true,
                    fechaAsignacion: new Date(),
                });
            });

            // Guardar todas las asignaciones en una transacción
            const asignacionesGuardadas = await this.asignacionRepository.save(nuevasAsignaciones);

            // Construir la respuesta con datos completos
            const response: AsignacionAreaEdificioResponseDto[] = asignacionesGuardadas.map(asignacion => {
                const areaComun = areasComunes.get(asignacion.idAreaComunUuid);
                return {
                    idAsignacion: asignacion.idAsignacion,
                    idEdificioUuid: asignacion.idEdificioUuid,
                    idAreaComunUuid: asignacion.idAreaComunUuid,
                    fechaAsignacion: asignacion.fechaAsignacion,
                    estaActivo: asignacion.estaActivo,
                    observaciones: asignacion.observaciones,
                    idEdificio: {
                        idEdificio: edificio.idEdificio,
                        nombreEdificio: edificio.nombreEdificio,
                        direccion: edificio.direccion,
                    },
                    idAreaComun: {
                        idAreaComun: areaComun.idAreaComun,
                        nombre: areaComun.nombre,
                        descripcion: areaComun.descripcion,
                    },
                };
            });

            return BaseResponseDto.success(
                response,
                `${response.length} asignaciones creadas exitosamente.`,
                HttpStatus.CREATED,
            );
        } catch (error) {
            return BaseResponseDto.error(
                'Error al crear las asignaciones: ' + error.message,
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    async findAll(): Promise<BaseResponseDto<AsignacionAreaEdificioResponseDto[]>> {
        try {
            const asignaciones = await this.asignacionRepository.find({
                relations: ['idEdificio', 'idAreaComun'],
                order: { fechaAsignacion: 'DESC' },
            });

            const response: AsignacionAreaEdificioResponseDto[] = asignaciones.map(asignacion => ({
                idAsignacion: asignacion.idAsignacion,
                idEdificioUuid: asignacion.idEdificioUuid,
                idAreaComunUuid: asignacion.idAreaComunUuid,
                fechaAsignacion: asignacion.fechaAsignacion,
                estaActivo: asignacion.estaActivo,
                observaciones: asignacion.observaciones,
                idEdificio: {
                    idEdificio: asignacion.idEdificio.idEdificio,
                    nombreEdificio: asignacion.idEdificio.nombreEdificio,
                    direccion: asignacion.idEdificio.direccion,
                },
                idAreaComun: {
                    idAreaComun: asignacion.idAreaComun.idAreaComun,
                    nombre: asignacion.idAreaComun.nombre,
                    descripcion: asignacion.idAreaComun.descripcion,
                },
            }));

            const message = response.length === 0
                ? 'No se encontraron asignaciones registradas.'
                : 'Asignaciones obtenidas exitosamente.';

            return BaseResponseDto.success(response, message, HttpStatus.OK);
        } catch (error) {
            return BaseResponseDto.error(
                'Error al obtener asignaciones: ' + error.message,
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    async findOne(id: string): Promise<BaseResponseDto<AsignacionAreaEdificioResponseDto>> {
        try {
            if (!id) {
                return BaseResponseDto.error(
                    'Ingrese un ID válido, Intente de Nuevo.',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const asignacion = await this.asignacionRepository.findOne({
                where: { idAsignacion: id },
                relations: ['idEdificio', 'idAreaComun'],
            });

            if (!asignacion) {
                return BaseResponseDto.error('Asignación no encontrada.', HttpStatus.NOT_FOUND);
            }

            const response: AsignacionAreaEdificioResponseDto = {
                idAsignacion: asignacion.idAsignacion,
                idEdificioUuid: asignacion.idEdificioUuid,
                idAreaComunUuid: asignacion.idAreaComunUuid,
                fechaAsignacion: asignacion.fechaAsignacion,
                estaActivo: asignacion.estaActivo,
                observaciones: asignacion.observaciones,
                idEdificio: {
                    idEdificio: asignacion.idEdificio.idEdificio,
                    nombreEdificio: asignacion.idEdificio.nombreEdificio,
                    direccion: asignacion.idEdificio.direccion,
                },
                idAreaComun: {
                    idAreaComun: asignacion.idAreaComun.idAreaComun,
                    nombre: asignacion.idAreaComun.nombre,
                    descripcion: asignacion.idAreaComun.descripcion,
                },
            };

            return BaseResponseDto.success(
                response,
                'Asignación obtenida exitosamente.',
                HttpStatus.OK,
            );
        } catch (error) {
            return BaseResponseDto.error(
                'Error al obtener la asignación: ' + error.message,
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    async findByEdificio(idEdificio: string): Promise<BaseResponseDto<AsignacionAreaEdificioResponseDto[]>> {
        try {
            if (!idEdificio) {
                return BaseResponseDto.error(
                    'Ingrese un ID de edificio válido.',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const asignaciones = await this.asignacionRepository.find({
                where: { idEdificioUuid: idEdificio },
                relations: ['idEdificio', 'idAreaComun'],
                order: { fechaAsignacion: 'DESC' },
            });

            const response: AsignacionAreaEdificioResponseDto[] = asignaciones.map(asignacion => ({
                idAsignacion: asignacion.idAsignacion,
                idEdificioUuid: asignacion.idEdificioUuid,
                idAreaComunUuid: asignacion.idAreaComunUuid,
                fechaAsignacion: asignacion.fechaAsignacion,
                estaActivo: asignacion.estaActivo,
                observaciones: asignacion.observaciones,
                idEdificio: {
                    idEdificio: asignacion.idEdificio.idEdificio,
                    nombreEdificio: asignacion.idEdificio.nombreEdificio,
                    direccion: asignacion.idEdificio.direccion,
                },
                idAreaComun: {
                    idAreaComun: asignacion.idAreaComun.idAreaComun,
                    nombre: asignacion.idAreaComun.nombre,
                    descripcion: asignacion.idAreaComun.descripcion,
                },
            }));

            const message = response.length === 0
                ? 'No se encontraron asignaciones para este edificio.'
                : 'Asignaciones del edificio obtenidas exitosamente.';

            return BaseResponseDto.success(response, message, HttpStatus.OK);
        } catch (error) {
            return BaseResponseDto.error(
                'Error al obtener asignaciones por edificio: ' + error.message,
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    async findByAreaComun(idAreaComun: string): Promise<BaseResponseDto<AsignacionAreaEdificioResponseDto[]>> {
        try {
            if (!idAreaComun) {
                return BaseResponseDto.error(
                    'Ingrese un ID de área común válido.',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const asignaciones = await this.asignacionRepository.find({
                where: { idAreaComunUuid: idAreaComun },
                relations: ['idEdificio', 'idAreaComun'],
                order: { fechaAsignacion: 'DESC' },
            });

            const response: AsignacionAreaEdificioResponseDto[] = asignaciones.map(asignacion => ({
                idAsignacion: asignacion.idAsignacion,
                idEdificioUuid: asignacion.idEdificioUuid,
                idAreaComunUuid: asignacion.idAreaComunUuid,
                fechaAsignacion: asignacion.fechaAsignacion,
                estaActivo: asignacion.estaActivo,
                observaciones: asignacion.observaciones,
                idEdificio: {
                    idEdificio: asignacion.idEdificio.idEdificio,
                    nombreEdificio: asignacion.idEdificio.nombreEdificio,
                    direccion: asignacion.idEdificio.direccion,
                },
                idAreaComun: {
                    idAreaComun: asignacion.idAreaComun.idAreaComun,
                    nombre: asignacion.idAreaComun.nombre,
                    descripcion: asignacion.idAreaComun.descripcion,
                },
            }));

            const message = response.length === 0
                ? 'No se encontraron asignaciones para esta área común.'
                : 'Asignaciones del área común obtenidas exitosamente.';

            return BaseResponseDto.success(response, message, HttpStatus.OK);
        } catch (error) {
            return BaseResponseDto.error(
                'Error al obtener asignaciones por área común: ' + error.message,
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    async update(
        id: string,
        updateAsignacionDto: UpdateAsignacionAreaEdificioDto,
    ): Promise<BaseResponseDto<AsignacionAreaEdificioResponseDto>> {
        try {
            if (!id || !updateAsignacionDto) {
                return BaseResponseDto.error(
                    'Ingrese datos válidos, Intente de Nuevo.',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const asignacion = await this.asignacionRepository.findOne({
                where: { idAsignacion: id },
                relations: ['idEdificio', 'idAreaComun'],
            });

            if (!asignacion) {
                return BaseResponseDto.error('Asignación no encontrada.', HttpStatus.NOT_FOUND);
            }

            // Actualizar campos permitidos
            if (updateAsignacionDto.observaciones !== undefined) {
                asignacion.observaciones = updateAsignacionDto.observaciones;
            }
            if (updateAsignacionDto.estaActivo !== undefined) {
                asignacion.estaActivo = updateAsignacionDto.estaActivo;
            }

            const asignacionActualizada = await this.asignacionRepository.save(asignacion);

            const response: AsignacionAreaEdificioResponseDto = {
                idAsignacion: asignacionActualizada.idAsignacion,
                idEdificioUuid: asignacionActualizada.idEdificioUuid,
                idAreaComunUuid: asignacionActualizada.idAreaComunUuid,
                fechaAsignacion: asignacionActualizada.fechaAsignacion,
                estaActivo: asignacionActualizada.estaActivo,
                observaciones: asignacionActualizada.observaciones,
                idEdificio: {
                    idEdificio: asignacion.idEdificio.idEdificio,
                    nombreEdificio: asignacion.idEdificio.nombreEdificio,
                    direccion: asignacion.idEdificio.direccion,
                },
                idAreaComun: {
                    idAreaComun: asignacion.idAreaComun.idAreaComun,
                    nombre: asignacion.idAreaComun.nombre,
                    descripcion: asignacion.idAreaComun.descripcion,
                },
            };

            return BaseResponseDto.success(
                response,
                'Asignación actualizada exitosamente.',
                HttpStatus.OK,
            );
        } catch (error) {
            return BaseResponseDto.error(
                'Error al actualizar la asignación: ' + error.message,
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    async remove(id: string): Promise<BaseResponseDto<string>> {
        try {
            if (!id) {
                return BaseResponseDto.error(
                    'Ingrese un ID válido, Intente de Nuevo.',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const asignacion = await this.asignacionRepository.findOne({
                where: { idAsignacion: id },
            });

            if (!asignacion) {
                return BaseResponseDto.error('Asignación no encontrada.', HttpStatus.NOT_FOUND);
            }

            await this.asignacionRepository.remove(asignacion);

            return BaseResponseDto.success(
                'Asignación eliminada exitosamente',
                'Asignación eliminada exitosamente.',
                HttpStatus.OK,
            );
        } catch (error) {
            return BaseResponseDto.error(
                'Error al eliminar la asignación: ' + error.message,
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    async toggleStatus(id: string): Promise<BaseResponseDto<AsignacionAreaEdificioResponseDto>> {
        try {
            if (!id) {
                return BaseResponseDto.error(
                    'Ingrese un ID válido, Intente de Nuevo.',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const asignacion = await this.asignacionRepository.findOne({
                where: { idAsignacion: id },
                relations: ['idEdificio', 'idAreaComun'],
            });

            if (!asignacion) {
                return BaseResponseDto.error('Asignación no encontrada.', HttpStatus.NOT_FOUND);
            }

            asignacion.estaActivo = !asignacion.estaActivo;
            const asignacionActualizada = await this.asignacionRepository.save(asignacion);

            const response: AsignacionAreaEdificioResponseDto = {
                idAsignacion: asignacionActualizada.idAsignacion,
                idEdificioUuid: asignacionActualizada.idEdificioUuid,
                idAreaComunUuid: asignacionActualizada.idAreaComunUuid,
                fechaAsignacion: asignacionActualizada.fechaAsignacion,
                estaActivo: asignacionActualizada.estaActivo,
                observaciones: asignacionActualizada.observaciones,
                idEdificio: {
                    idEdificio: asignacion.idEdificio.idEdificio,
                    nombreEdificio: asignacion.idEdificio.nombreEdificio,
                    direccion: asignacion.idEdificio.direccion,
                },
                idAreaComun: {
                    idAreaComun: asignacion.idAreaComun.idAreaComun,
                    nombre: asignacion.idAreaComun.nombre,
                    descripcion: asignacion.idAreaComun.descripcion,
                },
            };

            const statusText = asignacion.estaActivo ? 'activada' : 'desactivada';
            return BaseResponseDto.success(
                response,
                `Asignación ${statusText} exitosamente.`,
                HttpStatus.OK,
            );
        } catch (error) {
            return BaseResponseDto.error(
                'Error al cambiar el estado de la asignación: ' + error.message,
                HttpStatus.BAD_REQUEST,
            );
        }
    }
}
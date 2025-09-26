import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateEdificioDto, UpdateEdificioDto } from 'src/dtos';
import { BaseResponseDto } from 'src/dtos/baseResponse/baseResponse.dto';
import { Edificio } from 'src/entities/Edificio';
import { IEdificioService } from 'src/services/interfaces';
import { Repository } from 'typeorm';

@Injectable()
export class EdificioService implements IEdificioService {
    constructor(
        @InjectRepository(Edificio)
        private readonly edificioRepository: Repository<Edificio>,
    ) { }

    async create(
        createEdificioDto: CreateEdificioDto,
    ): Promise<BaseResponseDto<Edificio>> {
        if (!createEdificioDto) {
            return {
                success: false,
                message: 'Datos no válidos',
                data: null,
                error: {
                    message: 'Ingrese datos válidos, Intente de Nuevo.',
                    statusCode: 400,
                },
            };
        }

        try {
            // Crear la entidad edificio con relaciones
            const edificioData = {
                ...createEdificioDto,
                fechaRegistro: new Date(),
                estaActivo: createEdificioDto.estaActivo ?? true,
                numeroSotanos: createEdificioDto.numeroSotanos ?? 0,
                cantAlmacenes: createEdificioDto.cantAlmacenes ?? 0,
                numeroCocheras: createEdificioDto.numeroCocheras ?? 0,
                numeroAreasComunes: createEdificioDto.numeroAreasComunes ?? 0,
                // Configurar relaciones
                idAdministradorEdificio: { idTrabajador: createEdificioDto.idAdministradorEdificio } as any,
                idInmobiliaria: { idInmobiliaria: createEdificioDto.idInmobiliaria } as any,
                ...(createEdificioDto.idAreasComunes && {
                    idAreasComunes: { idAreaComun: createEdificioDto.idAreasComunes } as any,
                }),
            };

            const edificio = this.edificioRepository.create(edificioData);
            const edificioGuardado = await this.edificioRepository.save(edificio);

            return {
                success: true,
                message: 'Edificio creado exitosamente.',
                data: edificioGuardado,
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al crear el edificio',
                data: null,
                error: {
                    message: 'Error al crear el edificio: ' + error.message,
                    statusCode: 400,
                },
            };
        }
    }

    async findAll(): Promise<BaseResponseDto<Edificio[]>> {
        try {
            const edificios = await this.edificioRepository.find({
                relations: ['idAdministradorEdificio', 'idInmobiliaria', 'idAreasComunes'],
            });

            return {
                success: true,
                message:
                    edificios.length > 0
                        ? 'Edificios obtenidos exitosamente.'
                        : 'No se encontraron edificios.',
                data: edificios,
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al obtener edificios',
                data: [],
                error: {
                    message: 'Error al obtener edificios: ' + error.message,
                    statusCode: 400,
                },
            };
        }
    }

    async findOne(id: string): Promise<BaseResponseDto<Edificio>> {
        if (!id) {
            return {
                success: false,
                message: 'ID no válido',
                data: null,
                error: {
                    message: 'Ingrese un ID válido, Intente de Nuevo.',
                    statusCode: 400,
                },
            };
        }

        try {
            const edificio = await this.edificioRepository.findOne({
                where: { idEdificio: id },
                relations: ['idAdministradorEdificio', 'idInmobiliaria', 'idAreasComunes', 'propiedads'],
            });

            if (!edificio) {
                return {
                    success: false,
                    message: 'Edificio no encontrado',
                    data: null,
                    error: {
                        message: 'Edificio no encontrado.',
                        statusCode: 404,
                    },
                };
            }

            return {
                success: true,
                message: 'Edificio obtenido exitosamente.',
                data: edificio,
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al obtener el edificio',
                data: null,
                error: {
                    message: 'Error al obtener el edificio: ' + error.message,
                    statusCode: 400,
                },
            };
        }
    }

    async update(
        id: string,
        updateEdificioDto: UpdateEdificioDto,
    ): Promise<BaseResponseDto<Edificio>> {
        if (!id || !updateEdificioDto) {
            return {
                success: false,
                message: 'Datos no válidos',
                data: null,
                error: {
                    message: 'Ingrese datos válidos, Intente de Nuevo.',
                    statusCode: 400,
                },
            };
        }

        try {
            const edificio = await this.edificioRepository.findOne({
                where: { idEdificio: id },
            });

            if (!edificio) {
                return {
                    success: false,
                    message: 'Edificio no encontrado',
                    data: null,
                    error: {
                        message: 'Edificio no encontrado.',
                        statusCode: 404,
                    },
                };
            }

            // Preparar datos de actualización
            const updateData: any = {
                ...updateEdificioDto,
                fechaActualizacion: new Date(),
            };

            // Configurar relaciones si están presentes
            if (updateEdificioDto.idAdministradorEdificio) {
                updateData.idAdministradorEdificio = { idTrabajador: updateEdificioDto.idAdministradorEdificio };
            }
            if (updateEdificioDto.idInmobiliaria) {
                updateData.idInmobiliaria = { idInmobiliaria: updateEdificioDto.idInmobiliaria };
            }
            if (updateEdificioDto.idAreasComunes) {
                updateData.idAreasComunes = { idAreaComun: updateEdificioDto.idAreasComunes };
            }

            this.edificioRepository.merge(edificio, updateData);
            const edificioActualizado = await this.edificioRepository.save(edificio);

            return {
                success: true,
                message: 'Edificio actualizado exitosamente.',
                data: edificioActualizado,
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al actualizar el edificio',
                data: null,
                error: {
                    message: 'Error al actualizar el edificio: ' + error.message,
                    statusCode: 400,
                },
            };
        }
    }

    async remove(id: string): Promise<BaseResponseDto<void>> {
        if (!id) {
            return {
                success: false,
                message: 'ID no válido',
                data: undefined,
                error: {
                    message: 'Ingrese un ID válido, Intente de Nuevo.',
                    statusCode: 400,
                },
            };
        }

        try {
            const edificio = await this.edificioRepository.findOne({
                where: { idEdificio: id },
            });

            if (!edificio) {
                return {
                    success: false,
                    message: 'Edificio no encontrado',
                    data: undefined,
                    error: {
                        message: 'Edificio no encontrado.',
                        statusCode: 404,
                    },
                };
            }

            // Eliminación lógica: cambiar estaActivo a false
            edificio.estaActivo = false;
            edificio.fechaActualizacion = new Date();
            await this.edificioRepository.save(edificio);

            return {
                success: true,
                message: 'Edificio eliminado exitosamente.',
                data: undefined,
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al eliminar el edificio',
                data: undefined,
                error: {
                    message: 'Error al eliminar el edificio: ' + error.message,
                    statusCode: 400,
                },
            };
        }
    }

    async findByNombre(nombre: string): Promise<BaseResponseDto<Edificio>> {
        if (!nombre) {
            return {
                success: false,
                message: 'Nombre no válido',
                data: null,
                error: {
                    message: 'Ingrese un nombre válido, Intente de Nuevo.',
                    statusCode: 400,
                },
            };
        }

        try {
            const edificio = await this.edificioRepository.findOne({
                where: { nombreEdificio: nombre },
                relations: ['idAdministradorEdificio', 'idInmobiliaria', 'idAreasComunes'],
            });

            if (!edificio) {
                return {
                    success: false,
                    message: 'Edificio no encontrado con ese nombre',
                    data: null,
                    error: {
                        message: 'Edificio no encontrado con ese nombre.',
                        statusCode: 404,
                    },
                };
            }

            return {
                success: true,
                message: 'Edificio encontrado exitosamente.',
                data: edificio,
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al buscar el edificio por nombre',
                data: null,
                error: {
                    message: 'Error al buscar el edificio por nombre: ' + error.message,
                    statusCode: 400,
                },
            };
        }
    }

    async findByDistrito(distrito: string): Promise<BaseResponseDto<Edificio[]>> {
        if (!distrito) {
            return {
                success: false,
                message: 'Distrito no válido',
                data: [],
                error: {
                    message: 'Ingrese un distrito válido, Intente de Nuevo.',
                    statusCode: 400,
                },
            };
        }

        try {
            const edificios = await this.edificioRepository.find({
                where: { distrito },
                relations: ['idAdministradorEdificio', 'idInmobiliaria'],
            });

            return {
                success: true,
                message:
                    edificios.length > 0
                        ? 'Edificios encontrados exitosamente.'
                        : 'No se encontraron edificios en ese distrito.',
                data: edificios,
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al buscar edificios por distrito',
                data: [],
                error: {
                    message: 'Error al buscar edificios por distrito: ' + error.message,
                    statusCode: 400,
                },
            };
        }
    }

    async findByInmobiliaria(idInmobiliaria: string): Promise<BaseResponseDto<Edificio[]>> {
        if (!idInmobiliaria) {
            return {
                success: false,
                message: 'ID de inmobiliaria no válido',
                data: [],
                error: {
                    message: 'Ingrese un ID de inmobiliaria válido, Intente de Nuevo.',
                    statusCode: 400,
                },
            };
        }

        try {
            const edificios = await this.edificioRepository.find({
                where: { idInmobiliaria: { idInmobiliaria } as any },
                relations: ['idAdministradorEdificio', 'idInmobiliaria'],
            });

            return {
                success: true,
                message:
                    edificios.length > 0
                        ? 'Edificios de la inmobiliaria obtenidos exitosamente.'
                        : 'No se encontraron edificios para esa inmobiliaria.',
                data: edificios,
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al buscar edificios por inmobiliaria',
                data: [],
                error: {
                    message: 'Error al buscar edificios por inmobiliaria: ' + error.message,
                    statusCode: 400,
                },
            };
        }
    }

    async findActivos(): Promise<BaseResponseDto<Edificio[]>> {
        try {
            const edificios = await this.edificioRepository.find({
                where: { estaActivo: true },
                relations: ['idAdministradorEdificio', 'idInmobiliaria'],
            });

            return {
                success: true,
                message:
                    edificios.length > 0
                        ? 'Edificios activos obtenidos exitosamente.'
                        : 'No se encontraron edificios activos.',
                data: edificios,
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al obtener edificios activos',
                data: [],
                error: {
                    message: 'Error al obtener edificios activos: ' + error.message,
                    statusCode: 400,
                },
            };
        }
    }
}
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateInmobiliariaDto, UpdateInmobiliariaDto } from 'src/dtos';
import { BaseResponseDto } from 'src/dtos/baseResponse/baseResponse.dto';
import { Inmobiliaria } from 'src/entities/Inmobiliaria';
import { IInmobiliariaService } from 'src/services/interfaces';
import { Repository } from 'typeorm';

@Injectable()
export class InmobiliariaService implements IInmobiliariaService {
    constructor(
        @InjectRepository(Inmobiliaria)
        private readonly inmobiliariaRepository: Repository<Inmobiliaria>,
    ) { }

    async create(
        createInmobiliariaDto: CreateInmobiliariaDto,
    ): Promise<BaseResponseDto<Inmobiliaria>> {
        if (!createInmobiliariaDto) {
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
            const inmobiliaria = this.inmobiliariaRepository.create(createInmobiliariaDto);
            const inmobiliariaGuardada = await this.inmobiliariaRepository.save(inmobiliaria);

            return {
                success: true,
                message: 'Inmobiliaria creada exitosamente.',
                data: inmobiliariaGuardada,
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al crear la inmobiliaria',
                data: null,
                error: {
                    message: 'Error al crear la inmobiliaria: ' + error.message,
                    statusCode: 400,
                },
            };
        }
    }

    async findAll(): Promise<BaseResponseDto<Inmobiliaria[]>> {
        try {
            const inmobiliarias = await this.inmobiliariaRepository.find({
                relations: ['edificios'],
            });

            return {
                success: true,
                message:
                    inmobiliarias.length > 0
                        ? 'Inmobiliarias obtenidas exitosamente.'
                        : 'No se encontraron inmobiliarias.',
                data: inmobiliarias,
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al obtener inmobiliarias',
                data: [],
                error: {
                    message: 'Error al obtener inmobiliarias: ' + error.message,
                    statusCode: 400,
                },
            };
        }
    }

    async findOne(id: string): Promise<BaseResponseDto<Inmobiliaria>> {
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
            const inmobiliaria = await this.inmobiliariaRepository.findOne({
                where: { idInmobiliaria: id },
                relations: ['edificios'],
            });

            if (!inmobiliaria) {
                return {
                    success: false,
                    message: 'Inmobiliaria no encontrada',
                    data: null,
                    error: {
                        message: 'Inmobiliaria no encontrada.',
                        statusCode: 404,
                    },
                };
            }

            return {
                success: true,
                message: 'Inmobiliaria obtenida exitosamente.',
                data: inmobiliaria,
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al obtener la inmobiliaria',
                data: null,
                error: {
                    message: 'Error al obtener la inmobiliaria: ' + error.message,
                    statusCode: 400,
                },
            };
        }
    }

    async update(
        id: string,
        updateInmobiliariaDto: UpdateInmobiliariaDto,
    ): Promise<BaseResponseDto<Inmobiliaria>> {
        if (!id || !updateInmobiliariaDto) {
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
            const inmobiliaria = await this.inmobiliariaRepository.findOne({
                where: { idInmobiliaria: id },
            });

            if (!inmobiliaria) {
                return {
                    success: false,
                    message: 'Inmobiliaria no encontrada',
                    data: null,
                    error: {
                        message: 'Inmobiliaria no encontrada.',
                        statusCode: 404,
                    },
                };
            }

            this.inmobiliariaRepository.merge(inmobiliaria, updateInmobiliariaDto);
            const inmobiliariaActualizada = await this.inmobiliariaRepository.save(inmobiliaria);

            return {
                success: true,
                message: 'Inmobiliaria actualizada exitosamente.',
                data: inmobiliariaActualizada,
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al actualizar la inmobiliaria',
                data: null,
                error: {
                    message: 'Error al actualizar la inmobiliaria: ' + error.message,
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
            const inmobiliaria = await this.inmobiliariaRepository.findOne({
                where: { idInmobiliaria: id },
                relations: ['edificios'],
            });

            if (!inmobiliaria) {
                return {
                    success: false,
                    message: 'Inmobiliaria no encontrada',
                    data: undefined,
                    error: {
                        message: 'Inmobiliaria no encontrada.',
                        statusCode: 404,
                    },
                };
            }

            // Verificar si tiene edificios asociados antes de eliminar
            if (inmobiliaria.edificios && inmobiliaria.edificios.length > 0) {
                return {
                    success: false,
                    message: 'No se puede eliminar la inmobiliaria',
                    data: undefined,
                    error: {
                        message: 'La inmobiliaria tiene edificios asociados y no puede ser eliminada.',
                        statusCode: 400,
                    },
                };
            }

            await this.inmobiliariaRepository.remove(inmobiliaria);

            return {
                success: true,
                message: 'Inmobiliaria eliminada exitosamente.',
                data: undefined,
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al eliminar la inmobiliaria',
                data: undefined,
                error: {
                    message: 'Error al eliminar la inmobiliaria: ' + error.message,
                    statusCode: 400,
                },
            };
        }
    }

    async findByNombre(nombre: string): Promise<BaseResponseDto<Inmobiliaria>> {
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
            const inmobiliaria = await this.inmobiliariaRepository.findOne({
                where: { nomInmobiliaria: nombre },
                relations: ['edificios'],
            });

            if (!inmobiliaria) {
                return {
                    success: false,
                    message: 'Inmobiliaria no encontrada con ese nombre',
                    data: null,
                    error: {
                        message: 'Inmobiliaria no encontrada con ese nombre.',
                        statusCode: 404,
                    },
                };
            }

            return {
                success: true,
                message: 'Inmobiliaria encontrada exitosamente.',
                data: inmobiliaria,
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al buscar la inmobiliaria por nombre',
                data: null,
                error: {
                    message: 'Error al buscar la inmobiliaria por nombre: ' + error.message,
                    statusCode: 400,
                },
            };
        }
    }

    async findByCorreo(correo: string): Promise<BaseResponseDto<Inmobiliaria>> {
        if (!correo) {
            return {
                success: false,
                message: 'Correo no válido',
                data: null,
                error: {
                    message: 'Ingrese un correo válido, Intente de Nuevo.',
                    statusCode: 400,
                },
            };
        }

        try {
            const inmobiliaria = await this.inmobiliariaRepository.findOne({
                where: { correoContacto: correo },
                relations: ['edificios'],
            });

            if (!inmobiliaria) {
                return {
                    success: false,
                    message: 'Inmobiliaria no encontrada con ese correo',
                    data: null,
                    error: {
                        message: 'Inmobiliaria no encontrada con ese correo.',
                        statusCode: 404,
                    },
                };
            }

            return {
                success: true,
                message: 'Inmobiliaria encontrada exitosamente.',
                data: inmobiliaria,
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al buscar la inmobiliaria por correo',
                data: null,
                error: {
                    message: 'Error al buscar la inmobiliaria por correo: ' + error.message,
                    statusCode: 400,
                },
            };
        }
    }
}
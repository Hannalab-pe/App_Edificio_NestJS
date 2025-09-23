import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoContacto } from '../../../entities/TipoContacto';
import { CreateTipoContactoDto, UpdateTipoContactoDto } from '../../../dtos';
import { BaseResponseDto } from '../../../dtos/baseResponse/baseResponse.dto';
import { ITipoContactoService } from '../../interfaces/tipo-contacto.interface';

@Injectable()
export class TipoContactoService implements ITipoContactoService {
    constructor(
        @InjectRepository(TipoContacto)
        private readonly tipoContactoRepository: Repository<TipoContacto>,
    ) { }

    async create(createTipoContactoDto: CreateTipoContactoDto): Promise<BaseResponseDto<TipoContacto>> {
        try {
            // Verificar si ya existe un tipo de contacto con el mismo nombre
            const tipoContactoExistente = await this.tipoContactoRepository.findOne({
                where: { nombre: createTipoContactoDto.nombre }
            });

            if (tipoContactoExistente) {
                return {
                    success: false,
                    message: 'Ya existe un tipo de contacto con este nombre',
                    data: null,
                    error: { message: 'Nombre de tipo de contacto duplicado' }
                };
            }

            const nuevoTipoContacto = this.tipoContactoRepository.create(createTipoContactoDto);
            const tipoContactoGuardado = await this.tipoContactoRepository.save(nuevoTipoContacto);

            return {
                success: true,
                message: 'Tipo de contacto creado exitosamente',
                data: tipoContactoGuardado,
                error: null
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al crear el tipo de contacto',
                data: null,
                error: { message: error.message }
            };
        }
    }

    async findAll(): Promise<BaseResponseDto<TipoContacto[]>> {
        try {
            const tiposContacto = await this.tipoContactoRepository.find({
                order: { nombre: 'ASC' }
            });

            return {
                success: true,
                message: tiposContacto.length > 0 ? 'Tipos de contacto encontrados' : 'No se encontraron tipos de contacto',
                data: tiposContacto,
                error: null
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al obtener los tipos de contacto',
                data: [],
                error: { message: error.message }
            };
        }
    }

    async findOne(id: string): Promise<BaseResponseDto<TipoContacto>> {
        try {
            const tipoContacto = await this.tipoContactoRepository.findOne({
                where: { idTipoContacto: id }
            });

            if (!tipoContacto) {
                return {
                    success: false,
                    message: 'Tipo de contacto no encontrado',
                    data: null,
                    error: { message: 'No existe un tipo de contacto con el ID proporcionado' }
                };
            }

            return {
                success: true,
                message: 'Tipo de contacto encontrado',
                data: tipoContacto,
                error: null
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al buscar el tipo de contacto',
                data: null,
                error: { message: error.message }
            };
        }
    }

    async update(id: string, updateTipoContactoDto: UpdateTipoContactoDto): Promise<BaseResponseDto<TipoContacto>> {
        try {
            const tipoContacto = await this.tipoContactoRepository.findOne({
                where: { idTipoContacto: id }
            });

            if (!tipoContacto) {
                return {
                    success: false,
                    message: 'Tipo de contacto no encontrado',
                    data: null,
                    error: { message: 'No existe un tipo de contacto con el ID proporcionado' }
                };
            }

            // Verificar si se está cambiando el nombre y ya existe otro con ese nombre
            if (updateTipoContactoDto.nombre &&
                updateTipoContactoDto.nombre !== tipoContacto.nombre) {
                const tipoContactoExistente = await this.tipoContactoRepository.findOne({
                    where: { nombre: updateTipoContactoDto.nombre }
                });

                if (tipoContactoExistente) {
                    return {
                        success: false,
                        message: 'Ya existe un tipo de contacto con este nombre',
                        data: null,
                        error: { message: 'Nombre de tipo de contacto duplicado' }
                    };
                }
            }

            const tipoContactoActualizado = await this.tipoContactoRepository.save({
                ...tipoContacto,
                ...updateTipoContactoDto
            });

            return {
                success: true,
                message: 'Tipo de contacto actualizado exitosamente',
                data: tipoContactoActualizado,
                error: null
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al actualizar el tipo de contacto',
                data: null,
                error: { message: error.message }
            };
        }
    }

    async remove(id: string): Promise<BaseResponseDto<undefined>> {
        try {
            const tipoContacto = await this.tipoContactoRepository.findOne({
                where: { idTipoContacto: id },
                relations: ['contactos']
            });

            if (!tipoContacto) {
                return {
                    success: false,
                    message: 'Tipo de contacto no encontrado',
                    data: undefined,
                    error: { message: 'No existe un tipo de contacto con el ID proporcionado' }
                };
            }

            // Verificar si hay contactos asociados
            if (tipoContacto.contactos && tipoContacto.contactos.length > 0) {
                return {
                    success: false,
                    message: 'No se puede eliminar el tipo de contacto porque tiene contactos asociados',
                    data: undefined,
                    error: { message: 'Tipo de contacto en uso' }
                };
            }

            // Eliminación física
            await this.tipoContactoRepository.remove(tipoContacto);

            return {
                success: true,
                message: 'Tipo de contacto eliminado exitosamente',
                data: undefined,
                error: null
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al eliminar el tipo de contacto',
                data: undefined,
                error: { message: error.message }
            };
        }
    }

    async findByNombre(nombre: string): Promise<BaseResponseDto<TipoContacto>> {
        try {
            const tipoContacto = await this.tipoContactoRepository.findOne({
                where: { nombre: nombre }
            });

            if (!tipoContacto) {
                return {
                    success: false,
                    message: 'Tipo de contacto no encontrado',
                    data: null,
                    error: { message: `No existe un tipo de contacto con el nombre ${nombre}` }
                };
            }

            return {
                success: true,
                message: 'Tipo de contacto encontrado',
                data: tipoContacto,
                error: null
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al buscar el tipo de contacto por nombre',
                data: null,
                error: { message: error.message }
            };
        }
    }
}

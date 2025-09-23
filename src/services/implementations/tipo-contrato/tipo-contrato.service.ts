import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoContrato } from '../../../entities/TipoContrato';
import { CreateTipoContratoDto, UpdateTipoContratoDto } from '../../../dtos';
import { BaseResponseDto } from '../../../dtos/baseResponse/baseResponse.dto';
import { ITipoContratoService } from '../../interfaces/tipo-contrato.interface';

@Injectable()
export class TipoContratoService implements ITipoContratoService {
    constructor(
        @InjectRepository(TipoContrato)
        private readonly tipoContratoRepository: Repository<TipoContrato>,
    ) { }

    async create(createTipoContratoDto: CreateTipoContratoDto): Promise<BaseResponseDto<TipoContrato>> {
        try {
            // Verificar si ya existe un tipo de contrato con el mismo nombre
            const tipoContratoExistente = await this.tipoContratoRepository.findOne({
                where: { nombre: createTipoContratoDto.nombre }
            });

            if (tipoContratoExistente) {
                return {
                    success: false,
                    message: 'Ya existe un tipo de contrato con este nombre',
                    data: null,
                    error: { message: 'Nombre de tipo de contrato duplicado' }
                };
            }

            const nuevoTipoContrato = this.tipoContratoRepository.create(createTipoContratoDto);
            const tipoContratoGuardado = await this.tipoContratoRepository.save(nuevoTipoContrato);

            return {
                success: true,
                message: 'Tipo de contrato creado exitosamente',
                data: tipoContratoGuardado,
                error: null
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al crear el tipo de contrato',
                data: null,
                error: { message: error.message }
            };
        }
    }

    async findAll(): Promise<BaseResponseDto<TipoContrato[]>> {
        try {
            const tiposContrato = await this.tipoContratoRepository.find({
                order: { nombre: 'ASC' }
            });

            return {
                success: true,
                message: tiposContrato.length > 0 ? 'Tipos de contrato encontrados' : 'No se encontraron tipos de contrato',
                data: tiposContrato,
                error: null
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al obtener los tipos de contrato',
                data: [],
                error: { message: error.message }
            };
        }
    }

    async findOne(id: string): Promise<BaseResponseDto<TipoContrato>> {
        try {
            const tipoContrato = await this.tipoContratoRepository.findOne({
                where: { idTipoContrato: id }
            });

            if (!tipoContrato) {
                return {
                    success: false,
                    message: 'Tipo de contrato no encontrado',
                    data: null,
                    error: { message: 'No existe un tipo de contrato con el ID proporcionado' }
                };
            }

            return {
                success: true,
                message: 'Tipo de contrato encontrado',
                data: tipoContrato,
                error: null
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al buscar el tipo de contrato',
                data: null,
                error: { message: error.message }
            };
        }
    }

    async update(id: string, updateTipoContratoDto: UpdateTipoContratoDto): Promise<BaseResponseDto<TipoContrato>> {
        try {
            const tipoContrato = await this.tipoContratoRepository.findOne({
                where: { idTipoContrato: id }
            });

            if (!tipoContrato) {
                return {
                    success: false,
                    message: 'Tipo de contrato no encontrado',
                    data: null,
                    error: { message: 'No existe un tipo de contrato con el ID proporcionado' }
                };
            }

            // Verificar si se está cambiando el nombre y ya existe otro con ese nombre
            if (updateTipoContratoDto.nombre &&
                updateTipoContratoDto.nombre !== tipoContrato.nombre) {
                const tipoContratoExistente = await this.tipoContratoRepository.findOne({
                    where: { nombre: updateTipoContratoDto.nombre }
                });

                if (tipoContratoExistente) {
                    return {
                        success: false,
                        message: 'Ya existe un tipo de contrato con este nombre',
                        data: null,
                        error: { message: 'Nombre de tipo de contrato duplicado' }
                    };
                }
            }

            const tipoContratoActualizado = await this.tipoContratoRepository.save({
                ...tipoContrato,
                ...updateTipoContratoDto
            });

            return {
                success: true,
                message: 'Tipo de contrato actualizado exitosamente',
                data: tipoContratoActualizado,
                error: null
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al actualizar el tipo de contrato',
                data: null,
                error: { message: error.message }
            };
        }
    }

    async remove(id: string): Promise<BaseResponseDto<undefined>> {
        try {
            const tipoContrato = await this.tipoContratoRepository.findOne({
                where: { idTipoContrato: id },
                relations: ['contactos', 'contratoes']
            });

            if (!tipoContrato) {
                return {
                    success: false,
                    message: 'Tipo de contrato no encontrado',
                    data: undefined,
                    error: { message: 'No existe un tipo de contrato con el ID proporcionado' }
                };
            }

            // Verificar si hay contactos o contratos asociados
            const tieneContactos = tipoContrato.contactos && tipoContrato.contactos.length > 0;
            const tieneContratos = tipoContrato.contratoes && tipoContrato.contratoes.length > 0;

            if (tieneContactos || tieneContratos) {
                return {
                    success: false,
                    message: 'No se puede eliminar el tipo de contrato porque tiene registros asociados',
                    data: undefined,
                    error: { message: 'Tipo de contrato en uso' }
                };
            }

            // Eliminación física
            await this.tipoContratoRepository.remove(tipoContrato);

            return {
                success: true,
                message: 'Tipo de contrato eliminado exitosamente',
                data: undefined,
                error: null
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al eliminar el tipo de contrato',
                data: undefined,
                error: { message: error.message }
            };
        }
    }

    async findByNombre(nombre: string): Promise<BaseResponseDto<TipoContrato>> {
        try {
            const tipoContrato = await this.tipoContratoRepository.findOne({
                where: { nombre: nombre }
            });

            if (!tipoContrato) {
                return {
                    success: false,
                    message: 'Tipo de contrato no encontrado',
                    data: null,
                    error: { message: `No existe un tipo de contrato con el nombre ${nombre}` }
                };
            }

            return {
                success: true,
                message: 'Tipo de contrato encontrado',
                data: tipoContrato,
                error: null
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al buscar el tipo de contrato por nombre',
                data: null,
                error: { message: error.message }
            };
        }
    }
}

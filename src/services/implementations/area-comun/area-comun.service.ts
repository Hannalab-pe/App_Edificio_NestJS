import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAreaComunDto, UpdateAreaComunDto } from 'src/dtos';
import { BaseResponseDto } from 'src/dtos/baseResponse/baseResponse.dto';
import { AreaComun } from 'src/entities/AreaComun';
import { IAreaComunService } from 'src/services/interfaces';
import { Repository } from 'typeorm';

@Injectable()
export class AreaComunService implements IAreaComunService {

    constructor(
        @InjectRepository(AreaComun)
        private areaComunRepository: Repository<AreaComun>,
    ) { }

    async createAreaComun(createAreaComunDto: CreateAreaComunDto): Promise<BaseResponseDto<AreaComun>> {
        if (!createAreaComunDto) {
            return {
                success: false,
                message: 'Datos no válidos',
                data: null,
                error: new BadRequestException('Ingrese datos válidos, Intente de Nuevo.')
            };
        }

        try {
            const areaComun = this.areaComunRepository.create(createAreaComunDto);
            const areaComunGuardado = await this.areaComunRepository.save(areaComun);
            return {
                success: true,
                message: 'Área común creada exitosamente.',
                data: areaComunGuardado
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al crear el área común',
                data: null,
                error: new BadRequestException('Error al crear el área común: ' + error.message)
            };
        }
    }

    async findAll(): Promise<BaseResponseDto<AreaComun[]>> {
        try {
            const areasComunes = await this.areaComunRepository.find({
                where: { estaActivo: true }
            });
            return {
                success: true,
                message: areasComunes.length > 0
                    ? 'Áreas comunes obtenidas exitosamente.'
                    : 'No se encontraron áreas comunes.',
                data: areasComunes
            };
        } catch (error) {
            const exception = new BadRequestException('Error al obtener áreas comunes: ' + error.message);
            return {
                success: false,
                message: 'Error al obtener áreas comunes',
                data: [],
                error: exception
            };
        }
    }

    async findOne(id: string): Promise<BaseResponseDto<AreaComun>> {
        if (!id) {
            return {
                success: false,
                message: 'ID no válido',
                data: null,
                error: new BadRequestException('Ingrese un ID válido, Intente de Nuevo.')
            };
        }

        try {
            const areaComun = await this.areaComunRepository.findOne({
                where: {
                    idAreaComun: id,
                    estaActivo: true
                }
            });
            if (!areaComun) {
                return {
                    success: false,
                    message: 'Área común no encontrada',
                    data: null,
                    error: {
                        message: 'Área común no encontrada.',
                        statusCode: 404
                    }
                };
            }
            return {
                success: true,
                message: 'Área común obtenida exitosamente.',
                data: areaComun
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al obtener el área común',
                data: null,
                error: new BadRequestException('Error al obtener el área común: ' + error.message)
            };
        }
    }


    async updateAreaComun(id: string, updateAreaComunDto: UpdateAreaComunDto): Promise<BaseResponseDto<AreaComun>> {
        if (!id || !updateAreaComunDto) {
            return {
                success: false,
                message: 'Datos no válidos',
                data: null,
                error: new BadRequestException('Ingrese datos válidos, Intente de Nuevo.')
            };
        }

        try {
            const areaComun = await this.areaComunRepository.findOne({ where: { idAreaComun: id } });
            if (!areaComun) {
                return {
                    success: false,
                    message: 'Área común no encontrada',
                    data: null,
                    error: new BadRequestException('Área común no encontrada.')
                };
            }
            this.areaComunRepository.merge(areaComun, updateAreaComunDto);
            const areaComunActualizada = await this.areaComunRepository.save(areaComun);
            return {
                success: true,
                message: 'Área común actualizada exitosamente.',
                data: areaComunActualizada
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al actualizar el área común',
                data: null,
                error: new BadRequestException('Error al actualizar el área común: ' + error.message)
            };
        }
    }

    async eliminacionLogica(id: string): Promise<BaseResponseDto<void>> {
        if (!id) {
            return {
                success: false,
                message: 'ID no válido',
                data: undefined,
                error: new BadRequestException('Ingrese un ID válido, Intente de Nuevo.')
            };
        }

        try {
            const areaComun = await this.areaComunRepository.findOne({ where: { idAreaComun: id } });
            if (!areaComun) {
                return {
                    success: false,
                    message: 'Área común no encontrada',
                    data: undefined,
                    error: {
                        message: 'Área común no encontrada.',
                        statusCode: 404
                    }
                };
            }

            // Eliminación lógica: cambiar estaActivo a false
            areaComun.estaActivo = false;
            await this.areaComunRepository.save(areaComun);

            return {
                success: true,
                message: 'Área común eliminada exitosamente.',
                data: undefined
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al eliminar el área común',
                data: undefined,
                error: new BadRequestException('Error al eliminar el área común: ' + error.message)
            };
        }
    }

    async findByEstado(estado: boolean): Promise<BaseResponseDto<AreaComun[]>> {
        if (estado === null || estado === undefined) {
            return {
                success: false,
                message: 'Estado no válido',
                data: [],
                error: new BadRequestException('Ingrese un estado válido, Intente de Nuevo.')
            };
        }

        try {
            const areasComunes = await this.areaComunRepository.find({ where: { estaActivo: estado } });
            return {
                success: true,
                message: areasComunes.length > 0
                    ? `Áreas comunes ${estado ? 'activas' : 'inactivas'} obtenidas exitosamente.`
                    : `No se encontraron áreas comunes ${estado ? 'activas' : 'inactivas'}.`,
                data: areasComunes
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al obtener áreas comunes por estado',
                data: [],
                error: new BadRequestException('Error al obtener áreas comunes por estado: ' + error.message)
            };
        }
    }

    async findAvailable(): Promise<BaseResponseDto<AreaComun[]>> {
        try {
            const areasComunes = await this.areaComunRepository.find({ where: { estaActivo: true } });
            return {
                success: true,
                message: areasComunes.length > 0
                    ? 'Áreas comunes disponibles obtenidas exitosamente.'
                    : 'No se encontraron áreas comunes disponibles.',
                data: areasComunes
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al obtener áreas comunes disponibles',
                data: [],
                error: new BadRequestException('Error al obtener áreas comunes disponibles: ' + error.message)
            };
        }
    }

}

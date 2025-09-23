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
            throw new BadRequestException('Ingrese datos validos, Intente de Nuevo.');
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
            const exception = new BadRequestException('Error al crear el área común: ' + error.message);
            return {
                success: false,
                message: 'Error al crear el área común',
                data: null,
                error: exception
            }
        }
    }

    async findAll(): Promise<BaseResponseDto<AreaComun[]>> {
        try {

            const areasComunes = await this.areaComunRepository.find();
            if (areasComunes.length === 0) {
                throw new BadRequestException('No se encontraron áreas comunes.');
            }
            return {
                success: true,
                message: 'Áreas comunes obtenidas exitosamente.',
                data: areasComunes
            };
        } catch (error) {
            const exception = new BadRequestException('Error al obtener áreas comunes: ' + error.message);
            return {
                success: false,
                message: 'Error al obtener áreas comunes',
                data: [],
                error: exception
            }
        }
    }

    async findOne(id: string): Promise<BaseResponseDto<AreaComun>> {
        if (!id) {
            throw new BadRequestException('Ingrese un ID válido, Intente de Nuevo.');
        }

        try {
            const areaComun = await this.areaComunRepository.findOne({ where: { idAreaComun: id } });
            if (!areaComun) {
                throw new BadRequestException('Área común no encontrada.');
            }
            return {
                success: true,
                message: 'Área común obtenida exitosamente.',
                data: areaComun
            };
        } catch (error) {
            const exception = new BadRequestException('Error al obtener el área común: ' + error.message);
            return {
                success: false,
                message: 'Error al obtener el área común',
                data: null,
                error: exception
            }
        }
    }

    async updateAreaComun(id: string, updateAreaComunDto: UpdateAreaComunDto): Promise<BaseResponseDto<AreaComun>> {
        if (!id || !updateAreaComunDto) {
            throw new BadRequestException('Ingrese datos válidos, Intente de Nuevo.');
        }

        try {
            const areaComun = await this.areaComunRepository.findOne({ where: { idAreaComun: id } });
            if (!areaComun) {
                throw new BadRequestException('Área común no encontrada.');
            }
            this.areaComunRepository.merge(areaComun, updateAreaComunDto);
            const areaComunActualizada = await this.areaComunRepository.save(areaComun);
            return {
                success: true,
                message: 'Área común actualizada exitosamente.',
                data: areaComunActualizada
            };
        } catch (error) {
            const exception = new BadRequestException('Error al actualizar el área común: ' + error.message);
            return {
                success: false,
                message: 'Error al actualizar el área común',
                data: null,
                error: exception
            }
        }
    }

    async eliminacionLogica(id: string): Promise<BaseResponseDto<void>> {
        if (!id) {
            throw new BadRequestException('Ingrese un ID válido, Intente de Nuevo.');
        }

        try {
            const areaComun = await this.areaComunRepository.findOne({ where: { idAreaComun: id } });
            if (!areaComun) {
                throw new BadRequestException('Área común no encontrada.');
            }
            await this.areaComunRepository.remove(areaComun);
            return {
                success: true,
                message: 'Área común eliminada exitosamente.',
                data: undefined
            };
        } catch (error) {
            const exception = new BadRequestException('Error al eliminar el área común: ' + error.message);
            return {
                success: false,
                message: 'Error al eliminar el área común',
                data: undefined,
                error: exception
            }
        }
    }

    async findByEstado(estado: boolean): Promise<BaseResponseDto<AreaComun[]>> {
        if (estado === null || estado === undefined) {
            throw new BadRequestException('Ingrese un estado válido, Intente de Nuevo.');
        }

        try {
            const areasComunes = await this.areaComunRepository.find({ where: { estaActivo: estado } });
            if (areasComunes.length === 0) {
                throw new BadRequestException('No se encontraron áreas comunes con el estado especificado.');
            }
            return {
                success: true,
                message: `Áreas comunes ${estado ? 'activas' : 'inactivas'} obtenidas exitosamente.`,
                data: areasComunes
            };
        } catch (error) {
            const exception = new BadRequestException('Error al obtener áreas comunes por estado: ' + error.message);
            return {
                success: false,
                message: 'Error al obtener áreas comunes por estado',
                data: [],
                error: exception
            }
        }
    }

    async findAvailable(): Promise<BaseResponseDto<AreaComun[]>> {
        try {
            const areasComunes = await this.areaComunRepository.find({ where: { estaActivo: true } });
            if (areasComunes.length === 0) {
                throw new BadRequestException('No se encontraron áreas comunes disponibles.');
            }
            return {
                success: true,
                message: 'Áreas comunes disponibles obtenidas exitosamente.',
                data: areasComunes
            };
        } catch (error) {
            const exception = new BadRequestException('Error al obtener áreas comunes disponibles: ' + error.message);
            return {
                success: false,
                message: 'Error al obtener áreas comunes disponibles',
                data: [],
                error: exception
            }
        }
    }

}

import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateEdificioDto, UpdateEdificioDto } from 'src/dtos';
import { BaseResponseDto } from 'src/dtos/baseResponse/baseResponse.dto';
import { Edificio } from 'src/entities/Edificio';
import { IEdificioService } from 'src/services/interfaces';
import { Repository } from 'typeorm';
import { InmobiliariaService } from '../inmobiliaria/inmobiliaria.service';

@Injectable()
export class EdificioService implements IEdificioService {
    constructor(
        @InjectRepository(Edificio)
        private readonly edificioRepository: Repository<Edificio>,
        private readonly inmobiliariaService: InmobiliariaService
    ) { }

    async create(
        createEdificioDto: CreateEdificioDto,
    ): Promise<BaseResponseDto<Edificio>> {
        if (!createEdificioDto) {
            return BaseResponseDto.error('Ingrese datos válidos, Intente de Nuevo.', HttpStatus.BAD_REQUEST);
        }

        try {
            const inmobiliariaFound = await this.inmobiliariaService.findOne(createEdificioDto.idInmobiliaria);
            if (!inmobiliariaFound.data) {
                return BaseResponseDto.error('Inmobiliaria no encontrada', HttpStatus.NOT_FOUND);
            }

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
                idInmobiliaria: inmobiliariaFound.data,
            };

            const edificio = this.edificioRepository.create(edificioData);
            const edificioGuardado = await this.edificioRepository.save(edificio);

            return BaseResponseDto.success(edificioGuardado, 'Edificio creado exitosamente.', HttpStatus.CREATED);
        } catch (error) {
            return BaseResponseDto.error('Error al crear el edificio: ' + error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async findAll(): Promise<BaseResponseDto<Edificio[]>> {
        try {
            const edificios = await this.edificioRepository.find({
                relations: ['idAdministradorEdificio', 'idInmobiliaria'],
            });

            const message = edificios.length > 0
                ? 'Edificios obtenidos exitosamente.'
                : 'No se encontraron edificios.';

            return BaseResponseDto.success(edificios, message, HttpStatus.OK);
        } catch (error) {
            return BaseResponseDto.error('Error al obtener edificios: ' + error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async findOne(id: string): Promise<BaseResponseDto<Edificio>> {
        if (!id) {
            return BaseResponseDto.error('Ingrese un ID válido, Intente de Nuevo.', HttpStatus.BAD_REQUEST);
        }

        try {
            const edificio = await this.edificioRepository.findOne({
                where: { idEdificio: id },
                relations: ['idAdministradorEdificio', 'idInmobiliaria', 'propiedads'],
            });

            if (!edificio) {
                return BaseResponseDto.error('Edificio no encontrado.', HttpStatus.NOT_FOUND);
            }

            return BaseResponseDto.success(edificio, 'Edificio obtenido exitosamente.', HttpStatus.OK);
        } catch (error) {
            return BaseResponseDto.error('Error al obtener el edificio: ' + error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async update(
        id: string,
        updateEdificioDto: UpdateEdificioDto,
    ): Promise<BaseResponseDto<Edificio>> {
        if (!id || !updateEdificioDto) {
            return BaseResponseDto.error('Ingrese datos válidos, Intente de Nuevo.', HttpStatus.BAD_REQUEST);
        }

        try {
            const edificio = await this.edificioRepository.findOne({
                where: { idEdificio: id },
            });

            if (!edificio) {
                return BaseResponseDto.error('Edificio no encontrado.', HttpStatus.NOT_FOUND);
            }

            // Validar inmobiliaria si se está actualizando
            if (updateEdificioDto.idInmobiliaria) {
                const inmobiliariaFound = await this.inmobiliariaService.findOne(updateEdificioDto.idInmobiliaria);
                if (!inmobiliariaFound.data) {
                    return BaseResponseDto.error('Inmobiliaria no encontrada', HttpStatus.NOT_FOUND);
                }
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
                const inmobiliariaFound = await this.inmobiliariaService.findOne(updateEdificioDto.idInmobiliaria);
                updateData.idInmobiliaria = inmobiliariaFound.data;
            }

            this.edificioRepository.merge(edificio, updateData);
            const edificioActualizado = await this.edificioRepository.save(edificio);

            return BaseResponseDto.success(edificioActualizado, 'Edificio actualizado exitosamente.', HttpStatus.OK);
        } catch (error) {
            return BaseResponseDto.error('Error al actualizar el edificio: ' + error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async remove(id: string): Promise<BaseResponseDto<void>> {
        if (!id) {
            return BaseResponseDto.error('Ingrese un ID válido, Intente de Nuevo.', HttpStatus.BAD_REQUEST);
        }

        try {
            const edificio = await this.edificioRepository.findOne({
                where: { idEdificio: id },
            });

            if (!edificio) {
                return BaseResponseDto.error('Edificio no encontrado.', HttpStatus.NOT_FOUND);
            }

            // Eliminación lógica: cambiar estaActivo a false
            edificio.estaActivo = false;
            edificio.fechaActualizacion = new Date();
            await this.edificioRepository.save(edificio);

            return BaseResponseDto.success(undefined, 'Edificio eliminado exitosamente.', HttpStatus.OK);
        } catch (error) {
            return BaseResponseDto.error('Error al eliminar el edificio: ' + error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async findByNombre(nombre: string): Promise<BaseResponseDto<Edificio>> {
        if (!nombre) {
            return BaseResponseDto.error('Ingrese un nombre válido, Intente de Nuevo.', HttpStatus.BAD_REQUEST);
        }

        try {
            const edificio = await this.edificioRepository.findOne({
                where: { nombreEdificio: nombre },
                relations: ['idAdministradorEdificio', 'idInmobiliaria'],
            });

            if (!edificio) {
                return BaseResponseDto.error('Edificio no encontrado con ese nombre.', HttpStatus.NOT_FOUND);
            }

            return BaseResponseDto.success(edificio, 'Edificio encontrado exitosamente.', HttpStatus.OK);
        } catch (error) {
            return BaseResponseDto.error('Error al buscar el edificio por nombre: ' + error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async findByDistrito(distrito: string): Promise<BaseResponseDto<Edificio[]>> {
        if (!distrito) {
            return BaseResponseDto.error('Ingrese un distrito válido, Intente de Nuevo.', HttpStatus.BAD_REQUEST);
        }

        try {
            const edificios = await this.edificioRepository.find({
                where: { distrito },
                relations: ['idAdministradorEdificio', 'idInmobiliaria'],
            });

            const message = edificios.length > 0
                ? 'Edificios encontrados exitosamente.'
                : 'No se encontraron edificios en ese distrito.';

            return BaseResponseDto.success(edificios, message, HttpStatus.OK);
        } catch (error) {
            return BaseResponseDto.error('Error al buscar edificios por distrito: ' + error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async findByInmobiliaria(idInmobiliaria: string): Promise<BaseResponseDto<Edificio[]>> {
        if (!idInmobiliaria) {
            return BaseResponseDto.error('Ingrese un ID de inmobiliaria válido, Intente de Nuevo.', HttpStatus.BAD_REQUEST);
        }

        try {
            const edificios = await this.edificioRepository.find({
                where: { idInmobiliaria: { idInmobiliaria } as any },
                relations: ['idAdministradorEdificio', 'idInmobiliaria'],
            });

            const message = edificios.length > 0
                ? 'Edificios de la inmobiliaria obtenidos exitosamente.'
                : 'No se encontraron edificios para esa inmobiliaria.';

            return BaseResponseDto.success(edificios, message, HttpStatus.OK);
        } catch (error) {
            return BaseResponseDto.error('Error al buscar edificios por inmobiliaria: ' + error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async findActivos(): Promise<BaseResponseDto<Edificio[]>> {
        try {
            const edificios = await this.edificioRepository.find({
                where: { estaActivo: true },
                relations: ['idAdministradorEdificio', 'idInmobiliaria'],
            });

            const message = edificios.length > 0
                ? 'Edificios activos obtenidos exitosamente.'
                : 'No se encontraron edificios activos.';

            return BaseResponseDto.success(edificios, message, HttpStatus.OK);
        } catch (error) {
            return BaseResponseDto.error('Error al obtener edificios activos: ' + error.message, HttpStatus.BAD_REQUEST);
        }
    }
}
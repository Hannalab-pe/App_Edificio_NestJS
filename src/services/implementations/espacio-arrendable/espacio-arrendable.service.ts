import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EspacioArrendable } from 'src/entities/EspacioArrendable';
import { CreateEspacioArrendableDto, UpdateEspacioArrendableDto, EspacioArrendableResponseDto } from 'src/dtos/espacio-arrendable';
import { BaseResponseDto } from 'src/dtos/baseResponse/baseResponse.dto';
import { IEspacioArrendableService } from 'src/services/interfaces';

@Injectable()
export class EspacioArrendableService implements IEspacioArrendableService {
    constructor(
        @InjectRepository(EspacioArrendable)
        private readonly espacioArrendableRepository: Repository<EspacioArrendable>,
    ) { }

    async create(createEspacioArrendableDto: CreateEspacioArrendableDto): Promise<BaseResponseDto<EspacioArrendableResponseDto>> {
        if (!createEspacioArrendableDto) {
            return BaseResponseDto.error('Ingrese datos válidos, Intente de Nuevo.', HttpStatus.BAD_REQUEST);
        }

        try {
            // Verificar si ya existe un espacio con el mismo código
            const espacioExistente = await this.espacioArrendableRepository.findOne({
                where: { codigo: createEspacioArrendableDto.codigo },
            });

            if (espacioExistente) {
                return BaseResponseDto.error('Ya existe un espacio arrendable con ese código.', HttpStatus.CONFLICT);
            }

            // Crear la entidad espacio arrendable
            const espacioData = {
                ...createEspacioArrendableDto,
                estaActivo: true, // Por defecto activo
                // Configurar relación con tipo de espacio
                idTipoEspacio2: { idTipoEspacio: createEspacioArrendableDto.idTipoEspacio } as any,
            };

            const espacioArrendable = this.espacioArrendableRepository.create(espacioData);
            const espacioGuardado = await this.espacioArrendableRepository.save(espacioArrendable);

            // Obtener el espacio guardado con sus relaciones para la respuesta
            const espacioCompleto = await this.espacioArrendableRepository.findOne({
                where: { idEspacio: espacioGuardado.idEspacio },
                relations: ['idTipoEspacio2'],
            });

            if (!espacioCompleto) {
                return BaseResponseDto.error('Error al obtener el espacio arrendable creado.', HttpStatus.INTERNAL_SERVER_ERROR);
            }

            const responseDto = this.mapToResponseDto(espacioCompleto);

            return BaseResponseDto.success(responseDto, 'Espacio arrendable creado exitosamente.', HttpStatus.CREATED);
        } catch (error) {
            return BaseResponseDto.error('Error al crear el espacio arrendable: ' + error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async findAll(): Promise<BaseResponseDto<EspacioArrendableResponseDto[]>> {
        try {
            const espacios = await this.espacioArrendableRepository.find({
                relations: ['idTipoEspacio2'],
            });

            const responseData = espacios.map(espacio => this.mapToResponseDto(espacio));

            const message = espacios.length > 0
                ? 'Espacios arrendables obtenidos exitosamente.'
                : 'No se encontraron espacios arrendables.';

            return BaseResponseDto.success(responseData, message, HttpStatus.OK);
        } catch (error) {
            return BaseResponseDto.error('Error al obtener espacios arrendables: ' + error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async findOne(id: string): Promise<BaseResponseDto<EspacioArrendableResponseDto>> {
        if (!id) {
            return BaseResponseDto.error('Ingrese un ID válido, Intente de Nuevo.', HttpStatus.BAD_REQUEST);
        }

        try {
            const espacioArrendable = await this.espacioArrendableRepository.findOne({
                where: { idEspacio: id },
                relations: ['idTipoEspacio2', 'arrendamientoEspacios'],
            });

            if (!espacioArrendable) {
                return BaseResponseDto.error('Espacio arrendable no encontrado.', HttpStatus.NOT_FOUND);
            }

            const responseDto = this.mapToResponseDto(espacioArrendable);

            return BaseResponseDto.success(responseDto, 'Espacio arrendable obtenido exitosamente.', HttpStatus.OK);
        } catch (error) {
            return BaseResponseDto.error('Error al obtener el espacio arrendable: ' + error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async update(id: string, updateEspacioArrendableDto: UpdateEspacioArrendableDto): Promise<BaseResponseDto<EspacioArrendableResponseDto>> {
        if (!id || !updateEspacioArrendableDto) {
            return BaseResponseDto.error('Ingrese datos válidos, Intente de Nuevo.', HttpStatus.BAD_REQUEST);
        }

        try {
            const espacioArrendable = await this.espacioArrendableRepository.findOne({
                where: { idEspacio: id },
            });

            if (!espacioArrendable) {
                return BaseResponseDto.error('Espacio arrendable no encontrado.', HttpStatus.NOT_FOUND);
            }

            // Verificar si se está actualizando el código y si ya existe
            if (updateEspacioArrendableDto.codigo && updateEspacioArrendableDto.codigo !== espacioArrendable.codigo) {
                const espacioExistente = await this.espacioArrendableRepository.findOne({
                    where: { codigo: updateEspacioArrendableDto.codigo },
                });

                if (espacioExistente) {
                    return BaseResponseDto.error('Ya existe un espacio arrendable con ese código.', HttpStatus.CONFLICT);
                }
            }

            // Preparar datos de actualización
            const updateData: any = {
                ...updateEspacioArrendableDto,
            };

            // Configurar relación con tipo de espacio si está presente
            if (updateEspacioArrendableDto.idTipoEspacio) {
                updateData.idTipoEspacio2 = { idTipoEspacio: updateEspacioArrendableDto.idTipoEspacio };
            }

            this.espacioArrendableRepository.merge(espacioArrendable, updateData);
            const espacioActualizado = await this.espacioArrendableRepository.save(espacioArrendable);

            // Obtener el espacio actualizado con sus relaciones
            const espacioCompleto = await this.espacioArrendableRepository.findOne({
                where: { idEspacio: espacioActualizado.idEspacio },
                relations: ['idTipoEspacio2'],
            });

            if (!espacioCompleto) {
                return BaseResponseDto.error('Error al obtener el espacio arrendable actualizado.', HttpStatus.INTERNAL_SERVER_ERROR);
            }

            const responseDto = this.mapToResponseDto(espacioCompleto);

            return BaseResponseDto.success(responseDto, 'Espacio arrendable actualizado exitosamente.', HttpStatus.OK);
        } catch (error) {
            return BaseResponseDto.error('Error al actualizar el espacio arrendable: ' + error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async remove(id: string): Promise<BaseResponseDto<void>> {
        if (!id) {
            return BaseResponseDto.error('Ingrese un ID válido, Intente de Nuevo.', HttpStatus.BAD_REQUEST);
        }

        try {
            const espacioArrendable = await this.espacioArrendableRepository.findOne({
                where: { idEspacio: id },
                relations: ['arrendamientoEspacios'],
            });

            if (!espacioArrendable) {
                return BaseResponseDto.error('Espacio arrendable no encontrado.', HttpStatus.NOT_FOUND);
            }

            // Verificar si tiene arrendamientos activos
            if (espacioArrendable.arrendamientoEspacios && espacioArrendable.arrendamientoEspacios.length > 0) {
                return BaseResponseDto.error('No se puede eliminar el espacio arrendable porque tiene arrendamientos asociados.', HttpStatus.CONFLICT);
            }

            // Eliminación lógica: cambiar estaActivo a false
            espacioArrendable.estaActivo = false;
            await this.espacioArrendableRepository.save(espacioArrendable);

            return BaseResponseDto.success(undefined, 'Espacio arrendable eliminado exitosamente.', HttpStatus.OK);
        } catch (error) {
            return BaseResponseDto.error('Error al eliminar el espacio arrendable: ' + error.message, HttpStatus.BAD_REQUEST);
        }
    }

    // Métodos adicionales específicos para espacios arrendables

    async findByCodigo(codigo: string): Promise<BaseResponseDto<EspacioArrendableResponseDto>> {
        if (!codigo) {
            return BaseResponseDto.error('Ingrese un código válido, Intente de Nuevo.', HttpStatus.BAD_REQUEST);
        }

        try {
            const espacioArrendable = await this.espacioArrendableRepository.findOne({
                where: { codigo },
                relations: ['idTipoEspacio2'],
            });

            if (!espacioArrendable) {
                return BaseResponseDto.error('Espacio arrendable no encontrado con ese código.', HttpStatus.NOT_FOUND);
            }

            const responseDto = this.mapToResponseDto(espacioArrendable);

            return BaseResponseDto.success(responseDto, 'Espacio arrendable encontrado exitosamente.', HttpStatus.OK);
        } catch (error) {
            return BaseResponseDto.error('Error al buscar el espacio arrendable por código: ' + error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async findByEstado(estado: string): Promise<BaseResponseDto<EspacioArrendableResponseDto[]>> {
        if (!estado) {
            return BaseResponseDto.error('Ingrese un estado válido, Intente de Nuevo.', HttpStatus.BAD_REQUEST);
        }

        try {
            const espacios = await this.espacioArrendableRepository.find({
                where: { estado },
                relations: ['idTipoEspacio2'],
            });

            const responseData = espacios.map(espacio => this.mapToResponseDto(espacio));

            const message = espacios.length > 0
                ? 'Espacios arrendables encontrados exitosamente.'
                : 'No se encontraron espacios arrendables con ese estado.';

            return BaseResponseDto.success(responseData, message, HttpStatus.OK);
        } catch (error) {
            return BaseResponseDto.error('Error al buscar espacios arrendables por estado: ' + error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async findByTipoEspacio(idTipoEspacio: string): Promise<BaseResponseDto<EspacioArrendableResponseDto[]>> {
        if (!idTipoEspacio) {
            return BaseResponseDto.error('Ingrese un ID de tipo de espacio válido, Intente de Nuevo.', HttpStatus.BAD_REQUEST);
        }

        try {
            const espacios = await this.espacioArrendableRepository.find({
                where: { idTipoEspacio2: { idTipoEspacio } as any },
                relations: ['idTipoEspacio2'],
            });

            const responseData = espacios.map(espacio => this.mapToResponseDto(espacio));

            const message = espacios.length > 0
                ? 'Espacios arrendables del tipo obtenidos exitosamente.'
                : 'No se encontraron espacios arrendables de ese tipo.';

            return BaseResponseDto.success(responseData, message, HttpStatus.OK);
        } catch (error) {
            return BaseResponseDto.error('Error al buscar espacios arrendables por tipo: ' + error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async findActivos(): Promise<BaseResponseDto<EspacioArrendableResponseDto[]>> {
        try {
            const espacios = await this.espacioArrendableRepository.find({
                where: { estaActivo: true },
                relations: ['idTipoEspacio2'],
            });

            const responseData = espacios.map(espacio => this.mapToResponseDto(espacio));

            const message = espacios.length > 0
                ? 'Espacios arrendables activos obtenidos exitosamente.'
                : 'No se encontraron espacios arrendables activos.';

            return BaseResponseDto.success(responseData, message, HttpStatus.OK);
        } catch (error) {
            return BaseResponseDto.error('Error al obtener espacios arrendables activos: ' + error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async findDisponibles(): Promise<BaseResponseDto<EspacioArrendableResponseDto[]>> {
        try {
            const espacios = await this.espacioArrendableRepository.find({
                where: {
                    estado: 'DISPONIBLE',
                    estaActivo: true
                },
                relations: ['idTipoEspacio2'],
            });

            const responseData = espacios.map(espacio => this.mapToResponseDto(espacio));

            const message = espacios.length > 0
                ? 'Espacios arrendables disponibles obtenidos exitosamente.'
                : 'No se encontraron espacios arrendables disponibles.';

            return BaseResponseDto.success(responseData, message, HttpStatus.OK);
        } catch (error) {
            return BaseResponseDto.error('Error al obtener espacios arrendables disponibles: ' + error.message, HttpStatus.BAD_REQUEST);
        }
    }

    // Método privado para mapear entidad a DTO de respuesta
    private mapToResponseDto(espacio: EspacioArrendable): EspacioArrendableResponseDto {
        const responseDto = new EspacioArrendableResponseDto();
        responseDto.idEspacio = espacio.idEspacio;
        responseDto.codigo = espacio.codigo;
        responseDto.descripcion = espacio.descripcion;
        responseDto.ubicacion = espacio.ubicacion;
        responseDto.areaM2 = espacio.areaM2;
        responseDto.estado = espacio.estado;
        responseDto.tarifaMensual = espacio.tarifaMensual;
        responseDto.estaActivo = espacio.estaActivo;

        // Mapear relación con tipo de espacio
        if (espacio.idTipoEspacio2) {
            responseDto.idTipoEspacio2 = {
                idTipoEspacio: espacio.idTipoEspacio2.idTipoEspacio,
                nombre: espacio.idTipoEspacio2.nombre,
                descripcion: espacio.idTipoEspacio2.descripcion,
            };
        }

        return responseDto;
    }
}

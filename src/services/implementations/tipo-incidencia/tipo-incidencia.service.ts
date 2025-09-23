<<<<<<< HEAD
import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ITipoIncidenciaService } from '../../interfaces/tipo-incidencia.interface';
import { TipoIncidencia } from '../../../entities/TipoIncidencia';
import { CreateTipoIncidenciaDto, UpdateTipoIncidenciaDto } from '../../../dtos';

@Injectable()
export class TipoIncidenciaService implements ITipoIncidenciaService {
  constructor(
    @InjectRepository(TipoIncidencia)
    private readonly tipoIncidenciaRepository: Repository<TipoIncidencia>,
  ) {}

  async create(createTipoIncidenciaDto: CreateTipoIncidenciaDto): Promise<TipoIncidencia> {
    // Verificar si ya existe un tipo de incidencia con el mismo nombre
    const existingTipo = await this.tipoIncidenciaRepository.findOne({
      where: { nombre: createTipoIncidenciaDto.nombre }
    });

    if (existingTipo) {
      throw new ConflictException('Ya existe un tipo de incidencia con este nombre');
    }

    const tipoIncidencia = this.tipoIncidenciaRepository.create({
      ...createTipoIncidenciaDto,
      estaActivo: true,
    });

    const result = await this.tipoIncidenciaRepository.save(tipoIncidencia);
    return Array.isArray(result) ? result[0] : result;
  }

  async findAll(): Promise<TipoIncidencia[]> {
    return await this.tipoIncidenciaRepository.find({
      relations: ['incidencias'],
      order: {
        nombre: 'ASC'
      }
    });
  }

  async findOne(id: string): Promise<TipoIncidencia> {
    const tipoIncidencia = await this.tipoIncidenciaRepository.findOne({
      where: { idTipoIncidencia: id },
      relations: ['incidencias'],
    });

    if (!tipoIncidencia) {
      throw new NotFoundException(`Tipo de incidencia con ID ${id} no encontrado`);
    }

    return tipoIncidencia;
  }

  async update(id: string, updateTipoIncidenciaDto: UpdateTipoIncidenciaDto): Promise<TipoIncidencia> {
    await this.findOne(id);

    // Si se actualiza el nombre, verificar que no exista otro con el mismo nombre
    if (updateTipoIncidenciaDto.nombre) {
      const existingTipo = await this.tipoIncidenciaRepository.findOne({
        where: {
          nombre: updateTipoIncidenciaDto.nombre,
          idTipoIncidencia: require('typeorm').Not(id)
        }
      });

      if (existingTipo) {
        throw new ConflictException('Ya existe otro tipo de incidencia con este nombre');
      }
    }

    await this.tipoIncidenciaRepository.update(id, updateTipoIncidenciaDto);
    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const tipoIncidencia = await this.findOne(id);

    // Verificar si tiene incidencias asociadas activas
    const incidenciasActivas = await this.tipoIncidenciaRepository
      .createQueryBuilder('tipo')
      .leftJoin('tipo.incidencias', 'incidencia')
      .where('tipo.idTipoIncidencia = :id', { id })
      .andWhere('incidencia.estado != :estado', { estado: 'Resuelto' })
      .getCount();

    if (incidenciasActivas > 0) {
      throw new BadRequestException('No se puede eliminar un tipo de incidencia que tiene incidencias activas asociadas');
    }

    // Eliminación lógica: marcar como inactivo
    await this.tipoIncidenciaRepository.update(id, { estaActivo: false });
  }

  async findByNombre(nombre: string): Promise<TipoIncidencia> {
    const tipoIncidencia = await this.tipoIncidenciaRepository.findOne({
      where: {
        nombre,
        estaActivo: true
      },
      relations: ['incidencias'],
    });

    if (!tipoIncidencia) {
      throw new NotFoundException(`Tipo de incidencia con nombre '${nombre}' no encontrado`);
    }

    return tipoIncidencia;
  }

  async findByPrioridad(prioridad: string): Promise<TipoIncidencia[]> {
    return await this.tipoIncidenciaRepository.find({
      where: {
        prioridad,
        estaActivo: true
      },
      relations: ['incidencias'],
      order: {
        nombre: 'ASC'
      }
    });
  }

  async findActivos(): Promise<TipoIncidencia[]> {
    return await this.tipoIncidenciaRepository.find({
      where: { estaActivo: true },
      relations: ['incidencias'],
      order: {
        nombre: 'ASC'
      }
    });
  }
}
=======
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTipoIncidenciaDto, UpdateTipoIncidenciaDto } from 'src/dtos';
import { BaseResponseDto } from 'src/dtos/baseResponse/baseResponse.dto';
import { TipoIncidencia } from 'src/entities/TipoIncidencia';
import { ITipoIncidenciaService } from 'src/services/interfaces';
import { Repository } from 'typeorm';

@Injectable()
export class TipoIncidenciaService implements ITipoIncidenciaService {
	constructor(@InjectRepository(TipoIncidencia) private readonly tipoIncidenciaRepository: Repository<TipoIncidencia>) {}

	async create(createTipoIncidenciaDto: CreateTipoIncidenciaDto): Promise<BaseResponseDto<TipoIncidencia>> {
		if (!createTipoIncidenciaDto) {
			return {
				success: false,
				message: 'Datos no válidos',
				data: null,
				error: {
					message: 'Ingrese datos válidos, Intente de Nuevo.',
					statusCode: 400
				}
			};
		}
		try {
			const tipoIncidencia = this.tipoIncidenciaRepository.create(createTipoIncidenciaDto);
			const tipoIncidenciaGuardado = await this.tipoIncidenciaRepository.save(tipoIncidencia);
			return {
				success: true,
				message: 'Tipo de incidencia creado exitosamente.',
				data: tipoIncidenciaGuardado
			};
		} catch (error) {
			return {
				success: false,
				message: 'Error al crear el tipo de incidencia',
				data: null,
				error: {
					message: 'Error al crear el tipo de incidencia: ' + error.message,
					statusCode: 400
				}
			};
		}
	}

	async findAll(): Promise<BaseResponseDto<TipoIncidencia[]>> {
		try {
			const tiposIncidencia = await this.tipoIncidenciaRepository.find();
			return {
				success: true,
				message: tiposIncidencia.length > 0
					? 'Tipos de incidencia obtenidos exitosamente.'
					: 'No se encontraron tipos de incidencia.',
				data: tiposIncidencia
			};
		} catch (error) {
			return {
				success: false,
				message: 'Error al obtener tipos de incidencia',
				data: [],
				error: {
					message: 'Error al obtener tipos de incidencia: ' + error.message,
					statusCode: 400
				}
			};
		}
	}

	async findOne(id: string): Promise<BaseResponseDto<TipoIncidencia>> {
		if (!id) {
			return {
				success: false,
				message: 'ID no válido',
				data: null,
				error: {
					message: 'Ingrese un ID válido, Intente de Nuevo.',
					statusCode: 400
				}
			};
		}
		try {
			const tipoIncidencia = await this.tipoIncidenciaRepository.findOne({ where: { idTipoIncidencia: id } });
			if (!tipoIncidencia) {
				return {
					success: false,
					message: 'Tipo de incidencia no encontrado',
					data: null,
					error: {
						message: 'Tipo de incidencia no encontrado.',
						statusCode: 404
					}
				};
			}
			return {
				success: true,
				message: 'Tipo de incidencia obtenido exitosamente.',
				data: tipoIncidencia
			};
		} catch (error) {
			return {
				success: false,
				message: 'Error al obtener el tipo de incidencia',
				data: null,
				error: {
					message: 'Error al obtener el tipo de incidencia: ' + error.message,
					statusCode: 400
				}
			};
		}
	}

	async update(id: string, updateTipoIncidenciaDto: UpdateTipoIncidenciaDto): Promise<BaseResponseDto<TipoIncidencia>> {
		if (!id || !updateTipoIncidenciaDto) {
			return {
				success: false,
				message: 'Datos no válidos',
				data: null,
				error: {
					message: 'Ingrese datos válidos, Intente de Nuevo.',
					statusCode: 400
				}
			};
		}
		try {
			const tipoIncidencia = await this.tipoIncidenciaRepository.findOne({ where: { idTipoIncidencia: id } });
			if (!tipoIncidencia) {
				return {
					success: false,
					message: 'Tipo de incidencia no encontrado',
					data: null,
					error: {
						message: 'Tipo de incidencia no encontrado.',
						statusCode: 404
					}
				};
			}
			this.tipoIncidenciaRepository.merge(tipoIncidencia, updateTipoIncidenciaDto);
			const tipoIncidenciaActualizado = await this.tipoIncidenciaRepository.save(tipoIncidencia);
			return {
				success: true,
				message: 'Tipo de incidencia actualizado exitosamente.',
				data: tipoIncidenciaActualizado
			};
		} catch (error) {
			return {
				success: false,
				message: 'Error al actualizar el tipo de incidencia',
				data: null,
				error: {
					message: 'Error al actualizar el tipo de incidencia: ' + error.message,
					statusCode: 400
				}
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
					statusCode: 400
				}
			};
		}
		try {
			const tipoIncidencia = await this.tipoIncidenciaRepository.findOne({ where: { idTipoIncidencia: id } });
			if (!tipoIncidencia) {
				return {
					success: false,
					message: 'Tipo de incidencia no encontrado',
					data: undefined,
					error: {
						message: 'Tipo de incidencia no encontrado.',
						statusCode: 404
					}
				};
			}
			// Eliminación lógica: cambiar estaActivo a false
			tipoIncidencia.estaActivo = false;
			await this.tipoIncidenciaRepository.save(tipoIncidencia);
			return {
				success: true,
				message: 'Tipo de incidencia eliminado exitosamente.',
				data: undefined
			};
		} catch (error) {
			return {
				success: false,
				message: 'Error al eliminar el tipo de incidencia',
				data: undefined,
				error: {
					message: 'Error al eliminar el tipo de incidencia: ' + error.message,
					statusCode: 400
				}
			};
		}
	}

	async findByNombre(nombre: string): Promise<BaseResponseDto<TipoIncidencia>> {
		if (!nombre) {
			return {
				success: false,
				message: 'Nombre no válido',
				data: null,
				error: {
					message: 'Ingrese un nombre válido, Intente de Nuevo.',
					statusCode: 400
				}
			};
		}
		try {
			const tipoIncidencia = await this.tipoIncidenciaRepository.findOne({ where: { nombre } });
			if (!tipoIncidencia) {
				return {
					success: false,
					message: 'Tipo de incidencia no encontrado con ese nombre',
					data: null,
					error: {
						message: 'Tipo de incidencia no encontrado con ese nombre.',
						statusCode: 404
					}
				};
			}
			return {
				success: true,
				message: 'Tipo de incidencia encontrado exitosamente.',
				data: tipoIncidencia
			};
		} catch (error) {
			return {
				success: false,
				message: 'Error al buscar el tipo de incidencia por nombre',
				data: null,
				error: {
					message: 'Error al buscar el tipo de incidencia por nombre: ' + error.message,
					statusCode: 400
				}
			};
		}
	}
}
>>>>>>> 56ba60af9806ab17fa9dd2551616d39c4ecc114c

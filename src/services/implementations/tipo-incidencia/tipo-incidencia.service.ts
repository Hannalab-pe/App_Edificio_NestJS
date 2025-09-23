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

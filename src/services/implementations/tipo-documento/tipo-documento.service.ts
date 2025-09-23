import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoDocumento } from '../../../entities/TipoDocumento';
import { Documento } from '../../../entities/Documento';
import { BaseResponseDto } from '../../../dtos/baseResponse/baseResponse.dto';
import { ITipoDocumentoService } from '../../interfaces/tipo-documento.interface';
import { CreateTipoDocumentoDto, UpdateTipoDocumentoDto } from 'src/dtos';

@Injectable()
export class TipoDocumentoService implements ITipoDocumentoService {
    constructor(
        @InjectRepository(TipoDocumento)
        private readonly tipoDocumentoRepository: Repository<TipoDocumento>,
        @InjectRepository(Documento)
        private readonly documentoRepository: Repository<Documento>,
    ) { }

    async create(createTipoDocumentoDto: CreateTipoDocumentoDto): Promise<BaseResponseDto<TipoDocumento>> {
        try {
            // Verificar si ya existe un tipo de documento con el mismo nombre
            const existingTipoDocumento = await this.tipoDocumentoRepository.findOne({
                where: { tipoDocumento: createTipoDocumentoDto.tipoDocumento }
            });

            if (existingTipoDocumento) {
                throw new ConflictException('Ya existe un tipo de documento con ese nombre');
            }

            const tipoDocumento = this.tipoDocumentoRepository.create(createTipoDocumentoDto);
            const savedTipoDocumento = await this.tipoDocumentoRepository.save(tipoDocumento);

            const responseDto: any = {
                idTipoDocumento: savedTipoDocumento.idTipoDocumento,
                tipoDocumento: savedTipoDocumento.tipoDocumento,
                descripcion: savedTipoDocumento.descripcion,
            };

            return {
                success: true,
                message: 'Tipo de documento creado exitosamente',
                data: responseDto,
            };
        } catch (error) {
            if (error instanceof ConflictException) {
                throw error;
            }
            throw new Error(`Error al crear el tipo de documento: ${error.message}`);
        }
    }

    async findAll(): Promise<BaseResponseDto<TipoDocumento[]>> {
        try {
            const tiposDocumento = await this.tipoDocumentoRepository.find({
                order: { tipoDocumento: 'ASC' }
            });

            const responseDtos: any[] = tiposDocumento.map(tipo => ({
                idTipoDocumento: tipo.idTipoDocumento,
                tipoDocumento: tipo.tipoDocumento,
                descripcion: tipo.descripcion,
            }));

            return {
                success: true,
                message: 'Tipos de documento obtenidos exitosamente',
                data: responseDtos,
            };
        } catch (error) {
            throw new Error(`Error al obtener los tipos de documento: ${error.message}`);
        }
    }

    async findOne(id: string): Promise<BaseResponseDto<TipoDocumento>> {
        try {
            const tipoDocumento = await this.tipoDocumentoRepository.findOne({
                where: { idTipoDocumento: id }
            });

            if (!tipoDocumento) {
                throw new NotFoundException('Tipo de documento no encontrado');
            }

            const responseDto: any = {
                idTipoDocumento: tipoDocumento.idTipoDocumento,
                tipoDocumento: tipoDocumento.tipoDocumento,
                descripcion: tipoDocumento.descripcion,
            };

            return {
                success: true,
                message: 'Tipo de documento encontrado exitosamente',
                data: responseDto,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new Error(`Error al buscar el tipo de documento: ${error.message}`);
        }
    }

    async update(id: string, updateTipoDocumentoDto: UpdateTipoDocumentoDto): Promise<BaseResponseDto<TipoDocumento>> {
        try {
            const tipoDocumento = await this.tipoDocumentoRepository.findOne({
                where: { idTipoDocumento: id }
            });

            if (!tipoDocumento) {
                throw new NotFoundException('Tipo de documento no encontrado');
            }

            // Verificar si ya existe otro tipo de documento con el mismo nombre (si se está actualizando el nombre)
            if (updateTipoDocumentoDto.tipoDocumento && updateTipoDocumentoDto.tipoDocumento !== tipoDocumento.tipoDocumento) {
                const existingTipoDocumento = await this.tipoDocumentoRepository.findOne({
                    where: { tipoDocumento: updateTipoDocumentoDto.tipoDocumento }
                });

                if (existingTipoDocumento) {
                    throw new ConflictException('Ya existe otro tipo de documento con ese nombre');
                }
            }

            // Actualizar los campos
            Object.assign(tipoDocumento, updateTipoDocumentoDto);
            const updatedTipoDocumento = await this.tipoDocumentoRepository.save(tipoDocumento);

            const responseDto: any = {
                idTipoDocumento: updatedTipoDocumento.idTipoDocumento,
                tipoDocumento: updatedTipoDocumento.tipoDocumento,
                descripcion: updatedTipoDocumento.descripcion,
            };

            return {
                success: true,
                message: 'Tipo de documento actualizado exitosamente',
                data: responseDto,
            };
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof ConflictException) {
                throw error;
            }
            throw new Error(`Error al actualizar el tipo de documento: ${error.message}`);
        }
    }

    async remove(id: string): Promise<BaseResponseDto<void>> {
        try {
            const tipoDocumento = await this.tipoDocumentoRepository.findOne({
                where: { idTipoDocumento: id }
            });

            if (!tipoDocumento) {
                throw new NotFoundException('Tipo de documento no encontrado');
            }

            // Verificar si hay documentos asociados
            const documentosRelacionados = await this.documentoRepository.count({
                where: { idTipoDocumento: { idTipoDocumento: id } }
            });

            if (documentosRelacionados > 0) {
                throw new ConflictException('No se puede eliminar el tipo de documento porque tiene documentos asociados');
            }

            await this.tipoDocumentoRepository.remove(tipoDocumento);

            return {
                success: true,
                message: 'Tipo de documento eliminado exitosamente',
                data: undefined,
            };
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof ConflictException) {
                throw error;
            }
            throw new Error(`Error al eliminar el tipo de documento: ${error.message}`);
        }
    }

    async findByTipoDocumento(tipoDocumento: string): Promise<BaseResponseDto<TipoDocumento>> {
        try {
            const tipoDocumentoEntity = await this.tipoDocumentoRepository.findOne({
                where: { tipoDocumento: tipoDocumento }
            });

            if (!tipoDocumentoEntity) {
                throw new NotFoundException(`No se encontró un tipo de documento con el nombre: ${tipoDocumento}`);
            }

            const responseDto: any = {
                idTipoDocumento: tipoDocumentoEntity.idTipoDocumento,
                tipoDocumento: tipoDocumentoEntity.tipoDocumento,
                descripcion: tipoDocumentoEntity.descripcion,
            };

            return {
                success: true,
                message: 'Tipo de documento encontrado por nombre exitosamente',
                data: responseDto,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new Error(`Error al buscar el tipo de documento por nombre: ${error.message}`);
        }
    }
}

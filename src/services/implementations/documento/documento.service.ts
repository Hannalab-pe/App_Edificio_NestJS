import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Documento } from 'src/entities/Documento';
import { TipoDocumento } from 'src/entities/TipoDocumento';
import { Trabajador } from 'src/entities/Trabajador';
import { IDocumentoService } from 'src/services/interfaces/documento/documento.interface';
import { CreateDocumentoDto, UpdateDocumentoDto, DocumentoResponseDto } from 'src/dtos/index';
import { BaseResponseDto } from 'src/dtos/baseResponse/baseResponse.dto';

@Injectable()
export class DocumentoService implements IDocumentoService {
    constructor(
        @InjectRepository(Documento)
        private documentoRepository: Repository<Documento>,
        @InjectRepository(TipoDocumento)
        private tipoDocumentoRepository: Repository<TipoDocumento>,
        @InjectRepository(Trabajador)
        private trabajadorRepository: Repository<Trabajador>,
    ) { }

    async create(createDocumentoDto: CreateDocumentoDto): Promise<BaseResponseDto<DocumentoResponseDto>> {
        try {
            const tipoDocumento = await this.tipoDocumentoRepository.findOne({
                where: { idTipoDocumento: createDocumentoDto.idTipoDocumento }
            });

            if (!tipoDocumento) {
                return {
                    success: false,
                    message: 'Tipo de documento no encontrado',
                    data: null
                };
            }

            const trabajador = await this.trabajadorRepository.findOne({
                where: { idTrabajador: createDocumentoDto.idTrabajador }
            });

            if (!trabajador) {
                return {
                    success: false,
                    message: 'Trabajador no encontrado',
                    data: null
                };
            }

            const documento = this.documentoRepository.create({
                urlDocumento: createDocumentoDto.urlDocumento,
                descripcion: createDocumentoDto.descripcion,
                idTipoDocumento: tipoDocumento,
                idTrabajador: trabajador,
            });

            const documentoGuardado = await this.documentoRepository.save(documento);
            const documentoCompleto = await this.findOneEntity(documentoGuardado.idDocumento);

            return {
                success: true,
                message: 'Documento creado exitosamente',
                data: this.mapToResponseDto(documentoCompleto!)
            };
        } catch (error) {
            return {
                success: false,
                message: `Error al crear documento: ${error.message}`,
                data: null
            };
        }
    }

    async findAll(): Promise<BaseResponseDto<DocumentoResponseDto[]>> {
        try {
            const documentos = await this.documentoRepository.find({
                relations: ['idTipoDocumento', 'idTrabajador']
            });

            const documentosResponse = documentos.map(doc => this.mapToResponseDto(doc));

            return {
                success: true,
                message: 'Documentos obtenidos exitosamente',
                data: documentosResponse
            };
        } catch (error) {
            return {
                success: false,
                message: `Error al obtener documentos: ${error.message}`,
                data: []
            };
        }
    }

    async findOne(id: string): Promise<BaseResponseDto<DocumentoResponseDto>> {
        try {
            const documento = await this.findOneEntity(id);

            if (!documento) {
                return {
                    success: false,
                    message: 'Documento no encontrado',
                    data: null
                };
            }

            return {
                success: true,
                message: 'Documento obtenido exitosamente',
                data: this.mapToResponseDto(documento)
            };
        } catch (error) {
            return {
                success: false,
                message: `Error al obtener documento: ${error.message}`,
                data: null
            };
        }
    }

    async update(id: string, updateDocumentoDto: UpdateDocumentoDto): Promise<BaseResponseDto<DocumentoResponseDto>> {
        try {
            const documento = await this.documentoRepository.findOne({
                where: { idDocumento: id }
            });

            if (!documento) {
                return {
                    success: false,
                    message: 'Documento no encontrado',
                    data: null
                };
            }

            if (updateDocumentoDto.idTipoDocumento) {
                const tipoDocumento = await this.tipoDocumentoRepository.findOne({
                    where: { idTipoDocumento: updateDocumentoDto.idTipoDocumento }
                });

                if (!tipoDocumento) {
                    return {
                        success: false,
                        message: 'Tipo de documento no encontrado',
                        data: null
                    };
                }
            }

            if (updateDocumentoDto.idTrabajador) {
                const trabajador = await this.trabajadorRepository.findOne({
                    where: { idTrabajador: updateDocumentoDto.idTrabajador }
                });

                if (!trabajador) {
                    return {
                        success: false,
                        message: 'Trabajador no encontrado',
                        data: null
                    };
                }
            }

            const updateData: any = {};

            if (updateDocumentoDto.urlDocumento) {
                updateData.urlDocumento = updateDocumentoDto.urlDocumento;
            }

            if (updateDocumentoDto.descripcion) {
                updateData.descripcion = updateDocumentoDto.descripcion;
            }

            if (updateDocumentoDto.idTipoDocumento) {
                updateData.idTipoDocumento = { idTipoDocumento: updateDocumentoDto.idTipoDocumento };
            }

            if (updateDocumentoDto.idTrabajador) {
                updateData.idTrabajador = { idTrabajador: updateDocumentoDto.idTrabajador };
            }

            await this.documentoRepository.update(id, updateData);

            const documentoActualizado = await this.findOneEntity(id);

            return {
                success: true,
                message: 'Documento actualizado exitosamente',
                data: this.mapToResponseDto(documentoActualizado!)
            };
        } catch (error) {
            return {
                success: false,
                message: `Error al actualizar documento: ${error.message}`,
                data: null
            };
        }
    }

    async remove(id: string): Promise<BaseResponseDto<void>> {
        try {
            const documento = await this.documentoRepository.findOne({
                where: { idDocumento: id }
            });

            if (!documento) {
                return {
                    success: false,
                    message: 'Documento no encontrado',
                    data: null
                };
            }

            await this.documentoRepository.remove(documento);

            return {
                success: true,
                message: 'Documento eliminado exitosamente',
                data: null
            };
        } catch (error) {
            return {
                success: false,
                message: `Error al eliminar documento: ${error.message}`,
                data: null
            };
        }
    }

    async findByTipoDocumento(idTipoDocumento: string): Promise<BaseResponseDto<DocumentoResponseDto[]>> {
        try {
            const documentos = await this.documentoRepository.find({
                where: { idTipoDocumento: { idTipoDocumento } },
                relations: ['idTipoDocumento', 'idTrabajador']
            });

            const documentosResponse = documentos.map(doc => this.mapToResponseDto(doc));

            return {
                success: true,
                message: 'Documentos por tipo obtenidos exitosamente',
                data: documentosResponse
            };
        } catch (error) {
            return {
                success: false,
                message: `Error al obtener documentos por tipo: ${error.message}`,
                data: []
            };
        }
    }

    async findByTrabajador(idTrabajador: string): Promise<BaseResponseDto<DocumentoResponseDto[]>> {
        try {
            const documentos = await this.documentoRepository.find({
                where: { idTrabajador: { idTrabajador } },
                relations: ['idTipoDocumento', 'idTrabajador']
            });

            const documentosResponse = documentos.map(doc => this.mapToResponseDto(doc));

            return {
                success: true,
                message: 'Documentos por trabajador obtenidos exitosamente',
                data: documentosResponse
            };
        } catch (error) {
            return {
                success: false,
                message: `Error al obtener documentos por trabajador: ${error.message}`,
                data: []
            };
        }
    }

    async findByDescripcion(descripcion: string): Promise<BaseResponseDto<DocumentoResponseDto[]>> {
        try {
            const documentos = await this.documentoRepository
                .createQueryBuilder('documento')
                .leftJoinAndSelect('documento.idTipoDocumento', 'tipoDocumento')
                .leftJoinAndSelect('documento.idTrabajador', 'trabajador')
                .where('documento.descripcion ILIKE :descripcion', { descripcion: `%${descripcion}%` })
                .getMany();

            const documentosResponse = documentos.map(doc => this.mapToResponseDto(doc));

            return {
                success: true,
                message: 'Documentos encontrados por descripción',
                data: documentosResponse
            };
        } catch (error) {
            return {
                success: false,
                message: `Error al buscar documentos: ${error.message}`,
                data: []
            };
        }
    }

    private async findOneEntity(id: string): Promise<Documento | null> {
        return await this.documentoRepository.findOne({
            where: { idDocumento: id },
            relations: ['idTipoDocumento', 'idTrabajador']
        });
    }

    private mapToResponseDto(documento: Documento): DocumentoResponseDto {
        return {
            idDocumento: documento.idDocumento,
            urlDocumento: documento.urlDocumento,
            descripcion: documento.descripcion,
            tipoDocumento: documento.idTipoDocumento ? {
                idTipoDocumento: documento.idTipoDocumento.idTipoDocumento,
                tipoDocumento: documento.idTipoDocumento.tipoDocumento,
                descripcion: documento.idTipoDocumento.descripcion,
            } : undefined,
            trabajador: documento.idTrabajador ? {
                idTrabajador: documento.idTrabajador.idTrabajador,
                nombreCompleto: `${documento.idTrabajador.nombre} ${documento.idTrabajador.apellido}`,
                correo: documento.idTrabajador.correo,
            } : undefined,
        };
    }
}

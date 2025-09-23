import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDocumentoIdentidadDto, UpdateDocumentoIdentidadDto } from '../../../dtos';
import { BaseResponseDto } from '../../../dtos/baseResponse/baseResponse.dto';
import { DocumentoIdentidad } from '../../../entities/DocumentoIdentidad';
import { IDocumentoIdentidadService } from '../../interfaces/documento-identidad.interface';
import { Repository } from 'typeorm';

@Injectable()
export class DocumentoIdentidadService implements IDocumentoIdentidadService {

    constructor(
        @InjectRepository(DocumentoIdentidad)
        private readonly documentoIdentidadRepository: Repository<DocumentoIdentidad>,
    ) { }

    async create(createDocumentoIdentidadDto: CreateDocumentoIdentidadDto): Promise<BaseResponseDto<DocumentoIdentidad>> {
        if (!createDocumentoIdentidadDto) {
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
            // Verificar si ya existe un documento con ese número
            const existingDocument = await this.documentoIdentidadRepository.findOne({
                where: { numero: createDocumentoIdentidadDto.numero }
            });

            if (existingDocument) {
                return {
                    success: false,
                    message: 'Documento con ese número ya existe',
                    data: null,
                    error: {
                        message: 'Ya existe un documento de identidad con ese número.',
                        statusCode: 409
                    }
                };
            }

            const documentoIdentidad = this.documentoIdentidadRepository.create(createDocumentoIdentidadDto);
            const documentoIdentidadGuardado = await this.documentoIdentidadRepository.save(documentoIdentidad);
            return {
                success: true,
                message: 'Documento de identidad creado exitosamente.',
                data: documentoIdentidadGuardado
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al crear el documento de identidad',
                data: null,
                error: {
                    message: 'Error al crear el documento de identidad: ' + error.message,
                    statusCode: 400
                }
            };
        }
    }

    async findAll(): Promise<BaseResponseDto<DocumentoIdentidad[]>> {
        try {
            const documentosIdentidad = await this.documentoIdentidadRepository.find();
            return {
                success: true,
                message: documentosIdentidad.length > 0
                    ? 'Documentos de identidad obtenidos exitosamente.'
                    : 'No se encontraron documentos de identidad.',
                data: documentosIdentidad
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al obtener documentos de identidad',
                data: [],
                error: {
                    message: 'Error al obtener documentos de identidad: ' + error.message,
                    statusCode: 400
                }
            };
        }
    }

    async findOne(id: string): Promise<BaseResponseDto<DocumentoIdentidad>> {
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
            const documentoIdentidad = await this.documentoIdentidadRepository.findOne({
                where: { idDocumentoIdentidad: id }
            });

            if (!documentoIdentidad) {
                return {
                    success: false,
                    message: 'Documento de identidad no encontrado',
                    data: null,
                    error: {
                        message: 'Documento de identidad no encontrado.',
                        statusCode: 404
                    }
                };
            }

            return {
                success: true,
                message: 'Documento de identidad obtenido exitosamente.',
                data: documentoIdentidad
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al obtener el documento de identidad',
                data: null,
                error: {
                    message: 'Error al obtener el documento de identidad: ' + error.message,
                    statusCode: 400
                }
            };
        }
    }

    async update(id: string, updateDocumentoIdentidadDto: UpdateDocumentoIdentidadDto): Promise<BaseResponseDto<DocumentoIdentidad>> {
        if (!id || !updateDocumentoIdentidadDto) {
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
            const documentoIdentidad = await this.documentoIdentidadRepository.findOne({
                where: { idDocumentoIdentidad: id }
            });

            if (!documentoIdentidad) {
                return {
                    success: false,
                    message: 'Documento de identidad no encontrado',
                    data: null,
                    error: {
                        message: 'Documento de identidad no encontrado.',
                        statusCode: 404
                    }
                };
            }

            // Verificar si el nuevo número ya existe (si se está actualizando el número)
            if (updateDocumentoIdentidadDto.numero && updateDocumentoIdentidadDto.numero !== documentoIdentidad.numero) {
                const existingDocument = await this.documentoIdentidadRepository.findOne({
                    where: { numero: updateDocumentoIdentidadDto.numero }
                });

                if (existingDocument) {
                    return {
                        success: false,
                        message: 'Documento con ese número ya existe',
                        data: null,
                        error: {
                            message: 'Ya existe un documento de identidad con ese número.',
                            statusCode: 409
                        }
                    };
                }
            }

            this.documentoIdentidadRepository.merge(documentoIdentidad, updateDocumentoIdentidadDto);
            const documentoIdentidadActualizado = await this.documentoIdentidadRepository.save(documentoIdentidad);

            return {
                success: true,
                message: 'Documento de identidad actualizado exitosamente.',
                data: documentoIdentidadActualizado
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al actualizar el documento de identidad',
                data: null,
                error: {
                    message: 'Error al actualizar el documento de identidad: ' + error.message,
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
            const documentoIdentidad = await this.documentoIdentidadRepository.findOne({
                where: { idDocumentoIdentidad: id }
            });

            if (!documentoIdentidad) {
                return {
                    success: false,
                    message: 'Documento de identidad no encontrado',
                    data: undefined,
                    error: {
                        message: 'Documento de identidad no encontrado.',
                        statusCode: 404
                    }
                };
            }

            await this.documentoIdentidadRepository.remove(documentoIdentidad);

            return {
                success: true,
                message: 'Documento de identidad eliminado exitosamente.',
                data: undefined
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al eliminar el documento de identidad',
                data: undefined,
                error: {
                    message: 'Error al eliminar el documento de identidad: ' + error.message,
                    statusCode: 400
                }
            };
        }
    }

    async findByTipo(tipo: string): Promise<BaseResponseDto<DocumentoIdentidad[]>> {
        if (!tipo) {
            return {
                success: false,
                message: 'Tipo no válido',
                data: [],
                error: {
                    message: 'Ingrese un tipo válido, Intente de Nuevo.',
                    statusCode: 400
                }
            };
        }

        try {
            const documentosIdentidad = await this.documentoIdentidadRepository.find({
                where: { tipoDocumento: tipo }
            });

            return {
                success: true,
                message: documentosIdentidad.length > 0
                    ? `Documentos de identidad de tipo ${tipo} encontrados exitosamente.`
                    : `No se encontraron documentos de identidad de tipo ${tipo}.`,
                data: documentosIdentidad
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al buscar documentos de identidad por tipo',
                data: [],
                error: {
                    message: 'Error al buscar documentos de identidad por tipo: ' + error.message,
                    statusCode: 400
                }
            };
        }
    }

    async findByNumero(numero: number): Promise<BaseResponseDto<DocumentoIdentidad>> {
        if (!numero) {
            return {
                success: false,
                message: 'Número no válido',
                data: null,
                error: {
                    message: 'Ingrese un número válido, Intente de Nuevo.',
                    statusCode: 400
                }
            };
        }

        try {
            const documentoIdentidad = await this.documentoIdentidadRepository.findOne({
                where: { numero: numero }
            });

            if (!documentoIdentidad) {
                return {
                    success: false,
                    message: 'Documento de identidad no encontrado con ese número',
                    data: null,
                    error: {
                        message: 'Documento de identidad no encontrado con ese número.',
                        statusCode: 404
                    }
                };
            }

            return {
                success: true,
                message: 'Documento de identidad encontrado exitosamente.',
                data: documentoIdentidad
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al buscar el documento de identidad por número',
                data: null,
                error: {
                    message: 'Error al buscar el documento de identidad por número: ' + error.message,
                    statusCode: 400
                }
            };
        }
    }
}

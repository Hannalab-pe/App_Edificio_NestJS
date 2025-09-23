import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateConceptoPagoDto, UpdateConceptoPagoDto } from 'src/dtos';
import { BaseResponseDto } from 'src/dtos/baseResponse/baseResponse.dto';
import { ConceptoPago } from 'src/entities/ConceptoPago';
import { IConceptoPagoService } from 'src/services/interfaces';
import { Repository } from 'typeorm';

@Injectable()
export class ConceptoPagoService implements IConceptoPagoService {

    constructor(@InjectRepository(ConceptoPago) private readonly conceptoPagoRepository: Repository<ConceptoPago>) { }

    async create(createConceptoPagoDto: CreateConceptoPagoDto): Promise<BaseResponseDto<ConceptoPago>> {
        if (!createConceptoPagoDto) {
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
            const conceptoPago = this.conceptoPagoRepository.create(createConceptoPagoDto);
            const conceptoPagoGuardado = await this.conceptoPagoRepository.save(conceptoPago);
            return {
                success: true,
                message: 'Concepto de pago creado exitosamente.',
                data: conceptoPagoGuardado
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al crear el concepto de pago',
                data: null,
                error: {
                    message: 'Error al crear el concepto de pago: ' + error.message,
                    statusCode: 400
                }
            };
        }
    }

    async findAll(): Promise<BaseResponseDto<ConceptoPago[]>> {
        try {
            const conceptosPago = await this.conceptoPagoRepository.find();
            return {
                success: true,
                message: conceptosPago.length > 0
                    ? 'Conceptos de pago obtenidos exitosamente.'
                    : 'No se encontraron conceptos de pago.',
                data: conceptosPago
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al obtener conceptos de pago',
                data: [],
                error: {
                    message: 'Error al obtener conceptos de pago: ' + error.message,
                    statusCode: 400
                }
            };
        }
    }
    async findOne(id: string): Promise<BaseResponseDto<ConceptoPago>> {
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
            const conceptoPago = await this.conceptoPagoRepository.findOne({ where: { idConceptoPago: id } });
            if (!conceptoPago) {
                return {
                    success: false,
                    message: 'Concepto de pago no encontrado',
                    data: null,
                    error: {
                        message: 'Concepto de pago no encontrado.',
                        statusCode: 404
                    }
                };
            }
            return {
                success: true,
                message: 'Concepto de pago obtenido exitosamente.',
                data: conceptoPago
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al obtener el concepto de pago',
                data: null,
                error: {
                    message: 'Error al obtener el concepto de pago: ' + error.message,
                    statusCode: 400
                }
            };
        }
    }
    async update(id: string, updateConceptoPagoDto: UpdateConceptoPagoDto): Promise<BaseResponseDto<ConceptoPago>> {
        if (!id || !updateConceptoPagoDto) {
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
            const conceptoPago = await this.conceptoPagoRepository.findOne({ where: { idConceptoPago: id } });
            if (!conceptoPago) {
                return {
                    success: false,
                    message: 'Concepto de pago no encontrado',
                    data: null,
                    error: {
                        message: 'Concepto de pago no encontrado.',
                        statusCode: 404
                    }
                };
            }

            const updateData: any = { ...updateConceptoPagoDto };
            this.conceptoPagoRepository.merge(conceptoPago, updateData);
            const conceptoPagoActualizado = await this.conceptoPagoRepository.save(conceptoPago);
            return {
                success: true,
                message: 'Concepto de pago actualizado exitosamente.',
                data: conceptoPagoActualizado
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al actualizar el concepto de pago',
                data: null,
                error: {
                    message: 'Error al actualizar el concepto de pago: ' + error.message,
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
            const conceptoPago = await this.conceptoPagoRepository.findOne({ where: { idConceptoPago: id } });
            if (!conceptoPago) {
                return {
                    success: false,
                    message: 'Concepto de pago no encontrado',
                    data: undefined,
                    error: {
                        message: 'Concepto de pago no encontrado.',
                        statusCode: 404
                    }
                };
            }

            // Eliminación lógica: cambiar estaActivo a false
            conceptoPago.estaActivo = false;
            await this.conceptoPagoRepository.save(conceptoPago);

            return {
                success: true,
                message: 'Concepto de pago eliminado exitosamente.',
                data: undefined
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al eliminar el concepto de pago',
                data: undefined,
                error: {
                    message: 'Error al eliminar el concepto de pago: ' + error.message,
                    statusCode: 400
                }
            };
        }
    }

    async findByNombre(nombre: string): Promise<BaseResponseDto<ConceptoPago>> {
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
            const conceptoPago = await this.conceptoPagoRepository.findOne({ where: { nombre } });
            if (!conceptoPago) {
                return {
                    success: false,
                    message: 'Concepto de pago no encontrado con ese nombre',
                    data: null,
                    error: {
                        message: 'Concepto de pago no encontrado con ese nombre.',
                        statusCode: 404
                    }
                };
            }
            return {
                success: true,
                message: 'Concepto de pago encontrado exitosamente.',
                data: conceptoPago
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al buscar el concepto de pago por nombre',
                data: null,
                error: {
                    message: 'Error al buscar el concepto de pago por nombre: ' + error.message,
                    statusCode: 400
                }
            };
        }
    }
    async findByTipo(tipo: string): Promise<BaseResponseDto<ConceptoPago[]>> {
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
            const conceptosPago = await this.conceptoPagoRepository.find({ where: { frecuencia: tipo } });
            return {
                success: true,
                message: conceptosPago.length > 0
                    ? 'Conceptos de pago encontrados exitosamente.'
                    : 'No se encontraron conceptos de pago con ese tipo.',
                data: conceptosPago
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al buscar conceptos de pago por tipo',
                data: [],
                error: {
                    message: 'Error al buscar conceptos de pago por tipo: ' + error.message,
                    statusCode: 400
                }
            };
        }
    }

}

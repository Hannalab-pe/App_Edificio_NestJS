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
            throw new BadRequestException('Ingrese datos válidos, Intente de Nuevo.');
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
            const exception = new BadRequestException('Error al crear el concepto de pago: ' + error.message);
            return {
                success: false,
                message: 'Error al crear el concepto de pago',
                data: null,
                error: exception
            }
        }
    }

    async findAll(): Promise<BaseResponseDto<ConceptoPago[]>> {
        try {
            const conceptosPago = await this.conceptoPagoRepository.find();
            if (conceptosPago.length === 0) {
                throw new BadRequestException('No se encontraron conceptos de pago.');
            }
            return {
                success: true,
                message: 'Conceptos de pago obtenidos exitosamente.',
                data: conceptosPago
            };
        } catch (error) {
            const exception = new BadRequestException('Error al obtener conceptos de pago: ' + error.message);
            return {
                success: false,
                message: 'Error al obtener conceptos de pago',
                data: [],
                error: exception
            }
        }
    }
    async findOne(id: string): Promise<BaseResponseDto<ConceptoPago>> {
        if (!id) {
            throw new BadRequestException('Ingrese un ID válido, Intente de Nuevo.');
        }

        try {
            const conceptoPago = await this.conceptoPagoRepository.findOne({ where: { idConceptoPago: id } });
            if (!conceptoPago) {
                throw new BadRequestException('Concepto de pago no encontrado.');
            }
            return {
                success: true,
                message: 'Concepto de pago obtenido exitosamente.',
                data: conceptoPago
            };
        } catch (error) {
            const exception = new BadRequestException('Error al obtener el concepto de pago: ' + error.message);
            return {
                success: false,
                message: 'Error al obtener el concepto de pago',
                data: null,
                error: exception
            }
        }
    }
    async update(id: string, updateConceptoPagoDto: UpdateConceptoPagoDto): Promise<BaseResponseDto<ConceptoPago>> {
        if (!id || !updateConceptoPagoDto) {
            throw new BadRequestException('Ingrese datos válidos, Intente de Nuevo.');
        }

        try {
            const conceptoPago = await this.conceptoPagoRepository.findOne({ where: { idConceptoPago: id } });
            if (!conceptoPago) {
                throw new BadRequestException('Concepto de pago no encontrado.');
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
            const exception = new BadRequestException('Error al actualizar el concepto de pago: ' + error.message);
            return {
                success: false,
                message: 'Error al actualizar el concepto de pago',
                data: null,
                error: exception
            }
        }
    }

    async remove(id: string): Promise<BaseResponseDto<void>> {
        if (!id) {
            throw new BadRequestException('Ingrese un ID válido, Intente de Nuevo.');
        }

        try {
            const conceptoPago = await this.conceptoPagoRepository.findOne({ where: { idConceptoPago: id } });
            if (!conceptoPago) {
                throw new BadRequestException('Concepto de pago no encontrado.');
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
            const exception = new BadRequestException('Error al eliminar el concepto de pago: ' + error.message);
            return {
                success: false,
                message: 'Error al eliminar el concepto de pago',
                data: undefined,
                error: exception
            }
        }
    }

    async findByNombre(nombre: string): Promise<BaseResponseDto<ConceptoPago>> {
        if (!nombre) {
            throw new BadRequestException('Ingrese un nombre válido, Intente de Nuevo.');
        }

        try {
            const conceptoPago = await this.conceptoPagoRepository.findOne({ where: { nombre } });
            if (!conceptoPago) {
                throw new BadRequestException('Concepto de pago no encontrado con ese nombre.');
            }
            return {
                success: true,
                message: 'Concepto de pago encontrado exitosamente.',
                data: conceptoPago
            };
        } catch (error) {
            const exception = new BadRequestException('Error al buscar el concepto de pago por nombre: ' + error.message);
            return {
                success: false,
                message: 'Error al buscar el concepto de pago por nombre',
                data: null,
                error: exception
            }
        }
    }
    async findByTipo(tipo: string): Promise<BaseResponseDto<ConceptoPago[]>> {
        if (!tipo) {
            throw new BadRequestException('Ingrese un tipo válido, Intente de Nuevo.');
        }

        try {
            const conceptosPago = await this.conceptoPagoRepository.find({ where: { frecuencia: tipo } });
            if (conceptosPago.length === 0) {
                throw new BadRequestException('No se encontraron conceptos de pago con ese tipo.');
            }
            return {
                success: true,
                message: 'Conceptos de pago encontrados exitosamente.',
                data: conceptosPago
            };
        } catch (error) {
            const exception = new BadRequestException('Error al buscar conceptos de pago por tipo: ' + error.message);
            return {
                success: false,
                message: 'Error al buscar conceptos de pago por tipo',
                data: [],
                error: exception
            }
        }
    }

}

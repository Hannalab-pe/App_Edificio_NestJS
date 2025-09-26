import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pago } from '../../../entities/Pago';
import { ConceptoPago } from '../../../entities/ConceptoPago';
import { Residencia } from '../../../entities/Residencia';
import { ArrendamientoEspacio } from '../../../entities/ArrendamientoEspacio';
import { IPagoService } from '../../interfaces/pago.interface';
import {
  CreatePagoDto,
  UpdatePagoDto,
  PagoResponseDto,
  CreatePagoResponseDto,
  GetPagoResponseDto,
  GetPagosResponseDto,
  UpdatePagoResponseDto,
  DeletePagoResponseDto,
} from '../../../dtos';
import { BaseResponseDto } from '../../../dtos/baseResponse/baseResponse.dto';
import { EstadoPago } from '../../../Enums/globales.enum';

@Injectable()
export class PagoService implements IPagoService {
  constructor(
    @InjectRepository(Pago)
    private readonly pagoRepository: Repository<Pago>,
    @InjectRepository(ConceptoPago)
    private readonly conceptoPagoRepository: Repository<ConceptoPago>,
    @InjectRepository(Residencia)
    private readonly residenciaRepository: Repository<Residencia>,
    @InjectRepository(ArrendamientoEspacio)
    private readonly arrendamientoRepository: Repository<ArrendamientoEspacio>,
  ) {}

  private mapToResponseDto(pago: Pago): PagoResponseDto {
    return {
      idPago: pago.idPago,
      monto: pago.monto,
      fechaVencimiento: pago.fechaVencimiento,
      fechaPago: pago.fechaPago,
      estado: pago.estado as EstadoPago,
      descripcion: pago.descripcion,
      comprobanteUrl: pago.comprobanteUrl,
      metodoPago: pago.metodoPago as any,
      referenciaPago: pago.referenciaPago,
      idResidencia: pago.idResidencia?.idResidencia,
      idArrendamiento: pago.idArrendamiento?.idArrendamiento,
      idConceptoPago: pago.idConceptoPago?.idConceptoPago,
      conceptoPago: pago.idConceptoPago ? {
        idConceptoPago: pago.idConceptoPago.idConceptoPago,
        nombre: pago.idConceptoPago.nombre,
        descripcion: pago.idConceptoPago.descripcion || undefined,
        monto: pago.idConceptoPago.montoBase,
      } : undefined,
      residencia: pago.idResidencia ? {
        idResidencia: pago.idResidencia.idResidencia,
        numero: pago.idResidencia.tipoOcupacion,
        piso: pago.idResidencia.estado,
      } : undefined,
      arrendamiento: pago.idArrendamiento ? {
        idArrendamiento: pago.idArrendamiento.idArrendamiento,
        fechaInicio: pago.idArrendamiento.fechaInicio,
        fechaFin: pago.idArrendamiento.fechaFin || '',
      } : undefined,
    };
  }

  async create(createPagoDto: CreatePagoDto): Promise<CreatePagoResponseDto> {
    try {
      // Validar que el concepto de pago existe
      const conceptoPago = await this.conceptoPagoRepository.findOne({
        where: { idConceptoPago: createPagoDto.idConceptoPago },
      });

      if (!conceptoPago) {
        return BaseResponseDto.error(
          'El concepto de pago especificado no existe',
          404,
          'CONCEPT_NOT_FOUND',
        );
      }

      // Validar residencia si se proporciona
      if (createPagoDto.idResidencia) {
        const residencia = await this.residenciaRepository.findOne({
          where: { idResidencia: createPagoDto.idResidencia },
        });

        if (!residencia) {
          return BaseResponseDto.error(
            'La residencia especificada no existe',
            404,
            'RESIDENCIA_NOT_FOUND',
          );
        }
      }

      // Validar arrendamiento si se proporciona
      if (createPagoDto.idArrendamiento) {
        const arrendamiento = await this.arrendamientoRepository.findOne({
          where: { idArrendamiento: createPagoDto.idArrendamiento },
        });

        if (!arrendamiento) {
          return BaseResponseDto.error(
            'El arrendamiento especificado no existe',
            404,
            'ARRENDAMIENTO_NOT_FOUND',
          );
        }
      }

      // Crear el pago
      const pago = this.pagoRepository.create({
        monto: createPagoDto.monto,
        fechaVencimiento: createPagoDto.fechaVencimiento,
        estado: createPagoDto.estado,
        descripcion: createPagoDto.descripcion,
        metodoPago: createPagoDto.metodoPago,
        referenciaPago: createPagoDto.referenciaPago,
        comprobanteUrl: createPagoDto.comprobanteUrl,
        idConceptoPago: { idConceptoPago: createPagoDto.idConceptoPago } as ConceptoPago,
        idResidencia: createPagoDto.idResidencia 
          ? { idResidencia: createPagoDto.idResidencia } as Residencia 
          : undefined,
        idArrendamiento: createPagoDto.idArrendamiento 
          ? { idArrendamiento: createPagoDto.idArrendamiento } as ArrendamientoEspacio 
          : undefined,
      });

      const savedPago = await this.pagoRepository.save(pago);

      // Obtener el pago completo con relaciones
      const fullPago = await this.pagoRepository.findOne({
        where: { idPago: savedPago.idPago },
        relations: ['idConceptoPago', 'idResidencia', 'idArrendamiento'],
      });

      return BaseResponseDto.success(
        this.mapToResponseDto(fullPago!),
        'Pago creado exitosamente',
      );
    } catch (error) {
      return BaseResponseDto.error(
        'Error interno del servidor al crear el pago',
        500,
        'INTERNAL_SERVER_ERROR',
      );
    }
  }

  async findAll(): Promise<GetPagosResponseDto> {
    try {
      const pagos = await this.pagoRepository.find({
        relations: ['idConceptoPago', 'idResidencia', 'idArrendamiento'],
        order: { fechaVencimiento: 'DESC' },
      });

      const pagosMapped = pagos.map(pago => this.mapToResponseDto(pago));

      return BaseResponseDto.success(
        pagosMapped,
        `Se encontraron ${pagosMapped.length} pagos`,
      );
    } catch (error) {
      return BaseResponseDto.error(
        'Error interno del servidor al obtener los pagos',
        500,
        'INTERNAL_SERVER_ERROR',
      );
    }
  }

  async findOne(id: string): Promise<GetPagoResponseDto> {
    try {
      const pago = await this.pagoRepository.findOne({
        where: { idPago: id },
        relations: ['idConceptoPago', 'idResidencia', 'idArrendamiento'],
      });

      if (!pago) {
        return BaseResponseDto.error(
          `Pago con ID ${id} no encontrado`,
          404,
          'PAGO_NOT_FOUND',
        );
      }

      return BaseResponseDto.success(
        this.mapToResponseDto(pago),
        'Pago encontrado exitosamente',
      );
    } catch (error) {
      return BaseResponseDto.error(
        'Error interno del servidor al obtener el pago',
        500,
        'INTERNAL_SERVER_ERROR',
      );
    }
  }

  async update(id: string, updatePagoDto: UpdatePagoDto): Promise<UpdatePagoResponseDto> {
    try {
      const pago = await this.pagoRepository.findOne({
        where: { idPago: id },
        relations: ['idConceptoPago', 'idResidencia', 'idArrendamiento'],
      });

      if (!pago) {
        return BaseResponseDto.error(
          `Pago con ID ${id} no encontrado`,
          404,
          'PAGO_NOT_FOUND',
        );
      }

      // Validar concepto de pago si se actualiza
      if (updatePagoDto.idConceptoPago) {
        const conceptoPago = await this.conceptoPagoRepository.findOne({
          where: { idConceptoPago: updatePagoDto.idConceptoPago },
        });

        if (!conceptoPago) {
          return BaseResponseDto.error(
            'El concepto de pago especificado no existe',
            404,
            'CONCEPT_NOT_FOUND',
          );
        }
      }

      // Validar residencia si se actualiza
      if (updatePagoDto.idResidencia) {
        const residencia = await this.residenciaRepository.findOne({
          where: { idResidencia: updatePagoDto.idResidencia },
        });

        if (!residencia) {
          return BaseResponseDto.error(
            'La residencia especificada no existe',
            404,
            'RESIDENCIA_NOT_FOUND',
          );
        }
      }

      // Validar arrendamiento si se actualiza
      if (updatePagoDto.idArrendamiento) {
        const arrendamiento = await this.arrendamientoRepository.findOne({
          where: { idArrendamiento: updatePagoDto.idArrendamiento },
        });

        if (!arrendamiento) {
          return BaseResponseDto.error(
            'El arrendamiento especificado no existe',
            404,
            'ARRENDAMIENTO_NOT_FOUND',
          );
        }
      }

      // Actualizar campos
      if (updatePagoDto.monto !== undefined) pago.monto = updatePagoDto.monto;
      if (updatePagoDto.fechaVencimiento) pago.fechaVencimiento = updatePagoDto.fechaVencimiento;
      if (updatePagoDto.fechaPago !== undefined) pago.fechaPago = updatePagoDto.fechaPago;
      if (updatePagoDto.estado) pago.estado = updatePagoDto.estado;
      if (updatePagoDto.descripcion !== undefined) pago.descripcion = updatePagoDto.descripcion;
      if (updatePagoDto.metodoPago !== undefined) pago.metodoPago = updatePagoDto.metodoPago;
      if (updatePagoDto.referenciaPago !== undefined) pago.referenciaPago = updatePagoDto.referenciaPago;
      if (updatePagoDto.comprobanteUrl !== undefined) pago.comprobanteUrl = updatePagoDto.comprobanteUrl;
      
      if (updatePagoDto.idConceptoPago) {
        pago.idConceptoPago = { idConceptoPago: updatePagoDto.idConceptoPago } as ConceptoPago;
      }
      
      if (updatePagoDto.idResidencia) {
        pago.idResidencia = { idResidencia: updatePagoDto.idResidencia } as Residencia;
      }
      
      if (updatePagoDto.idArrendamiento) {
        pago.idArrendamiento = { idArrendamiento: updatePagoDto.idArrendamiento } as ArrendamientoEspacio;
      }

      const savedPago = await this.pagoRepository.save(pago);

      // Obtener el pago actualizado con relaciones
      const fullPago = await this.pagoRepository.findOne({
        where: { idPago: savedPago.idPago },
        relations: ['idConceptoPago', 'idResidencia', 'idArrendamiento'],
      });

      return BaseResponseDto.success(
        this.mapToResponseDto(fullPago!),
        'Pago actualizado exitosamente',
      );
    } catch (error) {
      return BaseResponseDto.error(
        'Error interno del servidor al actualizar el pago',
        500,
        'INTERNAL_SERVER_ERROR',
      );
    }
  }

  async remove(id: string): Promise<DeletePagoResponseDto> {
    try {
      const pago = await this.pagoRepository.findOne({
        where: { idPago: id },
        relations: ['movimientoCajas', 'recibos'],
      });

      if (!pago) {
        return BaseResponseDto.error(
          `Pago con ID ${id} no encontrado`,
          404,
          'PAGO_NOT_FOUND',
        );
      }

      // Verificar si tiene movimientos de caja o recibos asociados
      if (pago.movimientoCajas && pago.movimientoCajas.length > 0) {
        return BaseResponseDto.error(
          'No se puede eliminar el pago porque tiene movimientos de caja asociados',
          400,
          'HAS_MOVEMENTS',
        );
      }

      if (pago.recibos && pago.recibos.length > 0) {
        return BaseResponseDto.error(
          'No se puede eliminar el pago porque tiene recibos asociados',
          400,
          'HAS_RECEIPTS',
        );
      }

      await this.pagoRepository.remove(pago);

      return BaseResponseDto.success(
        { idPago: id, mensaje: 'Pago eliminado exitosamente' },
        'Pago eliminado exitosamente',
      );
    } catch (error) {
      return BaseResponseDto.error(
        'Error interno del servidor al eliminar el pago',
        500,
        'INTERNAL_SERVER_ERROR',
      );
    }
  }

  async findByEstado(estado: string): Promise<GetPagosResponseDto> {
    try {
      const pagos = await this.pagoRepository.find({
        where: { estado },
        relations: ['idConceptoPago', 'idResidencia', 'idArrendamiento'],
        order: { fechaVencimiento: 'ASC' },
      });

      const pagosMapped = pagos.map(pago => this.mapToResponseDto(pago));

      return BaseResponseDto.success(
        pagosMapped,
        `Se encontraron ${pagosMapped.length} pagos con estado ${estado}`,
      );
    } catch (error) {
      return BaseResponseDto.error(
        'Error interno del servidor al obtener pagos por estado',
        500,
        'INTERNAL_SERVER_ERROR',
      );
    }
  }

  async findByResidencia(residenciaId: string): Promise<GetPagosResponseDto> {
    try {
      const pagos = await this.pagoRepository
        .createQueryBuilder('pago')
        .leftJoinAndSelect('pago.idConceptoPago', 'conceptoPago')
        .leftJoinAndSelect('pago.idResidencia', 'residencia')
        .leftJoinAndSelect('pago.idArrendamiento', 'arrendamiento')
        .where('pago.idResidencia = :residenciaId', { residenciaId })
        .orderBy('pago.fechaVencimiento', 'DESC')
        .getMany();

      const pagosMapped = pagos.map(pago => this.mapToResponseDto(pago));

      return BaseResponseDto.success(
        pagosMapped,
        `Se encontraron ${pagosMapped.length} pagos para la residencia`,
      );
    } catch (error) {
      return BaseResponseDto.error(
        'Error interno del servidor al obtener pagos por residencia',
        500,
        'INTERNAL_SERVER_ERROR',
      );
    }
  }

  async findByArrendamiento(arrendamientoId: string): Promise<GetPagosResponseDto> {
    try {
      const pagos = await this.pagoRepository
        .createQueryBuilder('pago')
        .leftJoinAndSelect('pago.idConceptoPago', 'conceptoPago')
        .leftJoinAndSelect('pago.idResidencia', 'residencia')
        .leftJoinAndSelect('pago.idArrendamiento', 'arrendamiento')
        .where('pago.idArrendamiento = :arrendamientoId', { arrendamientoId })
        .orderBy('pago.fechaVencimiento', 'DESC')
        .getMany();

      const pagosMapped = pagos.map(pago => this.mapToResponseDto(pago));

      return BaseResponseDto.success(
        pagosMapped,
        `Se encontraron ${pagosMapped.length} pagos para el arrendamiento`,
      );
    } catch (error) {
      return BaseResponseDto.error(
        'Error interno del servidor al obtener pagos por arrendamiento',
        500,
        'INTERNAL_SERVER_ERROR',
      );
    }
  }

  async findByConcepto(conceptoId: string): Promise<GetPagosResponseDto> {
    try {
      const pagos = await this.pagoRepository
        .createQueryBuilder('pago')
        .leftJoinAndSelect('pago.idConceptoPago', 'conceptoPago')
        .leftJoinAndSelect('pago.idResidencia', 'residencia')
        .leftJoinAndSelect('pago.idArrendamiento', 'arrendamiento')
        .where('pago.idConceptoPago = :conceptoId', { conceptoId })
        .orderBy('pago.fechaVencimiento', 'DESC')
        .getMany();

      const pagosMapped = pagos.map(pago => this.mapToResponseDto(pago));

      return BaseResponseDto.success(
        pagosMapped,
        `Se encontraron ${pagosMapped.length} pagos para el concepto`,
      );
    } catch (error) {
      return BaseResponseDto.error(
        'Error interno del servidor al obtener pagos por concepto',
        500,
        'INTERNAL_SERVER_ERROR',
      );
    }
  }

  async findVencidos(): Promise<GetPagosResponseDto> {
    try {
      const hoy = new Date().toISOString().split('T')[0];
      
      const pagos = await this.pagoRepository
        .createQueryBuilder('pago')
        .leftJoinAndSelect('pago.idConceptoPago', 'conceptoPago')
        .leftJoinAndSelect('pago.idResidencia', 'residencia')
        .leftJoinAndSelect('pago.idArrendamiento', 'arrendamiento')
        .where('pago.fechaVencimiento < :hoy', { hoy })
        .andWhere('pago.estado != :pagado', { pagado: EstadoPago.PAGADO })
        .orderBy('pago.fechaVencimiento', 'ASC')
        .getMany();

      const pagosMapped = pagos.map(pago => this.mapToResponseDto(pago));

      return BaseResponseDto.success(
        pagosMapped,
        `Se encontraron ${pagosMapped.length} pagos vencidos`,
      );
    } catch (error) {
      return BaseResponseDto.error(
        'Error interno del servidor al obtener pagos vencidos',
        500,
        'INTERNAL_SERVER_ERROR',
      );
    }
  }

  async findPendientes(): Promise<GetPagosResponseDto> {
    try {
      const pagos = await this.pagoRepository.find({
        where: { estado: EstadoPago.PENDIENTE },
        relations: ['idConceptoPago', 'idResidencia', 'idArrendamiento'],
        order: { fechaVencimiento: 'ASC' },
      });

      const pagosMapped = pagos.map(pago => this.mapToResponseDto(pago));

      return BaseResponseDto.success(
        pagosMapped,
        `Se encontraron ${pagosMapped.length} pagos pendientes`,
      );
    } catch (error) {
      return BaseResponseDto.error(
        'Error interno del servidor al obtener pagos pendientes',
        500,
        'INTERNAL_SERVER_ERROR',
      );
    }
  }
}
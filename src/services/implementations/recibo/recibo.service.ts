import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Recibo } from '../../../entities/Recibo';
import { Pago } from '../../../entities/Pago';
import {
  CreateReciboDto,
  UpdateReciboDto,
  ReciboResponseDto,
} from '../../../dtos';
import { BaseResponseDto } from 'src/dtos/baseResponse/baseResponse.dto';

@Injectable()
export class ReciboService {
  constructor(
    @InjectRepository(Recibo)
    private readonly reciboRepository: Repository<Recibo>,
    @InjectRepository(Pago)
    private readonly pagoRepository: Repository<Pago>,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    createReciboDto: CreateReciboDto,
  ): Promise<BaseResponseDto<ReciboResponseDto>> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Verificar que el pago existe
      const pago = await queryRunner.manager.findOne(Pago, {
        where: { idPago: createReciboDto.idPago },
      });

      if (!pago) {
        await queryRunner.rollbackTransaction();
        return BaseResponseDto.error(
          'El pago especificado no existe',
          HttpStatus.NOT_FOUND,
        );
      }

      // Verificar que el número de recibo no existe
      const existingRecibo = await queryRunner.manager.findOne(Recibo, {
        where: { numeroRecibo: createReciboDto.numeroRecibo },
      });

      if (existingRecibo) {
        await queryRunner.rollbackTransaction();
        return BaseResponseDto.error(
          'Ya existe un recibo con este número',
          HttpStatus.CONFLICT,
        );
      }

      // Crear el recibo
      const recibo = queryRunner.manager.create(Recibo, {
        numeroRecibo: createReciboDto.numeroRecibo,
        archivoPdfUrl: createReciboDto.archivoPdfUrl || null,
        idPago: pago,
      });

      const savedRecibo = await queryRunner.manager.save(recibo);
      await queryRunner.commitTransaction();

      const responseData: ReciboResponseDto = {
        idRecibo: savedRecibo.idRecibo,
        numeroRecibo: savedRecibo.numeroRecibo,
        archivoPdfUrl: savedRecibo.archivoPdfUrl,
        idPago: {
          idPago: pago.idPago,
          monto: pago.monto,
          fechaPago: pago.fechaPago,
          estado: pago.estado,
        },
      };

      return BaseResponseDto.success(
        responseData,
        'Recibo creado exitosamente',
        HttpStatus.CREATED,
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return BaseResponseDto.error(
        `Error al crear el recibo: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<BaseResponseDto<ReciboResponseDto[]>> {
    try {
      const recibos = await this.reciboRepository.find({
        relations: ['idPago'],
      });

      const responseData: ReciboResponseDto[] = recibos.map((recibo) => ({
        idRecibo: recibo.idRecibo,
        numeroRecibo: recibo.numeroRecibo,
        archivoPdfUrl: recibo.archivoPdfUrl,
        idPago: recibo.idPago
          ? {
              idPago: recibo.idPago.idPago,
              monto: recibo.idPago.monto,
              fechaPago: recibo.idPago.fechaPago,
              estado: recibo.idPago.estado,
            }
          : undefined,
      }));

      return BaseResponseDto.success(
        responseData,
        `Se encontraron ${recibos.length} recibos`,
        HttpStatus.OK,
      );
    } catch (error) {
      return BaseResponseDto.error(
        `Error al obtener los recibos: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string): Promise<BaseResponseDto<ReciboResponseDto>> {
    try {
      const recibo = await this.reciboRepository.findOne({
        where: { idRecibo: id },
        relations: ['idPago'],
      });

      if (!recibo) {
        return BaseResponseDto.error(
          'Recibo no encontrado',
          HttpStatus.NOT_FOUND,
        );
      }

      const responseData: ReciboResponseDto = {
        idRecibo: recibo.idRecibo,
        numeroRecibo: recibo.numeroRecibo,
        archivoPdfUrl: recibo.archivoPdfUrl,
        idPago: recibo.idPago
          ? {
              idPago: recibo.idPago.idPago,
              monto: recibo.idPago.monto,
              fechaPago: recibo.idPago.fechaPago,
              estado: recibo.idPago.estado,
            }
          : undefined,
      };

      return BaseResponseDto.success(
        responseData,
        'Recibo encontrado exitosamente',
        HttpStatus.OK,
      );
    } catch (error) {
      return BaseResponseDto.error(
        `Error al buscar el recibo: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: string,
    updateReciboDto: UpdateReciboDto,
  ): Promise<BaseResponseDto<ReciboResponseDto>> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const recibo = await queryRunner.manager.findOne(Recibo, {
        where: { idRecibo: id },
        relations: ['idPago'],
      });

      if (!recibo) {
        await queryRunner.rollbackTransaction();
        return BaseResponseDto.error(
          'Recibo no encontrado',
          HttpStatus.NOT_FOUND,
        );
      }

      // Verificar número único si se está actualizando
      if (
        updateReciboDto.numeroRecibo &&
        updateReciboDto.numeroRecibo !== recibo.numeroRecibo
      ) {
        const existingRecibo = await queryRunner.manager.findOne(Recibo, {
          where: { numeroRecibo: updateReciboDto.numeroRecibo },
        });

        if (existingRecibo) {
          await queryRunner.rollbackTransaction();
          return BaseResponseDto.error(
            'Ya existe otro recibo con este número',
            HttpStatus.CONFLICT,
          );
        }
      }

      // Verificar pago si se está actualizando
      let pago = recibo.idPago;
      if (updateReciboDto.idPago) {
        const foundPago = await queryRunner.manager.findOne(Pago, {
          where: { idPago: updateReciboDto.idPago },
        });

        if (!foundPago) {
          await queryRunner.rollbackTransaction();
          return BaseResponseDto.error(
            'El pago especificado no existe',
            HttpStatus.NOT_FOUND,
          );
        }
        pago = foundPago;
      }

      // Actualizar campos
      if (updateReciboDto.numeroRecibo !== undefined) {
        recibo.numeroRecibo = updateReciboDto.numeroRecibo;
      }
      if (updateReciboDto.archivoPdfUrl !== undefined) {
        recibo.archivoPdfUrl = updateReciboDto.archivoPdfUrl;
      }
      if (updateReciboDto.idPago !== undefined) {
        recibo.idPago = pago;
      }

      const updatedRecibo = await queryRunner.manager.save(recibo);
      await queryRunner.commitTransaction();

      const responseData: ReciboResponseDto = {
        idRecibo: updatedRecibo.idRecibo,
        numeroRecibo: updatedRecibo.numeroRecibo,
        archivoPdfUrl: updatedRecibo.archivoPdfUrl,
        idPago: pago
          ? {
              idPago: pago.idPago,
              monto: pago.monto,
              fechaPago: pago.fechaPago,
              estado: pago.estado,
            }
          : undefined,
      };

      return BaseResponseDto.success(
        responseData,
        'Recibo actualizado exitosamente',
        HttpStatus.OK,
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return BaseResponseDto.error(
        `Error al actualizar el recibo: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string): Promise<BaseResponseDto<ReciboResponseDto>> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const recibo = await queryRunner.manager.findOne(Recibo, {
        where: { idRecibo: id },
        relations: ['idPago'],
      });

      if (!recibo) {
        await queryRunner.rollbackTransaction();
        return BaseResponseDto.error(
          'Recibo no encontrado',
          HttpStatus.NOT_FOUND,
        );
      }

      const responseData: ReciboResponseDto = {
        idRecibo: recibo.idRecibo,
        numeroRecibo: recibo.numeroRecibo,
        archivoPdfUrl: recibo.archivoPdfUrl,
        idPago: recibo.idPago
          ? {
              idPago: recibo.idPago.idPago,
              monto: recibo.idPago.monto,
              fechaPago: recibo.idPago.fechaPago,
              estado: recibo.idPago.estado,
            }
          : undefined,
      };

      await queryRunner.manager.remove(recibo);
      await queryRunner.commitTransaction();

      return BaseResponseDto.success(
        responseData,
        'Recibo eliminado exitosamente',
        HttpStatus.OK,
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return BaseResponseDto.error(
        `Error al eliminar el recibo: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async findByNumeroRecibo(
    numeroRecibo: string,
  ): Promise<BaseResponseDto<ReciboResponseDto>> {
    try {
      const recibo = await this.reciboRepository.findOne({
        where: { numeroRecibo },
        relations: ['idPago'],
      });

      if (!recibo) {
        return BaseResponseDto.error(
          'Recibo no encontrado con ese número',
          HttpStatus.NOT_FOUND,
        );
      }

      const responseData: ReciboResponseDto = {
        idRecibo: recibo.idRecibo,
        numeroRecibo: recibo.numeroRecibo,
        archivoPdfUrl: recibo.archivoPdfUrl,
        idPago: recibo.idPago
          ? {
              idPago: recibo.idPago.idPago,
              monto: recibo.idPago.monto,
              fechaPago: recibo.idPago.fechaPago,
              estado: recibo.idPago.estado,
            }
          : undefined,
      };

      return BaseResponseDto.success(
        responseData,
        'Recibo encontrado por número exitosamente',
        HttpStatus.OK,
      );
    } catch (error) {
      return BaseResponseDto.error(
        `Error al buscar el recibo por número: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByPago(
    pagoId: string,
  ): Promise<BaseResponseDto<ReciboResponseDto[]>> {
    try {
      const recibos = await this.reciboRepository
        .createQueryBuilder('recibo')
        .leftJoinAndSelect('recibo.idPago', 'pago')
        .where('pago.idPago = :pagoId', { pagoId })
        .getMany();

      const responseData: ReciboResponseDto[] = recibos.map((recibo) => ({
        idRecibo: recibo.idRecibo,
        numeroRecibo: recibo.numeroRecibo,
        archivoPdfUrl: recibo.archivoPdfUrl,
        idPago: recibo.idPago
          ? {
              idPago: recibo.idPago.idPago,
              monto: recibo.idPago.monto,
              fechaPago: recibo.idPago.fechaPago,
              estado: recibo.idPago.estado,
            }
          : undefined,
      }));

      return BaseResponseDto.success(
        responseData,
        `Se encontraron ${recibos.length} recibos para el pago`,
        HttpStatus.OK,
      );
    } catch (error) {
      return BaseResponseDto.error(
        `Error al buscar recibos por pago: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

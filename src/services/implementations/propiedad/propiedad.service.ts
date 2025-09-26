import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Propiedad } from '../../../entities/Propiedad';
import { CreatePropiedadDto, UpdatePropiedadDto } from '../../../dtos';
import { BaseResponseDto } from '../../../dtos/baseResponse/baseResponse.dto';
import { IPropiedadService } from '../../interfaces/propiedad.interface';

@Injectable()
export class PropiedadService implements IPropiedadService {
  constructor(
    @InjectRepository(Propiedad)
    private readonly propiedadRepository: Repository<Propiedad>,
  ) { }

  async create(
    createPropiedadDto: CreatePropiedadDto,
  ): Promise<BaseResponseDto<Propiedad>> {
    try {
      // Verificar si ya existe una propiedad con el mismo número de departamento
      const propiedadExistente = await this.propiedadRepository.findOne({
        where: {
          numeroDepartamento: createPropiedadDto.numeroDepartamento,
          estaActivo: true,
        },
      });

      if (propiedadExistente) {
        return {
          success: false,
          message: 'Ya existe una propiedad con este número de departamento',
          data: null,
          error: { message: 'Número de departamento duplicado' },
        };
      }

      const nuevaPropiedad = this.propiedadRepository.create({
        ...createPropiedadDto,
        estaActivo: createPropiedadDto.estaActivo ?? true,
      });

      const propiedadGuardada =
        await this.propiedadRepository.save(nuevaPropiedad);

      return {
        success: true,
        message: 'Propiedad creada exitosamente',
        data: propiedadGuardada,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al crear la propiedad',
        data: null,
        error: { message: error.message },
      };
    }
  }

  async findAll(): Promise<BaseResponseDto<Propiedad[]>> {
    try {
      const propiedades = await this.propiedadRepository.find({
        where: { estaActivo: true },
        order: { numeroDepartamento: 'ASC' },
      });

      return {
        success: true,
        message:
          propiedades.length > 0
            ? 'Propiedades encontradas'
            : 'No se encontraron propiedades',
        data: propiedades,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al obtener las propiedades',
        data: [],
        error: { message: error.message },
      };
    }
  }

  async findOne(id: string): Promise<BaseResponseDto<Propiedad>> {
    try {
      const propiedad = await this.propiedadRepository.findOne({
        where: {
          idPropiedad: id,
          estaActivo: true,
        },
      });

      if (!propiedad) {
        return {
          success: false,
          message: 'Propiedad no encontrada',
          data: null,
          error: { message: 'No existe una propiedad con el ID proporcionado' },
        };
      }

      return {
        success: true,
        message: 'Propiedad encontrada',
        data: propiedad,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al buscar la propiedad',
        data: null,
        error: { message: error.message },
      };
    }
  }

  async update(
    id: string,
    updatePropiedadDto: UpdatePropiedadDto,
  ): Promise<BaseResponseDto<Propiedad>> {
    try {
      const propiedad = await this.propiedadRepository.findOne({
        where: {
          idPropiedad: id,
          estaActivo: true,
        },
      });

      if (!propiedad) {
        return {
          success: false,
          message: 'Propiedad no encontrada',
          data: null,
          error: { message: 'No existe una propiedad con el ID proporcionado' },
        };
      }

      // Verificar si se está cambiando el número de departamento y ya existe otro con ese número
      if (
        updatePropiedadDto.numeroDepartamento &&
        updatePropiedadDto.numeroDepartamento !== propiedad.numeroDepartamento
      ) {
        const propiedadExistente = await this.propiedadRepository.findOne({
          where: {
            numeroDepartamento: updatePropiedadDto.numeroDepartamento,
            estaActivo: true,
          },
        });

        if (propiedadExistente) {
          return {
            success: false,
            message: 'Ya existe una propiedad con este número de departamento',
            data: null,
            error: { message: 'Número de departamento duplicado' },
          };
        }
      }

      const datosActualizacion = {
        ...updatePropiedadDto,
      };

      const propiedadActualizada = await this.propiedadRepository.save({
        ...propiedad,
        ...datosActualizacion,
      });

      return {
        success: true,
        message: 'Propiedad actualizada exitosamente',
        data: propiedadActualizada,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al actualizar la propiedad',
        data: null,
        error: { message: error.message },
      };
    }
  }

  async remove(id: string): Promise<BaseResponseDto<undefined>> {
    try {
      const propiedad = await this.propiedadRepository.findOne({
        where: {
          idPropiedad: id,
          estaActivo: true,
        },
      });

      if (!propiedad) {
        return {
          success: false,
          message: 'Propiedad no encontrada',
          data: undefined,
          error: { message: 'No existe una propiedad con el ID proporcionado' },
        };
      }

      // Eliminación lógica
      await this.propiedadRepository.save({
        ...propiedad,
        estaActivo: false,
      });

      return {
        success: true,
        message: 'Propiedad eliminada exitosamente',
        data: undefined,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al eliminar la propiedad',
        data: undefined,
        error: { message: error.message },
      };
    }
  }

  async findByTipoPropiedad(
    tipoPropiedad: string,
  ): Promise<BaseResponseDto<Propiedad[]>> {
    try {
      const propiedades = await this.propiedadRepository.find({
        where: {
          tipoPropiedad: tipoPropiedad,
          estaActivo: true,
        },
        order: { numeroDepartamento: 'ASC' },
      });

      return {
        success: true,
        message:
          propiedades.length > 0
            ? `Propiedades de tipo ${tipoPropiedad} encontradas`
            : `No se encontraron propiedades de tipo ${tipoPropiedad}`,
        data: propiedades,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al buscar propiedades por tipo',
        data: [],
        error: { message: error.message },
      };
    }
  }

  async findByPiso(piso: number): Promise<BaseResponseDto<Propiedad[]>> {
    try {
      const propiedades = await this.propiedadRepository.find({
        where: {
          piso: piso,
          estaActivo: true,
        },
        order: { numeroDepartamento: 'ASC' },
      });

      return {
        success: true,
        message:
          propiedades.length > 0
            ? `Propiedades del piso ${piso} encontradas`
            : `No se encontraron propiedades en el piso ${piso}`,
        data: propiedades,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al buscar propiedades por piso',
        data: [],
        error: { message: error.message },
      };
    }
  }

  async findByEstadoOcupacion(
    estadoOcupacion: string,
  ): Promise<BaseResponseDto<Propiedad[]>> {
    try {
      const propiedades = await this.propiedadRepository.find({
        where: {
          estadoOcupacion: estadoOcupacion,
          estaActivo: true,
        },
        order: { numeroDepartamento: 'ASC' },
      });

      return {
        success: true,
        message:
          propiedades.length > 0
            ? `Propiedades con estado ${estadoOcupacion} encontradas`
            : `No se encontraron propiedades con estado ${estadoOcupacion}`,
        data: propiedades,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al buscar propiedades por estado de ocupación',
        data: [],
        error: { message: error.message },
      };
    }
  }

  async findByNumeroDepartamento(
    numeroDepartamento: string,
  ): Promise<BaseResponseDto<Propiedad>> {
    try {
      const propiedad = await this.propiedadRepository.findOne({
        where: {
          numeroDepartamento: numeroDepartamento,
          estaActivo: true,
        },
      });

      if (!propiedad) {
        return {
          success: false,
          message: 'Propiedad no encontrada',
          data: null,
          error: {
            message: `No existe una propiedad con el número ${numeroDepartamento}`,
          },
        };
      }

      return {
        success: true,
        message: 'Propiedad encontrada',
        data: propiedad,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al buscar la propiedad por número de departamento',
        data: null,
        error: { message: error.message },
      };
    }
  }
}

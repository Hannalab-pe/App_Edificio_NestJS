import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CreatePropietarioDto, UpdatePropietarioDto } from 'src/dtos';
import { Propietario } from 'src/entities/Propietario';
import { IPropietarioService } from 'src/services/interfaces';
import { BaseResponseDto } from 'src/dtos/baseResponse/baseResponse.dto';
import { DocumentoIdentidadService } from '../documento-identidad/documento-identidad.service';
import { UsuarioService } from '../usuario/usuario.service';
@Injectable()
export class PropietarioService implements IPropietarioService {
  constructor(
    @InjectRepository(Propietario)
    private readonly propietarioRepository: Repository<Propietario>,
    private readonly documentoIdentidadService: DocumentoIdentidadService,
    private readonly usuarioService: UsuarioService,
    private readonly dataSource: DataSource,
  ) {}

  async createPropietario(
    data: CreatePropietarioDto | any,
  ): Promise<BaseResponseDto<Propietario & { usuario?: any }>> {
    try {
      // Solo acepta datos anidados sin usuario, crea usuario automáticamente en backend
      if (data.documentoIdentidad) {
        return this.createPropietarioConDatosAnidados(data);
      }
      return {
        success: false,
        message: 'Formato de datos inválido',
        data: null,
        error: { message: 'Se requiere datos de documentoIdentidad' },
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al crear el propietario',
        data: null,
        error: { message: error.message },
      };
    }
  }

  private async createPropietarioConDatosAnidados(
    propietarioData: any,
  ): Promise<BaseResponseDto<Propietario & { usuario: any }>> {
    // Verificar si ya existe un propietario con el mismo correo
    const propietarioExistente = await this.propietarioRepository.findOne({
      where: { correo: propietarioData.correo },
    });

    if (propietarioExistente) {
      return {
        success: false,
        message: 'Ya existe un propietario con este correo',
        data: null,
        error: { message: 'Correo duplicado' },
      };
    }

    // Validar y crear documento de identidad si no existe
    let documentoIdentidad;
    try {
      const existingDoc = await this.documentoIdentidadService.findByNumero(
        propietarioData.documentoIdentidad.numeroDocumento,
      );
      documentoIdentidad = existingDoc;
    } catch (error) {
      // No existe, crear nuevo
      documentoIdentidad = await this.documentoIdentidadService.create({
        numero: propietarioData.documentoIdentidad.numeroDocumento,
        tipoDocumento: propietarioData.documentoIdentidad.tipoDocumento,
      });
    }

    // Crear usuario automáticamente
    const nuevoUsuario = await this.usuarioService.create({
      correo: propietarioData.correo, // Usar el mismo correo del propietario
      contrasena: propietarioData.documentoIdentidad.numeroDocumento, // Contraseña inicial con DNI
      idRol: '5fd55b1a-8fd0-41ff-bbe2-ae413fb7f32c', // Rol de PROPIETARIO
    });

    const nuevoPropietario = this.propietarioRepository.create({
      nombre: propietarioData.nombre,
      apellido: propietarioData.apellido,
      correo: propietarioData.correo,
      telefono: propietarioData.telefono,
      direccion: propietarioData.direccion,
      idDocumentoIdentidad: documentoIdentidad,
      idUsuario: nuevoUsuario,
      estaActivo: true,
    });

    const propietarioGuardado =
      await this.propietarioRepository.save(nuevoPropietario);

    return {
      success: true,
      message: 'Propietario creado exitosamente con usuario automático',
      data: {
        ...propietarioGuardado,
        usuario: {
          idUsuario: nuevoUsuario.idUsuario,
          correo: nuevoUsuario.correo,
        },
      },
      error: null,
    };
  }
  async findAll(): Promise<BaseResponseDto<Propietario[]>> {
    try {
      const propietarios = await this.propietarioRepository.find({
        relations: ['idDocumentoIdentidad', 'idUsuario'],
        order: { fechaRegistro: 'DESC' },
      });

      return BaseResponseDto.success(
        propietarios,
        'Propietarios recuperados exitosamente',
      );
    } catch (error) {
      return BaseResponseDto.error(
        `Error al recuperar los propietarios: ${error.message}`,
      );
    }
  }

  async findOne(id: string): Promise<BaseResponseDto<Propietario>> {
    try {
      const propietario = await this.propietarioRepository.findOne({
        where: { idPropietario: id },
        relations: [
          'idDocumentoIdentidad',
          'idUsuario',
          'propiedadPropietarios',
        ],
      });

      if (!propietario) {
        return BaseResponseDto.error('Propietario no encontrado', 404);
      }

      return BaseResponseDto.success(
        propietario,
        'Propietario encontrado exitosamente',
      );
    } catch (error) {
      return BaseResponseDto.error(
        `Error al buscar el propietario: ${error.message}`,
      );
    }
  }

  async update(
    id: string,
    updatePropietarioDto: UpdatePropietarioDto,
  ): Promise<BaseResponseDto<Propietario>> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const propietarioExistente = await queryRunner.manager.findOne(
        Propietario,
        {
          where: { idPropietario: id },
          relations: ['idDocumentoIdentidad', 'idUsuario'],
        },
      );

      if (!propietarioExistente) {
        await queryRunner.rollbackTransaction();
        return BaseResponseDto.error('Propietario no encontrado', 404);
      }

      // Verificar si el correo ya está en uso por otro propietario
      if (
        updatePropietarioDto.correo &&
        updatePropietarioDto.correo !== propietarioExistente.correo
      ) {
        const correoExistente = await queryRunner.manager.findOne(Propietario, {
          where: { correo: updatePropietarioDto.correo },
        });

        if (correoExistente) {
          await queryRunner.rollbackTransaction();
          return BaseResponseDto.error(
            'El correo ya está registrado por otro propietario',
            409,
          );
        }
      }

      // Actualizar campos del propietario
      Object.assign(propietarioExistente, updatePropietarioDto);

      const propietarioActualizado = await queryRunner.manager.save(
        Propietario,
        propietarioExistente,
      );

      await queryRunner.commitTransaction();

      return BaseResponseDto.success(
        propietarioActualizado,
        'Propietario actualizado exitosamente',
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return BaseResponseDto.error(
        `Error al actualizar el propietario: ${error.message}`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string): Promise<BaseResponseDto<void>> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const propietario = await queryRunner.manager.findOne(Propietario, {
        where: { idPropietario: id },
        relations: ['propiedadPropietarios'],
      });

      if (!propietario) {
        await queryRunner.rollbackTransaction();
        return BaseResponseDto.error('Propietario no encontrado', 404);
      }

      // Verificar si tiene propiedades asociadas
      if (
        propietario.propiedadPropietarios &&
        propietario.propiedadPropietarios.length > 0
      ) {
        await queryRunner.rollbackTransaction();
        return BaseResponseDto.error(
          'No se puede eliminar el propietario porque tiene propiedades asociadas',
          409,
        );
      }

      await queryRunner.manager.remove(Propietario, propietario);
      await queryRunner.commitTransaction();

      return BaseResponseDto.success(
        null,
        'Propietario eliminado exitosamente',
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return BaseResponseDto.error(
        `Error al eliminar el propietario: ${error.message}`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async findByNumeroDocumento(
    numeroDocumento: string,
  ): Promise<BaseResponseDto<Propietario>> {
    try {
      const propietario = await this.propietarioRepository
        .createQueryBuilder('propietario')
        .leftJoinAndSelect('propietario.idDocumentoIdentidad', 'documento')
        .leftJoinAndSelect('propietario.idUsuario', 'usuario')
        .where('documento.numero = :numeroDocumento', { numeroDocumento })
        .getOne();

      if (!propietario) {
        return BaseResponseDto.error(
          'Propietario no encontrado con ese número de documento',
          404,
        );
      }

      return BaseResponseDto.success(
        propietario,
        'Propietario encontrado por número de documento',
      );
    } catch (error) {
      return BaseResponseDto.error(
        `Error al buscar propietario por documento: ${error.message}`,
      );
    }
  }

  async findWithPropiedades(id: string): Promise<BaseResponseDto<Propietario>> {
    try {
      const propietario = await this.propietarioRepository.findOne({
        where: { idPropietario: id },
        relations: [
          'idDocumentoIdentidad',
          'idUsuario',
          'propiedadPropietarios',
          'propiedadPropietarios.idPropiedad',
        ],
      });

      if (!propietario) {
        return BaseResponseDto.error('Propietario no encontrado', 404);
      }

      return BaseResponseDto.success(
        propietario,
        'Propietario con propiedades recuperado exitosamente',
      );
    } catch (error) {
      return BaseResponseDto.error(
        `Error al buscar propietario con propiedades: ${error.message}`,
      );
    }
  }

  async create(
    createPropietarioDto: CreatePropietarioDto,
  ): Promise<BaseResponseDto<Propietario>> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Verificar si ya existe un propietario con el mismo correo
      const propietarioExistente = await queryRunner.manager.findOne(
        Propietario,
        {
          where: { correo: createPropietarioDto.correo },
        },
      );

      if (propietarioExistente) {
        await queryRunner.rollbackTransaction();
        return BaseResponseDto.error(
          'Ya existe un propietario con este correo',
          409,
        );
      }

      const nuevoPropietario = queryRunner.manager.create(Propietario, {
        ...createPropietarioDto,
        idDocumentoIdentidad: {
          idDocumentoIdentidad: createPropietarioDto.idDocumentoIdentidad,
        } as any,
        idUsuario: { idUsuario: createPropietarioDto.idUsuario } as any,
        estaActivo: true,
      });

      const propietarioGuardado = await queryRunner.manager.save(
        Propietario,
        nuevoPropietario,
      );
      await queryRunner.commitTransaction();

      return BaseResponseDto.success(
        propietarioGuardado,
        'Propietario creado exitosamente',
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return BaseResponseDto.error(
        `Error al crear el propietario: ${error.message}`,
      );
    } finally {
      await queryRunner.release();
    }
  }
}

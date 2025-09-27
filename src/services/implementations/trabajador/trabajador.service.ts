import {
  Injectable,
  Inject,
  BadRequestException,
  ConflictException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ITrabajadorService } from '../../interfaces/trabajador.interface';
import { IAuthService } from '../../interfaces/auth.interface';
import { IRolService } from '../../interfaces/rol.interface';
import { IUsuarioService } from '../../interfaces/usuario.interface';
import { IDocumentoIdentidadService } from '../../interfaces/documento-identidad.interface';
import { Trabajador } from '../../../entities/Trabajador';
import { Usuario } from '../../../entities/Usuario';
import { DocumentoIdentidad } from '../../../entities/DocumentoIdentidad';
import {
  CreateTrabajadorDto,
  UpdateTrabajadorDto,
  TrabajadorRegisterResponseDto,
  TrabajadorResponseDto,
  TrabajadorSingleResponseDto,
  TrabajadorArrayResponseDto,
  CreateUsuarioDto,
} from '../../../dtos';
import { BaseResponseDto } from '../../../dtos/baseResponse/baseResponse.dto';

@Injectable()
export class TrabajadorService implements ITrabajadorService {
  private readonly logger = new Logger(TrabajadorService.name);

  constructor(
    @InjectRepository(Trabajador)
    private readonly trabajadorRepository: Repository<Trabajador>,
    @Inject('IAuthService')
    private readonly authService: IAuthService,
    @Inject('IRolService')
    private readonly rolService: IRolService,
    @Inject('IUsuarioService')
    private readonly usuarioService: IUsuarioService,
    @Inject('IDocumentoIdentidadService')
    private readonly documentoIdentidadService: IDocumentoIdentidadService,
    private readonly dataSource: DataSource,
  ) {}

  async create(createTrabajadorDto: any): Promise<Trabajador> {
    const trabajador = this.trabajadorRepository.create(createTrabajadorDto);
    const result = await this.trabajadorRepository.save(trabajador);
    return Array.isArray(result) ? result[0] : result;
  }

  /**
   * Registrar un nuevo trabajador con usuario y documento de identidad
   * Utiliza transacción para asegurar consistencia
   */
  async register(
    createTrabajadorDto: CreateTrabajadorDto,
  ): Promise<TrabajadorRegisterResponseDto> {
    // Validar que las contraseñas coincidan
    if (
      createTrabajadorDto.contrasena !== createTrabajadorDto.confirmarContrasena
    ) {
      throw new BadRequestException('Las contraseñas no coinciden');
    }

    // Verificar si el correo ya está registrado
    const emailExists = await this.usuarioService.emailExists(
      createTrabajadorDto.correo,
    );
    if (emailExists) {
      throw new ConflictException(
        'Ya existe un usuario con este correo electrónico',
      );
    }

    // Verificar si ya existe un documento con el mismo número
    try {
      await this.documentoIdentidadService.findByNumero(
        createTrabajadorDto.numeroDocumento.toString(),
      );
      throw new ConflictException(
        'Ya existe un documento de identidad con este número',
      );
    } catch (error) {
      // Si no existe, continuamos (esto es lo esperado)
      if (error instanceof ConflictException) {
        throw error;
      }
    }

    // Iniciar transacción
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Obtener rol de trabajador por defecto si no se especifica
      let rolId = createTrabajadorDto.idRol;
      if (!rolId) {
        try {
          const trabajadorRol =
            await this.rolService.findByNombre('Trabajador');
          rolId = trabajadorRol.idRol;
        } catch (error) {
          // Si no existe el rol Trabajador, usar el primer rol disponible
          const roles = await this.rolService.findAll();
          if (roles.length === 0) {
            throw new BadRequestException(
              'No hay roles disponibles en el sistema',
            );
          }
          rolId = roles[0].idRol;
        }
      }

      // 1. Crear el documento de identidad primero
      const documentoIdentidad = queryRunner.manager.create(
        DocumentoIdentidad,
        {
          tipoDocumento: createTrabajadorDto.tipoDocumento,
          numero: createTrabajadorDto.numeroDocumento,
        },
      );

      const nuevoDocumentoIdentidad = await queryRunner.manager.save(
        DocumentoIdentidad,
        documentoIdentidad,
      );

      // 2. Hashear la contraseña
      const hashedPassword = await this.authService.hashPassword(
        createTrabajadorDto.contrasena,
      );

      // 3. Crear el usuario
      const createUsuarioDto: CreateUsuarioDto = {
        correo: createTrabajadorDto.correo,
        contrasena: hashedPassword,
        idRol: rolId,
      };

      const usuario = queryRunner.manager.create(Usuario, {
        correo: createUsuarioDto.correo,
        contrasena: createUsuarioDto.contrasena,
        idRol: { idRol: createUsuarioDto.idRol } as any,
        estaActivo: true,
      });

      const nuevoUsuario = await queryRunner.manager.save(Usuario, usuario);

      // 4. Crear el trabajador con las referencias al usuario y documento de identidad
      const trabajadorData = {
        nombre: createTrabajadorDto.nombre,
        apellido: createTrabajadorDto.apellido,
        correo: createTrabajadorDto.correo,
        telefono: createTrabajadorDto.telefono,
        fechaNacimiento: createTrabajadorDto.fechaNacimiento,
        fechaIngreso: createTrabajadorDto.fechaIngreso,
        salarioActual: createTrabajadorDto.salarioActual,
        estaActivo: true,
        idUsuario: nuevoUsuario,
        idDocumentoIdentidad: nuevoDocumentoIdentidad,
      };

      const trabajador = queryRunner.manager.create(Trabajador, trabajadorData);
      const nuevoTrabajador = await queryRunner.manager.save(
        Trabajador,
        trabajador,
      );

      // Confirmar transacción
      await queryRunner.commitTransaction();

      // Generar JWT token para login automático
      const loginResult = await this.authService.login(nuevoUsuario);

      return {
        access_token: loginResult.access_token,
        trabajador: nuevoTrabajador,
        usuario: nuevoUsuario,
      };
    } catch (error) {
      // Revertir transacción en caso de error
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Liberar el queryRunner
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Trabajador[]> {
    return await this.trabajadorRepository.find({
      relations: ['idUsuario', 'idDocumentoIdentidad'],
    });
  }

  async findOne(id: string): Promise<Trabajador> {
    const trabajador = await this.trabajadorRepository.findOne({
      where: { idTrabajador: id },
      relations: ['idUsuario', 'idDocumentoIdentidad'],
    });

    if (!trabajador) {
      throw new BadRequestException(`Trabajador con ID ${id} no encontrado`);
    }

    return trabajador;
  }

  async update(id: string, updateTrabajadorDto: any): Promise<Trabajador> {
    await this.findOne(id);
    await this.trabajadorRepository.update(id, updateTrabajadorDto);
    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.trabajadorRepository.update(id, { estaActivo: false });
  }

  async findByNumeroDocumento(numeroDocumento: string): Promise<Trabajador> {
    const trabajador = await this.trabajadorRepository.findOne({
      where: { idDocumentoIdentidad: { numeroDocumento } as any },
      relations: ['idUsuario', 'idDocumentoIdentidad'],
    });

    if (!trabajador) {
      throw new BadRequestException(
        `Trabajador con número de documento ${numeroDocumento} no encontrado`,
      );
    }

    return trabajador;
  }

  async findByCargo(cargo: string): Promise<Trabajador[]> {
    // Esta funcionalidad podría implementarse cuando se agregue el campo cargo
    // Por ahora retornamos todos los trabajadores activos
    return await this.trabajadorRepository.find({
      where: { estaActivo: true },
      relations: ['idUsuario', 'idDocumentoIdentidad'],
    });
  }

  // ========== NUEVOS MÉTODOS CON BASE RESPONSE DTO ==========

  /**
   * Mapear entidad Trabajador a TrabajadorResponseDto
   */
  private mapToResponseDto(trabajador: Trabajador): TrabajadorResponseDto {
    return {
      idTrabajador: trabajador.idTrabajador,
      nombre: trabajador.nombre,
      apellido: trabajador.apellido,
      correo: trabajador.correo,
      estaActivo: trabajador.estaActivo,
      telefono: trabajador.telefono,
      fechaNacimiento: trabajador.fechaNacimiento,
      fechaIngreso: trabajador.fechaIngreso,
      salarioActual: trabajador.salarioActual,
      documentoIdentidad: trabajador.idDocumentoIdentidad
        ? {
            idDocumentoIdentidad:
              trabajador.idDocumentoIdentidad.idDocumentoIdentidad,
            tipo: trabajador.idDocumentoIdentidad.tipoDocumento,
            numero: trabajador.idDocumentoIdentidad.numero,
          }
        : null,
      usuario: trabajador.idUsuario
        ? {
            idUsuario: trabajador.idUsuario.idUsuario,
            nombreUsuario: trabajador.idUsuario.correo, // usando correo como nombreUsuario
            rol: (trabajador.idUsuario as any).idRol
              ? {
                  idRol: (trabajador.idUsuario as any).idRol.idRol,
                  nombre: (trabajador.idUsuario as any).idRol.nombre,
                }
              : {
                  idRol: '',
                  nombre: 'Sin rol',
                },
          }
        : null,
    };
  }

  async createWithBaseResponse(
    createTrabajadorDto: CreateTrabajadorDto,
  ): Promise<TrabajadorSingleResponseDto> {
    try {
      this.logger.log(`Creando trabajador: ${createTrabajadorDto.correo}`);

      const trabajador = await this.create(createTrabajadorDto);

      // Recargar con relaciones para el mapeo completo
      const trabajadorCompleto = await this.trabajadorRepository.findOne({
        where: { idTrabajador: trabajador.idTrabajador },
        relations: ['idUsuario', 'idDocumentoIdentidad', 'idUsuario.idRol'],
      });

      if (!trabajadorCompleto) {
        return {
          success: false,
          statusCode: 500,
          message: 'Error interno: No se pudo recuperar el trabajador creado',
          data: null,
          error: { message: 'Error de consistencia de datos' },
        };
      }

      return {
        success: true,
        statusCode: 201,
        message: 'Trabajador creado exitosamente',
        data: this.mapToResponseDto(trabajadorCompleto),
        error: null,
      };
    } catch (error) {
      this.logger.error(`Error al crear trabajador: ${error.message}`);

      if (error instanceof ConflictException) {
        return {
          success: false,
          statusCode: 409,
          message: error.message,
          data: null,
          error: { message: error.message },
        };
      }

      if (error instanceof BadRequestException) {
        return {
          success: false,
          statusCode: 400,
          message: error.message,
          data: null,
          error: { message: error.message },
        };
      }

      return {
        success: false,
        statusCode: 500,
        message: 'Error interno del servidor al crear trabajador',
        data: null,
        error: { message: error.message },
      };
    }
  }

  async findAllWithBaseResponse(): Promise<TrabajadorArrayResponseDto> {
    try {
      this.logger.log('Obteniendo todos los trabajadores');

      const trabajadores = await this.trabajadorRepository.find({
        relations: ['idUsuario', 'idDocumentoIdentidad', 'idUsuario.idRol'],
        order: { nombre: 'ASC', apellido: 'ASC' },
      });

      const trabajadoresMapeados = trabajadores.map((trabajador) =>
        this.mapToResponseDto(trabajador),
      );

      return {
        success: true,
        statusCode: 200,
        message: `Se encontraron ${trabajadores.length} trabajadores`,
        data: trabajadoresMapeados,
        error: null,
      };
    } catch (error) {
      this.logger.error(`Error al obtener trabajadores: ${error.message}`);
      return {
        success: false,
        statusCode: 500,
        message: 'Error interno del servidor al obtener trabajadores',
        data: [],
        error: { message: error.message },
      };
    }
  }

  async findOneWithBaseResponse(
    id: string,
  ): Promise<TrabajadorSingleResponseDto> {
    try {
      this.logger.log(`Buscando trabajador con ID: ${id}`);

      const trabajador = await this.trabajadorRepository.findOne({
        where: { idTrabajador: id },
        relations: ['idUsuario', 'idDocumentoIdentidad', 'idUsuario.idRol'],
      });

      if (!trabajador) {
        return {
          success: false,
          statusCode: 404,
          message: `Trabajador con ID ${id} no encontrado`,
          data: null,
          error: { message: 'Trabajador no encontrado' },
        };
      }

      return {
        success: true,
        statusCode: 200,
        message: 'Trabajador encontrado exitosamente',
        data: this.mapToResponseDto(trabajador),
        error: null,
      };
    } catch (error) {
      this.logger.error(`Error al buscar trabajador: ${error.message}`);
      return {
        success: false,
        statusCode: 500,
        message: 'Error interno del servidor al buscar trabajador',
        data: null,
        error: { message: error.message },
      };
    }
  }

  async updateWithBaseResponse(
    id: string,
    updateTrabajadorDto: UpdateTrabajadorDto,
  ): Promise<TrabajadorSingleResponseDto> {
    try {
      this.logger.log(`Actualizando trabajador con ID: ${id}`);

      const trabajadorExistente = await this.trabajadorRepository.findOne({
        where: { idTrabajador: id },
      });

      if (!trabajadorExistente) {
        return {
          success: false,
          statusCode: 404,
          message: `Trabajador con ID ${id} no encontrado`,
          data: null,
          error: { message: 'Trabajador no encontrado' },
        };
      }

      // Si se actualiza el correo, verificar que no exista otro trabajador con el mismo correo
      if (
        updateTrabajadorDto.correo &&
        updateTrabajadorDto.correo !== trabajadorExistente.correo
      ) {
        const correoExiste = await this.trabajadorRepository.findOne({
          where: { correo: updateTrabajadorDto.correo },
        });

        if (correoExiste) {
          return {
            success: false,
            statusCode: 409,
            message: 'Ya existe otro trabajador con ese correo',
            data: null,
            error: { message: 'Correo duplicado' },
          };
        }
      }

      await this.trabajadorRepository.update(id, updateTrabajadorDto);

      const trabajadorActualizado = await this.trabajadorRepository.findOne({
        where: { idTrabajador: id },
        relations: ['idUsuario', 'idDocumentoIdentidad', 'idUsuario.idRol'],
      });

      if (!trabajadorActualizado) {
        return {
          success: false,
          statusCode: 500,
          message:
            'Error interno: No se pudo recuperar el trabajador actualizado',
          data: null,
          error: { message: 'Error de consistencia de datos' },
        };
      }

      return {
        success: true,
        statusCode: 200,
        message: 'Trabajador actualizado exitosamente',
        data: this.mapToResponseDto(trabajadorActualizado),
        error: null,
      };
    } catch (error) {
      this.logger.error(`Error al actualizar trabajador: ${error.message}`);

      if (error instanceof ConflictException) {
        return {
          success: false,
          statusCode: 409,
          message: error.message,
          data: null,
          error: { message: error.message },
        };
      }

      return {
        success: false,
        statusCode: 500,
        message: 'Error interno del servidor al actualizar trabajador',
        data: null,
        error: { message: error.message },
      };
    }
  }

  async removeWithBaseResponse(
    id: string,
  ): Promise<BaseResponseDto<undefined>> {
    try {
      this.logger.log(`Eliminando (desactivando) trabajador con ID: ${id}`);

      const trabajador = await this.trabajadorRepository.findOne({
        where: { idTrabajador: id },
      });

      if (!trabajador) {
        return {
          success: false,
          statusCode: 404,
          message: `Trabajador con ID ${id} no encontrado`,
          data: undefined,
          error: { message: 'Trabajador no encontrado' },
        };
      }

      if (!trabajador.estaActivo) {
        return {
          success: false,
          statusCode: 400,
          message: 'El trabajador ya está inactivo',
          data: undefined,
          error: { message: 'Trabajador ya inactivo' },
        };
      }

      await this.trabajadorRepository.update(id, { estaActivo: false });

      return {
        success: true,
        statusCode: 200,
        message: 'Trabajador desactivado exitosamente',
        data: undefined,
        error: null,
      };
    } catch (error) {
      this.logger.error(`Error al eliminar trabajador: ${error.message}`);
      return {
        success: false,
        statusCode: 500,
        message: 'Error interno del servidor al eliminar trabajador',
        data: undefined,
        error: { message: error.message },
      };
    }
  }

  async findByNumeroDocumentoWithBaseResponse(
    numeroDocumento: string,
  ): Promise<TrabajadorSingleResponseDto> {
    try {
      this.logger.log(
        `Buscando trabajador por número de documento: ${numeroDocumento}`,
      );

      const trabajador = await this.trabajadorRepository.findOne({
        where: {
          idDocumentoIdentidad: { numero: parseInt(numeroDocumento) } as any,
        },
        relations: ['idUsuario', 'idDocumentoIdentidad', 'idUsuario.idRol'],
      });

      if (!trabajador) {
        return {
          success: false,
          statusCode: 404,
          message: `No se encontró trabajador con número de documento ${numeroDocumento}`,
          data: null,
          error: { message: 'Trabajador no encontrado' },
        };
      }

      return {
        success: true,
        statusCode: 200,
        message: 'Trabajador encontrado exitosamente',
        data: this.mapToResponseDto(trabajador),
        error: null,
      };
    } catch (error) {
      this.logger.error(
        `Error al buscar trabajador por documento: ${error.message}`,
      );
      return {
        success: false,
        statusCode: 500,
        message: 'Error interno del servidor al buscar trabajador',
        data: null,
        error: { message: error.message },
      };
    }
  }

  async findByCargoWithBaseResponse(
    cargo: string,
  ): Promise<TrabajadorArrayResponseDto> {
    try {
      this.logger.log(`Buscando trabajadores por cargo: ${cargo}`);

      // Por ahora retornamos todos los trabajadores activos hasta implementar campo cargo
      const trabajadores = await this.trabajadorRepository.find({
        where: { estaActivo: true },
        relations: ['idUsuario', 'idDocumentoIdentidad', 'idUsuario.idRol'],
        order: { nombre: 'ASC', apellido: 'ASC' },
      });

      const trabajadoresMapeados = trabajadores.map((trabajador) =>
        this.mapToResponseDto(trabajador),
      );

      return {
        success: true,
        statusCode: 200,
        message: `Se encontraron ${trabajadores.length} trabajadores activos`,
        data: trabajadoresMapeados,
        error: null,
      };
    } catch (error) {
      this.logger.error(
        `Error al buscar trabajadores por cargo: ${error.message}`,
      );
      return {
        success: false,
        statusCode: 500,
        message: 'Error interno del servidor al buscar trabajadores',
        data: [],
        error: { message: error.message },
      };
    }
  }

  async findActivosWithBaseResponse(): Promise<TrabajadorArrayResponseDto> {
    try {
      this.logger.log('Obteniendo trabajadores activos');

      const trabajadores = await this.trabajadorRepository.find({
        where: { estaActivo: true },
        relations: ['idUsuario', 'idDocumentoIdentidad', 'idUsuario.idRol'],
        order: { nombre: 'ASC', apellido: 'ASC' },
      });

      const trabajadoresMapeados = trabajadores.map((trabajador) =>
        this.mapToResponseDto(trabajador),
      );

      return {
        success: true,
        statusCode: 200,
        message: `Se encontraron ${trabajadores.length} trabajadores activos`,
        data: trabajadoresMapeados,
        error: null,
      };
    } catch (error) {
      this.logger.error(
        `Error al obtener trabajadores activos: ${error.message}`,
      );
      return {
        success: false,
        statusCode: 500,
        message: 'Error interno del servidor al obtener trabajadores activos',
        data: [],
        error: { message: error.message },
      };
    }
  }

  async findByCorreoWithBaseResponse(
    correo: string,
  ): Promise<TrabajadorSingleResponseDto> {
    try {
      this.logger.log(`Buscando trabajador por correo: ${correo}`);

      const trabajador = await this.trabajadorRepository.findOne({
        where: { correo },
        relations: ['idUsuario', 'idDocumentoIdentidad', 'idUsuario.idRol'],
      });

      if (!trabajador) {
        return {
          success: false,
          statusCode: 404,
          message: `No se encontró trabajador con correo ${correo}`,
          data: null,
          error: { message: 'Trabajador no encontrado' },
        };
      }

      return {
        success: true,
        statusCode: 200,
        message: 'Trabajador encontrado exitosamente',
        data: this.mapToResponseDto(trabajador),
        error: null,
      };
    } catch (error) {
      this.logger.error(
        `Error al buscar trabajador por correo: ${error.message}`,
      );
      return {
        success: false,
        statusCode: 500,
        message: 'Error interno del servidor al buscar trabajador',
        data: null,
        error: { message: error.message },
      };
    }
  }
}

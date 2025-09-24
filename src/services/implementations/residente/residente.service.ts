import {
  Injectable,
  Inject,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { IResidenteService } from '../../interfaces/residente.interface';
import { IAuthService } from '../../interfaces/auth.interface';
import { IRolService } from '../../interfaces/rol.interface';
import { IUsuarioService } from '../../interfaces/usuario.interface';
import { IDocumentoIdentidadService } from '../../interfaces/documento-identidad.interface';
import { Residente } from '../../../entities/Residente';
import { Usuario } from '../../../entities/Usuario';
import { DocumentoIdentidad } from '../../../entities/DocumentoIdentidad';
import {
  CreateResidenteDto,
  UpdateResidenteDto,
  ResidenteRegisterResponseDto,
  CreateUsuarioDto,
} from '../../../dtos';

@Injectable()
export class ResidenteService implements IResidenteService {
  constructor(
    @InjectRepository(Residente)
    private readonly residenteRepository: Repository<Residente>,
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

  async create(createResidenteDto: CreateResidenteDto): Promise<Residente> {
    const residente = this.residenteRepository.create(createResidenteDto);
    const result = await this.residenteRepository.save(residente);
    return Array.isArray(result) ? result[0] : result;
  }

  /**
   * Registrar un nuevo residente con usuario y documento de identidad
   * Utiliza transacción para asegurar consistencia
   */
  async register(
    createResidenteDto: CreateResidenteDto,
  ): Promise<ResidenteRegisterResponseDto> {
    // Validar que las contraseñas coincidan
    if (
      createResidenteDto.contrasena !== createResidenteDto.confirmarContrasena
    ) {
      throw new BadRequestException('Las contraseñas no coinciden');
    }

    // Verificar si el correo ya está registrado
    const emailExists = await this.usuarioService.emailExists(
      createResidenteDto.correo,
    );
    if (emailExists) {
      throw new ConflictException(
        'Ya existe un usuario con este correo electrónico',
      );
    }

    // Verificar si ya existe un documento con el mismo número
    try {
      await this.documentoIdentidadService.findByNumero(
        createResidenteDto.numeroDocumento.toString(),
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
      // Obtener rol de residente por defecto si no se especifica
      let rolId = createResidenteDto.idRol;
      if (!rolId) {
        try {
          const residenteRol = await this.rolService.findByNombre('Residente');
          rolId = residenteRol.idRol;
        } catch (error) {
          // Si no existe el rol Residente, usar el primer rol disponible
          const roles = await this.rolService.findAll();
          if (roles.length === 0) {
            throw new BadRequestException(
              'No hay roles disponibles en el sistema',
            );
          }
          rolId = roles[0].idRol;
        }
      }

      // 1. Crear documento de identidad
      const documentoIdentidad = queryRunner.manager.create(
        DocumentoIdentidad,
        {
          tipoDocumento: createResidenteDto.tipoDocumento,
          numero: createResidenteDto.numeroDocumento,
        },
      );
      const savedDocumentoIdentidad = await queryRunner.manager.save(
        DocumentoIdentidad,
        documentoIdentidad,
      );

      // 2. Crear usuario
      const createUsuarioDto: CreateUsuarioDto = {
        correo: createResidenteDto.correo,
        contrasena: createResidenteDto.contrasena,
        idRol: rolId,
      };

      // Hashear la contraseña antes de guardar
      const hashedPassword = await this.authService.hashPassword(
        createResidenteDto.contrasena,
      );

      const usuario = queryRunner.manager.create(Usuario, {
        correo: createUsuarioDto.correo,
        contrasena: hashedPassword,
        estaActivo: true,
        idRol: { idRol: rolId } as any,
      });
      const savedUsuario = await queryRunner.manager.save(Usuario, usuario);

      // 3. Crear residente
      const residente = queryRunner.manager.create(Residente, {
        nombre: createResidenteDto.nombre,
        apellido: createResidenteDto.apellido,
        correo: createResidenteDto.correo,
        telefono: createResidenteDto.telefono,
        fechaNacimiento: createResidenteDto.fechaNacimiento,
        estaActivo: true,
        idDocumentoIdentidad: savedDocumentoIdentidad,
        idUsuario: savedUsuario,
      });
      const savedResidente = await queryRunner.manager.save(
        Residente,
        residente,
      );

      // Confirmar transacción
      await queryRunner.commitTransaction();

      // Generar token JWT usando el método login del auth service
      const loginResult = await this.authService.login(savedUsuario);

      // Cargar relaciones para la respuesta
      const residenteConRelaciones = await this.residenteRepository.findOne({
        where: { idResidente: savedResidente.idResidente },
        relations: ['idUsuario', 'idDocumentoIdentidad'],
      });

      return {
        success: true,
        message: 'Residente registrado exitosamente',
        residente: residenteConRelaciones!,
        accessToken: loginResult.access_token,
      };
    } catch (error) {
      // Rollback en caso de error
      await queryRunner.rollbackTransaction();

      if (
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }

      throw new BadRequestException(
        `Error al registrar residente: ${error.message}`,
      );
    } finally {
      // Liberar la conexión
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Residente[]> {
    return await this.residenteRepository.find({
      relations: ['idUsuario', 'idDocumentoIdentidad', 'residencias'],
      order: {
        fechaRegistro: 'DESC',
      },
    });
  }

  async findOne(id: string): Promise<Residente> {
    const residente = await this.residenteRepository.findOne({
      where: { idResidente: id },
      relations: [
        'idUsuario',
        'idDocumentoIdentidad',
        'residencias',
        'cronogramas',
      ],
    });

    if (!residente) {
      throw new NotFoundException(`Residente con ID ${id} no encontrado`);
    }

    return residente;
  }

  async update(
    id: string,
    updateResidenteDto: UpdateResidenteDto,
  ): Promise<Residente> {
    await this.findOne(id);

    const updateData: any = {};

    if (updateResidenteDto.nombre !== undefined) {
      updateData.nombre = updateResidenteDto.nombre;
    }
    if (updateResidenteDto.apellido !== undefined) {
      updateData.apellido = updateResidenteDto.apellido;
    }
    if (updateResidenteDto.correo !== undefined) {
      updateData.correo = updateResidenteDto.correo;
    }
    if (updateResidenteDto.telefono !== undefined) {
      updateData.telefono = updateResidenteDto.telefono;
    }
    if (updateResidenteDto.fechaNacimiento !== undefined) {
      updateData.fechaNacimiento = updateResidenteDto.fechaNacimiento;
    }

    await this.residenteRepository.update(id, updateData);
    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const residente = await this.findOne(id);

    // Eliminación lógica
    await this.residenteRepository.update(id, { estaActivo: false });

    // También desactivar el usuario asociado
    if (residente.idUsuario) {
      await this.usuarioService.update(residente.idUsuario.idUsuario, {
        estaActivo: false,
      });
    }
  }

  async findByPropiedad(propiedadId: string): Promise<Residente[]> {
    return await this.residenteRepository
      .createQueryBuilder('residente')
      .leftJoinAndSelect('residente.residencias', 'residencia')
      .leftJoinAndSelect('residencia.idPropiedad', 'propiedad')
      .leftJoinAndSelect('residente.idUsuario', 'usuario')
      .leftJoinAndSelect('residente.idDocumentoIdentidad', 'documentoIdentidad')
      .where('propiedad.idPropiedad = :propiedadId', { propiedadId })
      .andWhere('residente.estaActivo = :activo', { activo: true })
      .getMany();
  }

  async findByNumeroDocumento(numeroDocumento: string): Promise<Residente> {
    const residente = await this.residenteRepository
      .createQueryBuilder('residente')
      .leftJoinAndSelect('residente.idDocumentoIdentidad', 'documentoIdentidad')
      .leftJoinAndSelect('residente.idUsuario', 'usuario')
      .where('documentoIdentidad.numero = :numeroDocumento', {
        numeroDocumento: parseInt(numeroDocumento),
      })
      .andWhere('residente.estaActivo = :activo', { activo: true })
      .getOne();

    if (!residente) {
      throw new NotFoundException(
        `Residente con número de documento ${numeroDocumento} no encontrado`,
      );
    }

    return residente;
  }

  async findByCorreo(correo: string): Promise<Residente> {
    const residente = await this.residenteRepository.findOne({
      where: {
        correo,
        estaActivo: true,
      },
      relations: ['idUsuario', 'idDocumentoIdentidad'],
    });

    if (!residente) {
      throw new NotFoundException(
        `Residente con correo ${correo} no encontrado`,
      );
    }

    return residente;
  }
}

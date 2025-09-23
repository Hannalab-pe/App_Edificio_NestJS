import { Injectable, Inject, BadRequestException, ConflictException } from '@nestjs/common';
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
import { CreateTrabajadorDto, TrabajadorRegisterResponseDto, CreateUsuarioDto } from '../../../dtos';

@Injectable()
export class TrabajadorService implements ITrabajadorService {
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
  async register(createTrabajadorDto: CreateTrabajadorDto): Promise<TrabajadorRegisterResponseDto> {
    // Validar que las contraseñas coincidan
    if (createTrabajadorDto.contrasena !== createTrabajadorDto.confirmarContrasena) {
      throw new BadRequestException('Las contraseñas no coinciden');
    }

    // Verificar si el correo ya está registrado
    const emailExists = await this.usuarioService.emailExists(createTrabajadorDto.correo);
    if (emailExists) {
      throw new ConflictException('Ya existe un usuario con este correo electrónico');
    }

    // Verificar si ya existe un documento con el mismo número
    try {
      await this.documentoIdentidadService.findByNumero(createTrabajadorDto.numeroDocumento);
      throw new ConflictException('Ya existe un documento de identidad con este número');
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
          const trabajadorRol = await this.rolService.findByNombre('Trabajador');
          rolId = trabajadorRol.idRol;
        } catch (error) {
          // Si no existe el rol Trabajador, usar el primer rol disponible
          const roles = await this.rolService.findAll();
          if (roles.length === 0) {
            throw new BadRequestException('No hay roles disponibles en el sistema');
          }
          rolId = roles[0].idRol;
        }
      }

      // 1. Crear el documento de identidad primero
      const documentoIdentidad = queryRunner.manager.create(DocumentoIdentidad, {
        tipoDocumento: createTrabajadorDto.tipoDocumento,
        numero: createTrabajadorDto.numeroDocumento,
      });

      const nuevoDocumentoIdentidad = await queryRunner.manager.save(DocumentoIdentidad, documentoIdentidad);

      // 2. Hashear la contraseña
      const hashedPassword = await this.authService.hashPassword(createTrabajadorDto.contrasena);

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
      const nuevoTrabajador = await queryRunner.manager.save(Trabajador, trabajador);

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
      throw new BadRequestException(`Trabajador con número de documento ${numeroDocumento} no encontrado`);
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
}

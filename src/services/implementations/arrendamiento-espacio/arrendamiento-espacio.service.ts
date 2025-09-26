import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, LessThan, MoreThan } from 'typeorm';
import { IArrendamientoEspacioService } from '../../interfaces/arrendamiento-espacio.interface';
import {
  CreateArrendamientoEspacioDto,
  UpdateArrendamientoEspacioDto,
  CreateArrendamientoCompletoDto,
} from '../../../dtos';
import { ArrendamientoEspacio } from '../../../entities/ArrendamientoEspacio';
import { Arrendatario } from '../../../entities/Arrendatario';
import { EspacioArrendable } from '../../../entities/EspacioArrendable';
import { Usuario } from '../../../entities/Usuario';
import { BaseResponseDto } from '../../../dtos/baseResponse/baseResponse.dto';
import { ArrendatarioService } from '../arrendatario/arrendatario.service';
import { UsuarioService } from '../usuario/usuario.service';
import { RolService } from '../rol/rol.service';
import { Rol } from 'src/entities/Rol';

@Injectable()
export class ArrendamientoEspacioService
  implements IArrendamientoEspacioService {
  constructor(
    @InjectRepository(ArrendamientoEspacio)
    private readonly arrendamientoRepository: Repository<ArrendamientoEspacio>,
    @InjectRepository(EspacioArrendable)
    private readonly espacioRepository: Repository<EspacioArrendable>,
    @InjectRepository(Arrendatario)
    private readonly arrendatarioRepository: Repository<Arrendatario>,
    private readonly dataSource: DataSource,
    private readonly arrendatarioService: ArrendatarioService,
    private readonly usuarioService: UsuarioService,
    private readonly rolService: RolService,
  ) { }

  async crearArrendamientoCompleto(
    dto: CreateArrendamientoCompletoDto,
  ): Promise<BaseResponseDto<ArrendamientoEspacio>> {
    return await this.dataSource.transaction(async (manager) => {
      try {
        // 1. VALIDAR QUE EL ESPACIO EXISTE Y ESTÁ DISPONIBLE
        const validacionEspacio = await this.validarEspacioDisponible(
          dto.espacioId,
        );
        if (!validacionEspacio.success || !validacionEspacio.data) {
          return {
            success: false,
            message: 'El espacio no está disponible para arrendamiento',
            data: null,
            error: { message: 'Espacio no disponible' },
          };
        }

        // Obtener el espacio completo
        const espacio = await this.espacioRepository.findOne({
          where: { idEspacio: dto.espacioId },
          relations: ['idTipoEspacio2'],
        });

        if (!espacio) {
          return {
            success: false,
            message: 'Espacio arrendable no encontrado',
            data: null,
            error: { message: 'Espacio no encontrado' },
          };
        }

        // 2. GENERAR USUARIO AUTOMÁTICAMENTE PARA EL ARRENDATARIO
        const contrasenaTemp = this.generarContrasenaTemporalSegura();
        const nuevoUsuario = await this.usuarioService.create({
          correo: dto.arrendatario.correo,
          contrasena: contrasenaTemp,
          idRol: await this.obtenerRolArrendatario(
            dto.arrendatario.idRol ? dto.arrendatario.idRol : '',
          ), // Función que obtiene el UUID del rol
        });

        if (!nuevoUsuario) {
          return {
            success: false,
            message: 'Error al crear el usuario para el arrendatario',
            data: null,
            error: { message: 'Error creando usuario' },
          };
        }

        // 3. CREAR ARRENDATARIO CON USUARIO ASOCIADO
        const arrendatarioCreado = await this.arrendatarioService.create({
          // Campos del documento de identidad
          tipoDocumento: dto.arrendatario.tipoDocumento,
          numeroDocumento: dto.arrendatario.numeroDocumento,
          // Resto de campos del arrendatario
          telefonoSecundario: dto.arrendatario.telefonoSecundario,
          direccionCorrespondencia: dto.arrendatario.direccionCorrespondencia,
          ciudadCorrespondencia: dto.arrendatario.ciudadCorrespondencia,
          ocupacionActividad: dto.arrendatario.ocupacionActividad,
          esPersonaJuridica: dto.arrendatario.esPersonaJuridica,
          nombreEmpresa: dto.arrendatario.nombreEmpresa,
          ingresosAproximados: dto.arrendatario.ingresosAproximados,
          capacidadPagoDeclarada: dto.arrendatario.capacidadPagoDeclarada,
          referenciaPersonalNombre: dto.arrendatario.referenciaPersonalNombre,
          referenciaPersonalTelefono:
            dto.arrendatario.referenciaPersonalTelefono,
          referenciaComercialNombre: dto.arrendatario.referenciaComercialNombre,
          referenciaComercialTelefono:
            dto.arrendatario.referenciaComercialTelefono,
          usoPrevisto: dto.arrendatario.usoPrevisto,
          horarioUsoPrevisto: dto.arrendatario.horarioUsoPrevisto,
          requiereModificaciones: dto.arrendatario.requiereModificaciones,
          modificacionesRequeridas: dto.arrendatario.modificacionesRequeridas,
          placaVehiculo: dto.arrendatario.placaVehiculo,
          marcaVehiculo: dto.arrendatario.marcaVehiculo,
          modeloVehiculo: dto.arrendatario.modeloVehiculo,
          colorVehiculo: dto.arrendatario.colorVehiculo,
          tipoVehiculo: dto.arrendatario.tipoVehiculo,
          // Usuario asociado y registro
          idUsuario: nuevoUsuario.idUsuario,
          registradoPor: dto.registradoPor,
        });

        if (!arrendatarioCreado.success) {
          // Rollback: eliminar usuario creado
          await this.usuarioService.remove(nuevoUsuario.idUsuario);
          return {
            success: false,
            message: 'Error al crear el arrendatario',
            data: null,
            error: arrendatarioCreado.error,
          };
        }

        // 4. CREAR EL ARRENDAMIENTO
        const nuevoArrendamiento = manager.getRepository(ArrendamientoEspacio).create({
          fechaInicio: dto.fechaInicio,
          fechaFin: dto.fechaFin,
          montoMensual: dto.montoMensual,
          deposito: dto.deposito,
          estado: 'ACTIVO',
          observaciones: dto.observaciones,
          idArrendatario: arrendatarioCreado.data.idArrendatario,
          idEspacio: { idEspacio: dto.espacioId } as any,
        });

        const arrendamientoGuardado = await manager.getRepository(ArrendamientoEspacio).save(nuevoArrendamiento);

        // 5. ACTUALIZAR ESTADO DEL ESPACIO A OCUPADO
        await manager.update(EspacioArrendable, dto.espacioId, {
          estado: 'OCUPADO',
        });

        // 6. CARGAR EL ARRENDAMIENTO COMPLETO CON TODAS LAS RELACIONES
        const arrendamientoCompleto = await manager.findOne(
          ArrendamientoEspacio,
          {
            where: { idArrendamiento: arrendamientoGuardado.idArrendamiento },
            relations: [
              'idArrendatario2',
              'idArrendatario2.idDocumentoIdentidad',
              'idArrendatario2.idUsuario',
              'idEspacio',
              'idEspacio.idTipoEspacio2',
            ],
          },
        );

        return {
          success: true,
          message: 'Arrendamiento completo creado exitosamente',
          data: arrendamientoCompleto,
          error: null,
          // Información adicional para el frontend
          extra: {
            usuarioCredenciales: {
              correo: nuevoUsuario.correo,
              contrasenaTemp: contrasenaTemp,
              mensaje:
                'Usuario creado automáticamente. Se debe cambiar la contraseña en el primer acceso.',
            },
            espacioActualizado: {
              codigo: espacio.codigo,
              estadoAnterior: espacio.estado,
              estadoNuevo: 'OCUPADO',
            },
          },
        };
      } catch (error) {
        return {
          success: false,
          message: 'Error en la transacción de arrendamiento completo',
          data: null,
          error: { message: error.message },
        };
      }
    });
  }

  async create(
    dto: CreateArrendamientoEspacioDto,
  ): Promise<BaseResponseDto<ArrendamientoEspacio>> {
    try {
      // Validar que el arrendatario existe
      const arrendatario = await this.arrendatarioRepository.findOne({
        where: { idArrendatario: dto.idArrendatario, estaActivo: true },
      });

      if (!arrendatario) {
        return {
          success: false,
          message: 'Arrendatario no encontrado o inactivo',
          data: null,
          error: { message: 'Arrendatario inválido' },
        };
      }

      // Validar que el espacio está disponible
      const validacionEspacio = await this.validarEspacioDisponible(
        dto.idEspacio,
      );
      if (!validacionEspacio.success) {
        return validacionEspacio;
      }

      // Crear el arrendamiento
      const nuevoArrendamiento = this.arrendamientoRepository.create({
        fechaInicio: dto.fechaInicio,
        fechaFin: dto.fechaFin,
        montoMensual: dto.montoMensual,
        deposito: dto.deposito,
        estado: dto.estado,
        observaciones: dto.observaciones,
        idArrendatario: dto.idArrendatario,
        idEspacio: { idEspacio: dto.idEspacio } as any,
      });

      const arrendamientoGuardado = await this.arrendamientoRepository.save(nuevoArrendamiento);

      // Si el estado es ACTIVO, actualizar el estado del espacio
      if (dto.estado === 'ACTIVO') {
        await this.espacioRepository.update(dto.idEspacio, {
          estado: 'OCUPADO',
        });
      }

      const arrendamientoCompleto = await this.arrendamientoRepository.findOne({
        where: { idArrendamiento: arrendamientoGuardado.idArrendamiento },
        relations: ['idArrendatario2', 'idEspacio'],
      });

      return {
        success: true,
        message: 'Arrendamiento creado exitosamente',
        data: arrendamientoCompleto,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al crear el arrendamiento',
        data: null,
        error: { message: error.message },
      };
    }
  }

  async findAll(): Promise<BaseResponseDto<ArrendamientoEspacio[]>> {
    try {
      const arrendamientos = await this.arrendamientoRepository.find({
        relations: [
          'idArrendatario2',
          'idArrendatario2.idDocumentoIdentidad',
          'idEspacio',
          'idEspacio.idTipoEspacio2',
        ],
        order: { fechaCreacion: 'DESC' },
      });

      return {
        success: true,
        message: 'Arrendamientos obtenidos exitosamente',
        data: arrendamientos,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al obtener los arrendamientos',
        data: null,
        error: { message: error.message },
      };
    }
  }

  async findOne(id: string): Promise<BaseResponseDto<ArrendamientoEspacio>> {
    try {
      const arrendamiento = await this.arrendamientoRepository.findOne({
        where: { idArrendamiento: id },
        relations: [
          'idArrendatario2',
          'idArrendatario2.idDocumentoIdentidad',
          'idArrendatario2.idUsuario',
          'idEspacio',
          'idEspacio.idTipoEspacio2',
          'pagos',
        ],
      });

      if (!arrendamiento) {
        return {
          success: false,
          message: `Arrendamiento con ID ${id} no encontrado`,
          data: null,
          error: { message: 'Arrendamiento no encontrado' },
        };
      }

      return {
        success: true,
        message: 'Arrendamiento encontrado exitosamente',
        data: arrendamiento,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al obtener el arrendamiento',
        data: null,
        error: { message: error.message },
      };
    }
  }

  async update(
    id: string,
    dto: UpdateArrendamientoEspacioDto,
  ): Promise<BaseResponseDto<ArrendamientoEspacio>> {
    try {
      const arrendamientoExistente = await this.arrendamientoRepository.findOne(
        {
          where: { idArrendamiento: id },
        },
      );

      if (!arrendamientoExistente) {
        return {
          success: false,
          message: `Arrendamiento con ID ${id} no encontrado`,
          data: null,
          error: { message: 'Arrendamiento no encontrado' },
        };
      }

      // Si se está cambiando el espacio, validar disponibilidad
      if (
        dto.idEspacio &&
        dto.idEspacio !== arrendamientoExistente.idEspacio.idEspacio
      ) {
        const validacion = await this.validarEspacioDisponible(dto.idEspacio);
        if (!validacion.success) {
          return validacion;
        }
      }

      const updateData: any = { ...dto };

      if (dto.idEspacio) {
        updateData.idEspacio = { idEspacio: dto.idEspacio };
      }

      await this.arrendamientoRepository.update(id, updateData);

      const arrendamientoActualizado =
        await this.arrendamientoRepository.findOne({
          where: { idArrendamiento: id },
          relations: ['idArrendatario2', 'idEspacio'],
        });

      return {
        success: true,
        message: 'Arrendamiento actualizado exitosamente',
        data: arrendamientoActualizado,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al actualizar el arrendamiento',
        data: null,
        error: { message: error.message },
      };
    }
  }

  async remove(id: string): Promise<BaseResponseDto<void>> {
    try {
      const arrendamiento = await this.arrendamientoRepository.findOne({
        where: { idArrendamiento: id },
        relations: ['idEspacio'],
      });

      if (!arrendamiento) {
        return {
          success: false,
          message: `Arrendamiento con ID ${id} no encontrado`,
          data: null,
          error: { message: 'Arrendamiento no encontrado' },
        };
      }

      // Actualizar estado del arrendamiento a TERMINADO
      await this.arrendamientoRepository.update(id, { estado: 'TERMINADO' });

      // Liberar el espacio
      await this.espacioRepository.update(arrendamiento.idEspacio.idEspacio, {
        estado: 'DISPONIBLE',
      });

      return {
        success: true,
        message: 'Arrendamiento terminado exitosamente',
        data: null,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al terminar el arrendamiento',
        data: null,
        error: { message: error.message },
      };
    }
  }

  async validarEspacioDisponible(
    espacioId: string,
  ): Promise<BaseResponseDto<boolean>> {
    try {
      const espacio = await this.espacioRepository.findOne({
        where: { idEspacio: espacioId },
      });

      if (!espacio) {
        return {
          success: false,
          message: 'Espacio no encontrado',
          data: false,
          error: { message: 'Espacio no existe' },
        };
      }

      if (!espacio.estaActivo) {
        return {
          success: false,
          message: 'Espacio no está activo',
          data: false,
          error: { message: 'Espacio inactivo' },
        };
      }

      if (espacio.estado !== 'DISPONIBLE') {
        return {
          success: false,
          message: `Espacio no está disponible. Estado actual: ${espacio.estado}`,
          data: false,
          error: { message: 'Espacio no disponible' },
        };
      }

      // Verificar que no haya arrendamientos activos
      const arrendamientoActivo = await this.arrendamientoRepository.findOne({
        where: {
          idEspacio: { idEspacio: espacioId },
          estado: 'ACTIVO',
        },
      });

      if (arrendamientoActivo) {
        return {
          success: false,
          message: 'El espacio ya tiene un arrendamiento activo',
          data: false,
          error: { message: 'Arrendamiento activo existente' },
        };
      }

      return {
        success: true,
        message: 'Espacio disponible para arrendamiento',
        data: true,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al validar disponibilidad del espacio',
        data: false,
        error: { message: error.message },
      };
    }
  }

  async findByEstado(
    estado: string,
  ): Promise<BaseResponseDto<ArrendamientoEspacio[]>> {
    try {
      const arrendamientos = await this.arrendamientoRepository.find({
        where: { estado },
        relations: ['idArrendatario2', 'idEspacio'],
        order: { fechaCreacion: 'DESC' },
      });

      return {
        success: true,
        message: `Arrendamientos con estado "${estado}" obtenidos exitosamente`,
        data: arrendamientos,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al obtener arrendamientos por estado',
        data: null,
        error: { message: error.message },
      };
    }
  }

  async findByEspacio(
    espacioId: string,
  ): Promise<BaseResponseDto<ArrendamientoEspacio[]>> {
    try {
      const arrendamientos = await this.arrendamientoRepository.find({
        where: { idEspacio: { idEspacio: espacioId } },
        relations: ['idArrendatario2', 'idEspacio'],
        order: { fechaCreacion: 'DESC' },
      });

      return {
        success: true,
        message:
          'Historial de arrendamientos del espacio obtenido exitosamente',
        data: arrendamientos,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al obtener arrendamientos por espacio',
        data: null,
        error: { message: error.message },
      };
    }
  }

  async findByArrendatario(
    arrendatarioId: string,
  ): Promise<BaseResponseDto<ArrendamientoEspacio[]>> {
    try {
      const arrendamientos = await this.arrendamientoRepository.find({
        where: { idArrendatario: arrendatarioId },
        relations: ['idArrendatario2', 'idEspacio'],
        order: { fechaCreacion: 'DESC' },
      });

      return {
        success: true,
        message: 'Arrendamientos del arrendatario obtenidos exitosamente',
        data: arrendamientos,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al obtener arrendamientos por arrendatario',
        data: null,
        error: { message: error.message },
      };
    }
  }

  async findActivos(): Promise<BaseResponseDto<ArrendamientoEspacio[]>> {
    return this.findByEstado('ACTIVO');
  }

  async findVencidos(): Promise<BaseResponseDto<ArrendamientoEspacio[]>> {
    try {
      const fechaActual = new Date().toISOString().split('T')[0]; // Solo la fecha (YYYY-MM-DD)

      const arrendamientos = await this.arrendamientoRepository.find({
        where: {
          estado: 'ACTIVO',
          fechaFin: LessThan(fechaActual),
        },
        relations: ['idArrendatario2', 'idEspacio'],
        order: { fechaFin: 'ASC' },
      });

      return {
        success: true,
        message: 'Arrendamientos vencidos obtenidos exitosamente',
        data: arrendamientos,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al obtener arrendamientos vencidos',
        data: null,
        error: { message: error.message },
      };
    }
  }

  async findProximosAVencer(
    diasAntelacion: number = 30,
  ): Promise<BaseResponseDto<ArrendamientoEspacio[]>> {
    try {
      const fechaActual = new Date();
      const fechaLimite = new Date();
      fechaLimite.setDate(fechaActual.getDate() + diasAntelacion);

      const fechaActualStr = fechaActual.toISOString().split('T')[0];
      const fechaLimiteStr = fechaLimite.toISOString().split('T')[0];

      const arrendamientos = await this.arrendamientoRepository.find({
        where: {
          estado: 'ACTIVO',
          fechaFin: MoreThan(fechaActualStr) && LessThan(fechaLimiteStr),
        },
        relations: ['idArrendatario2', 'idEspacio'],
        order: { fechaFin: 'ASC' },
      });

      return {
        success: true,
        message: `Arrendamientos próximos a vencer en ${diasAntelacion} días obtenidos exitosamente`,
        data: arrendamientos,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al obtener arrendamientos próximos a vencer',
        data: null,
        error: { message: error.message },
      };
    }
  }

  // MÉTODOS AUXILIARES PRIVADOS

  private generarContrasenaTemporalSegura(): string {
    const caracteres =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%';
    let contrasena = '';
    for (let i = 0; i < 12; i++) {
      contrasena += caracteres.charAt(
        Math.floor(Math.random() * caracteres.length),
      );
    }
    return contrasena;
  }

  private async obtenerRolArrendatario(idRol: string): Promise<string> {
    const rolEncontrado = await this.rolService.findOne(idRol);
    return rolEncontrado.idRol;
  }
}

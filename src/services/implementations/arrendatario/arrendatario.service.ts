import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Not } from 'typeorm';
import { IArrendatarioService } from '../../interfaces/arrendatario.interface';
import { CreateArrendatarioDto, UpdateArrendatarioDto } from '../../../dtos';
import { Arrendatario } from '../../../entities/Arrendatario';
import { DocumentoIdentidad } from '../../../entities/DocumentoIdentidad';
import { BaseResponseDto } from '../../../dtos/baseResponse/baseResponse.dto';
import { DocumentoIdentidadService } from '../documento-identidad/documento-identidad.service';

@Injectable()
export class ArrendatarioService implements IArrendatarioService {
  constructor(
    @InjectRepository(Arrendatario)
    private readonly arrendatarioRepository: Repository<Arrendatario>,
    @InjectRepository(DocumentoIdentidad)
    private readonly documentoIdentidadRepository: Repository<DocumentoIdentidad>,
    private readonly dataSource: DataSource,
    private readonly documentoIdentidadService: DocumentoIdentidadService,
  ) {}

  async create(
    createArrendatarioDto: CreateArrendatarioDto,
  ): Promise<BaseResponseDto<Arrendatario>> {
    return await this.dataSource.transaction(async (manager) => {
      try {
        // 1. VERIFICAR SI YA EXISTE UN DOCUMENTO CON EL MISMO NÚMERO
        const documentoExistente = await manager.findOne(DocumentoIdentidad, {
          where: { numero: createArrendatarioDto.numeroDocumento },
        });

        if (documentoExistente) {
          // Verificar si ya hay un arrendatario activo con este documento
          const arrendatarioExistente = await manager.findOne(Arrendatario, {
            where: {
              idDocumentoIdentidad: {
                idDocumentoIdentidad: documentoExistente.idDocumentoIdentidad,
              },
              estaActivo: true,
            },
          });

          if (arrendatarioExistente) {
            return {
              success: false,
              message:
                'Ya existe un arrendatario activo con este documento de identidad',
              data: null,
              error: { message: 'Documento de identidad duplicado' },
            };
          }
        }

        // 2. CREAR DOCUMENTO DE IDENTIDAD (si no existe)
        let documentoIdentidad = documentoExistente;
        if (!documentoIdentidad) {
          documentoIdentidad = manager.create(DocumentoIdentidad, {
            numero: createArrendatarioDto.numeroDocumento,
            tipoDocumento: createArrendatarioDto.tipoDocumento as any,
          });

          documentoIdentidad = await manager.save(
            DocumentoIdentidad,
            documentoIdentidad,
          );
        }

        // 3. CREAR EL ARRENDATARIO
        const nuevoArrendatario = manager.create(Arrendatario, {
          telefonoSecundario: createArrendatarioDto.telefonoSecundario,
          direccionCorrespondencia:
            createArrendatarioDto.direccionCorrespondencia,
          ciudadCorrespondencia: createArrendatarioDto.ciudadCorrespondencia,
          ocupacionActividad: createArrendatarioDto.ocupacionActividad,
          esPersonaJuridica: createArrendatarioDto.esPersonaJuridica || false,
          nombreEmpresa: createArrendatarioDto.nombreEmpresa,
          ingresosAproximados: createArrendatarioDto.ingresosAproximados,
          capacidadPagoDeclarada: createArrendatarioDto.capacidadPagoDeclarada,
          referenciaPersonalNombre:
            createArrendatarioDto.referenciaPersonalNombre,
          referenciaPersonalTelefono:
            createArrendatarioDto.referenciaPersonalTelefono,
          referenciaComercialNombre:
            createArrendatarioDto.referenciaComercialNombre,
          referenciaComercialTelefono:
            createArrendatarioDto.referenciaComercialTelefono,
          usoPrevisto: createArrendatarioDto.usoPrevisto,
          horarioUsoPrevisto: createArrendatarioDto.horarioUsoPrevisto,
          requiereModificaciones:
            createArrendatarioDto.requiereModificaciones || false,
          modificacionesRequeridas:
            createArrendatarioDto.modificacionesRequeridas,
          cedulaDocumentoUrl: createArrendatarioDto.cedulaDocumentoUrl,
          referenciasUrl: createArrendatarioDto.referenciasUrl,
          placaVehiculo: createArrendatarioDto.placaVehiculo,
          marcaVehiculo: createArrendatarioDto.marcaVehiculo,
          modeloVehiculo: createArrendatarioDto.modeloVehiculo,
          colorVehiculo: createArrendatarioDto.colorVehiculo,
          tipoVehiculo: createArrendatarioDto.tipoVehiculo,
          estadoVerificacion: 'pendiente',
          observacionesVerificacion:
            createArrendatarioDto.observacionesVerificacion,
          estaActivo: true,
          idDocumentoIdentidad: documentoIdentidad,
          idUsuario: createArrendatarioDto.idUsuario
            ? ({ idUsuario: createArrendatarioDto.idUsuario } as any)
            : null,
          registradoPor: createArrendatarioDto.registradoPor
            ? ({ idUsuario: createArrendatarioDto.registradoPor } as any)
            : null,
        });

        const arrendatarioGuardado = await manager.save(
          Arrendatario,
          nuevoArrendatario,
        );

        // 4. CARGAR RELACIONES PARA LA RESPUESTA
        const arrendatarioCompleto = await manager.findOne(Arrendatario, {
          where: { idArrendatario: arrendatarioGuardado.idArrendatario },
          relations: ['idDocumentoIdentidad', 'idUsuario', 'registradoPor'],
        });

        return {
          success: true,
          message:
            'Arrendatario creado exitosamente con documento de identidad',
          data: arrendatarioCompleto,
          error: null,
        };
      } catch (error) {
        return {
          success: false,
          message: 'Error al crear el arrendatario',
          data: null,
          error: { message: error.message },
        };
      }
    });
  }

  async findAll(): Promise<BaseResponseDto<Arrendatario[]>> {
    try {
      const arrendatarios = await this.arrendatarioRepository.find({
        relations: ['idDocumentoIdentidad', 'idUsuario', 'registradoPor'],
        order: { fechaRegistro: 'DESC' },
      });

      return {
        success: true,
        message: 'Arrendatarios obtenidos exitosamente',
        data: arrendatarios,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al obtener los arrendatarios',
        data: null,
        error: { message: error.message },
      };
    }
  }

  async findOne(id: string): Promise<BaseResponseDto<Arrendatario>> {
    try {
      const arrendatario = await this.arrendatarioRepository.findOne({
        where: { idArrendatario: id },
        relations: [
          'idDocumentoIdentidad',
          'idUsuario',
          'registradoPor',
          'arrendamientoEspacios',
        ],
      });

      if (!arrendatario) {
        return {
          success: false,
          message: `Arrendatario con ID ${id} no encontrado`,
          data: null,
          error: { message: 'Arrendatario no encontrado' },
        };
      }

      return {
        success: true,
        message: 'Arrendatario encontrado exitosamente',
        data: arrendatario,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al obtener el arrendatario',
        data: null,
        error: { message: error.message },
      };
    }
  }

  async update(
    id: string,
    updateArrendatarioDto: UpdateArrendatarioDto,
  ): Promise<BaseResponseDto<Arrendatario>> {
    try {
      // Verificar que el arrendatario existe
      const arrendatarioExistente = await this.arrendatarioRepository.findOne({
        where: { idArrendatario: id },
      });

      if (!arrendatarioExistente) {
        return {
          success: false,
          message: `Arrendatario con ID ${id} no encontrado`,
          data: null,
          error: { message: 'Arrendatario no encontrado' },
        };
      }

      // Si se está actualizando el documento, verificar que no esté en uso por otro arrendatario
      if (
        updateArrendatarioDto.numeroDocumento &&
        updateArrendatarioDto.numeroDocumento !==
          arrendatarioExistente.idDocumentoIdentidad?.numero
      ) {
        const documentoExistente =
          await this.documentoIdentidadRepository.findOne({
            where: { numero: updateArrendatarioDto.numeroDocumento },
          });

        if (documentoExistente) {
          const existingArrendatario =
            await this.arrendatarioRepository.findOne({
              where: {
                idDocumentoIdentidad: {
                  idDocumentoIdentidad: documentoExistente.idDocumentoIdentidad,
                },
                idArrendatario: Not(id),
                estaActivo: true,
              },
            });

          if (existingArrendatario) {
            return {
              success: false,
              message:
                'Ya existe otro arrendatario activo con este documento de identidad',
              data: null,
              error: { message: 'Documento de identidad duplicado' },
            };
          }
        }
      }

      // Preparar los datos de actualización
      const updateData: any = { ...updateArrendatarioDto };

      // Si se están actualizando los campos de documento, crear/actualizar DocumentoIdentidad
      if (
        updateArrendatarioDto.numeroDocumento ||
        updateArrendatarioDto.tipoDocumento
      ) {
        return await this.dataSource.transaction(async (manager) => {
          try {
            const documentoIdentidad =
              arrendatarioExistente.idDocumentoIdentidad;

            // Si se está cambiando el número o tipo de documento
            if (
              updateArrendatarioDto.numeroDocumento !==
                documentoIdentidad?.numero ||
              updateArrendatarioDto.tipoDocumento !==
                documentoIdentidad?.tipoDocumento
            ) {
              // Buscar o crear nuevo documento
              let nuevoDocumento = await manager.findOne(DocumentoIdentidad, {
                where: { numero: updateArrendatarioDto.numeroDocumento },
              });

              if (!nuevoDocumento) {
                nuevoDocumento = manager.create(DocumentoIdentidad, {
                  numero: updateArrendatarioDto.numeroDocumento,
                  tipoDocumento: updateArrendatarioDto.tipoDocumento as any,
                });
                nuevoDocumento = await manager.save(
                  DocumentoIdentidad,
                  nuevoDocumento,
                );
              }

              updateData.idDocumentoIdentidad = nuevoDocumento;
            }

            // Limpiar campos que no deben actualizarse directamente
            delete updateData.numeroDocumento;
            delete updateData.tipoDocumento;

            // Convertir relaciones a la estructura correcta
            if (updateArrendatarioDto.idUsuario) {
              updateData.idUsuario = {
                idUsuario: updateArrendatarioDto.idUsuario,
              };
            }
            if (updateArrendatarioDto.registradoPor) {
              updateData.registradoPor = {
                idUsuario: updateArrendatarioDto.registradoPor,
              };
            }

            // Actualizar fecha de actualización
            updateData.fechaActualizacion = new Date();

            // Actualizar los datos
            await manager.update(Arrendatario, id, updateData);

            // Obtener el arrendatario actualizado
            const arrendatarioActualizado = await manager.findOne(
              Arrendatario,
              {
                where: { idArrendatario: id },
                relations: [
                  'idDocumentoIdentidad',
                  'idUsuario',
                  'registradoPor',
                ],
              },
            );

            return {
              success: true,
              message: 'Arrendatario actualizado exitosamente',
              data: arrendatarioActualizado,
              error: null,
            };
          } catch (error) {
            return {
              success: false,
              message: 'Error al actualizar el arrendatario',
              data: null,
              error: { message: error.message },
            };
          }
        });
      }

      // Si no se están actualizando campos de documento, actualización simple
      // Convertir relaciones a la estructura correcta
      if (updateArrendatarioDto.idUsuario) {
        updateData.idUsuario = { idUsuario: updateArrendatarioDto.idUsuario };
      }
      if (updateArrendatarioDto.registradoPor) {
        updateData.registradoPor = {
          idUsuario: updateArrendatarioDto.registradoPor,
        };
      }

      // Actualizar fecha de actualización
      updateData.fechaActualizacion = new Date();

      // Actualizar los datos
      await this.arrendatarioRepository.update(id, updateData);

      // Obtener el arrendatario actualizado
      const arrendatarioActualizado = await this.arrendatarioRepository.findOne(
        {
          where: { idArrendatario: id },
          relations: ['idDocumentoIdentidad', 'idUsuario', 'registradoPor'],
        },
      );

      return {
        success: true,
        message: 'Arrendatario actualizado exitosamente',
        data: arrendatarioActualizado,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al actualizar el arrendatario',
        data: null,
        error: { message: error.message },
      };
    }
  }

  async remove(id: string): Promise<BaseResponseDto<void>> {
    try {
      // Verificar que el arrendatario exists
      const arrendatario = await this.arrendatarioRepository.findOne({
        where: { idArrendatario: id },
      });

      if (!arrendatario) {
        return {
          success: false,
          message: `Arrendatario con ID ${id} no encontrado`,
          data: null,
          error: { message: 'Arrendatario no encontrado' },
        };
      }

      // Marcar como inactivo en lugar de eliminar físicamente
      await this.arrendatarioRepository.update(id, {
        estaActivo: false,
        fechaActualizacion: new Date(),
      });

      return {
        success: true,
        message: 'Arrendatario eliminado (desactivado) exitosamente',
        data: null,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al eliminar el arrendatario',
        data: null,
        error: { message: error.message },
      };
    }
  }

  async findByDocumento(
    numeroDocumento: string,
  ): Promise<BaseResponseDto<Arrendatario>> {
    try {
      const arrendatario = await this.arrendatarioRepository.findOne({
        where: {
          idDocumentoIdentidad: { numero: Number(numeroDocumento) },
          estaActivo: true,
        },
        relations: ['idDocumentoIdentidad', 'idUsuario', 'registradoPor'],
      });

      if (!arrendatario) {
        return {
          success: false,
          message: `Arrendatario con documento ${numeroDocumento} no encontrado`,
          data: null,
          error: { message: 'Arrendatario no encontrado' },
        };
      }

      return {
        success: true,
        message: 'Arrendatario encontrado exitosamente',
        data: arrendatario,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al buscar arrendatario por documento',
        data: null,
        error: { message: error.message },
      };
    }
  }

  async findByEstado(estado: string): Promise<BaseResponseDto<Arrendatario[]>> {
    try {
      const arrendatarios = await this.arrendatarioRepository.find({
        where: { estadoVerificacion: estado },
        relations: ['idDocumentoIdentidad', 'idUsuario', 'registradoPor'],
        order: { fechaRegistro: 'DESC' },
      });

      return {
        success: true,
        message: `Arrendatarios con estado "${estado}" obtenidos exitosamente`,
        data: arrendatarios,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al obtener arrendatarios por estado',
        data: null,
        error: { message: error.message },
      };
    }
  }

  async verificarArrendatario(
    id: string,
  ): Promise<BaseResponseDto<Arrendatario>> {
    try {
      const arrendatario = await this.arrendatarioRepository.findOne({
        where: { idArrendatario: id },
      });

      if (!arrendatario) {
        return {
          success: false,
          message: `Arrendatario con ID ${id} no encontrado`,
          data: null,
          error: { message: 'Arrendatario no encontrado' },
        };
      }

      // Actualizar estado de verificación
      await this.arrendatarioRepository.update(id, {
        estadoVerificacion: 'verificado',
        fechaVerificacion: new Date(),
        fechaActualizacion: new Date(),
      });

      const arrendatarioVerificado = await this.arrendatarioRepository.findOne({
        where: { idArrendatario: id },
        relations: ['idDocumentoIdentidad', 'idUsuario', 'registradoPor'],
      });

      return {
        success: true,
        message: 'Arrendatario verificado exitosamente',
        data: arrendatarioVerificado,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al verificar el arrendatario',
        data: null,
        error: { message: error.message },
      };
    }
  }

  async findActiveArrendatarios(): Promise<BaseResponseDto<Arrendatario[]>> {
    try {
      const arrendatarios = await this.arrendatarioRepository.find({
        where: { estaActivo: true },
        relations: ['idDocumentoIdentidad', 'idUsuario', 'registradoPor'],
        order: { fechaRegistro: 'DESC' },
      });

      return {
        success: true,
        message: 'Arrendatarios activos obtenidos exitosamente',
        data: arrendatarios,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al obtener arrendatarios activos',
        data: null,
        error: { message: error.message },
      };
    }
  }

  async findByUsuario(
    usuarioId: string,
  ): Promise<BaseResponseDto<Arrendatario>> {
    try {
      const arrendatario = await this.arrendatarioRepository.findOne({
        where: {
          idUsuario: { idUsuario: usuarioId },
          estaActivo: true,
        },
        relations: ['idDocumentoIdentidad', 'idUsuario', 'registradoPor'],
      });

      if (!arrendatario) {
        return {
          success: false,
          message: `Arrendatario asociado al usuario ${usuarioId} no encontrado`,
          data: null,
          error: { message: 'Arrendatario no encontrado' },
        };
      }

      return {
        success: true,
        message: 'Arrendatario encontrado exitosamente',
        data: arrendatario,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al buscar arrendatario por usuario',
        data: null,
        error: { message: error.message },
      };
    }
  }
}

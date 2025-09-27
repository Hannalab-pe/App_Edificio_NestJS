import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import { Contacto } from 'src/entities/Contacto';
import { TipoContacto } from 'src/entities/TipoContacto';
import { TipoContrato } from 'src/entities/TipoContrato';
import { CreateContactoDto, UpdateContactoDto, ContactoResponseDto } from 'src/dtos/contacto';
import { BaseResponseDto } from 'src/dtos/baseResponse/baseResponse.dto';
import { IContactoService } from 'src/services/interfaces/contacto.interface';

@Injectable()
export class ContactoService implements IContactoService {
    constructor(
        @InjectRepository(Contacto)
        private readonly contactoRepository: Repository<Contacto>,
        @InjectRepository(TipoContacto)
        private readonly tipoContactoRepository: Repository<TipoContacto>,
        @InjectRepository(TipoContrato)
        private readonly tipoContratoRepository: Repository<TipoContrato>,
    ) { }

    async create(createContactoDto: CreateContactoDto): Promise<BaseResponseDto<ContactoResponseDto>> {
        if (!createContactoDto) {
            return BaseResponseDto.error('Ingrese datos válidos, Intente de Nuevo.', HttpStatus.BAD_REQUEST);
        }

        try {
            // Validar que tenga al menos correo o teléfono
            if (!createContactoDto.correo && !createContactoDto.telefono) {
                return BaseResponseDto.error('Debe proporcionar al menos un correo electrónico o teléfono.', HttpStatus.BAD_REQUEST);
            }

            // Validar que el TipoContacto exista
            const tipoContacto = await this.tipoContactoRepository.findOne({
                where: { idTipoContacto: createContactoDto.idTipoContacto },
            });

            if (!tipoContacto) {
                return BaseResponseDto.error('Tipo de contacto no encontrado.', HttpStatus.NOT_FOUND);
            }

            // Validar que el TipoContrato exista
            const tipoContrato = await this.tipoContratoRepository.findOne({
                where: { idTipoContrato: createContactoDto.idTipoContrato },
            });

            if (!tipoContrato) {
                return BaseResponseDto.error('Tipo de contrato no encontrado.', HttpStatus.NOT_FOUND);
            }

            // Validar correo único si se proporciona
            if (createContactoDto.correo) {
                const contactoExistente = await this.contactoRepository.findOne({
                    where: { correo: createContactoDto.correo },
                });

                if (contactoExistente) {
                    return BaseResponseDto.error('Ya existe un contacto con este correo electrónico.', HttpStatus.CONFLICT);
                }
            }

            // Validar compatibilidad de tipos
            const compatibilidadResult = await this.validarCompatibilidadTipos(
                createContactoDto.idTipoContacto,
                createContactoDto.idTipoContrato
            );

            if (!compatibilidadResult.success) {
                return BaseResponseDto.error(compatibilidadResult.message, HttpStatus.BAD_REQUEST);
            }

            // Crear el contacto
            const contactoData = {
                ...createContactoDto,
                idTipoContacto: tipoContacto,
                idTipoContrato: tipoContrato,
                estaActivo: createContactoDto.estaActivo ?? true,
            };

            const contacto = this.contactoRepository.create(contactoData);
            const contactoGuardado = await this.contactoRepository.save(contacto);

            // Obtener el contacto completo con relaciones
            const contactoCompleto = await this.contactoRepository.findOne({
                where: { idContacto: contactoGuardado.idContacto },
                relations: ['idTipoContacto', 'idTipoContrato', 'mantenimientos'],
            });

            if (!contactoCompleto) {
                return BaseResponseDto.error('Error al obtener el contacto creado.', HttpStatus.INTERNAL_SERVER_ERROR);
            }

            const responseDto = this.mapToResponseDto(contactoCompleto);

            return BaseResponseDto.success(responseDto, 'Contacto creado exitosamente.', HttpStatus.CREATED);
        } catch (error) {
            return BaseResponseDto.error('Error al crear el contacto: ' + error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async findAll(): Promise<BaseResponseDto<ContactoResponseDto[]>> {
        try {
            const contactos = await this.contactoRepository.find({
                relations: ['idTipoContacto', 'idTipoContrato', 'mantenimientos'],
                order: { nombre: 'ASC' },
            });

            const responseData = contactos.map(contacto => this.mapToResponseDto(contacto));

            const message = contactos.length > 0
                ? 'Contactos obtenidos exitosamente.'
                : 'No se encontraron contactos.';

            return BaseResponseDto.success(responseData, message, HttpStatus.OK);
        } catch (error) {
            return BaseResponseDto.error('Error al obtener contactos: ' + error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async findOne(id: string): Promise<BaseResponseDto<ContactoResponseDto>> {
        if (!id) {
            return BaseResponseDto.error('Ingrese un ID válido, Intente de Nuevo.', HttpStatus.BAD_REQUEST);
        }

        try {
            const contacto = await this.contactoRepository.findOne({
                where: { idContacto: id },
                relations: ['idTipoContacto', 'idTipoContrato', 'mantenimientos'],
            });

            if (!contacto) {
                return BaseResponseDto.error('Contacto no encontrado.', HttpStatus.NOT_FOUND);
            }

            const responseDto = this.mapToResponseDto(contacto);

            return BaseResponseDto.success(responseDto, 'Contacto obtenido exitosamente.', HttpStatus.OK);
        } catch (error) {
            return BaseResponseDto.error('Error al obtener el contacto: ' + error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async update(id: string, updateContactoDto: UpdateContactoDto): Promise<BaseResponseDto<ContactoResponseDto>> {
        if (!id || !updateContactoDto) {
            return BaseResponseDto.error('Ingrese datos válidos, Intente de Nuevo.', HttpStatus.BAD_REQUEST);
        }

        try {
            const contacto = await this.contactoRepository.findOne({
                where: { idContacto: id },
                relations: ['idTipoContacto', 'idTipoContrato'],
            });

            if (!contacto) {
                return BaseResponseDto.error('Contacto no encontrado.', HttpStatus.NOT_FOUND);
            }

            // Validar correo único si se está actualizando
            if (updateContactoDto.correo && updateContactoDto.correo !== contacto.correo) {
                const contactoExistente = await this.contactoRepository.findOne({
                    where: { correo: updateContactoDto.correo },
                });

                if (contactoExistente && contactoExistente.idContacto !== id) {
                    return BaseResponseDto.error('Ya existe un contacto con este correo electrónico.', HttpStatus.CONFLICT);
                }
            }

            // Validar TipoContacto si se está actualizando
            if (updateContactoDto.idTipoContacto) {
                const tipoContacto = await this.tipoContactoRepository.findOne({
                    where: { idTipoContacto: updateContactoDto.idTipoContacto },
                });

                if (!tipoContacto) {
                    return BaseResponseDto.error('Tipo de contacto no encontrado.', HttpStatus.NOT_FOUND);
                }
                contacto.idTipoContacto = tipoContacto;
            }

            // Validar TipoContrato si se está actualizando
            if (updateContactoDto.idTipoContrato) {
                const tipoContrato = await this.tipoContratoRepository.findOne({
                    where: { idTipoContrato: updateContactoDto.idTipoContrato },
                });

                if (!tipoContrato) {
                    return BaseResponseDto.error('Tipo de contrato no encontrado.', HttpStatus.NOT_FOUND);
                }
                contacto.idTipoContrato = tipoContrato;
            }

            // Validar compatibilidad si se actualizan los tipos
            if (updateContactoDto.idTipoContacto || updateContactoDto.idTipoContrato) {
                const idTipoContactoFinal = updateContactoDto.idTipoContacto || contacto.idTipoContacto.idTipoContacto;
                const idTipoContratoFinal = updateContactoDto.idTipoContrato || contacto.idTipoContrato.idTipoContrato;

                const compatibilidadResult = await this.validarCompatibilidadTipos(idTipoContactoFinal, idTipoContratoFinal);

                if (!compatibilidadResult.success) {
                    return BaseResponseDto.error(compatibilidadResult.message, HttpStatus.BAD_REQUEST);
                }
            }

            // Actualizar campos básicos
            const camposActualizar = ['nombre', 'descripcion', 'correo', 'telefono', 'direccion', 'imagenUrl', 'estaActivo'];
            camposActualizar.forEach(campo => {
                if (updateContactoDto[campo] !== undefined) {
                    contacto[campo] = updateContactoDto[campo];
                }
            });

            const contactoActualizado = await this.contactoRepository.save(contacto);

            // Obtener el contacto completo actualizado
            const contactoCompleto = await this.contactoRepository.findOne({
                where: { idContacto: contactoActualizado.idContacto },
                relations: ['idTipoContacto', 'idTipoContrato', 'mantenimientos'],
            });

            const responseDto = this.mapToResponseDto(contactoCompleto!);

            return BaseResponseDto.success(responseDto, 'Contacto actualizado exitosamente.', HttpStatus.OK);
        } catch (error) {
            return BaseResponseDto.error('Error al actualizar el contacto: ' + error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async remove(id: string): Promise<BaseResponseDto<void>> {
        if (!id) {
            return BaseResponseDto.error('Ingrese un ID válido, Intente de Nuevo.', HttpStatus.BAD_REQUEST);
        }

        try {
            const contacto = await this.contactoRepository.findOne({
                where: { idContacto: id },
                relations: ['mantenimientos'],
            });

            if (!contacto) {
                return BaseResponseDto.error('Contacto no encontrado.', HttpStatus.NOT_FOUND);
            }

            // Verificar que no tenga mantenimientos pendientes
            const mantenimientosPendientes = contacto.mantenimientos?.filter(m =>
                ['PENDIENTE', 'EN_PROGRESO', 'PROGRAMADO'].includes(m.estado)
            );

            if (mantenimientosPendientes && mantenimientosPendientes.length > 0) {
                return BaseResponseDto.error(
                    'No se puede eliminar el contacto porque tiene mantenimientos pendientes.',
                    HttpStatus.CONFLICT
                );
            }

            await this.contactoRepository.remove(contacto);

            return BaseResponseDto.success(undefined, 'Contacto eliminado exitosamente.', HttpStatus.OK);
        } catch (error) {
            return BaseResponseDto.error('Error al eliminar el contacto: ' + error.message, HttpStatus.BAD_REQUEST);
        }
    }

    // Operaciones específicas por tipo

    async findByTipoContacto(idTipoContacto: string): Promise<BaseResponseDto<ContactoResponseDto[]>> {
        try {
            const contactos = await this.contactoRepository.find({
                where: { idTipoContacto: { idTipoContacto } },
                relations: ['idTipoContacto', 'idTipoContrato', 'mantenimientos'],
                order: { nombre: 'ASC' },
            });

            const responseData = contactos.map(contacto => this.mapToResponseDto(contacto));

            const message = contactos.length > 0
                ? 'Contactos por tipo obtenidos exitosamente.'
                : 'No se encontraron contactos para este tipo.';

            return BaseResponseDto.success(responseData, message, HttpStatus.OK);
        } catch (error) {
            return BaseResponseDto.error('Error al obtener contactos por tipo: ' + error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async findByTipoContrato(idTipoContrato: string): Promise<BaseResponseDto<ContactoResponseDto[]>> {
        try {
            const contactos = await this.contactoRepository.find({
                where: { idTipoContrato: { idTipoContrato } },
                relations: ['idTipoContacto', 'idTipoContrato', 'mantenimientos'],
                order: { nombre: 'ASC' },
            });

            const responseData = contactos.map(contacto => this.mapToResponseDto(contacto));

            const message = contactos.length > 0
                ? 'Contactos por tipo de contrato obtenidos exitosamente.'
                : 'No se encontraron contactos para este tipo de contrato.';

            return BaseResponseDto.success(responseData, message, HttpStatus.OK);
        } catch (error) {
            return BaseResponseDto.error('Error al obtener contactos por tipo de contrato: ' + error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async findByTipos(idTipoContacto: string, idTipoContrato: string): Promise<BaseResponseDto<ContactoResponseDto[]>> {
        try {
            const contactos = await this.contactoRepository.find({
                where: {
                    idTipoContacto: { idTipoContacto },
                    idTipoContrato: { idTipoContrato }
                },
                relations: ['idTipoContacto', 'idTipoContrato', 'mantenimientos'],
                order: { nombre: 'ASC' },
            });

            const responseData = contactos.map(contacto => this.mapToResponseDto(contacto));

            const message = contactos.length > 0
                ? 'Contactos por tipos específicos obtenidos exitosamente.'
                : 'No se encontraron contactos para estos tipos específicos.';

            return BaseResponseDto.success(responseData, message, HttpStatus.OK);
        } catch (error) {
            return BaseResponseDto.error('Error al obtener contactos por tipos: ' + error.message, HttpStatus.BAD_REQUEST);
        }
    }

    // Gestión de disponibilidad

    async findActivos(): Promise<BaseResponseDto<ContactoResponseDto[]>> {
        try {
            const contactos = await this.contactoRepository.find({
                where: { estaActivo: true },
                relations: ['idTipoContacto', 'idTipoContrato', 'mantenimientos'],
                order: { nombre: 'ASC' },
            });

            const responseData = contactos.map(contacto => this.mapToResponseDto(contacto));

            const message = contactos.length > 0
                ? 'Contactos activos obtenidos exitosamente.'
                : 'No se encontraron contactos activos.';

            return BaseResponseDto.success(responseData, message, HttpStatus.OK);
        } catch (error) {
            return BaseResponseDto.error('Error al obtener contactos activos: ' + error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async findInactivos(): Promise<BaseResponseDto<ContactoResponseDto[]>> {
        try {
            const contactos = await this.contactoRepository.find({
                where: { estaActivo: false },
                relations: ['idTipoContacto', 'idTipoContrato', 'mantenimientos'],
                order: { nombre: 'ASC' },
            });

            const responseData = contactos.map(contacto => this.mapToResponseDto(contacto));

            const message = contactos.length > 0
                ? 'Contactos inactivos obtenidos exitosamente.'
                : 'No se encontraron contactos inactivos.';

            return BaseResponseDto.success(responseData, message, HttpStatus.OK);
        } catch (error) {
            return BaseResponseDto.error('Error al obtener contactos inactivos: ' + error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async activarContacto(id: string): Promise<BaseResponseDto<ContactoResponseDto>> {
        return this.cambiarEstadoContacto(id, true);
    }

    async desactivarContacto(id: string): Promise<BaseResponseDto<ContactoResponseDto>> {
        return this.cambiarEstadoContacto(id, false);
    }

    private async cambiarEstadoContacto(id: string, estado: boolean): Promise<BaseResponseDto<ContactoResponseDto>> {
        try {
            const contacto = await this.contactoRepository.findOne({
                where: { idContacto: id },
                relations: ['idTipoContacto', 'idTipoContrato', 'mantenimientos'],
            });

            if (!contacto) {
                return BaseResponseDto.error('Contacto no encontrado.', HttpStatus.NOT_FOUND);
            }

            contacto.estaActivo = estado;
            const contactoActualizado = await this.contactoRepository.save(contacto);

            const responseDto = this.mapToResponseDto(contactoActualizado);

            const mensaje = estado ? 'Contacto activado exitosamente.' : 'Contacto desactivado exitosamente.';

            return BaseResponseDto.success(responseDto, mensaje, HttpStatus.OK);
        } catch (error) {
            return BaseResponseDto.error('Error al cambiar estado del contacto: ' + error.message, HttpStatus.BAD_REQUEST);
        }
    }

    // Búsquedas específicas para mantenimiento

    async findContactosParaMantenimiento(tipoTrabajo: string): Promise<BaseResponseDto<ContactoResponseDto[]>> {
        try {
            const contactos = await this.contactoRepository.find({
                where: {
                    estaActivo: true,
                    idTipoContacto: { nombre: Like(`%${tipoTrabajo}%`) }
                },
                relations: ['idTipoContacto', 'idTipoContrato', 'mantenimientos'],
                order: { nombre: 'ASC' },
            });

            const responseData = contactos.map(contacto => this.mapToResponseDto(contacto));

            const message = contactos.length > 0
                ? `Contactos para ${tipoTrabajo} obtenidos exitosamente.`
                : `No se encontraron contactos para ${tipoTrabajo}.`;

            return BaseResponseDto.success(responseData, message, HttpStatus.OK);
        } catch (error) {
            return BaseResponseDto.error('Error al obtener contactos para mantenimiento: ' + error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async findContactosEmergencia(): Promise<BaseResponseDto<ContactoResponseDto[]>> {
        try {
            const contactos = await this.contactoRepository.find({
                where: {
                    estaActivo: true,
                    idTipoContacto: { nombre: 'SERVICIO_EMERGENCIA' }
                },
                relations: ['idTipoContacto', 'idTipoContrato', 'mantenimientos'],
                order: { nombre: 'ASC' },
            });

            const responseData = contactos.map(contacto => this.mapToResponseDto(contacto));

            const message = contactos.length > 0
                ? 'Contactos de emergencia obtenidos exitosamente.'
                : 'No se encontraron contactos de emergencia.';

            return BaseResponseDto.success(responseData, message, HttpStatus.OK);
        } catch (error) {
            return BaseResponseDto.error('Error al obtener contactos de emergencia: ' + error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async findContactosDisponibles(urgente: boolean = false): Promise<BaseResponseDto<ContactoResponseDto[]>> {
        try {
            const tiposPermitidos = urgente
                ? ['SERVICIO_EMERGENCIA', 'PROVEEDOR_SERVICIOS']
                : ['PROVEEDOR_SERVICIOS', 'EMPRESA_MANTENIMIENTO', 'CONTRATISTA_OBRA'];

            const contactos = await this.contactoRepository.find({
                where: {
                    estaActivo: true,
                    idTipoContacto: { nombre: In(tiposPermitidos) }
                },
                relations: ['idTipoContacto', 'idTipoContrato', 'mantenimientos'],
                order: { nombre: 'ASC' },
            });

            const responseData = contactos.map(contacto => this.mapToResponseDto(contacto));

            const tipoServicio = urgente ? 'emergencia' : 'servicio regular';
            const message = contactos.length > 0
                ? `Contactos disponibles para ${tipoServicio} obtenidos exitosamente.`
                : `No se encontraron contactos disponibles para ${tipoServicio}.`;

            return BaseResponseDto.success(responseData, message, HttpStatus.OK);
        } catch (error) {
            return BaseResponseDto.error('Error al obtener contactos disponibles: ' + error.message, HttpStatus.BAD_REQUEST);
        }
    }

    // Búsquedas por información de contacto

    async findByEmail(email: string): Promise<BaseResponseDto<ContactoResponseDto>> {
        try {
            const contacto = await this.contactoRepository.findOne({
                where: { correo: email },
                relations: ['idTipoContacto', 'idTipoContrato', 'mantenimientos'],
            });

            if (!contacto) {
                return BaseResponseDto.error('No se encontró contacto con este email.', HttpStatus.NOT_FOUND);
            }

            const responseDto = this.mapToResponseDto(contacto);

            return BaseResponseDto.success(responseDto, 'Contacto obtenido por email exitosamente.', HttpStatus.OK);
        } catch (error) {
            return BaseResponseDto.error('Error al buscar contacto por email: ' + error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async findByTelefono(telefono: string): Promise<BaseResponseDto<ContactoResponseDto[]>> {
        try {
            const contactos = await this.contactoRepository.find({
                where: { telefono: Like(`%${telefono}%`) },
                relations: ['idTipoContacto', 'idTipoContrato', 'mantenimientos'],
                order: { nombre: 'ASC' },
            });

            const responseData = contactos.map(contacto => this.mapToResponseDto(contacto));

            const message = contactos.length > 0
                ? 'Contactos por teléfono obtenidos exitosamente.'
                : 'No se encontraron contactos con este teléfono.';

            return BaseResponseDto.success(responseData, message, HttpStatus.OK);
        } catch (error) {
            return BaseResponseDto.error('Error al buscar contactos por teléfono: ' + error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async buscarPorNombre(nombre: string): Promise<BaseResponseDto<ContactoResponseDto[]>> {
        try {
            const contactos = await this.contactoRepository.find({
                where: { nombre: Like(`%${nombre}%`) },
                relations: ['idTipoContacto', 'idTipoContrato', 'mantenimientos'],
                order: { nombre: 'ASC' },
            });

            const responseData = contactos.map(contacto => this.mapToResponseDto(contacto));

            const message = contactos.length > 0
                ? 'Contactos por nombre obtenidos exitosamente.'
                : 'No se encontraron contactos con este nombre.';

            return BaseResponseDto.success(responseData, message, HttpStatus.OK);
        } catch (error) {
            return BaseResponseDto.error('Error al buscar contactos por nombre: ' + error.message, HttpStatus.BAD_REQUEST);
        }
    }

    // Validaciones de negocio

    async validarCompatibilidadTipos(idTipoContacto: string, idTipoContrato: string): Promise<BaseResponseDto<boolean>> {
        try {
            const tipoContacto = await this.tipoContactoRepository.findOne({
                where: { idTipoContacto },
            });

            const tipoContrato = await this.tipoContratoRepository.findOne({
                where: { idTipoContrato },
            });

            if (!tipoContacto || !tipoContrato) {
                return BaseResponseDto.error('Tipos de contacto o contrato no encontrados.', HttpStatus.NOT_FOUND);
            }

            // Lógica de compatibilidad basada en combinaciones válidas
            const compatibilidades = {
                'PROVEEDOR_SERVICIOS': ['POR_HORAS', 'EMERGENCIA', 'MANTENIMIENTO_PREVENTIVO'],
                'EMPRESA_MANTENIMIENTO': ['MENSUAL', 'MANTENIMIENTO_PREVENTIVO', 'POR_PROYECTO'],
                'CONTRATISTA_OBRA': ['POR_PROYECTO', 'POR_HORAS'],
                'PROVEEDOR_SUMINISTROS': ['SUMINISTRO', 'MENSUAL'],
                'SERVICIO_EMERGENCIA': ['EMERGENCIA', 'POR_HORAS'],
                'CONSULTOR_TECNICO': ['POR_PROYECTO', 'POR_HORAS'],
            };

            const tiposCompatibles = compatibilidades[tipoContacto.nombre] || [];
            const esCompatible = tiposCompatibles.includes(tipoContrato.nombre);

            if (!esCompatible) {
                return BaseResponseDto.error(
                    `El tipo de contacto "${tipoContacto.nombre}" no es compatible con el tipo de contrato "${tipoContrato.nombre}".`,
                    HttpStatus.BAD_REQUEST
                );
            }

            return BaseResponseDto.success(true, 'Tipos compatibles.', HttpStatus.OK);
        } catch (error) {
            return BaseResponseDto.error('Error al validar compatibilidad: ' + error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async verificarDisponibilidad(id: string): Promise<BaseResponseDto<boolean>> {
        try {
            const contacto = await this.contactoRepository.findOne({
                where: { idContacto: id },
                relations: ['mantenimientos'],
            });

            if (!contacto) {
                return BaseResponseDto.error('Contacto no encontrado.', HttpStatus.NOT_FOUND);
            }

            if (!contacto.estaActivo) {
                return BaseResponseDto.success(false, 'Contacto inactivo.', HttpStatus.OK);
            }

            // Verificar mantenimientos pendientes o en progreso
            const mantenimientosPendientes = contacto.mantenimientos?.filter(m =>
                ['PENDIENTE', 'EN_PROGRESO', 'PROGRAMADO'].includes(m.estado)
            );

            const disponible = !mantenimientosPendientes || mantenimientosPendientes.length === 0;

            const mensaje = disponible
                ? 'Contacto disponible para asignación.'
                : 'Contacto ocupado con mantenimientos pendientes.';

            return BaseResponseDto.success(disponible, mensaje, HttpStatus.OK);
        } catch (error) {
            return BaseResponseDto.error('Error al verificar disponibilidad: ' + error.message, HttpStatus.BAD_REQUEST);
        }
    }

    // Estadísticas y reportes

    async obtenerEstadisticasContacto(id: string): Promise<BaseResponseDto<any>> {
        try {
            const contacto = await this.contactoRepository.findOne({
                where: { idContacto: id },
                relations: ['mantenimientos', 'idTipoContacto', 'idTipoContrato'],
            });

            if (!contacto) {
                return BaseResponseDto.error('Contacto no encontrado.', HttpStatus.NOT_FOUND);
            }

            const mantenimientos = contacto.mantenimientos || [];

            const estadisticas = {
                contacto: {
                    id: contacto.idContacto,
                    nombre: contacto.nombre,
                    tipoContacto: contacto.idTipoContacto.nombre,
                    tipoContrato: contacto.idTipoContrato.nombre,
                    estaActivo: contacto.estaActivo,
                },
                mantenimientos: {
                    total: mantenimientos.length,
                    completados: mantenimientos.filter(m => m.estado === 'COMPLETADO').length,
                    pendientes: mantenimientos.filter(m => ['PENDIENTE', 'PROGRAMADO'].includes(m.estado)).length,
                    enProgreso: mantenimientos.filter(m => m.estado === 'EN_PROGRESO').length,
                    cancelados: mantenimientos.filter(m => m.estado === 'CANCELADO').length,
                },
                fechaUltimoMantenimiento: mantenimientos.length > 0
                    ? mantenimientos.sort((a, b) => new Date(b.fechaInicio).getTime() - new Date(a.fechaInicio).getTime())[0].fechaInicio
                    : null,
            };

            return BaseResponseDto.success(estadisticas, 'Estadísticas del contacto obtenidas exitosamente.', HttpStatus.OK);
        } catch (error) {
            return BaseResponseDto.error('Error al obtener estadísticas: ' + error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async obtenerResumenPorTipo(): Promise<BaseResponseDto<any>> {
        try {
            const resumen = await this.contactoRepository
                .createQueryBuilder('contacto')
                .select('tipoContacto.nombre', 'tipoContacto')
                .addSelect('tipoContrato.nombre', 'tipoContrato')
                .addSelect('COUNT(contacto.idContacto)', 'total')
                .addSelect('SUM(CASE WHEN contacto.estaActivo = true THEN 1 ELSE 0 END)', 'activos')
                .addSelect('SUM(CASE WHEN contacto.estaActivo = false THEN 1 ELSE 0 END)', 'inactivos')
                .leftJoin('contacto.idTipoContacto', 'tipoContacto')
                .leftJoin('contacto.idTipoContrato', 'tipoContrato')
                .groupBy('tipoContacto.nombre')
                .addGroupBy('tipoContrato.nombre')
                .getRawMany();

            return BaseResponseDto.success(resumen, 'Resumen por tipo obtenido exitosamente.', HttpStatus.OK);
        } catch (error) {
            return BaseResponseDto.error('Error al obtener resumen por tipo: ' + error.message, HttpStatus.BAD_REQUEST);
        }
    }

    // Método auxiliar para mapear entidad a DTO de respuesta

    private mapToResponseDto(contacto: Contacto): ContactoResponseDto {
        const responseDto = new ContactoResponseDto();
        responseDto.idContacto = contacto.idContacto;
        responseDto.nombre = contacto.nombre;
        responseDto.descripcion = contacto.descripcion || undefined;
        responseDto.correo = contacto.correo || undefined;
        responseDto.telefono = contacto.telefono || undefined;
        responseDto.direccion = contacto.direccion || undefined;
        responseDto.imagenUrl = contacto.imagenUrl || undefined;
        responseDto.estaActivo = contacto.estaActivo;

        // Mapear tipo de contacto
        if (contacto.idTipoContacto) {
            responseDto.tipoContacto = {
                idTipoContacto: contacto.idTipoContacto.idTipoContacto,
                nombre: contacto.idTipoContacto.nombre,
                descripcion: contacto.idTipoContacto.descripcion || undefined,
            };
        }

        // Mapear tipo de contrato
        if (contacto.idTipoContrato) {
            responseDto.tipoContrato = {
                idTipoContrato: contacto.idTipoContrato.idTipoContrato,
                nombre: contacto.idTipoContrato.nombre,
                descripcion: contacto.idTipoContrato.descripcion || undefined,
            };
        }

        // Contar mantenimientos
        responseDto.totalMantenimientos = contacto.mantenimientos?.length || 0;

        return responseDto;
    }
}

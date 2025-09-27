import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { MensajePrivado } from '../../../entities/MensajePrivado';
import { Usuario } from '../../../entities/Usuario';
import { IMensajePrivadoService } from '../../interfaces/mensaje-privado.interface';
import { CreateMensajePrivadoDto } from '../../../dtos/mensaje-privado/create-mensaje-privado.dto';
import { UpdateMensajePrivadoDto } from '../../../dtos/mensaje-privado/update-mensaje-privado.dto';
import { MensajePrivadoResponseDto } from '../../../dtos/mensaje-privado/mensaje-privado-response.dto';

@Injectable()
export class MensajePrivadoService implements IMensajePrivadoService {
    constructor(
        @InjectRepository(MensajePrivado)
        private readonly mensajePrivadoRepository: Repository<MensajePrivado>,
        @InjectRepository(Usuario)
        private readonly usuarioRepository: Repository<Usuario>,
        @Inject(DataSource)
        private readonly dataSource: DataSource,
    ) { }

    async create(createMensajePrivadoDto: CreateMensajePrivadoDto): Promise<MensajePrivado> {
        return await this.dataSource.transaction(async (manager) => {
            const mensajeRepository = manager.getRepository(MensajePrivado);
            const usuarioRepository = manager.getRepository(Usuario);

            // Verificar que el receptor existe
            const receptor = await usuarioRepository.findOne({
                where: { idUsuario: createMensajePrivadoDto.receptorUsuario },
            });

            if (!receptor) {
                throw new NotFoundException(
                    `Usuario receptor con ID ${createMensajePrivadoDto.receptorUsuario} no encontrado`,
                );
            }

            // Si es una respuesta, verificar que el mensaje padre existe
            let mensajePadre: MensajePrivado | null | undefined = undefined;
            if (createMensajePrivadoDto.mensajePadreId) {
                mensajePadre = await mensajeRepository.findOne({
                    where: { idMensaje: createMensajePrivadoDto.mensajePadreId },
                });

                if (!mensajePadre) {
                    throw new NotFoundException(
                        `Mensaje padre con ID ${createMensajePrivadoDto.mensajePadreId} no encontrado`,
                    );
                }
            }

            // Crear el nuevo mensaje
            const nuevoMensaje = mensajeRepository.create({
                asunto: createMensajePrivadoDto.asunto,
                contenido: createMensajePrivadoDto.contenido,
                receptorUsuario: createMensajePrivadoDto.receptorUsuario,
                archivoAdjuntoUrl: createMensajePrivadoDto.archivoAdjuntoUrl,
                mensajePadre: mensajePadre || undefined,
                fechaEnvio: new Date(),
                leido: false,
                fechaLectura: null,
            });

            const mensajeGuardado = await mensajeRepository.save(nuevoMensaje);

            // Cargar el mensaje completo con relaciones
            const mensajeCompleto = await mensajeRepository.findOne({
                where: { idMensaje: mensajeGuardado.idMensaje },
                relations: ['emisorUsuario', 'receptorUsuario2', 'mensajePadre'],
            });

            if (!mensajeCompleto) {
                throw new Error('Error al recuperar el mensaje creado');
            }

            return mensajeCompleto;
        });
    }

    async findAll(): Promise<MensajePrivado[]> {
        return await this.mensajePrivadoRepository.find({
            relations: ['emisorUsuario', 'receptorUsuario2', 'mensajePadre', 'mensajePrivados'],
            order: { fechaEnvio: 'DESC' },
        });
    }

    async findOne(id: string): Promise<MensajePrivado> {
        const mensaje = await this.mensajePrivadoRepository.findOne({
            where: { idMensaje: id },
            relations: ['emisorUsuario', 'receptorUsuario2', 'mensajePadre', 'mensajePrivados'],
        });

        if (!mensaje) {
            throw new NotFoundException(`Mensaje con ID ${id} no encontrado`);
        }

        return mensaje;
    }

    async update(id: string, updateMensajePrivadoDto: UpdateMensajePrivadoDto): Promise<MensajePrivado> {
        const mensaje = await this.findOne(id);

        // Actualizar solo los campos permitidos
        if (updateMensajePrivadoDto.asunto !== undefined) {
            mensaje.asunto = updateMensajePrivadoDto.asunto;
        }
        if (updateMensajePrivadoDto.contenido !== undefined) {
            mensaje.contenido = updateMensajePrivadoDto.contenido;
        }
        if (updateMensajePrivadoDto.leido !== undefined) {
            mensaje.leido = updateMensajePrivadoDto.leido;
            // Si se marca como leído, actualizar fecha de lectura
            if (updateMensajePrivadoDto.leido && !mensaje.fechaLectura) {
                mensaje.fechaLectura = new Date();
            }
        }
        if (updateMensajePrivadoDto.archivoAdjuntoUrl !== undefined) {
            mensaje.archivoAdjuntoUrl = updateMensajePrivadoDto.archivoAdjuntoUrl;
        }

        return await this.mensajePrivadoRepository.save(mensaje);
    }

    async remove(id: string): Promise<void> {
        const mensaje = await this.findOne(id);

        // Verificar que no tiene respuestas
        const respuestas = await this.mensajePrivadoRepository.find({
            where: { mensajePadre: { idMensaje: id } },
        });

        if (respuestas.length > 0) {
            throw new BadRequestException(
                'No se puede eliminar un mensaje que tiene respuestas',
            );
        }

        await this.mensajePrivadoRepository.remove(mensaje);
    }

    async findByUsuario(usuarioId: string): Promise<MensajePrivado[]> {
        // Verificar que el usuario existe
        const usuario = await this.usuarioRepository.findOne({
            where: { idUsuario: usuarioId },
        });

        if (!usuario) {
            throw new NotFoundException(`Usuario con ID ${usuarioId} no encontrado`);
        }

        // Buscar mensajes donde el usuario es emisor o receptor
        return await this.mensajePrivadoRepository
            .createQueryBuilder('mensaje')
            .leftJoinAndSelect('mensaje.emisorUsuario', 'emisor')
            .leftJoinAndSelect('mensaje.receptorUsuario2', 'receptor')
            .leftJoinAndSelect('mensaje.mensajePadre', 'padre')
            .where('mensaje.emisorUsuario = :usuarioId OR mensaje.receptorUsuario = :usuarioId', {
                usuarioId,
            })
            .orderBy('mensaje.fechaEnvio', 'DESC')
            .getMany();
    }

    async findConversation(emisorId: string, receptorId: string): Promise<MensajePrivado[]> {
        // Verificar que ambos usuarios existen
        const [emisor, receptor] = await Promise.all([
            this.usuarioRepository.findOne({ where: { idUsuario: emisorId } }),
            this.usuarioRepository.findOne({ where: { idUsuario: receptorId } }),
        ]);

        if (!emisor) {
            throw new NotFoundException(`Usuario emisor con ID ${emisorId} no encontrado`);
        }

        if (!receptor) {
            throw new NotFoundException(`Usuario receptor con ID ${receptorId} no encontrado`);
        }

        // Buscar conversación entre los dos usuarios
        return await this.mensajePrivadoRepository
            .createQueryBuilder('mensaje')
            .leftJoinAndSelect('mensaje.emisorUsuario', 'emisor')
            .leftJoinAndSelect('mensaje.receptorUsuario2', 'receptorInfo')
            .leftJoinAndSelect('mensaje.mensajePadre', 'padre')
            .leftJoinAndSelect('mensaje.mensajePrivados', 'respuestas')
            .where(
                '(mensaje.emisorUsuario = :emisorId AND mensaje.receptorUsuario = :receptorId) OR ' +
                '(mensaje.emisorUsuario = :receptorId AND mensaje.receptorUsuario = :emisorId)',
                { emisorId, receptorId },
            )
            .orderBy('mensaje.fechaEnvio', 'ASC')
            .getMany();
    }

    async markAsRead(id: string): Promise<MensajePrivado> {
        const mensaje = await this.findOne(id);

        if (mensaje.leido) {
            throw new BadRequestException('El mensaje ya está marcado como leído');
        }

        mensaje.leido = true;
        mensaje.fechaLectura = new Date();

        return await this.mensajePrivadoRepository.save(mensaje);
    }

    async findUnreadByUsuario(usuarioId: string): Promise<MensajePrivado[]> {
        // Verificar que el usuario existe
        const usuario = await this.usuarioRepository.findOne({
            where: { idUsuario: usuarioId },
        });

        if (!usuario) {
            throw new NotFoundException(`Usuario con ID ${usuarioId} no encontrado`);
        }

        return await this.mensajePrivadoRepository.find({
            where: {
                receptorUsuario: usuarioId,
                leido: false,
            },
            relations: ['emisorUsuario', 'mensajePadre'],
            order: { fechaEnvio: 'DESC' },
        });
    }

    async countUnreadByUsuario(usuarioId: string): Promise<number> {
        // Verificar que el usuario existe
        const usuario = await this.usuarioRepository.findOne({
            where: { idUsuario: usuarioId },
        });

        if (!usuario) {
            throw new NotFoundException(`Usuario con ID ${usuarioId} no encontrado`);
        }

        return await this.mensajePrivadoRepository.count({
            where: {
                receptorUsuario: usuarioId,
                leido: false,
            },
        });
    }

    // Método auxiliar para formatear la respuesta
    formatMensajeForResponse(mensaje: MensajePrivado): MensajePrivadoResponseDto {
        return {
            idMensaje: mensaje.idMensaje,
            asunto: mensaje.asunto,
            contenido: mensaje.contenido,
            fechaEnvio: mensaje.fechaEnvio || new Date(),
            fechaLectura: mensaje.fechaLectura,
            leido: mensaje.leido || false,
            archivoAdjuntoUrl: mensaje.archivoAdjuntoUrl,
            receptorUsuario: mensaje.receptorUsuario,
            emisorUsuario: mensaje.emisorUsuario
                ? {
                    idUsuario: mensaje.emisorUsuario.idUsuario,
                    correo: mensaje.emisorUsuario.correo,
                }
                : {
                    idUsuario: '',
                    correo: '',
                },
            receptorUsuarioInfo: mensaje.receptorUsuario2
                ? {
                    idUsuario: mensaje.receptorUsuario2.idUsuario,
                    correo: mensaje.receptorUsuario2.correo,
                }
                : null,
            mensajePadre: mensaje.mensajePadre
                ? {
                    idMensaje: mensaje.mensajePadre.idMensaje,
                    asunto: mensaje.mensajePadre.asunto,
                    fechaEnvio: mensaje.mensajePadre.fechaEnvio || new Date(),
                }
                : null,
            respuestas: mensaje.mensajePrivados
                ? mensaje.mensajePrivados.map((respuesta) => ({
                    idMensaje: respuesta.idMensaje,
                    asunto: respuesta.asunto,
                    fechaEnvio: respuesta.fechaEnvio || new Date(),
                    leido: respuesta.leido || false,
                }))
                : [],
        };
    }
}

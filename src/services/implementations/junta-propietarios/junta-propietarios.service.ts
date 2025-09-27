import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Between } from 'typeorm';
import { JuntaPropietarios } from '../../../entities/JuntaPropietarios';
import { Documento } from '../../../entities/Documento';
import { Usuario } from '../../../entities/Usuario';
import { TipoDocumento } from '../../../entities/TipoDocumento';
import { Trabajador } from '../../../entities/Trabajador';
import { IJuntaPropietariosService } from '../../interfaces/junta-propietarios.interface';
import { CreateJuntaPropietariosDto } from '../../../dtos/junta-propietarios/create-junta-propietarios.dto';
import { UpdateJuntaPropietariosDto } from '../../../dtos/junta-propietarios/update-junta-propietarios.dto';
import { JuntaPropietariosResponseDto } from '../../../dtos/junta-propietarios/junta-propietarios-response.dto';
import { BaseResponseDto } from '../../../dtos/baseResponse/baseResponse.dto';

@Injectable()
export class JuntaPropietariosService implements IJuntaPropietariosService {
    constructor(
        @InjectRepository(JuntaPropietarios)
        private readonly juntaPropietariosRepository: Repository<JuntaPropietarios>,
        @InjectRepository(Documento)
        private readonly documentoRepository: Repository<Documento>,
        @InjectRepository(Usuario)
        private readonly usuarioRepository: Repository<Usuario>,
        @InjectRepository(TipoDocumento)
        private readonly tipoDocumentoRepository: Repository<TipoDocumento>,
        @InjectRepository(Trabajador)
        private readonly trabajadorRepository: Repository<Trabajador>,
        private readonly dataSource: DataSource,
    ) { }

    async create(createJuntaPropietariosDto: CreateJuntaPropietariosDto): Promise<BaseResponseDto<JuntaPropietariosResponseDto>> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // Validar que el usuario existe
            const usuario = await this.usuarioRepository.findOne({
                where: { idUsuario: createJuntaPropietariosDto.creadoPor }
            });
            if (!usuario) {
                throw new NotFoundException('Usuario no encontrado');
            }

            // Validar que el tipo de documento existe
            const tipoDocumento = await this.tipoDocumentoRepository.findOne({
                where: { idTipoDocumento: createJuntaPropietariosDto.idTipoDocumento }
            });
            if (!tipoDocumento) {
                throw new NotFoundException('Tipo de documento no encontrado');
            }

            // Validar que el trabajador existe
            const trabajador = await this.trabajadorRepository.findOne({
                where: { idTrabajador: createJuntaPropietariosDto.idTrabajador }
            });
            if (!trabajador) {
                throw new NotFoundException('Trabajador no encontrado');
            }

            // Verificar que no existe otra junta con el mismo número de acta
            const juntaExistente = await this.juntaPropietariosRepository.findOne({
                where: { numeroActa: createJuntaPropietariosDto.numeroActa }
            });
            if (juntaExistente) {
                throw new BadRequestException('Ya existe una junta con este número de acta');
            }

            // Crear el documento asociado
            const documento = this.documentoRepository.create({
                urlDocumento: createJuntaPropietariosDto.urlDocumento,
                descripcion: createJuntaPropietariosDto.descripcionDocumento,
                idTipoDocumento: tipoDocumento,
                idTrabajador: trabajador,
            });
            const documentoCreado = await queryRunner.manager.save(documento);

            // Crear la junta de propietarios
            const juntaPropietarios = this.juntaPropietariosRepository.create({
                numeroActa: createJuntaPropietariosDto.numeroActa,
                fechaJunta: createJuntaPropietariosDto.fechaJunta,
                tipoJunta: createJuntaPropietariosDto.tipoJunta,
                asistentesCount: createJuntaPropietariosDto.asistentesCount,
                quorumAlcanzado: createJuntaPropietariosDto.quorumAlcanzado,
                estado: createJuntaPropietariosDto.estado,
                resumen: createJuntaPropietariosDto.resumen,
                creadoPor: usuario,
                idDocumento: documentoCreado,
            });

            const juntaCreada = await queryRunner.manager.save(juntaPropietarios);
            await queryRunner.commitTransaction();

            // Obtener la junta completa con sus relaciones
            const juntaCompleta = await this.findOne(juntaCreada.idJunta);

            return {
                success: true,
                message: 'Junta de propietarios creada exitosamente',
                data: juntaCompleta.data,
            };

        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async findAll(): Promise<BaseResponseDto<JuntaPropietariosResponseDto[]>> {
        try {
            const juntas = await this.juntaPropietariosRepository.find({
                relations: {
                    creadoPor: true,
                    idDocumento: {
                        idTipoDocumento: true,
                        idTrabajador: true,
                    },
                },
                order: { fechaJunta: 'DESC' },
            });

            const juntasFormateadas = juntas.map(junta => this.formatJuntaForResponse(junta));

            return {
                success: true,
                message: 'Juntas de propietarios obtenidas exitosamente',
                data: juntasFormateadas,
            };
        } catch (error) {
            throw new BadRequestException('Error al obtener las juntas de propietarios');
        }
    }

    async findOne(id: string): Promise<BaseResponseDto<JuntaPropietariosResponseDto>> {
        try {
            const junta = await this.juntaPropietariosRepository.findOne({
                where: { idJunta: id },
                relations: {
                    creadoPor: true,
                    idDocumento: {
                        idTipoDocumento: true,
                        idTrabajador: true,
                    },
                },
            });

            if (!junta) {
                throw new NotFoundException('Junta de propietarios no encontrada');
            }

            return {
                success: true,
                message: 'Junta de propietarios obtenida exitosamente',
                data: this.formatJuntaForResponse(junta),
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException('Error al obtener la junta de propietarios');
        }
    }

    async update(id: string, updateJuntaPropietariosDto: UpdateJuntaPropietariosDto): Promise<BaseResponseDto<JuntaPropietariosResponseDto>> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const junta = await this.juntaPropietariosRepository.findOne({
                where: { idJunta: id },
                relations: { idDocumento: true },
            });

            if (!junta) {
                throw new NotFoundException('Junta de propietarios no encontrada');
            }

            // Verificar número de acta único si se está actualizando
            if (updateJuntaPropietariosDto.numeroActa && updateJuntaPropietariosDto.numeroActa !== junta.numeroActa) {
                const juntaExistente = await this.juntaPropietariosRepository.findOne({
                    where: { numeroActa: updateJuntaPropietariosDto.numeroActa }
                });
                if (juntaExistente) {
                    throw new BadRequestException('Ya existe una junta con este número de acta');
                }
            }

            // Actualizar campos de la junta
            Object.assign(junta, {
                numeroActa: updateJuntaPropietariosDto.numeroActa ?? junta.numeroActa,
                fechaJunta: updateJuntaPropietariosDto.fechaJunta ?? junta.fechaJunta,
                tipoJunta: updateJuntaPropietariosDto.tipoJunta ?? junta.tipoJunta,
                asistentesCount: updateJuntaPropietariosDto.asistentesCount ?? junta.asistentesCount,
                quorumAlcanzado: updateJuntaPropietariosDto.quorumAlcanzado ?? junta.quorumAlcanzado,
                estado: updateJuntaPropietariosDto.estado ?? junta.estado,
                resumen: updateJuntaPropietariosDto.resumen ?? junta.resumen,
            });

            await queryRunner.manager.save(junta);

            // Actualizar documento si se proporcionan datos
            if (updateJuntaPropietariosDto.urlDocumento ||
                updateJuntaPropietariosDto.descripcionDocumento ||
                updateJuntaPropietariosDto.idTipoDocumento) {

                const documento = junta.idDocumento;

                if (updateJuntaPropietariosDto.idTipoDocumento) {
                    const tipoDocumento = await this.tipoDocumentoRepository.findOne({
                        where: { idTipoDocumento: updateJuntaPropietariosDto.idTipoDocumento }
                    });
                    if (!tipoDocumento) {
                        throw new NotFoundException('Tipo de documento no encontrado');
                    }
                    documento.idTipoDocumento = tipoDocumento;
                }

                Object.assign(documento, {
                    urlDocumento: updateJuntaPropietariosDto.urlDocumento ?? documento.urlDocumento,
                    descripcion: updateJuntaPropietariosDto.descripcionDocumento ?? documento.descripcion,
                });

                await queryRunner.manager.save(documento);
            }

            await queryRunner.commitTransaction();

            // Obtener la junta actualizada
            const juntaActualizada = await this.findOne(id);

            return {
                success: true,
                message: 'Junta de propietarios actualizada exitosamente',
                data: juntaActualizada.data,
            };

        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async remove(id: string): Promise<BaseResponseDto<void>> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const junta = await this.juntaPropietariosRepository.findOne({
                where: { idJunta: id },
                relations: { idDocumento: true },
            });

            if (!junta) {
                throw new NotFoundException('Junta de propietarios no encontrada');
            }

            // Eliminar la junta (esto también eliminará el documento por cascada)
            await queryRunner.manager.remove(junta);
            await queryRunner.commitTransaction();

            return {
                success: true,
                message: 'Junta de propietarios eliminada exitosamente',
                data: undefined,
            };

        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async findByEstado(estado: string): Promise<BaseResponseDto<JuntaPropietariosResponseDto[]>> {
        try {
            const juntas = await this.juntaPropietariosRepository.find({
                where: { estado },
                relations: {
                    creadoPor: true,
                    idDocumento: {
                        idTipoDocumento: true,
                        idTrabajador: true,
                    },
                },
                order: { fechaJunta: 'DESC' },
            });

            const juntasFormateadas = juntas.map(junta => this.formatJuntaForResponse(junta));

            return {
                success: true,
                message: `Juntas con estado '${estado}' obtenidas exitosamente`,
                data: juntasFormateadas,
            };
        } catch (error) {
            throw new BadRequestException('Error al obtener las juntas por estado');
        }
    }

    async findByFechaRange(fechaInicio: string, fechaFin: string): Promise<BaseResponseDto<JuntaPropietariosResponseDto[]>> {
        try {
            const juntas = await this.juntaPropietariosRepository.find({
                where: {
                    fechaJunta: Between(fechaInicio, fechaFin),
                },
                relations: {
                    creadoPor: true,
                    idDocumento: {
                        idTipoDocumento: true,
                        idTrabajador: true,
                    },
                },
                order: { fechaJunta: 'DESC' },
            });

            const juntasFormateadas = juntas.map(junta => this.formatJuntaForResponse(junta));

            return {
                success: true,
                message: 'Juntas en el rango de fechas obtenidas exitosamente',
                data: juntasFormateadas,
            };
        } catch (error) {
            throw new BadRequestException('Error al obtener las juntas por rango de fechas');
        }
    }

    async findByNumeroActa(numeroActa: string): Promise<BaseResponseDto<JuntaPropietariosResponseDto>> {
        try {
            const junta = await this.juntaPropietariosRepository.findOne({
                where: { numeroActa },
                relations: {
                    creadoPor: true,
                    idDocumento: {
                        idTipoDocumento: true,
                        idTrabajador: true,
                    },
                },
            });

            if (!junta) {
                throw new NotFoundException('Junta de propietarios no encontrada con ese número de acta');
            }

            return {
                success: true,
                message: 'Junta de propietarios obtenida exitosamente',
                data: this.formatJuntaForResponse(junta),
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException('Error al obtener la junta por número de acta');
        }
    }

    async findByTipoJunta(tipoJunta: string): Promise<BaseResponseDto<JuntaPropietariosResponseDto[]>> {
        try {
            const juntas = await this.juntaPropietariosRepository.find({
                where: { tipoJunta },
                relations: {
                    creadoPor: true,
                    idDocumento: {
                        idTipoDocumento: true,
                        idTrabajador: true,
                    },
                },
                order: { fechaJunta: 'DESC' },
            });

            const juntasFormateadas = juntas.map(junta => this.formatJuntaForResponse(junta));

            return {
                success: true,
                message: `Juntas de tipo '${tipoJunta}' obtenidas exitosamente`,
                data: juntasFormateadas,
            };
        } catch (error) {
            throw new BadRequestException('Error al obtener las juntas por tipo');
        }
    }

    async updateDocumento(
        idJunta: string,
        urlDocumento: string,
        descripcion: string,
        idTipoDocumento: string
    ): Promise<BaseResponseDto<JuntaPropietariosResponseDto>> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const junta = await this.juntaPropietariosRepository.findOne({
                where: { idJunta },
                relations: { idDocumento: true },
            });

            if (!junta) {
                throw new NotFoundException('Junta de propietarios no encontrada');
            }

            const tipoDocumento = await this.tipoDocumentoRepository.findOne({
                where: { idTipoDocumento }
            });
            if (!tipoDocumento) {
                throw new NotFoundException('Tipo de documento no encontrado');
            }

            // Actualizar el documento
            Object.assign(junta.idDocumento, {
                urlDocumento,
                descripcion,
                idTipoDocumento: tipoDocumento,
            });

            await queryRunner.manager.save(junta.idDocumento);
            await queryRunner.commitTransaction();

            // Obtener la junta actualizada
            const juntaActualizada = await this.findOne(idJunta);

            return {
                success: true,
                message: 'Documento de la junta actualizado exitosamente',
                data: juntaActualizada.data,
            };

        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    private formatJuntaForResponse(junta: JuntaPropietarios): JuntaPropietariosResponseDto {
        return {
            idJunta: junta.idJunta,
            numeroActa: junta.numeroActa,
            fechaJunta: junta.fechaJunta,
            tipoJunta: junta.tipoJunta,
            asistentesCount: junta.asistentesCount,
            quorumAlcanzado: junta.quorumAlcanzado,
            estado: junta.estado,
            resumen: junta.resumen,
            creadoPor: {
                idUsuario: junta.creadoPor.idUsuario,
                correo: junta.creadoPor.correo,
            },
            documento: {
                idDocumento: junta.idDocumento.idDocumento,
                urlDocumento: junta.idDocumento.urlDocumento,
                descripcion: junta.idDocumento.descripcion,
                tipoDocumento: {
                    idTipoDocumento: junta.idDocumento.idTipoDocumento.idTipoDocumento,
                    tipoDocumento: junta.idDocumento.idTipoDocumento.tipoDocumento,
                    descripcion: junta.idDocumento.idTipoDocumento.descripcion,
                },
                trabajador: {
                    idTrabajador: junta.idDocumento.idTrabajador.idTrabajador,
                    nombre: junta.idDocumento.idTrabajador.nombre,
                    apellido: junta.idDocumento.idTrabajador.apellido,
                },
            },
        };
    }
}

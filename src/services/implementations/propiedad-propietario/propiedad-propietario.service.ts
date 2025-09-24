import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PropiedadPropietario } from 'src/entities/PropiedadPropietario';
import { IPropiedadPropietarioService } from 'src/services/interfaces';
import { DataSource, Equal, Repository } from 'typeorm';
import { PropiedadService } from '../propiedad/propiedad.service';
import { PropietarioService } from '../propietario/propietario.service';
import { BaseResponseDto } from 'src/dtos/baseResponse/baseResponse.dto';
import { Propiedad } from '../../../entities/Propiedad';
import { Propietario } from '../../../entities/Propietario';
import { CreatePropiedadPropietarioDto } from 'src/dtos/propiedad-propietario/create-propiedad-propietario.dto';

@Injectable()
export class PropiedadPropietarioService implements IPropiedadPropietarioService {

    constructor(
        @InjectRepository(PropiedadPropietario)
        private readonly propiedadPropietarioRepository: Repository<PropiedadPropietario>,
        private readonly propiedadService: PropiedadService,
        private readonly propietarioService: PropietarioService,
        private readonly datasource: DataSource
    ) { }

    async create(createPropiedadPropietarioDto: CreatePropiedadPropietarioDto): Promise<BaseResponseDto<PropiedadPropietario>> {
        const queryRunner = this.datasource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            let propiedad: Propiedad;
            let propietario: Propietario;

            // 1. Buscar propiedad existente por número de departamento
            const propiedadExistente = await this.propiedadService.findByNumeroDepartamento(
                createPropiedadPropietarioDto.propiedad.numeroDepartamento
            );

            if (!propiedadExistente.success) {
                throw new BadRequestException(
                    `La propiedad con número ${createPropiedadPropietarioDto.propiedad.numeroDepartamento} no existe. ` +
                    'El edificio debe registrar primero todas sus propiedades antes de asignar propietarios.'
                );
            }
            propiedad = propiedadExistente.data;

            // 2. Buscar propietario existente por correo
            const propietarioExistente = await queryRunner.manager.findOne(Propietario, {
                where: { correo: createPropiedadPropietarioDto.propietario.correo }
            });

            let usuarioCreado = null;
            if (propietarioExistente) {
                propietario = propietarioExistente;
            } else {
                // 3. Crear nuevo propietario si no existe (con validación de DNI y creación de usuario)
                const nuevoPropietario = await this.propietarioService.createPropietario(createPropiedadPropietarioDto.propietario);
                if (!nuevoPropietario.success) {
                    throw new BadRequestException('Error al crear el propietario: ' + nuevoPropietario.message);
                }
                propietario = nuevoPropietario.data;
                usuarioCreado = nuevoPropietario.data.usuario || null;
            }

            // 4. Verificar si ya existe la relación propiedad-propietario
            const relacionExistente = await queryRunner.manager.findOne(PropiedadPropietario, {
                where: {
                    idPropiedad: Equal(propiedad.idPropiedad),
                    idPropietario: Equal(propietario.idPropietario)
                },
            });

            if (relacionExistente) {
                throw new BadRequestException('Ya existe una relación entre esta propiedad y propietario');
            }

            // 5. Crear la relación propiedad-propietario
            const nuevaRelacion = queryRunner.manager.create(PropiedadPropietario, {
                idPropiedad: propiedad,
                idPropietario: propietario,
                fechaAdquisicion: createPropiedadPropietarioDto.fechaInicio?.toString() || new Date().toISOString().split('T')[0],
                fechaFin: createPropiedadPropietarioDto.fechaFin?.toString() || null,
                porcentajePropiedad: createPropiedadPropietarioDto.porcentajePropiedad?.toString() ?? "100.00",
                esPropietarioActual: createPropiedadPropietarioDto.estaActivo ?? true
            });

            const relacionGuardada = await queryRunner.manager.save(PropiedadPropietario, nuevaRelacion);

            await queryRunner.commitTransaction();

            // Preparar response con información del usuario si se creó uno nuevo
            const responseData: any = {
                ...relacionGuardada,
                propietario: propietario,
                propiedad: propiedad
            };

            if (usuarioCreado) {
                responseData.usuarioCreado = usuarioCreado;
            }

            return new BaseResponseDto(
                true,
                usuarioCreado ?
                    'Propiedad y propietario asociados exitosamente. Usuario creado automáticamente.' :
                    'Propiedad y propietario asociados exitosamente',
                responseData
            );

        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new BadRequestException(error.message || 'Error al crear la relación propiedad-propietario');
        } finally {
            await queryRunner.release();
        }
    }

    findAll(): Promise<BaseResponseDto<PropiedadPropietario[]>> {
        throw new Error('Method not implemented.');
    }
    findOne(id: string): Promise<BaseResponseDto<PropiedadPropietario>> {
        throw new Error('Method not implemented.');
    }
    update(id: string, updatePropiedadPropietarioDto: any): Promise<BaseResponseDto<PropiedadPropietario>> {
        throw new Error('Method not implemented.');
    }
    remove(id: string): Promise<BaseResponseDto<void>> {
        throw new Error('Method not implemented.');
    }
    findByPropiedad(propiedadId: string): Promise<BaseResponseDto<PropiedadPropietario[]>> {
        throw new Error('Method not implemented.');
    }
    findByPropietario(propietarioId: string): Promise<BaseResponseDto<PropiedadPropietario[]>> {
        throw new Error('Method not implemented.');
    }
}

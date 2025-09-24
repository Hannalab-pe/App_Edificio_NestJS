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
        private readonly dataSource: DataSource
    ) { }

    async createPropietario(data: CreatePropietarioDto | any): Promise<BaseResponseDto<Propietario & { usuario?: any }>> {
        try {
            // Solo acepta datos anidados sin usuario, crea usuario automáticamente en backend
            if (data.documentoIdentidad) {
                return this.createPropietarioConDatosAnidados(data);
            }
            return {
                success: false,
                message: 'Formato de datos inválido',
                data: null,
                error: { message: 'Se requiere datos de documentoIdentidad' }
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error al crear el propietario',
                data: null,
                error: { message: error.message }
            };
        }
    }

    private async createPropietarioConDatosAnidados(propietarioData: any): Promise<BaseResponseDto<Propietario & { usuario: any }>> {
        // Verificar si ya existe un propietario con el mismo correo
        const propietarioExistente = await this.propietarioRepository.findOne({
            where: { correo: propietarioData.correo }
        });

        if (propietarioExistente) {
            return {
                success: false,
                message: 'Ya existe un propietario con este correo',
                data: null,
                error: { message: 'Correo duplicado' }
            };
        }

        // Validar y crear documento de identidad si no existe
        let documentoIdentidad;
        try {
            const existingDoc = await this.documentoIdentidadService.findByNumero(propietarioData.documentoIdentidad.numeroDocumento);
            documentoIdentidad = existingDoc;
        } catch (error) {
            // No existe, crear nuevo
            documentoIdentidad = await this.documentoIdentidadService.create({
                numero: propietarioData.documentoIdentidad.numeroDocumento,
                tipoDocumento: propietarioData.documentoIdentidad.tipoDocumento
            });
        }

        // Crear usuario automáticamente
        const nuevoUsuario = await this.usuarioService.create({
            correo: propietarioData.correo, // Usar el mismo correo del propietario
            contrasena: propietarioData.documentoIdentidad.numeroDocumento, // Contraseña inicial con DNI
            idRol: '5fd55b1a-8fd0-41ff-bbe2-ae413fb7f32c' // Rol de PROPIETARIO
        });

        const nuevoPropietario = this.propietarioRepository.create({
            nombre: propietarioData.nombre,
            apellido: propietarioData.apellido,
            correo: propietarioData.correo,
            telefono: propietarioData.telefono,
            direccion: propietarioData.direccion,
            idDocumentoIdentidad: documentoIdentidad,
            idUsuario: nuevoUsuario,
            estaActivo: true
        });

        const propietarioGuardado = await this.propietarioRepository.save(nuevoPropietario);

        return {
            success: true,
            message: 'Propietario creado exitosamente con usuario automático',
            data: {
                ...propietarioGuardado,
                usuario: {
                    idUsuario: nuevoUsuario.idUsuario,
                    correo: nuevoUsuario.correo,
                }
            },
            error: null
        };
    }
    findAll(): Promise<BaseResponseDto<Propietario[]>> {
        throw new Error('Method not implemented.');
    }
    findOne(id: string): Promise<BaseResponseDto<Propietario>> {
        throw new Error('Method not implemented.');
    }
    update(id: string, updatePropietarioDto: UpdatePropietarioDto): Promise<BaseResponseDto<Propietario>> {
        throw new Error('Method not implemented.');
    }
    remove(id: string): Promise<BaseResponseDto<void>> {
        throw new Error('Method not implemented.');
    }
    findByNumeroDocumento(numeroDocumento: string): Promise<BaseResponseDto<Propietario>> {
        throw new Error('Method not implemented.');
    }
    findWithPropiedades(id: string): Promise<BaseResponseDto<Propietario>> {
        throw new Error('Method not implemented.');
    }
}

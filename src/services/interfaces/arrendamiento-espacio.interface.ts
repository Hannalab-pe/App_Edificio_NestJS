import { BaseResponseDto } from 'src/dtos/baseResponse/baseResponse.dto';
import {
  CreateArrendamientoEspacioDto,
  UpdateArrendamientoEspacioDto,
  CreateArrendamientoCompletoDto,
} from '../../dtos';
import { ArrendamientoEspacio } from '../../entities/ArrendamientoEspacio';

export interface IArrendamientoEspacioService {
  // TRANSACCIÓN PRINCIPAL - Crear arrendamiento completo
  crearArrendamientoCompleto(
    createArrendamientoCompletoDto: CreateArrendamientoCompletoDto,
  ): Promise<BaseResponseDto<ArrendamientoEspacio>>;

  // CRUD básico
  create(
    createArrendamientoEspacioDto: CreateArrendamientoEspacioDto,
  ): Promise<BaseResponseDto<ArrendamientoEspacio>>;
  findAll(): Promise<BaseResponseDto<ArrendamientoEspacio[]>>;
  findOne(id: string): Promise<BaseResponseDto<ArrendamientoEspacio>>;
  update(
    id: string,
    updateArrendamientoEspacioDto: UpdateArrendamientoEspacioDto,
  ): Promise<BaseResponseDto<ArrendamientoEspacio>>;
  remove(id: string): Promise<BaseResponseDto<void>>;

  // Métodos de validación y consulta específicos
  validarEspacioDisponible(
    espacioId: string,
  ): Promise<BaseResponseDto<boolean>>;
  findByEstado(
    estado: string,
  ): Promise<BaseResponseDto<ArrendamientoEspacio[]>>;
  findByEspacio(
    espacioId: string,
  ): Promise<BaseResponseDto<ArrendamientoEspacio[]>>;
  findByArrendatario(
    arrendatarioId: string,
  ): Promise<BaseResponseDto<ArrendamientoEspacio[]>>;
  findActivos(): Promise<BaseResponseDto<ArrendamientoEspacio[]>>;
  findVencidos(): Promise<BaseResponseDto<ArrendamientoEspacio[]>>;
  findProximosAVencer(
    diasAntelacion?: number,
  ): Promise<BaseResponseDto<ArrendamientoEspacio[]>>;
}

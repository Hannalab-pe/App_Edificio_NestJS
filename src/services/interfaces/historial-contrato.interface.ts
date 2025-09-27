import { BaseResponseDto } from 'src/dtos/baseResponse/baseResponse.dto';
import {
  CreateHistorialContratoDto,
  UpdateHistorialContratoDto,
  HistorialContratoResponseDto
} from 'src/dtos/index';
import { TipoAccionHistorial } from '../../Enums/TipoAccionHistorial';

export interface IHistorialContratoService {
  // Operaciones básicas CRUD
  create(createHistorialContratoDto: CreateHistorialContratoDto): Promise<BaseResponseDto<HistorialContratoResponseDto>>;
  findAll(): Promise<BaseResponseDto<HistorialContratoResponseDto[]>>;
  findOne(id: string): Promise<BaseResponseDto<HistorialContratoResponseDto>>;
  update(id: string, updateHistorialContratoDto: UpdateHistorialContratoDto): Promise<BaseResponseDto<HistorialContratoResponseDto>>;
  remove(id: string): Promise<BaseResponseDto<void>>;

  // Operaciones específicas por contrato
  findByContrato(contratoId: string): Promise<BaseResponseDto<HistorialContratoResponseDto[]>>;
  findByContratoOrdenado(contratoId: string): Promise<BaseResponseDto<HistorialContratoResponseDto[]>>;

  // Operaciones por trabajador
  findByTrabajador(trabajadorId: string): Promise<BaseResponseDto<HistorialContratoResponseDto[]>>;
  findHistorialCompletoTrabajador(trabajadorId: string): Promise<BaseResponseDto<HistorialContratoResponseDto[]>>;

  // Operaciones por tipo de acción
  findByTipoAccion(tipoAccion: TipoAccionHistorial): Promise<BaseResponseDto<HistorialContratoResponseDto[]>>;
  findAccionesRecientes(dias?: number): Promise<BaseResponseDto<HistorialContratoResponseDto[]>>;

  // Operaciones por rango de fechas
  findByFechaRange(fechaInicio: Date, fechaFin: Date): Promise<BaseResponseDto<HistorialContratoResponseDto[]>>;
  findByFechaRangeAndContrato(fechaInicio: Date, fechaFin: Date, contratoId: string): Promise<BaseResponseDto<HistorialContratoResponseDto[]>>;

  // Operaciones especializadas
  registrarAccion(
    contratoId: string,
    tipoAccion: TipoAccionHistorial,
    descripcion: string,
    estadoAnterior?: any,
    estadoNuevo?: any,
    usuarioAccion?: string,
    observaciones?: string
  ): Promise<BaseResponseDto<HistorialContratoResponseDto>>;

  obtenerUltimaAccion(contratoId: string): Promise<BaseResponseDto<HistorialContratoResponseDto>>;
  obtenerResumenActividad(contratoId: string): Promise<BaseResponseDto<any>>;
  obtenerEstadisticasAcciones(): Promise<BaseResponseDto<any>>;
}

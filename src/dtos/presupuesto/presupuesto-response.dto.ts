import { BaseResponseDto } from '../baseResponse/baseResponse.dto';
import { Presupuesto } from '../../entities/Presupuesto';

// Tipos para respuestas del módulo Presupuesto
export type PresupuestoResponseDto = BaseResponseDto<Presupuesto>;
export type PresupuestoListResponseDto = BaseResponseDto<Presupuesto[]>;
export type PresupuestoDeleteResponseDto = BaseResponseDto<undefined>;

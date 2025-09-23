import { BaseResponseDto } from 'src/dtos/baseResponse/baseResponse.dto';
import { CreatePresupuestoDto, UpdatePresupuestoDto } from 'src/dtos';
import { Presupuesto } from '../../entities/Presupuesto';

export interface IPresupuestoService {
    create(createPresupuestoDto: CreatePresupuestoDto): Promise<BaseResponseDto<Presupuesto>>;
    findAll(): Promise<BaseResponseDto<Presupuesto[]>>;
    findOne(id: string): Promise<BaseResponseDto<Presupuesto>>;
    update(id: string, updatePresupuestoDto: UpdatePresupuestoDto): Promise<BaseResponseDto<Presupuesto>>;
    remove(id: string): Promise<BaseResponseDto<undefined>>;
    findByAnio(anio: number): Promise<BaseResponseDto<Presupuesto[]>>;
    findByConcepto(concepto: string): Promise<BaseResponseDto<Presupuesto[]>>;
}
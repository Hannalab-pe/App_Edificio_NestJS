import { CreatePagoDto, UpdatePagoDto } from '../../dtos';
import { Pago } from '../../entities/Pago';

export interface IPagoService {
    create(createPagoDto: CreatePagoDto): Promise<Pago>;
    findAll(): Promise<Pago[]>;
    findOne(id: string): Promise<Pago>;
    update(id: string, updatePagoDto: UpdatePagoDto): Promise<Pago>;
    remove(id: string): Promise<void>;
    findByEstado(estado: string): Promise<Pago[]>;
    findByFechaRange(fechaInicio: Date, fechaFin: Date): Promise<Pago[]>;
    findByPropietario(propietarioId: string): Promise<Pago[]>;
    findByConcepto(conceptoId: string): Promise<Pago[]>;
}
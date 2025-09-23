import { MovimientoCaja } from '../../entities/MovimientoCaja';

export interface IMovimientoCajaService {
    create(createMovimientoCajaDto: any): Promise<MovimientoCaja>;
    findAll(): Promise<MovimientoCaja[]>;
    findOne(id: string): Promise<MovimientoCaja>;
    update(id: string, updateMovimientoCajaDto: any): Promise<MovimientoCaja>;
    remove(id: string): Promise<void>;
    findByTipo(tipo: string): Promise<MovimientoCaja[]>;
    findByCaja(cajaId: string): Promise<MovimientoCaja[]>;
    findByFechaRange(fechaInicio: Date, fechaFin: Date): Promise<MovimientoCaja[]>;
}
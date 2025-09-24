import { HistorialContrato } from '../../entities/HistorialContrato';

export interface IHistorialContratoService {
  create(createHistorialContratoDto: any): Promise<HistorialContrato>;
  findAll(): Promise<HistorialContrato[]>;
  findOne(id: string): Promise<HistorialContrato>;
  update(
    id: string,
    updateHistorialContratoDto: any,
  ): Promise<HistorialContrato>;
  remove(id: string): Promise<void>;
  findByContrato(contratoId: string): Promise<HistorialContrato[]>;
  findByFechaRange(
    fechaInicio: Date,
    fechaFin: Date,
  ): Promise<HistorialContrato[]>;
}

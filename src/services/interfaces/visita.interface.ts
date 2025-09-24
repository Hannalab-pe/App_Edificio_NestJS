import { Visita } from '../../entities/Visita';
import { CreateVisitaDto, UpdateVisitaDto } from '../../dtos/visita';

/**
 * Interfaz que define los métodos del servicio de visitas
 * Proporciona operaciones CRUD y funcionalidades específicas para gestión de visitas
 */
export interface IVisitaService {
  create(createVisitaDto: any): Promise<Visita>;
  findAll(): Promise<Visita[]>;
  findOne(id: string): Promise<Visita>;
  update(id: string, updateVisitaDto: any): Promise<Visita>;
  remove(id: string): Promise<void>;
  findByEstado(estado: string): Promise<Visita[]>;
  findByPropiedad(propiedadId: string): Promise<Visita[]>;
  findByFechaRange(fechaInicio: Date, fechaFin: Date): Promise<Visita[]>;
}

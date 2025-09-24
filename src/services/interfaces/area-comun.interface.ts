import { CreateAreaComunDto, UpdateAreaComunDto } from '../../dtos';
import { AreaComun } from '../../entities/AreaComun';

export interface IAreaComunService {
  create(createAreaComunDto: CreateAreaComunDto): Promise<AreaComun>;
  findAll(): Promise<AreaComun[]>;
  findOne(id: string): Promise<AreaComun>;
  update(
    id: string,
    updateAreaComunDto: UpdateAreaComunDto,
  ): Promise<AreaComun>;
  remove(id: string): Promise<void>;
  findByEstado(estado: boolean): Promise<AreaComun[]>;
  findAvailable(): Promise<AreaComun[]>;
  findByCapacidad(capacidadMinima: number): Promise<AreaComun[]>;
  findByPrecio(precioMaximo: number): Promise<AreaComun[]>;
}

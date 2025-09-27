import { Visita } from '../../entities/Visita';
import { CreateVisitaDto, UpdateVisitaDto } from '../../dtos/visita';
import { VisitaSingleResponseDto, VisitaArrayResponseDto } from '../../dtos';

/**
 * Interfaz que define los métodos del servicio de visitas
 * Proporciona operaciones CRUD y funcionalidades específicas para gestión de visitas
 */
export interface IVisitaService {
  // Métodos legacy (existentes)
  create(createVisitaDto: any): Promise<Visita>;
  findAll(): Promise<Visita[]>;
  findOne(id: string): Promise<Visita>;
  update(id: string, updateVisitaDto: any): Promise<Visita>;
  remove(id: string): Promise<void>;
  findByEstado(estado: string): Promise<Visita[]>;
  findByPropiedad(propiedadId: string): Promise<Visita[]>;
  findByFechaRange(fechaInicio: Date, fechaFin: Date): Promise<Visita[]>;
  findByUsuarioAutorizador(usuarioId: string): Promise<Visita[]>;
  registrarIngreso(codigoQr: string): Promise<Visita>;
  registrarSalida(codigoQr: string): Promise<Visita>;

  // Nuevos métodos con BaseResponseDto
  createWithResponse(
    createVisitaDto: CreateVisitaDto,
  ): Promise<VisitaSingleResponseDto>;
  findAllWithResponse(
    page?: number,
    limit?: number,
  ): Promise<VisitaArrayResponseDto>;
  findOneWithResponse(id: string): Promise<VisitaSingleResponseDto>;
  updateWithResponse(
    id: string,
    updateVisitaDto: UpdateVisitaDto,
  ): Promise<VisitaSingleResponseDto>;
  removeWithResponse(id: string): Promise<VisitaSingleResponseDto>;
  findByEstadoWithResponse(
    estado: string,
    page?: number,
    limit?: number,
  ): Promise<VisitaArrayResponseDto>;
  findByPropiedadWithResponse(
    propiedadId: string,
    page?: number,
    limit?: number,
  ): Promise<VisitaArrayResponseDto>;
  findByFechaRangeWithResponse(
    fechaInicio: Date,
    fechaFin: Date,
    page?: number,
    limit?: number,
  ): Promise<VisitaArrayResponseDto>;
  findByUsuarioAutorizadorWithResponse(
    usuarioId: string,
    page?: number,
    limit?: number,
  ): Promise<VisitaArrayResponseDto>;
  registrarIngresoWithResponse(
    codigoQr: string,
  ): Promise<VisitaSingleResponseDto>;
  registrarSalidaWithResponse(
    codigoQr: string,
  ): Promise<VisitaSingleResponseDto>;
}

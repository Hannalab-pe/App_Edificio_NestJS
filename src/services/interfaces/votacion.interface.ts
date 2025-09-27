import { CreateVotacionDto, UpdateVotacionDto, VotacionSingleResponseDto, VotacionArrayResponseDto } from '../../dtos';
import { Votacion } from '../../entities/Votacion';

/**
 * Interfaz que define los métodos del servicio de votaciones
 * Proporciona operaciones CRUD y funcionalidades específicas para gestión de votaciones
 */
export interface IVotacionService {
  // Métodos legacy (existentes)
  create(createVotacionDto: CreateVotacionDto): Promise<Votacion>;
  findAll(): Promise<Votacion[]>;
  findOne(id: string): Promise<Votacion>;
  update(id: string, updateVotacionDto: UpdateVotacionDto): Promise<Votacion>;
  remove(id: string): Promise<void>;
  findByEstado(estado: string): Promise<Votacion[]>;
  findActive(): Promise<Votacion[]>;
  findByJuntaPropietarios(juntaId: string): Promise<Votacion[]>;

  // Nuevos métodos con BaseResponseDto
  createWithResponse(createVotacionDto: CreateVotacionDto): Promise<VotacionSingleResponseDto>;
  findAllWithResponse(page?: number, limit?: number): Promise<VotacionArrayResponseDto>;
  findOneWithResponse(id: string): Promise<VotacionSingleResponseDto>;
  updateWithResponse(id: string, updateVotacionDto: UpdateVotacionDto): Promise<VotacionSingleResponseDto>;
  removeWithResponse(id: string): Promise<VotacionSingleResponseDto>;
  
  // Métodos específicos de votación con BaseResponse
  findByEstadoWithResponse(estado: string, page?: number, limit?: number): Promise<VotacionArrayResponseDto>;
  findActiveWithResponse(page?: number, limit?: number): Promise<VotacionArrayResponseDto>;
  findByJuntaPropietariosWithResponse(juntaId: string, page?: number, limit?: number): Promise<VotacionArrayResponseDto>;
  findByDateRangeWithResponse(fechaInicio: Date, fechaFin: Date, page?: number, limit?: number): Promise<VotacionArrayResponseDto>;
  findByCreadorWithResponse(creadorId: string, page?: number, limit?: number): Promise<VotacionArrayResponseDto>;
  
  // Métodos de estadísticas y gestión
  getEstadisticasGeneralesWithResponse(): Promise<VotacionArrayResponseDto>;
  cerrarVotacionWithResponse(id: string): Promise<VotacionSingleResponseDto>;
  activarVotacionWithResponse(id: string): Promise<VotacionSingleResponseDto>;
  cancelarVotacionWithResponse(id: string): Promise<VotacionSingleResponseDto>;
}

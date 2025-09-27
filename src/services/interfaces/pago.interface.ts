import {
  CreatePagoDto,
  UpdatePagoDto,
  CreatePagoResponseDto,
  GetPagoResponseDto,
  GetPagosResponseDto,
  UpdatePagoResponseDto,
  DeletePagoResponseDto,
} from '../../dtos';

export interface IPagoService {
  create(createPagoDto: CreatePagoDto): Promise<CreatePagoResponseDto>;
  findAll(): Promise<GetPagosResponseDto>;
  findOne(id: string): Promise<GetPagoResponseDto>;
  update(
    id: string,
    updatePagoDto: UpdatePagoDto,
  ): Promise<UpdatePagoResponseDto>;
  remove(id: string): Promise<DeletePagoResponseDto>;
  findByEstado(estado: string): Promise<GetPagosResponseDto>;
  findByResidencia(residenciaId: string): Promise<GetPagosResponseDto>;
  findByArrendamiento(arrendamientoId: string): Promise<GetPagosResponseDto>;
  findByConcepto(conceptoId: string): Promise<GetPagosResponseDto>;
  findVencidos(): Promise<GetPagosResponseDto>;
  findPendientes(): Promise<GetPagosResponseDto>;
}

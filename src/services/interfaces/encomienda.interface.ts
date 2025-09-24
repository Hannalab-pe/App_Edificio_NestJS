import { CreateEncomiendaDto, UpdateEncomiendaDto } from '../../dtos';
import { Encomienda } from '../../entities/Encomienda';

export interface IEncomiendaService {
  create(createEncomiendaDto: CreateEncomiendaDto): Promise<Encomienda>;
  findAll(): Promise<Encomienda[]>;
  findOne(id: string): Promise<Encomienda>;
  update(
    id: string,
    updateEncomiendaDto: UpdateEncomiendaDto,
  ): Promise<Encomienda>;
  remove(id: string): Promise<void>;
  findByEstado(estado: string): Promise<Encomienda[]>;
  findByDestinatario(destinatarioId: string): Promise<Encomienda[]>;
  findByFechaRange(fechaInicio: Date, fechaFin: Date): Promise<Encomienda[]>;
}

import {
  CreateOpcionVotoDto,
  UpdateOpcionVotoDto,
  CreateOpcionVotoResponseDto,
  GetOpcionVotoResponseDto,
  GetOpcionesVotoResponseDto,
  UpdateOpcionVotoResponseDto,
  DeleteOpcionVotoResponseDto,
} from '../../dtos';

export interface IOpcionVotoService {
  create(
    createOpcionVotoDto: CreateOpcionVotoDto,
  ): Promise<CreateOpcionVotoResponseDto>;
  findAll(): Promise<GetOpcionesVotoResponseDto>;
  findOne(id: string): Promise<GetOpcionVotoResponseDto>;
  update(
    id: string,
    updateOpcionVotoDto: UpdateOpcionVotoDto,
  ): Promise<UpdateOpcionVotoResponseDto>;
  remove(id: string): Promise<DeleteOpcionVotoResponseDto>;
  findByVotacion(votacionId: string): Promise<GetOpcionesVotoResponseDto>;
}

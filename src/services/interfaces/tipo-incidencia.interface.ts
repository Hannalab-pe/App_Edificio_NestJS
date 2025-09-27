import { 
  CreateTipoIncidenciaDto, 
  UpdateTipoIncidenciaDto,
  TipoIncidenciaSingleResponseDto,
  TipoIncidenciaArrayResponseDto 
} from '../../dtos';
import { TipoIncidencia } from '../../entities/TipoIncidencia';
import { BaseResponseDto } from '../../dtos/baseResponse/baseResponse.dto';

export interface ITipoIncidenciaService {
  // Métodos existentes (mantener compatibilidad)
  create(
    createTipoIncidenciaDto: CreateTipoIncidenciaDto,
  ): Promise<TipoIncidencia>;
  findAll(): Promise<TipoIncidencia[]>;
  findOne(id: string): Promise<TipoIncidencia>;
  update(
    id: string,
    updateTipoIncidenciaDto: UpdateTipoIncidenciaDto,
  ): Promise<TipoIncidencia>;
  remove(id: string): Promise<void>;
  findByNombre(nombre: string): Promise<TipoIncidencia>;
  findByPrioridad(prioridad: string): Promise<TipoIncidencia[]>;
  findActivos(): Promise<TipoIncidencia[]>;

  // Nuevos métodos con BaseResponseDto
  createWithBaseResponse(
    createTipoIncidenciaDto: CreateTipoIncidenciaDto,
  ): Promise<TipoIncidenciaSingleResponseDto>;
  findAllWithBaseResponse(): Promise<TipoIncidenciaArrayResponseDto>;
  findOneWithBaseResponse(id: string): Promise<TipoIncidenciaSingleResponseDto>;
  updateWithBaseResponse(
    id: string,
    updateTipoIncidenciaDto: UpdateTipoIncidenciaDto,
  ): Promise<TipoIncidenciaSingleResponseDto>;
  removeWithBaseResponse(id: string): Promise<BaseResponseDto<undefined>>;
  findByNombreWithBaseResponse(nombre: string): Promise<TipoIncidenciaSingleResponseDto>;
  findByPrioridadWithBaseResponse(prioridad: string): Promise<TipoIncidenciaArrayResponseDto>;
  findActivosWithBaseResponse(): Promise<TipoIncidenciaArrayResponseDto>;
}

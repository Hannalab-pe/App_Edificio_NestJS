import { BaseResponseDto } from 'src/dtos/baseResponse/baseResponse.dto';
import { CreateTipoIncidenciaDto, UpdateTipoIncidenciaDto } from 'src/dtos';
import { TipoIncidencia } from '../../entities/TipoIncidencia';

export interface ITipoIncidenciaService {
    create(createTipoIncidenciaDto: CreateTipoIncidenciaDto): Promise<BaseResponseDto<TipoIncidencia>>;
    findAll(): Promise<BaseResponseDto<TipoIncidencia[]>>;
    findOne(id: string): Promise<BaseResponseDto<TipoIncidencia>>;
    update(id: string, updateTipoIncidenciaDto: UpdateTipoIncidenciaDto): Promise<BaseResponseDto<TipoIncidencia>>;
    remove(id: string): Promise<BaseResponseDto<void>>;
    findByNombre(nombre: string): Promise<BaseResponseDto<TipoIncidencia>>;
}
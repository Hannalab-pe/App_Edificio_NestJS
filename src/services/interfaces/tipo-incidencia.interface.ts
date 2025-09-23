<<<<<<< HEAD
import { CreateTipoIncidenciaDto, UpdateTipoIncidenciaDto } from '../../dtos';
import { TipoIncidencia } from '../../entities/TipoIncidencia';

export interface ITipoIncidenciaService {
    create(createTipoIncidenciaDto: CreateTipoIncidenciaDto): Promise<TipoIncidencia>;
    findAll(): Promise<TipoIncidencia[]>;
    findOne(id: string): Promise<TipoIncidencia>;
    update(id: string, updateTipoIncidenciaDto: UpdateTipoIncidenciaDto): Promise<TipoIncidencia>;
    remove(id: string): Promise<void>;
    findByNombre(nombre: string): Promise<TipoIncidencia>;
    findByPrioridad(prioridad: string): Promise<TipoIncidencia[]>;
    findActivos(): Promise<TipoIncidencia[]>;
=======
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
>>>>>>> 56ba60af9806ab17fa9dd2551616d39c4ecc114c
}
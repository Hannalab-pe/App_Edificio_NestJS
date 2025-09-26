import { BaseResponseDto } from '../../dtos/baseResponse/baseResponse.dto';
import { CreateAsignacionAreaEdificioDto, UpdateAsignacionAreaEdificioDto, AsignacionAreaEdificioResponseDto } from '../../dtos/asignacion-area-edificio';

export interface IAsignacionAreaEdificioService {
    /**
     * Crear una nueva asignación de área común a edificio
     */
    create(createAsignacionDto: CreateAsignacionAreaEdificioDto): Promise<BaseResponseDto<AsignacionAreaEdificioResponseDto>>;

    /**
     * Obtener todas las asignaciones con sus relaciones
     */
    findAll(): Promise<BaseResponseDto<AsignacionAreaEdificioResponseDto[]>>;

    /**
     * Obtener una asignación por ID
     */
    findOne(id: string): Promise<BaseResponseDto<AsignacionAreaEdificioResponseDto>>;

    /**
     * Obtener asignaciones por edificio
     */
    findByEdificio(idEdificio: string): Promise<BaseResponseDto<AsignacionAreaEdificioResponseDto[]>>;

    /**
     * Obtener asignaciones por área común
     */
    findByAreaComun(idAreaComun: string): Promise<BaseResponseDto<AsignacionAreaEdificioResponseDto[]>>;

    /**
     * Actualizar una asignación
     */
    update(id: string, updateAsignacionDto: UpdateAsignacionAreaEdificioDto): Promise<BaseResponseDto<AsignacionAreaEdificioResponseDto>>;

    /**
     * Eliminar una asignación
     */
    remove(id: string): Promise<BaseResponseDto<string>>;

    /**
     * Activar/Desactivar una asignación
     */
    toggleStatus(id: string): Promise<BaseResponseDto<AsignacionAreaEdificioResponseDto>>;
}
import { BaseResponseDto } from 'src/dtos/baseResponse/baseResponse.dto';
import { Mantenimiento } from '../../entities/Mantenimiento';
import { CreateMantenimientoDto } from '../../dtos/mantenimiento/create-mantenimiento.dto';
import { UpdateMantenimientoDto } from '../../dtos/mantenimiento/update-mantenimiento.dto';
import { MantenimientoResponseDto } from '../../dtos/mantenimiento/mantenimiento-response.dto';

export interface IMantenimientoService {
  create(createMantenimientoDto: CreateMantenimientoDto): Promise<BaseResponseDto<MantenimientoResponseDto>>;
  findAll(): Promise<BaseResponseDto<MantenimientoResponseDto[]>>;
  findOne(id: string): Promise<BaseResponseDto<MantenimientoResponseDto>>;
  update(id: string, updateMantenimientoDto: UpdateMantenimientoDto): Promise<BaseResponseDto<MantenimientoResponseDto>>;
  remove(id: string): Promise<BaseResponseDto<void>>;
  findByEstado(estado: string): Promise<BaseResponseDto<MantenimientoResponseDto[]>>;
  findByAreaComun(areaComunId: string): Promise<BaseResponseDto<MantenimientoResponseDto[]>>;
  findByContacto(contactoId: string): Promise<BaseResponseDto<MantenimientoResponseDto[]>>;
  findByFechaRange(fechaInicio: string, fechaFin: string): Promise<BaseResponseDto<MantenimientoResponseDto[]>>;
  findMantenimientosActivos(): Promise<BaseResponseDto<MantenimientoResponseDto[]>>;
  findMantenimientosProgramados(): Promise<BaseResponseDto<MantenimientoResponseDto[]>>;
  cambiarEstado(id: string, nuevoEstado: string): Promise<BaseResponseDto<MantenimientoResponseDto>>;
}

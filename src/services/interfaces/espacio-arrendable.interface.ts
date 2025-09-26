import { BaseResponseDto } from 'src/dtos/baseResponse/baseResponse.dto';
import { CreateEspacioArrendableDto, UpdateEspacioArrendableDto, EspacioArrendableResponseDto } from 'src/dtos/espacio-arrendable';

export interface IEspacioArrendableService {
  create(createEspacioArrendableDto: CreateEspacioArrendableDto): Promise<BaseResponseDto<EspacioArrendableResponseDto>>;
  findAll(): Promise<BaseResponseDto<EspacioArrendableResponseDto[]>>;
  findOne(id: string): Promise<BaseResponseDto<EspacioArrendableResponseDto>>;
  update(id: string, updateEspacioArrendableDto: UpdateEspacioArrendableDto): Promise<BaseResponseDto<EspacioArrendableResponseDto>>;
  remove(id: string): Promise<BaseResponseDto<void>>;
}

import { BaseResponseDto } from 'src/dtos/baseResponse/baseResponse.dto';
import { JuntaPropietarios } from '../../entities/JuntaPropietarios';
import { CreateJuntaPropietariosDto } from '../../dtos/junta-propietarios/create-junta-propietarios.dto';
import { UpdateJuntaPropietariosDto } from '../../dtos/junta-propietarios/update-junta-propietarios.dto';
import { JuntaPropietariosResponseDto } from '../../dtos/junta-propietarios/junta-propietarios-response.dto';

export interface IJuntaPropietariosService {
  create(createJuntaPropietariosDto: CreateJuntaPropietariosDto): Promise<BaseResponseDto<JuntaPropietariosResponseDto>>;
  findAll(): Promise<BaseResponseDto<JuntaPropietariosResponseDto[]>>;
  findOne(id: string): Promise<BaseResponseDto<JuntaPropietariosResponseDto>>;
  update(
    id: string,
    updateJuntaPropietariosDto: UpdateJuntaPropietariosDto,
  ): Promise<BaseResponseDto<JuntaPropietariosResponseDto>>;
  remove(id: string): Promise<BaseResponseDto<void>>;
  findByEstado(estado: string): Promise<BaseResponseDto<JuntaPropietariosResponseDto[]>>;
  findByFechaRange(
    fechaInicio: string,
    fechaFin: string,
  ): Promise<BaseResponseDto<JuntaPropietariosResponseDto[]>>;
  findByNumeroActa(numeroActa: string): Promise<BaseResponseDto<JuntaPropietariosResponseDto>>;
  findByTipoJunta(tipoJunta: string): Promise<BaseResponseDto<JuntaPropietariosResponseDto[]>>;
  updateDocumento(
    idJunta: string,
    urlDocumento: string,
    descripcion: string,
    idTipoDocumento: string
  ): Promise<BaseResponseDto<JuntaPropietariosResponseDto>>;
}

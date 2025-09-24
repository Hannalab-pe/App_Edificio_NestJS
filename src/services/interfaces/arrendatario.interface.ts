import { BaseResponseDto } from 'src/dtos/baseResponse/baseResponse.dto';
import { CreateArrendatarioDto, UpdateArrendatarioDto } from '../../dtos';
import { Arrendatario } from '../../entities/Arrendatario';

export interface IArrendatarioService {
  create(
    createArrendatarioDto: CreateArrendatarioDto,
  ): Promise<BaseResponseDto<Arrendatario>>;
  findAll(): Promise<BaseResponseDto<Arrendatario[]>>;
  findOne(id: string): Promise<BaseResponseDto<Arrendatario>>;
  update(
    id: string,
    updateArrendatarioDto: UpdateArrendatarioDto,
  ): Promise<BaseResponseDto<Arrendatario>>;
  remove(id: string): Promise<BaseResponseDto<void>>;
  findByDocumento(
    numeroDocumento: string,
  ): Promise<BaseResponseDto<Arrendatario>>;
  findByEstado(estado: string): Promise<BaseResponseDto<Arrendatario[]>>;
  verificarArrendatario(id: string): Promise<BaseResponseDto<Arrendatario>>;
  findActiveArrendatarios(): Promise<BaseResponseDto<Arrendatario[]>>;
  findByUsuario(usuarioId: string): Promise<BaseResponseDto<Arrendatario>>;
}

import { BaseResponseDto } from 'src/dtos/baseResponse/baseResponse.dto';
import { CreateEncomiendaDto, UpdateEncomiendaDto, EncomiendaResponseDto } from 'src/dtos/encomienda';
import { EstadoEncomienda } from 'src/Enums/encomienda.enum';

export interface IEncomiendaService {
    create(createEncomiendaDto: CreateEncomiendaDto): Promise<BaseResponseDto<EncomiendaResponseDto>>;
    findAll(): Promise<BaseResponseDto<EncomiendaResponseDto[]>>;
    findOne(id: string): Promise<BaseResponseDto<EncomiendaResponseDto>>;
    update(id: string, updateEncomiendaDto: UpdateEncomiendaDto): Promise<BaseResponseDto<EncomiendaResponseDto>>;
    remove(id: string): Promise<BaseResponseDto<void>>;

    findByPropiedad(idPropiedad: string): Promise<BaseResponseDto<EncomiendaResponseDto[]>>;
    findByTrabajador(idTrabajador: string): Promise<BaseResponseDto<EncomiendaResponseDto[]>>;
    findByEstado(estado: EstadoEncomienda): Promise<BaseResponseDto<EncomiendaResponseDto[]>>;
    findByRemitente(remitente: string): Promise<BaseResponseDto<EncomiendaResponseDto[]>>;
    findByCodigo(codigoSeguimiento: string): Promise<BaseResponseDto<EncomiendaResponseDto>>;
    marcarComoEntregada(id: string): Promise<BaseResponseDto<EncomiendaResponseDto>>;
    obtenerEncomiendasPendientes(): Promise<BaseResponseDto<EncomiendaResponseDto[]>>;
}
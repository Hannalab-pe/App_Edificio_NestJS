import { BaseResponseDto } from 'src/dtos/baseResponse/baseResponse.dto';
import { CreateCajaDto, UpdateCajaDto, CajaResponseDto, AperturaCajaDto, CierreCajaDto } from 'src/dtos/caja';

export interface ICajaService {
  // Operaciones básicas CRUD
  create(createCajaDto: CreateCajaDto): Promise<BaseResponseDto<CajaResponseDto>>;
  findAll(): Promise<BaseResponseDto<CajaResponseDto[]>>;
  findOne(id: string): Promise<BaseResponseDto<CajaResponseDto>>;
  update(id: string, updateCajaDto: UpdateCajaDto): Promise<BaseResponseDto<CajaResponseDto>>;
  remove(id: string): Promise<BaseResponseDto<void>>;

  // Operaciones específicas de caja
  abrirCaja(idTrabajador: string, aperturaCajaDto: AperturaCajaDto): Promise<BaseResponseDto<CajaResponseDto>>;
  cerrarCaja(idCaja: string, cierreCajaDto: CierreCajaDto): Promise<BaseResponseDto<CajaResponseDto>>;
  obtenerCajaActiva(idTrabajador: string): Promise<BaseResponseDto<CajaResponseDto>>;
  validarCierre(idCaja: string, montoFinalReal: number): Promise<BaseResponseDto<any>>;
  calcularTotalMovimientos(idCaja: string): Promise<BaseResponseDto<any>>;

  // Consultas específicas
  findByTrabajador(idTrabajador: string): Promise<BaseResponseDto<CajaResponseDto[]>>;
  findByFecha(fecha: string): Promise<BaseResponseDto<CajaResponseDto[]>>;
  findCajasAbiertas(): Promise<BaseResponseDto<CajaResponseDto[]>>;
}

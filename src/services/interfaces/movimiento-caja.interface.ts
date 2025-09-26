import { BaseResponseDto } from 'src/dtos/baseResponse/baseResponse.dto';
import { CreateMovimientoCajaDto, UpdateMovimientoCajaDto, MovimientoCajaResponseDto, TipoMovimiento } from 'src/dtos/movimiento-caja';

export interface IMovimientoCajaService {
  // Operaciones básicas CRUD
  create(createMovimientoCajaDto: CreateMovimientoCajaDto): Promise<BaseResponseDto<MovimientoCajaResponseDto>>;
  findAll(): Promise<BaseResponseDto<MovimientoCajaResponseDto[]>>;
  findOne(id: string): Promise<BaseResponseDto<MovimientoCajaResponseDto>>;
  update(id: string, updateMovimientoCajaDto: UpdateMovimientoCajaDto): Promise<BaseResponseDto<MovimientoCajaResponseDto>>;
  remove(id: string): Promise<BaseResponseDto<void>>;

  // Operaciones específicas de movimientos
  registrarIngreso(createMovimientoCajaDto: CreateMovimientoCajaDto): Promise<BaseResponseDto<MovimientoCajaResponseDto>>;
  registrarEgreso(createMovimientoCajaDto: CreateMovimientoCajaDto): Promise<BaseResponseDto<MovimientoCajaResponseDto>>;
  anularMovimiento(id: string, motivo: string): Promise<BaseResponseDto<MovimientoCajaResponseDto>>;

  // Consultas específicas
  findByCaja(cajaId: string): Promise<BaseResponseDto<MovimientoCajaResponseDto[]>>;
  findByTipo(tipo: TipoMovimiento): Promise<BaseResponseDto<MovimientoCajaResponseDto[]>>;
  findByFechaRange(fechaInicio: string, fechaFin: string): Promise<BaseResponseDto<MovimientoCajaResponseDto[]>>;
  findByPago(pagoId: string): Promise<BaseResponseDto<MovimientoCajaResponseDto>>;
}

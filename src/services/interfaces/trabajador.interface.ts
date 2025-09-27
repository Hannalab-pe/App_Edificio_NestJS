import { Trabajador } from '../../entities/Trabajador';
import { 
  CreateTrabajadorDto, 
  UpdateTrabajadorDto,
  TrabajadorRegisterResponseDto,
  TrabajadorSingleResponseDto,
  TrabajadorArrayResponseDto 
} from '../../dtos';
import { BaseResponseDto } from '../../dtos/baseResponse/baseResponse.dto';

export interface ITrabajadorService {
  // Métodos existentes (mantener compatibilidad)
  create(createTrabajadorDto: any): Promise<Trabajador>;
  register(
    createTrabajadorDto: CreateTrabajadorDto,
  ): Promise<TrabajadorRegisterResponseDto>;
  findAll(): Promise<Trabajador[]>;
  findOne(id: string): Promise<Trabajador>;
  update(id: string, updateTrabajadorDto: any): Promise<Trabajador>;
  remove(id: string): Promise<void>;
  findByNumeroDocumento(numeroDocumento: string): Promise<Trabajador>;
  findByCargo(cargo: string): Promise<Trabajador[]>;

  // Nuevos métodos con BaseResponseDto
  createWithBaseResponse(
    createTrabajadorDto: CreateTrabajadorDto,
  ): Promise<TrabajadorSingleResponseDto>;
  findAllWithBaseResponse(): Promise<TrabajadorArrayResponseDto>;
  findOneWithBaseResponse(id: string): Promise<TrabajadorSingleResponseDto>;
  updateWithBaseResponse(
    id: string,
    updateTrabajadorDto: UpdateTrabajadorDto,
  ): Promise<TrabajadorSingleResponseDto>;
  removeWithBaseResponse(id: string): Promise<BaseResponseDto<undefined>>;
  findByNumeroDocumentoWithBaseResponse(numeroDocumento: string): Promise<TrabajadorSingleResponseDto>;
  findByCargoWithBaseResponse(cargo: string): Promise<TrabajadorArrayResponseDto>;
  findActivosWithBaseResponse(): Promise<TrabajadorArrayResponseDto>;
  findByCorreoWithBaseResponse(correo: string): Promise<TrabajadorSingleResponseDto>;
}

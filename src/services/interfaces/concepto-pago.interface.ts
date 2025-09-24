import { BaseResponseDto } from 'src/dtos/baseResponse/baseResponse.dto';
import { CreateConceptoPagoDto, UpdateConceptoPagoDto } from 'src/dtos';
import { ConceptoPago } from '../../entities/ConceptoPago';

export interface IConceptoPagoService {
  create(
    createConceptoPagoDto: CreateConceptoPagoDto,
  ): Promise<BaseResponseDto<ConceptoPago>>;
  findAll(): Promise<BaseResponseDto<ConceptoPago[]>>;
  findOne(id: string): Promise<BaseResponseDto<ConceptoPago>>;
  update(
    id: string,
    updateConceptoPagoDto: UpdateConceptoPagoDto,
  ): Promise<BaseResponseDto<ConceptoPago>>;
  remove(id: string): Promise<BaseResponseDto<void>>;
  findByNombre(nombre: string): Promise<BaseResponseDto<ConceptoPago>>;
  findByTipo(tipo: string): Promise<BaseResponseDto<ConceptoPago[]>>;
}

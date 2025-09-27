// Exportar todos los DTOs de visita
export { CreateVisitaDto } from './create-visita.dto';
export { UpdateVisitaDto } from './update-visita.dto';
export {
  VisitaDto,
  VisitaResponseDto,
  VisitaListResponseDto,
  UsuarioAutorizadorDto,
  PropiedadVisitaDto,
} from './visita-response.dto';

// Nuevos DTOs con BaseResponse
export {
  VisitaResponseDto as VisitaNewResponseDto,
  UsuarioAutorizadorResponseDto,
  PropiedadVisitaResponseDto,
} from './visitaResponse.dto';
export {
  VisitaSingleResponseDto,
  VisitaArrayResponseDto,
} from './visitaBaseResponse.dto';

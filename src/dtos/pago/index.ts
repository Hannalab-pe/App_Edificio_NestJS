// Re-exports
export { CreatePagoDto } from './create-pago.dto';
export { UpdatePagoDto } from './update-pago.dto';
export { PagoResponseDto } from './pago-response.dto';

// Response DTOs with BaseResponseDto
export type CreatePagoResponseDto = import('../baseResponse/baseResponse.dto').BaseResponseDto<import('./pago-response.dto').PagoResponseDto>;
export type GetPagoResponseDto = import('../baseResponse/baseResponse.dto').BaseResponseDto<import('./pago-response.dto').PagoResponseDto>;
export type GetPagosResponseDto = import('../baseResponse/baseResponse.dto').BaseResponseDto<import('./pago-response.dto').PagoResponseDto[]>;
export type UpdatePagoResponseDto = import('../baseResponse/baseResponse.dto').BaseResponseDto<import('./pago-response.dto').PagoResponseDto>;
export type DeletePagoResponseDto = import('../baseResponse/baseResponse.dto').BaseResponseDto<{ idPago: string; mensaje: string }>;
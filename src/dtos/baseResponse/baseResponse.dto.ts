export class BaseResponseDto<T> {
    success: boolean;
    message: string;
    data: any | T;
    error?: any;
}
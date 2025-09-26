import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsOptional, IsString, IsBoolean } from 'class-validator';

export class CreateAsignacionAreaEdificioDto {
    @ApiProperty({
        description: 'ID del edificio',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @IsUUID()
    idEdificio: string;

    @ApiProperty({
        description: 'ID del área común',
        example: '123e4567-e89b-12d3-a456-426614174001',
    })
    @IsUUID()
    idAreaComun: string;

    @ApiProperty({
        description: 'Observaciones sobre la asignación',
        example: 'Área asignada específicamente para residentes de este edificio',
        required: false,
    })
    @IsOptional()
    @IsString()
    observaciones?: string;

    @ApiProperty({
        description: 'Estado activo de la asignación',
        example: true,
        default: true,
        required: false,
    })
    @IsOptional()
    @IsBoolean()
    estaActivo?: boolean;
}
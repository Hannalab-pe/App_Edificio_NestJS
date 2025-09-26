import { PartialType } from '@nestjs/swagger';
import { CreateAsignacionAreaEdificioDto } from './create-asignacion-area-edificio.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class UpdateAsignacionAreaEdificioDto extends PartialType(CreateAsignacionAreaEdificioDto) {
    @ApiProperty({
        description: 'Observaciones sobre la asignación',
        example: 'Área asignada con restricciones especiales',
        required: false,
    })
    @IsOptional()
    @IsString()
    observaciones?: string;

    @ApiProperty({
        description: 'Estado activo de la asignación',
        example: false,
        required: false,
    })
    @IsOptional()
    @IsBoolean()
    estaActivo?: boolean;
}
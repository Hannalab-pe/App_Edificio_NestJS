import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

export class AsignacionAreaDto {
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
    observaciones?: string;
}

export class CreateMultipleAsignacionAreaEdificioDto {
    @ApiProperty({
        description: 'ID del edificio',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @IsUUID()
    idEdificio: string;

    @ApiProperty({
        description: 'Lista de áreas comunes a asignar',
        type: [AsignacionAreaDto],
        example: [
            {
                idAreaComun: '123e4567-e89b-12d3-a456-426614174001',
                observaciones: 'Piscina para uso de residentes'
            },
            {
                idAreaComun: '123e4567-e89b-12d3-a456-426614174002',
                observaciones: 'Gimnasio disponible 24h'
            }
        ]
    })
    @IsArray()
    @ArrayMinSize(1, { message: 'Debe incluir al menos una asignación' })
    @ValidateNested({ each: true })
    @Type(() => AsignacionAreaDto)
    asignaciones: AsignacionAreaDto[];
}
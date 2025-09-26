import { ApiProperty } from '@nestjs/swagger';

export class CajaResponseDto {
    @ApiProperty({
        description: 'ID único de la caja',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    idCaja: string;

    @ApiProperty({
        description: 'Monto inicial con el que se abrió la caja',
        example: 500.00,
    })
    montoInicial: number;

    @ApiProperty({
        description: 'Monto final de la caja',
        example: 750.50,
    })
    montoFinal: number;

    @ApiProperty({
        description: 'Fecha de inicio de la caja',
        example: '2025-09-26',
        nullable: true,
    })
    fechaInicio: string | null;

    @ApiProperty({
        description: 'Fecha de fin de la caja',
        example: '2025-09-26',
        nullable: true,
    })
    fechaFin: string | null;

    @ApiProperty({
        description: 'Estado de la caja (true=abierta, false=cerrada)',
        example: true,
    })
    estado: boolean;

    @ApiProperty({
        description: 'Descripción de la caja',
        example: 'Caja turno mañana',
        nullable: true,
    })
    descripcion: string | null;

    @ApiProperty({
        description: 'Número de caja único',
        example: 'CAJA-001-20250926',
        nullable: true,
    })
    numeroCaja: string | null;

    @ApiProperty({
        description: 'Información del trabajador responsable',
        type: 'object',
        properties: {
            idTrabajador: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174001' },
            nombre: { type: 'string', example: 'Juan' },
            apellido: { type: 'string', example: 'Pérez' },
            correo: { type: 'string', example: 'juan.perez@edificio.com' },
        },
    })
    idTrabajador?: {
        idTrabajador: string;
        nombre: string;
        apellido: string;
        correo: string;
    };

    @ApiProperty({
        description: 'Total de ingresos calculado',
        example: 300.00,
    })
    totalIngresos?: number;

    @ApiProperty({
        description: 'Total de egresos calculado',
        example: 50.00,
    })
    totalEgresos?: number;

    @ApiProperty({
        description: 'Diferencia entre monto real y calculado',
        example: 0.50,
    })
    diferencia?: number;

    @ApiProperty({
        description: 'Cantidad de movimientos registrados',
        example: 12,
    })
    cantidadMovimientos?: number;
}
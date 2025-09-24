import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PropiedadPropietarioService } from 'src/services/implementations/propiedad-propietario/propiedad-propietario.service';
import { CreatePropiedadPropietarioDto } from 'src/dtos/propiedad-propietario/create-propiedad-propietario.dto';
import { BaseResponseDto } from 'src/dtos/baseResponse/baseResponse.dto';
import { PropiedadPropietario } from 'src/entities/PropiedadPropietario';

@ApiTags('Propiedad-Propietario')
@Controller('propiedad-propietario')
export class PropiedadPropietarioController {
    constructor(private readonly propiedadPropietarioService: PropiedadPropietarioService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: 'Asignar propietario a propiedad existente',
        description: 'Asocia un propietario a una propiedad que ya debe estar registrada en el edificio. Si el propietario no existe, lo crea automáticamente.'
    })
    @ApiResponse({
        status: 201,
        description: 'Propietario asignado a la propiedad exitosamente',
        type: BaseResponseDto
    })
    @ApiResponse({
        status: 400,
        description: 'Error en los datos enviados, la propiedad no existe, o la relación ya existe'
    })
    async create(@Body() createPropiedadPropietarioDto: CreatePropiedadPropietarioDto): Promise<BaseResponseDto<PropiedadPropietario>> {
        return await this.propiedadPropietarioService.create(createPropiedadPropietarioDto);
    }
}

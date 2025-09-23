import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AreaComunService } from 'src/services/implementations';

@ApiTags('Áreas Comunes')
@Controller('area-comun')
export class AreaComunController {

    constructor(private readonly areaComunService: AreaComunService) { }
    
    @Get()
    @ApiOperation({
        summary: 'Obtener todas las áreas comunes',
        description: 'Retorna una lista de todas las áreas comunes del edificio'
    })
    async findAll() {
        return await this.areaComunService.findAll();
    }

}

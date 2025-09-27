import {
    Controller,
    Get,
    Post,
    Patch,
    Param,
    Body,
    Query,
    HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ContratoService } from 'src/services/implementations/contrato/contrato.service';
import { CreateContratoDto, UpdateContratoDto, ContratoResponseDto, RenovarContratoDto } from 'src/dtos/contrato';
import { BaseResponseDto } from 'src/dtos/baseResponse/baseResponse.dto';
import { Contrato } from 'src/entities/Contrato';

@ApiTags('Contratos')
@Controller('contrato')
export class ContratoController {
    constructor(private readonly contratoService: ContratoService) { }

    @Post()
    @ApiOperation({
        summary: 'Crear un nuevo contrato',
        description: 'Crea un nuevo contrato para un trabajador usando su salario actual como remuneración. Si existe un contrato activo, lo registra en el historial y lo marca como terminado. El trabajador debe tener un salario actual válido definido.'
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Contrato creado exitosamente usando el salario actual del trabajador',
        type: Contrato
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Datos inválidos o trabajador sin salario actual válido'
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Trabajador no encontrado'
    })
    async crearContrato(@Body() createContratoDto: CreateContratoDto): Promise<BaseResponseDto<Contrato>> {
        return this.contratoService.crearNuevoContrato(createContratoDto);
    }

    @Get('trabajador/:idTrabajador/activo')
    @ApiOperation({
        summary: 'Obtener contrato activo de un trabajador',
        description: 'Retorna el contrato que esté vigente para el trabajador especificado'
    })
    @ApiParam({
        name: 'idTrabajador',
        description: 'ID del trabajador',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Contrato activo obtenido exitosamente',
        type: Contrato
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'No se encontró contrato activo para el trabajador'
    })
    async obtenerContratoActivo(@Param('idTrabajador') idTrabajador: string): Promise<Contrato | null> {
        return this.contratoService.obtenerContratoActivo(idTrabajador);
    }

    @Get('trabajador/:idTrabajador/historial')
    @ApiOperation({
        summary: 'Obtener historial de contratos de un trabajador',
        description: 'Retorna todos los contratos del trabajador con su estado lógico calculado'
    })
    @ApiParam({
        name: 'idTrabajador',
        description: 'ID del trabajador',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Historial de contratos obtenido exitosamente',
        type: [ContratoResponseDto]
    })
    async obtenerHistorialContratos(@Param('idTrabajador') idTrabajador: string) {
        return this.contratoService.obtenerHistorialContratos(idTrabajador);
    }

    @Patch(':idContrato/renovar')
    @ApiOperation({
        summary: 'Renovar un contrato existente',
        description: 'Renueva un contrato extendiendo su fecha de fin y opcionalmente actualizando la remuneración'
    })
    @ApiParam({
        name: 'idContrato',
        description: 'ID del contrato a renovar',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Contrato renovado exitosamente',
        type: Contrato
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Contrato no encontrado'
    })
    async renovarContrato(
        @Param('idContrato') idContrato: string,
        @Body() renovarContratoDto: RenovarContratoDto
    ): Promise<BaseResponseDto<Contrato>> {
        return this.contratoService.renovarContrato(
            idContrato,
            renovarContratoDto.nuevaFechaFin,
            renovarContratoDto.nuevaRemuneracion
        );
    }

    @Post('trabajador/:idTrabajador/sincronizar-salario')
    @ApiOperation({
        summary: 'Sincronizar salario de un trabajador',
        description: 'Actualiza el salario del trabajador basado en su contrato activo'
    })
    @ApiParam({
        name: 'idTrabajador',
        description: 'ID del trabajador',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Salario sincronizado exitosamente'
    })
    async sincronizarSalario(@Param('idTrabajador') idTrabajador: string): Promise<BaseResponseDto<any>> {
        return this.contratoService.sincronizarSalarioTrabajador(idTrabajador);
    }

    @Get('trabajador/:idTrabajador/validar-consistencia')
    @ApiOperation({
        summary: 'Validar consistencia salarial',
        description: 'Verifica que el salario del trabajador coincida con su contrato activo'
    })
    @ApiParam({
        name: 'idTrabajador',
        description: 'ID del trabajador',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Validación de consistencia completada'
    })
    async validarConsistencia(@Param('idTrabajador') idTrabajador: string) {
        return this.contratoService.validarConsistenciaSalarial(idTrabajador);
    }

    @Post('sincronizar-todos-salarios')
    @ApiOperation({
        summary: 'Sincronizar salarios de todos los trabajadores',
        description: 'Proceso masivo para sincronizar los salarios de todos los trabajadores con sus contratos activos'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Proceso de sincronización completado'
    })
    async sincronizarTodosLosSalarios(): Promise<BaseResponseDto<any>> {
        return this.contratoService.sincronizarTodosLosSalarios();
    }

    @Get('estadisticas')
    @ApiOperation({
        summary: 'Obtener estadísticas de contratos',
        description: 'Retorna estadísticas generales sobre contratos y remuneraciones'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Estadísticas obtenidas exitosamente'
    })
    async obtenerEstadisticas() {
        return this.contratoService.obtenerEstadisticas();
    }

    @Get('debug/estados/:idTrabajador')
    @ApiOperation({
        summary: 'DEBUG - Verificar estados de contratos',
        description: 'Endpoint temporal para verificar estados de contratos de un trabajador y detectar duplicados'
    })
    @ApiParam({
        name: 'idTrabajador',
        description: 'ID del trabajador a verificar',
        example: '62cab11b-352c-46de-b0ea-56632be97ebd'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Estados verificados exitosamente'
    })
    async verificarEstados(@Param('idTrabajador') idTrabajador: string) {
        return this.contratoService.verificarEstadosContratos(idTrabajador);
    }
}

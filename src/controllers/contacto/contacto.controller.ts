import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ContactoService } from 'src/services/implementations/contacto/contacto.service';
import { CreateContactoDto, UpdateContactoDto, ContactoResponseDto } from 'src/dtos/contacto';
import { BaseResponseDto } from 'src/dtos/baseResponse/baseResponse.dto';

@ApiTags('Contactos')
@Controller('contacto')
export class ContactoController {
    constructor(private readonly contactoService: ContactoService) { }

    @Post()
    @ApiOperation({
        summary: 'Crear un nuevo contacto',
        description: 'Crea un nuevo contacto con la información proporcionada y validaciones de negocio'
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Contacto creado exitosamente',
        type: ContactoResponseDto
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Datos inválidos o tipos incompatibles'
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'Email duplicado'
    })
    create(@Body() createContactoDto: CreateContactoDto): Promise<BaseResponseDto<ContactoResponseDto>> {
        return this.contactoService.create(createContactoDto);
    }

    @Get()
    @ApiOperation({
        summary: 'Obtener todos los contactos',
        description: 'Retorna una lista de todos los contactos registrados con su información completa'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Lista de contactos obtenida exitosamente',
        type: [ContactoResponseDto]
    })
    findAll(): Promise<BaseResponseDto<ContactoResponseDto[]>> {
        return this.contactoService.findAll();
    }

    @Get('activos')
    @ApiOperation({
        summary: 'Obtener contactos activos',
        description: 'Retorna solo los contactos que están marcados como activos'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Contactos activos obtenidos exitosamente',
        type: [ContactoResponseDto]
    })
    findActivos(): Promise<BaseResponseDto<ContactoResponseDto[]>> {
        return this.contactoService.findActivos();
    }

    @Get('inactivos')
    @ApiOperation({
        summary: 'Obtener contactos inactivos',
        description: 'Retorna solo los contactos que están marcados como inactivos'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Contactos inactivos obtenidos exitosamente',
        type: [ContactoResponseDto]
    })
    findInactivos(): Promise<BaseResponseDto<ContactoResponseDto[]>> {
        return this.contactoService.findInactivos();
    }

    @Get('disponibles')
    @ApiOperation({
        summary: 'Obtener contactos disponibles',
        description: 'Retorna contactos disponibles para asignación, opcionalmente filtrados para emergencias'
    })
    @ApiQuery({
        name: 'urgente',
        description: 'Filtrar solo contactos de emergencia',
        example: false,
        required: false,
        type: Boolean
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Contactos disponibles obtenidos exitosamente',
        type: [ContactoResponseDto]
    })
    findDisponibles(@Query('urgente') urgente?: boolean): Promise<BaseResponseDto<ContactoResponseDto[]>> {
        return this.contactoService.findContactosDisponibles(urgente);
    }

    @Get('emergencia')
    @ApiOperation({
        summary: 'Obtener contactos de emergencia',
        description: 'Retorna solo los contactos especializados en servicios de emergencia'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Contactos de emergencia obtenidos exitosamente',
        type: [ContactoResponseDto]
    })
    findEmergencia(): Promise<BaseResponseDto<ContactoResponseDto[]>> {
        return this.contactoService.findContactosEmergencia();
    }

    @Get('por-tipo-contacto/:idTipoContacto')
    @ApiOperation({
        summary: 'Obtener contactos por tipo de contacto',
        description: 'Retorna todos los contactos de un tipo específico'
    })
    @ApiParam({
        name: 'idTipoContacto',
        description: 'ID del tipo de contacto',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Contactos por tipo obtenidos exitosamente',
        type: [ContactoResponseDto]
    })
    findByTipoContacto(@Param('idTipoContacto') idTipoContacto: string): Promise<BaseResponseDto<ContactoResponseDto[]>> {
        return this.contactoService.findByTipoContacto(idTipoContacto);
    }

    @Get('por-tipo-contrato/:idTipoContrato')
    @ApiOperation({
        summary: 'Obtener contactos por tipo de contrato',
        description: 'Retorna todos los contactos con un tipo de contrato específico'
    })
    @ApiParam({
        name: 'idTipoContrato',
        description: 'ID del tipo de contrato',
        example: '123e4567-e89b-12d3-a456-426614174001'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Contactos por tipo de contrato obtenidos exitosamente',
        type: [ContactoResponseDto]
    })
    findByTipoContrato(@Param('idTipoContrato') idTipoContrato: string): Promise<BaseResponseDto<ContactoResponseDto[]>> {
        return this.contactoService.findByTipoContrato(idTipoContrato);
    }

    @Get('por-tipos/:idTipoContacto/:idTipoContrato')
    @ApiOperation({
        summary: 'Obtener contactos por ambos tipos',
        description: 'Retorna contactos que coincidan con tipo de contacto Y tipo de contrato específicos'
    })
    @ApiParam({
        name: 'idTipoContacto',
        description: 'ID del tipo de contacto',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiParam({
        name: 'idTipoContrato',
        description: 'ID del tipo de contrato',
        example: '123e4567-e89b-12d3-a456-426614174001'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Contactos por tipos específicos obtenidos exitosamente',
        type: [ContactoResponseDto]
    })
    findByTipos(
        @Param('idTipoContacto') idTipoContacto: string,
        @Param('idTipoContrato') idTipoContrato: string,
    ): Promise<BaseResponseDto<ContactoResponseDto[]>> {
        return this.contactoService.findByTipos(idTipoContacto, idTipoContrato);
    }

    @Get('buscar-nombre')
    @ApiOperation({
        summary: 'Buscar contactos por nombre',
        description: 'Busca contactos que contengan el texto especificado en su nombre'
    })
    @ApiQuery({
        name: 'nombre',
        description: 'Texto a buscar en el nombre',
        example: 'Juan'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Contactos encontrados por nombre',
        type: [ContactoResponseDto]
    })
    buscarPorNombre(@Query('nombre') nombre: string): Promise<BaseResponseDto<ContactoResponseDto[]>> {
        return this.contactoService.buscarPorNombre(nombre);
    }

    @Get('buscar-telefono')
    @ApiOperation({
        summary: 'Buscar contactos por teléfono',
        description: 'Busca contactos que contengan el número especificado'
    })
    @ApiQuery({
        name: 'telefono',
        description: 'Número de teléfono a buscar',
        example: '987654321'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Contactos encontrados por teléfono',
        type: [ContactoResponseDto]
    })
    buscarPorTelefono(@Query('telefono') telefono: string): Promise<BaseResponseDto<ContactoResponseDto[]>> {
        return this.contactoService.findByTelefono(telefono);
    }

    @Get('buscar-email/:email')
    @ApiOperation({
        summary: 'Buscar contacto por email',
        description: 'Busca un contacto específico por su dirección de correo electrónico'
    })
    @ApiParam({
        name: 'email',
        description: 'Dirección de correo electrónico',
        example: 'contacto@email.com'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Contacto encontrado por email',
        type: ContactoResponseDto
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'No se encontró contacto con este email'
    })
    findByEmail(@Param('email') email: string): Promise<BaseResponseDto<ContactoResponseDto>> {
        return this.contactoService.findByEmail(email);
    }

    @Get('mantenimiento/:tipoTrabajo')
    @ApiOperation({
        summary: 'Obtener contactos para tipo de mantenimiento',
        description: 'Retorna contactos especializados en un tipo específico de trabajo de mantenimiento'
    })
    @ApiParam({
        name: 'tipoTrabajo',
        description: 'Tipo de trabajo de mantenimiento',
        example: 'ELECTRICIDAD'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Contactos para mantenimiento obtenidos exitosamente',
        type: [ContactoResponseDto]
    })
    findParaMantenimiento(@Param('tipoTrabajo') tipoTrabajo: string): Promise<BaseResponseDto<ContactoResponseDto[]>> {
        return this.contactoService.findContactosParaMantenimiento(tipoTrabajo);
    }

    @Get('resumen-tipos')
    @ApiOperation({
        summary: 'Obtener resumen por tipos',
        description: 'Retorna estadísticas agrupadas por tipo de contacto y contrato'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Resumen por tipos obtenido exitosamente'
    })
    obtenerResumenPorTipo(): Promise<BaseResponseDto<any>> {
        return this.contactoService.obtenerResumenPorTipo();
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Obtener un contacto por ID',
        description: 'Retorna la información detallada de un contacto específico'
    })
    @ApiParam({
        name: 'id',
        description: 'ID único del contacto',
        example: '123e4567-e89b-12d3-a456-426614174002'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Contacto obtenido exitosamente',
        type: ContactoResponseDto
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Contacto no encontrado'
    })
    findOne(@Param('id') id: string): Promise<BaseResponseDto<ContactoResponseDto>> {
        return this.contactoService.findOne(id);
    }

    @Get(':id/estadisticas')
    @ApiOperation({
        summary: 'Obtener estadísticas de un contacto',
        description: 'Retorna estadísticas detalladas de mantenimientos y actividad del contacto'
    })
    @ApiParam({
        name: 'id',
        description: 'ID único del contacto',
        example: '123e4567-e89b-12d3-a456-426614174002'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Estadísticas del contacto obtenidas exitosamente'
    })
    obtenerEstadisticas(@Param('id') id: string): Promise<BaseResponseDto<any>> {
        return this.contactoService.obtenerEstadisticasContacto(id);
    }

    @Get(':id/disponibilidad')
    @ApiOperation({
        summary: 'Verificar disponibilidad de un contacto',
        description: 'Verifica si el contacto está disponible para asignación de nuevos trabajos'
    })
    @ApiParam({
        name: 'id',
        description: 'ID único del contacto',
        example: '123e4567-e89b-12d3-a456-426614174002'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Disponibilidad verificada exitosamente'
    })
    verificarDisponibilidad(@Param('id') id: string): Promise<BaseResponseDto<boolean>> {
        return this.contactoService.verificarDisponibilidad(id);
    }

    @Patch(':id')
    @ApiOperation({
        summary: 'Actualizar un contacto',
        description: 'Actualiza la información de un contacto existente'
    })
    @ApiParam({
        name: 'id',
        description: 'ID único del contacto',
        example: '123e4567-e89b-12d3-a456-426614174002'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Contacto actualizado exitosamente',
        type: ContactoResponseDto
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Contacto no encontrado'
    })
    update(
        @Param('id') id: string,
        @Body() updateContactoDto: UpdateContactoDto,
    ): Promise<BaseResponseDto<ContactoResponseDto>> {
        return this.contactoService.update(id, updateContactoDto);
    }

    @Patch(':id/activar')
    @ApiOperation({
        summary: 'Activar un contacto',
        description: 'Activa un contacto marcándolo como disponible para asignaciones'
    })
    @ApiParam({
        name: 'id',
        description: 'ID único del contacto',
        example: '123e4567-e89b-12d3-a456-426614174002'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Contacto activado exitosamente',
        type: ContactoResponseDto
    })
    activar(@Param('id') id: string): Promise<BaseResponseDto<ContactoResponseDto>> {
        return this.contactoService.activarContacto(id);
    }

    @Patch(':id/desactivar')
    @ApiOperation({
        summary: 'Desactivar un contacto',
        description: 'Desactiva un contacto impidiendo nuevas asignaciones'
    })
    @ApiParam({
        name: 'id',
        description: 'ID único del contacto',
        example: '123e4567-e89b-12d3-a456-426614174002'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Contacto desactivado exitosamente',
        type: ContactoResponseDto
    })
    desactivar(@Param('id') id: string): Promise<BaseResponseDto<ContactoResponseDto>> {
        return this.contactoService.desactivarContacto(id);
    }

    @Delete(':id')
    @ApiOperation({
        summary: 'Eliminar un contacto',
        description: 'Elimina un contacto del sistema (solo si no tiene mantenimientos pendientes)'
    })
    @ApiParam({
        name: 'id',
        description: 'ID único del contacto',
        example: '123e4567-e89b-12d3-a456-426614174002'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Contacto eliminado exitosamente'
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Contacto no encontrado'
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'No se puede eliminar el contacto porque tiene mantenimientos pendientes'
    })
    remove(@Param('id') id: string): Promise<BaseResponseDto<void>> {
        return this.contactoService.remove(id);
    }
}

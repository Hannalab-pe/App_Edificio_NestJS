import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    ParseUUIDPipe,
    HttpStatus,
    HttpCode,
    UseGuards,
    Inject,
    Request,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiQuery,
} from '@nestjs/swagger';
import { IMensajePrivadoService } from '../../services/interfaces/mensaje-privado.interface';
import { CreateMensajePrivadoDto } from '../../dtos/mensaje-privado/create-mensaje-privado.dto';
import { UpdateMensajePrivadoDto } from '../../dtos/mensaje-privado/update-mensaje-privado.dto';
import { MensajePrivadoResponseDto } from '../../dtos/mensaje-privado/mensaje-privado-response.dto';
import { BaseResponseDto } from '../../dtos/baseResponse/baseResponse.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('Mensajes Privados')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('mensaje-privado')
export class MensajePrivadoController {
    constructor(
        @Inject('IMensajePrivadoService')
        private readonly mensajePrivadoService: IMensajePrivadoService,
    ) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: 'Crear un nuevo mensaje privado',
        description: 'Permite crear un mensaje privado entre usuarios. Puede ser un mensaje nuevo o una respuesta a un mensaje existente.',
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Mensaje privado creado exitosamente',
        type: BaseResponseDto<MensajePrivadoResponseDto>,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Datos de entrada inválidos',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Usuario receptor o mensaje padre no encontrado',
    })
    async create(
        @Body() createMensajePrivadoDto: CreateMensajePrivadoDto,
        @Request() req: any,
    ): Promise<BaseResponseDto<MensajePrivadoResponseDto>> {
        try {
            // El usuario emisor se obtiene del token JWT
            req.user = req.user || { userId: 'temp-user-id' }; // Fallback temporal para desarrollo

            const mensaje = await this.mensajePrivadoService.create(createMensajePrivadoDto);
            const response = this.mensajePrivadoService.formatMensajeForResponse(mensaje);

            return BaseResponseDto.success(
                response,
                'Mensaje privado creado exitosamente',
                HttpStatus.CREATED,
            );
        } catch (error) {
            return BaseResponseDto.error(
                error.message || 'Error al crear el mensaje privado',
                HttpStatus.BAD_REQUEST,
                error,
            );
        }
    }

    @Get()
    @ApiOperation({
        summary: 'Obtener todos los mensajes privados',
        description: 'Retorna una lista de todos los mensajes privados con paginación opcional.',
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Número máximo de resultados',
    })
    @ApiQuery({
        name: 'offset',
        required: false,
        type: Number,
        description: 'Número de resultados a omitir',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Lista de mensajes privados obtenida exitosamente',
        type: [MensajePrivadoResponseDto],
    })
    async findAll(
        @Query('limit') limit?: string,
        @Query('offset') offset?: string,
    ): Promise<BaseResponseDto<MensajePrivadoResponseDto[]>> {
        try {
            const mensajes = await this.mensajePrivadoService.findAll();
            const responses = mensajes.map(mensaje =>
                this.mensajePrivadoService.formatMensajeForResponse(mensaje)
            );

            // Aplicar paginación si se especifica
            let paginatedResults = responses;
            if (limit || offset) {
                const limitNum = limit ? parseInt(limit, 10) : responses.length;
                const offsetNum = offset ? parseInt(offset, 10) : 0;
                paginatedResults = responses.slice(offsetNum, offsetNum + limitNum);
            }

            return BaseResponseDto.success(
                paginatedResults,
                'Mensajes privados obtenidos exitosamente',
                HttpStatus.OK,
            );
        } catch (error) {
            return BaseResponseDto.error(
                error.message || 'Error al obtener los mensajes privados',
                HttpStatus.INTERNAL_SERVER_ERROR,
                error,
            );
        }
    }

    @Get('usuario/:usuarioId')
    @ApiOperation({
        summary: 'Obtener mensajes de un usuario específico',
        description: 'Retorna todos los mensajes privados donde el usuario es emisor o receptor.',
    })
    @ApiParam({
        name: 'usuarioId',
        type: 'string',
        format: 'uuid',
        description: 'ID del usuario',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Mensajes del usuario obtenidos exitosamente',
        type: [MensajePrivadoResponseDto],
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Usuario no encontrado',
    })
    async findByUsuario(
        @Param('usuarioId', ParseUUIDPipe) usuarioId: string,
    ): Promise<BaseResponseDto<MensajePrivadoResponseDto[]>> {
        try {
            const mensajes = await this.mensajePrivadoService.findByUsuario(usuarioId);
            const responses = mensajes.map(mensaje =>
                this.mensajePrivadoService.formatMensajeForResponse(mensaje)
            );

            return BaseResponseDto.success(
                responses,
                'Mensajes del usuario obtenidos exitosamente',
                HttpStatus.OK,
            );
        } catch (error) {
            return BaseResponseDto.error(
                error.message || 'Error al obtener los mensajes del usuario',
                HttpStatus.NOT_FOUND,
                error,
            );
        }
    }

    @Get('conversacion/:emisorId/:receptorId')
    @ApiOperation({
        summary: 'Obtener conversación entre dos usuarios',
        description: 'Retorna todos los mensajes intercambiados entre dos usuarios específicos.',
    })
    @ApiParam({
        name: 'emisorId',
        type: 'string',
        format: 'uuid',
        description: 'ID del usuario emisor',
    })
    @ApiParam({
        name: 'receptorId',
        type: 'string',
        format: 'uuid',
        description: 'ID del usuario receptor',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Conversación obtenida exitosamente',
        type: [MensajePrivadoResponseDto],
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Uno o ambos usuarios no encontrados',
    })
    async findConversation(
        @Param('emisorId', ParseUUIDPipe) emisorId: string,
        @Param('receptorId', ParseUUIDPipe) receptorId: string,
    ): Promise<BaseResponseDto<MensajePrivadoResponseDto[]>> {
        try {
            const mensajes = await this.mensajePrivadoService.findConversation(emisorId, receptorId);
            const responses = mensajes.map(mensaje =>
                this.mensajePrivadoService.formatMensajeForResponse(mensaje)
            );

            return BaseResponseDto.success(
                responses,
                'Conversación obtenida exitosamente',
                HttpStatus.OK,
            );
        } catch (error) {
            return BaseResponseDto.error(
                error.message || 'Error al obtener la conversación',
                HttpStatus.NOT_FOUND,
                error,
            );
        }
    }

    @Get('no-leidos/:usuarioId')
    @ApiOperation({
        summary: 'Obtener mensajes no leídos de un usuario',
        description: 'Retorna todos los mensajes no leídos dirigidos a un usuario específico.',
    })
    @ApiParam({
        name: 'usuarioId',
        type: 'string',
        format: 'uuid',
        description: 'ID del usuario receptor',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Mensajes no leídos obtenidos exitosamente',
        type: [MensajePrivadoResponseDto],
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Usuario no encontrado',
    })
    async findUnreadByUsuario(
        @Param('usuarioId', ParseUUIDPipe) usuarioId: string,
    ): Promise<BaseResponseDto<MensajePrivadoResponseDto[]>> {
        try {
            const mensajes = await this.mensajePrivadoService.findUnreadByUsuario(usuarioId);
            const responses = mensajes.map(mensaje =>
                this.mensajePrivadoService.formatMensajeForResponse(mensaje)
            );

            return BaseResponseDto.success(
                responses,
                'Mensajes no leídos obtenidos exitosamente',
                HttpStatus.OK,
            );
        } catch (error) {
            return BaseResponseDto.error(
                error.message || 'Error al obtener los mensajes no leídos',
                HttpStatus.NOT_FOUND,
                error,
            );
        }
    }

    @Get('contar-no-leidos/:usuarioId')
    @ApiOperation({
        summary: 'Contar mensajes no leídos de un usuario',
        description: 'Retorna el número total de mensajes no leídos dirigidos a un usuario específico.',
    })
    @ApiParam({
        name: 'usuarioId',
        type: 'string',
        format: 'uuid',
        description: 'ID del usuario receptor',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Conteo de mensajes no leídos obtenido exitosamente',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
                data: { type: 'number' },
            },
        },
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Usuario no encontrado',
    })
    async countUnreadByUsuario(
        @Param('usuarioId', ParseUUIDPipe) usuarioId: string,
    ): Promise<BaseResponseDto<number>> {
        try {
            const count = await this.mensajePrivadoService.countUnreadByUsuario(usuarioId);

            return BaseResponseDto.success(
                count,
                'Conteo de mensajes no leídos obtenido exitosamente',
                HttpStatus.OK,
            );
        } catch (error) {
            return BaseResponseDto.error(
                error.message || 'Error al contar los mensajes no leídos',
                HttpStatus.NOT_FOUND,
                error,
            );
        }
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Obtener un mensaje privado por ID',
        description: 'Retorna los detalles de un mensaje privado específico.',
    })
    @ApiParam({
        name: 'id',
        type: 'string',
        format: 'uuid',
        description: 'ID del mensaje privado',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Mensaje privado obtenido exitosamente',
        type: MensajePrivadoResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Mensaje privado no encontrado',
    })
    async findOne(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<BaseResponseDto<MensajePrivadoResponseDto>> {
        try {
            const mensaje = await this.mensajePrivadoService.findOne(id);
            const response = this.mensajePrivadoService.formatMensajeForResponse(mensaje);

            return BaseResponseDto.success(
                response,
                'Mensaje privado obtenido exitosamente',
                HttpStatus.OK,
            );
        } catch (error) {
            return BaseResponseDto.error(
                error.message || 'Error al obtener el mensaje privado',
                HttpStatus.NOT_FOUND,
                error,
            );
        }
    }

    @Patch(':id')
    @ApiOperation({
        summary: 'Actualizar un mensaje privado',
        description: 'Permite actualizar parcialmente un mensaje privado existente.',
    })
    @ApiParam({
        name: 'id',
        type: 'string',
        format: 'uuid',
        description: 'ID del mensaje privado',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Mensaje privado actualizado exitosamente',
        type: BaseResponseDto<MensajePrivadoResponseDto>,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Mensaje privado no encontrado',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Datos de entrada inválidos',
    })
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateMensajePrivadoDto: UpdateMensajePrivadoDto,
    ): Promise<BaseResponseDto<MensajePrivadoResponseDto>> {
        try {
            const mensaje = await this.mensajePrivadoService.update(id, updateMensajePrivadoDto);
            const response = this.mensajePrivadoService.formatMensajeForResponse(mensaje);

            return BaseResponseDto.success(
                response,
                'Mensaje privado actualizado exitosamente',
                HttpStatus.OK,
            );
        } catch (error) {
            return BaseResponseDto.error(
                error.message || 'Error al actualizar el mensaje privado',
                HttpStatus.BAD_REQUEST,
                error,
            );
        }
    }

    @Patch(':id/marcar-leido')
    @ApiOperation({
        summary: 'Marcar mensaje como leído',
        description: 'Marca un mensaje privado específico como leído y registra la fecha de lectura.',
    })
    @ApiParam({
        name: 'id',
        type: 'string',
        format: 'uuid',
        description: 'ID del mensaje privado',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Mensaje marcado como leído exitosamente',
        type: BaseResponseDto<MensajePrivadoResponseDto>,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Mensaje privado no encontrado',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'El mensaje ya está marcado como leído',
    })
    async markAsRead(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<BaseResponseDto<MensajePrivadoResponseDto>> {
        try {
            const mensaje = await this.mensajePrivadoService.markAsRead(id);
            const response = this.mensajePrivadoService.formatMensajeForResponse(mensaje);

            return BaseResponseDto.success(
                response,
                'Mensaje marcado como leído exitosamente',
                HttpStatus.OK,
            );
        } catch (error) {
            return BaseResponseDto.error(
                error.message || 'Error al marcar el mensaje como leído',
                HttpStatus.BAD_REQUEST,
                error,
            );
        }
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({
        summary: 'Eliminar un mensaje privado',
        description: 'Elimina un mensaje privado. No se puede eliminar si tiene respuestas.',
    })
    @ApiParam({
        name: 'id',
        type: 'string',
        format: 'uuid',
        description: 'ID del mensaje privado',
    })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'Mensaje privado eliminado exitosamente',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Mensaje privado no encontrado',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'No se puede eliminar un mensaje que tiene respuestas',
    })
    async remove(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<BaseResponseDto<null>> {
        try {
            await this.mensajePrivadoService.remove(id);

            return BaseResponseDto.success(
                null,
                'Mensaje privado eliminado exitosamente',
                HttpStatus.NO_CONTENT,
            );
        } catch (error) {
            return BaseResponseDto.error(
                error.message || 'Error al eliminar el mensaje privado',
                HttpStatus.BAD_REQUEST,
                error,
            );
        }
    }
}

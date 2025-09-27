import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  Inject,
  UseGuards,
  HttpException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { IRolService } from '../../services/interfaces/rol.interface';
import {
  CreateRolDto,
  UpdateRolDto,
  RolSingleResponseDto,
  RolArrayResponseDto,
} from '../../dtos';
import { BaseResponseDto } from '../../dtos/baseResponse/baseResponse.dto';
import { Rol } from '../../entities/Rol';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolService } from '../../services/implementations/rol/rol.service';

@ApiTags('Roles')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('rol')
export class RolController {
  constructor(
    @Inject('IRolService')
    private readonly rolService: IRolService,
    private readonly rolServiceDirect: RolService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Crear nuevo rol',
    description:
      'Crea un nuevo rol en el sistema con validación de nombre único',
  })
  @ApiBody({
    type: CreateRolDto,
    description: 'Datos del rol a crear',
  })
  @ApiResponse({
    status: 201,
    description: 'Rol creado exitosamente',
    type: RolSingleResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
  })
  @ApiResponse({
    status: 409,
    description: 'Ya existe un rol con el mismo nombre',
  })
  async create(
    @Body() createRolDto: CreateRolDto,
  ): Promise<BaseResponseDto<any>> {
    try {
      return await this.rolServiceDirect.createWithBaseResponse(createRolDto);
    } catch (error) {
      throw new HttpException(
        `Error al crear el rol: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los roles',
    description:
      'Retorna una lista de todos los roles del sistema con sus relaciones',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de roles obtenida exitosamente',
    type: RolArrayResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async findAll(): Promise<BaseResponseDto<any[]>> {
    try {
      return await this.rolServiceDirect.findAllWithBaseResponse();
    } catch (error) {
      throw new HttpException(
        `Error al obtener los roles: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener rol por ID',
    description:
      'Retorna un rol específico identificado por su UUID con todas sus relaciones',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID único del rol',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Rol encontrado exitosamente',
    type: RolSingleResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Rol no encontrado',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<BaseResponseDto<any>> {
    try {
      return await this.rolServiceDirect.findOneWithBaseResponse(id);
    } catch (error) {
      throw new HttpException(
        `Error al buscar el rol: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('nombre/:nombre')
  @ApiOperation({
    summary: 'Obtener rol por nombre',
    description:
      'Busca un rol específico por su nombre con todas sus relaciones',
  })
  @ApiParam({
    name: 'nombre',
    description: 'Nombre exacto del rol a buscar',
    example: 'Administrador',
  })
  @ApiResponse({
    status: 200,
    description: 'Rol encontrado exitosamente',
    type: RolSingleResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Rol no encontrado con el nombre especificado',
  })
  async findByNombre(
    @Param('nombre') nombre: string,
  ): Promise<BaseResponseDto<any>> {
    try {
      return await this.rolServiceDirect.findByNombreWithBaseResponse(nombre);
    } catch (error) {
      throw new HttpException(
        `Error al buscar rol por nombre: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar rol',
    description:
      'Actualiza parcialmente un rol existente con validación de nombre único',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID único del rol a actualizar',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    type: UpdateRolDto,
    description: 'Datos del rol a actualizar (campos opcionales)',
  })
  @ApiResponse({
    status: 200,
    description: 'Rol actualizado exitosamente',
    type: RolSingleResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
  })
  @ApiResponse({
    status: 404,
    description: 'Rol no encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflicto con nombre existente',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRolDto: UpdateRolDto,
  ): Promise<BaseResponseDto<any>> {
    try {
      return await this.rolServiceDirect.updateWithBaseResponse(
        id,
        updateRolDto,
      );
    } catch (error) {
      throw new HttpException(
        `Error al actualizar el rol: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar rol',
    description: 'Elimina un rol del sistema si no tiene usuarios asociados',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID único del rol a eliminar',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Rol eliminado exitosamente',
    type: BaseResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Rol no encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'No se puede eliminar el rol porque tiene usuarios asociados',
  })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<BaseResponseDto<null>> {
    try {
      return await this.rolServiceDirect.removeWithBaseResponse(id);
    } catch (error) {
      throw new HttpException(
        `Error al eliminar el rol: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('seed')
  @ApiOperation({
    summary: 'Inicializar roles del sistema',
    description:
      'Crea los roles por defecto del sistema si no existen (Administrador, Propietario, Residente, Portero, Conserje)',
  })
  @ApiResponse({
    status: 200,
    description: 'Roles por defecto procesados exitosamente',
    type: BaseResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async createDefaultRoles(): Promise<BaseResponseDto<null>> {
    try {
      await this.rolService.createDefaultRoles();
      return BaseResponseDto.success(
        null,
        'Roles por defecto procesados exitosamente',
      );
    } catch (error) {
      throw new HttpException(
        `Error al crear roles por defecto: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

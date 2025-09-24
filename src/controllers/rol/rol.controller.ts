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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { IRolService } from '../../services/interfaces/rol.interface';
import { CreateRolDto, UpdateRolDto } from '../../dtos';
import { BaseResponseDto } from '../../dtos/baseResponse/baseResponse.dto';
import { Rol } from '../../entities/Rol';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('Roles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('rol')
export class RolController {
  constructor(
    @Inject('IRolService')
    private readonly rolService: IRolService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo rol' })
  @ApiResponse({
    status: 201,
    description: 'Rol creado exitosamente',
    type: BaseResponseDto<Rol>,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
  })
  async create(
    @Body() createRolDto: CreateRolDto,
  ): Promise<BaseResponseDto<Rol>> {
    try {
      const rol = await this.rolService.create(createRolDto);
      return BaseResponseDto.success(
        rol,
        'Rol creado exitosamente',
        HttpStatus.CREATED,
      );
    } catch (error) {
      return BaseResponseDto.error(
        'Error al crear el rol',
        HttpStatus.BAD_REQUEST,
        error.message,
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los roles' })
  @ApiResponse({
    status: 200,
    description: 'Lista de roles obtenida exitosamente',
    type: BaseResponseDto<Rol[]>,
  })
  async findAll(): Promise<BaseResponseDto<Rol[]>> {
    try {
      const roles = await this.rolService.findAll();
      return BaseResponseDto.success(
        roles,
        'Roles obtenidos exitosamente',
        HttpStatus.OK,
      );
    } catch (error) {
      return BaseResponseDto.error(
        'Error al obtener los roles',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un rol por ID' })
  @ApiResponse({
    status: 200,
    description: 'Rol encontrado exitosamente',
    type: BaseResponseDto<Rol>,
  })
  @ApiResponse({
    status: 404,
    description: 'Rol no encontrado',
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<BaseResponseDto<Rol>> {
    try {
      const rol = await this.rolService.findOne(id);
      return BaseResponseDto.success(
        rol,
        'Rol encontrado exitosamente',
        HttpStatus.OK,
      );
    } catch (error) {
      return BaseResponseDto.error(
        'Error al obtener el rol',
        HttpStatus.NOT_FOUND,
        error.message,
      );
    }
  }

  @Get('nombre/:nombre')
  @ApiOperation({ summary: 'Obtener un rol por nombre' })
  @ApiResponse({
    status: 200,
    description: 'Rol encontrado exitosamente',
    type: BaseResponseDto<Rol>,
  })
  @ApiResponse({
    status: 404,
    description: 'Rol no encontrado',
  })
  async findByNombre(
    @Param('nombre') nombre: string,
  ): Promise<BaseResponseDto<Rol>> {
    try {
      const rol = await this.rolService.findByNombre(nombre);
      return BaseResponseDto.success(
        rol,
        'Rol encontrado exitosamente',
        HttpStatus.OK,
      );
    } catch (error) {
      return BaseResponseDto.error(
        'Error al obtener el rol',
        HttpStatus.NOT_FOUND,
        error.message,
      );
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un rol' })
  @ApiResponse({
    status: 200,
    description: 'Rol actualizado exitosamente',
    type: BaseResponseDto<Rol>,
  })
  @ApiResponse({
    status: 404,
    description: 'Rol no encontrado',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRolDto: UpdateRolDto,
  ): Promise<BaseResponseDto<Rol>> {
    try {
      const rol = await this.rolService.update(id, updateRolDto);
      return BaseResponseDto.success(
        rol,
        'Rol actualizado exitosamente',
        HttpStatus.OK,
      );
    } catch (error) {
      return BaseResponseDto.error(
        'Error al actualizar el rol',
        error.status || HttpStatus.BAD_REQUEST,
        error.message,
      );
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un rol' })
  @ApiResponse({
    status: 204,
    description: 'Rol eliminado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Rol no encontrado',
  })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<BaseResponseDto<null>> {
    try {
      await this.rolService.remove(id);
      return BaseResponseDto.success(
        null,
        'Rol eliminado exitosamente',
        HttpStatus.NO_CONTENT,
      );
    } catch (error) {
      return BaseResponseDto.error(
        'Error al eliminar el rol',
        error.status || HttpStatus.BAD_REQUEST,
        error.message,
      );
    }
  }

  @Post('seed')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Crear roles por defecto del sistema' })
  @ApiResponse({
    status: 200,
    description: 'Roles por defecto creados exitosamente',
  })
  async createDefaultRoles(): Promise<BaseResponseDto<null>> {
    try {
      await this.rolService.createDefaultRoles();
      return BaseResponseDto.success(
        null,
        'Roles por defecto procesados exitosamente',
        HttpStatus.OK,
      );
    } catch (error) {
      return BaseResponseDto.error(
        'Error al crear roles por defecto',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message,
      );
    }
  }
}

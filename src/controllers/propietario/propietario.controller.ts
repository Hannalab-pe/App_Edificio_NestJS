import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  HttpStatus,
  HttpException,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PropietarioService } from 'src/services/implementations/propietario/propietario.service';
import {
  CreatePropietarioDto,
  UpdatePropietarioDto,
  PropietarioSingleResponseDto,
  PropietarioArrayResponseDto,
} from 'src/dtos';

@ApiTags('Propietario')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('propietario')
export class PropietarioController {
  constructor(private readonly propietarioService: PropietarioService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear nuevo propietario',
    description:
      'Crea un nuevo propietario en el sistema con validación de datos únicos',
  })
  @ApiResponse({
    status: 201,
    description: 'Propietario creado exitosamente',
    type: PropietarioSingleResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token inválido o expirado',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflicto - El correo ya está registrado',
  })
  async create(
    @Body() createDto: CreatePropietarioDto,
  ): Promise<PropietarioSingleResponseDto> {
    const result = await this.propietarioService.create(createDto);

    if (!result.success) {
      const statusCode = result.statusCode || HttpStatus.BAD_REQUEST;
      throw new HttpException(result.message, statusCode);
    }

    return {
      success: result.success,
      message: result.message,
      data: result.data,
      statusCode: HttpStatus.CREATED,
    };
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los propietarios',
    description:
      'Recupera una lista de todos los propietarios registrados en el sistema',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de propietarios recuperada exitosamente',
    type: PropietarioArrayResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token inválido o expirado',
  })
  async findAll(): Promise<PropietarioArrayResponseDto> {
    const result = await this.propietarioService.findAll();

    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return {
      success: result.success,
      message: result.message,
      data: result.data,
      statusCode: HttpStatus.OK,
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener propietario por ID',
    description: 'Recupera un propietario específico por su ID único',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID único del propietario',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Propietario encontrado exitosamente',
    type: PropietarioSingleResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token inválido o expirado',
  })
  @ApiResponse({
    status: 404,
    description: 'Propietario no encontrado',
  })
  async findOne(
    @Param('id') id: string,
  ): Promise<PropietarioSingleResponseDto> {
    const result = await this.propietarioService.findOne(id);

    if (!result.success) {
      const statusCode = result.statusCode || HttpStatus.NOT_FOUND;
      throw new HttpException(result.message, statusCode);
    }

    return {
      success: result.success,
      message: result.message,
      data: result.data,
      statusCode: HttpStatus.OK,
    };
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar propietario',
    description: 'Actualiza los datos de un propietario existente',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID único del propietario',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Propietario actualizado exitosamente',
    type: PropietarioSingleResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token inválido o expirado',
  })
  @ApiResponse({
    status: 404,
    description: 'Propietario no encontrado',
  })
  @ApiResponse({
    status: 409,
    description:
      'Conflicto - El correo ya está registrado por otro propietario',
  })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdatePropietarioDto,
  ): Promise<PropietarioSingleResponseDto> {
    const result = await this.propietarioService.update(id, updateDto);

    if (!result.success) {
      const statusCode = result.statusCode || HttpStatus.BAD_REQUEST;
      throw new HttpException(result.message, statusCode);
    }

    return {
      success: result.success,
      message: result.message,
      data: result.data,
      statusCode: HttpStatus.OK,
    };
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar propietario',
    description:
      'Elimina un propietario del sistema (solo si no tiene propiedades asociadas)',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID único del propietario',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Propietario eliminado exitosamente',
    type: PropietarioSingleResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token inválido o expirado',
  })
  @ApiResponse({
    status: 404,
    description: 'Propietario no encontrado',
  })
  @ApiResponse({
    status: 409,
    description:
      'No se puede eliminar - El propietario tiene propiedades asociadas',
  })
  async remove(@Param('id') id: string): Promise<PropietarioSingleResponseDto> {
    const result = await this.propietarioService.remove(id);

    if (!result.success) {
      const statusCode = result.statusCode || HttpStatus.BAD_REQUEST;
      throw new HttpException(result.message, statusCode);
    }

    return {
      success: result.success,
      message: result.message,
      data: result.data,
      statusCode: HttpStatus.OK,
    };
  }

  @Get('documento/:numeroDocumento')
  @ApiOperation({
    summary: 'Buscar propietario por número de documento',
    description:
      'Busca un propietario utilizando su número de documento de identidad',
  })
  @ApiParam({
    name: 'numeroDocumento',
    type: 'string',
    description: 'Número de documento de identidad',
    example: '12345678',
  })
  @ApiResponse({
    status: 200,
    description: 'Propietario encontrado por documento',
    type: PropietarioSingleResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token inválido o expirado',
  })
  @ApiResponse({
    status: 404,
    description: 'Propietario no encontrado con ese documento',
  })
  async findByNumeroDocumento(
    @Param('numeroDocumento') numeroDocumento: string,
  ): Promise<PropietarioSingleResponseDto> {
    const result =
      await this.propietarioService.findByNumeroDocumento(numeroDocumento);

    if (!result.success) {
      const statusCode = result.statusCode || HttpStatus.NOT_FOUND;
      throw new HttpException(result.message, statusCode);
    }

    return {
      success: result.success,
      message: result.message,
      data: result.data,
      statusCode: HttpStatus.OK,
    };
  }

  @Get(':id/propiedades')
  @ApiOperation({
    summary: 'Obtener propietario con sus propiedades',
    description:
      'Recupera un propietario incluyendo todas sus propiedades asociadas',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID único del propietario',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Propietario con propiedades recuperado exitosamente',
    type: PropietarioSingleResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token inválido o expirado',
  })
  @ApiResponse({
    status: 404,
    description: 'Propietario no encontrado',
  })
  async findWithPropiedades(
    @Param('id') id: string,
  ): Promise<PropietarioSingleResponseDto> {
    const result = await this.propietarioService.findWithPropiedades(id);

    if (!result.success) {
      const statusCode = result.statusCode || HttpStatus.NOT_FOUND;
      throw new HttpException(result.message, statusCode);
    }

    return {
      success: result.success,
      message: result.message,
      data: result.data,
      statusCode: HttpStatus.OK,
    };
  }
}

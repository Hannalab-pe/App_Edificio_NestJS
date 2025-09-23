import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from '../services/implementations/auth/auth.service';
import { LoginDto, LoginResponseDto, RegisterDto, RegisterResponseDto, ProfileResponseDto, ErrorResponseDto } from '../dtos/auth';
import { Public } from './decorators/public.decorator';
import { GetUser } from './decorators/get-user.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Usuario } from '../entities/Usuario';

@ApiTags('Autenticación') // Agrupa endpoints en Swagger
@Controller('auth') // Ruta base: /api/v1/auth
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Endpoint de inicio de sesión
   * POST /api/v1/auth/login
   */
  @Public() // Marca como público - no requiere autenticación
  @Post('login')
  @HttpCode(HttpStatus.OK) // Retorna 200 en lugar de 201 por defecto
  @ApiOperation({
    summary: 'Iniciar sesión',
    description: 'Autentica un usuario con correo y contraseña, retorna JWT token'
  })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciales inválidas',
    type: ErrorResponseDto,
  })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    // Validar las credenciales del usuario
    const usuario = await this.authService.validateUser(
      loginDto.correo,
      loginDto.contrasena,
    );

    // Si las credenciales son incorrectas, lanzar excepción
    if (!usuario) {
      throw new UnauthorizedException({
        success: false,
        message: 'Credenciales inválidas',
        data: null,
        error: {
          code: 'INVALID_CREDENTIALS',
          timestamp: new Date().toISOString(),
          path: '/api/v1/auth/login'
        }
      });
    }

    // Generar JWT token y respuesta
    const result = await this.authService.login(usuario);

    // Formatear respuesta para el cliente
    return {
      success: true,
      data: result,
      message: 'Login exitoso',
    };
  }

  /**
   * Endpoint de registro de usuario
   * POST /api/v1/auth/register
   */
  @Public() // Marca como público - no requiere autenticación
  @Post('register')
  @HttpCode(HttpStatus.CREATED) // Retorna 201 para creación exitosa
  @ApiOperation({
    summary: 'Registrar nuevo usuario',
    description: 'Crea un nuevo usuario en el sistema y retorna JWT token para login automático'
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario registrado exitosamente',
    type: RegisterResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o contraseñas no coinciden',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'El correo ya está registrado',
    type: ErrorResponseDto,
  })
  async register(@Body() registerDto: RegisterDto): Promise<RegisterResponseDto> {
    try {
      // Llamar al servicio de registro
      const result = await this.authService.register(registerDto);

      // Formatear respuesta para el cliente
      return {
        success: true,
        data: result,
        message: 'Usuario registrado exitosamente',
      };
    } catch (error) {
      // Re-lanzar el error para que NestJS lo maneje apropiadamente
      throw error;
    }
  }

  /**
   * Endpoint para obtener perfil del usuario autenticado
   * GET /api/v1/auth/profile
   */
  @Get('profile')
  @UseGuards(JwtAuthGuard) // Requiere autenticación JWT
  @ApiBearerAuth() // Indica en Swagger que requiere Bearer token
  @ApiOperation({
    summary: 'Obtener perfil del usuario',
    description: 'Retorna la información del usuario autenticado'
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil obtenido exitosamente',
    type: ProfileResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido o expirado',
    type: ErrorResponseDto,
  })
  async getProfile(@GetUser() user: Usuario): Promise<ProfileResponseDto> {
    // El usuario viene automáticamente del JWT gracias al decorator @GetUser()
    return {
      success: true,
      data: {
        idUsuario: user.idUsuario,
        correo: user.correo,
        estaActivo: user.estaActivo,
        idRol: user.idRol, // Incluye información del rol
      },
      message: 'Perfil obtenido exitosamente',
    };
  }

  /**
   * Endpoint de prueba para verificar autenticación
   * GET /api/v1/auth/test-protected
   */
  @Get('test-protected')
  @UseGuards(JwtAuthGuard) // Requiere autenticación JWT
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Endpoint de prueba protegido',
    description: 'Endpoint para probar que la autenticación funciona correctamente'
  })
  @ApiResponse({
    status: 200,
    description: 'Acceso autorizado',
    schema: {
      example: {
        success: true,
        message: 'Acceso autorizado a ruta protegida',
        user: 'admin@viveconecta.com',
        timestamp: '2024-01-01T12:00:00.000Z'
      }
    }
  })
  async testProtected(@GetUser() user: Usuario) {
    return {
      success: true,
      message: 'Acceso autorizado a ruta protegida',
      user: user.correo,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Endpoint público de prueba
   * GET /api/v1/auth/test-public
   */
  @Public() // No requiere autenticación
  @Get('test-public')
  @ApiOperation({
    summary: 'Endpoint público de prueba',
    description: 'Endpoint para verificar que las rutas públicas funcionan'
  })
  @ApiResponse({
    status: 200,
    description: 'Acceso público exitoso',
    schema: {
      example: {
        success: true,
        message: 'Endpoint público funcionando correctamente',
        timestamp: '2024-01-01T12:00:00.000Z'
      }
    }
  })
  async testPublic() {
    return {
      success: true,
      message: 'Endpoint público funcionando correctamente',
      timestamp: new Date().toISOString(),
    };
  }
}
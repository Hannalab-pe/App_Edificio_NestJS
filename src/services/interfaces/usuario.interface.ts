import { 
  CreateUsuarioDto, 
  UpdateUsuarioDto,
  UsuarioSingleResponseDto,
  UsuarioArrayResponseDto 
} from '../../dtos';
import { Usuario } from '../../entities/Usuario';

export interface IUsuarioService {
  // Métodos existentes (mantener compatibilidad)
  create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario>;
  findAll(): Promise<Usuario[]>;
  findOne(id: string): Promise<Usuario>;
  update(id: string, updateUsuarioDto: UpdateUsuarioDto): Promise<Usuario>;
  remove(id: string): Promise<void>;
  findByEmail(email: string): Promise<Usuario>;
  findActiveUsers(): Promise<Usuario[]>;
  emailExists(email: string): Promise<boolean>;

  // Nuevos métodos con BaseResponseDto
  createWithBaseResponse(createUsuarioDto: CreateUsuarioDto): Promise<UsuarioSingleResponseDto>;
  findAllWithBaseResponse(): Promise<UsuarioArrayResponseDto>;
  findOneWithBaseResponse(id: string): Promise<UsuarioSingleResponseDto>;
  updateWithBaseResponse(id: string, updateUsuarioDto: UpdateUsuarioDto): Promise<UsuarioSingleResponseDto>;
  removeWithBaseResponse(id: string): Promise<UsuarioSingleResponseDto>;
  findByEmailWithBaseResponse(email: string): Promise<UsuarioSingleResponseDto>;
  findActiveUsersWithBaseResponse(): Promise<UsuarioArrayResponseDto>;
  findByRoleWithBaseResponse(roleId: string): Promise<UsuarioArrayResponseDto>;
  getUserProfileWithBaseResponse(id: string): Promise<UsuarioSingleResponseDto>;
  getUserStatisticsWithBaseResponse(id: string): Promise<UsuarioSingleResponseDto>;
}

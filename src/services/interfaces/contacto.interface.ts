import { BaseResponseDto } from 'src/dtos/baseResponse/baseResponse.dto';
import { CreateContactoDto, UpdateContactoDto, ContactoResponseDto } from 'src/dtos/contacto';

export interface IContactoService {
  // Operaciones básicas CRUD
  create(createContactoDto: CreateContactoDto): Promise<BaseResponseDto<ContactoResponseDto>>;
  findAll(): Promise<BaseResponseDto<ContactoResponseDto[]>>;
  findOne(id: string): Promise<BaseResponseDto<ContactoResponseDto>>;
  update(id: string, updateContactoDto: UpdateContactoDto): Promise<BaseResponseDto<ContactoResponseDto>>;
  remove(id: string): Promise<BaseResponseDto<void>>;

  // Operaciones específicas por tipo
  findByTipoContacto(idTipoContacto: string): Promise<BaseResponseDto<ContactoResponseDto[]>>;
  findByTipoContrato(idTipoContrato: string): Promise<BaseResponseDto<ContactoResponseDto[]>>;
  findByTipos(idTipoContacto: string, idTipoContrato: string): Promise<BaseResponseDto<ContactoResponseDto[]>>;

  // Gestión de disponibilidad
  findActivos(): Promise<BaseResponseDto<ContactoResponseDto[]>>;
  findInactivos(): Promise<BaseResponseDto<ContactoResponseDto[]>>;
  activarContacto(id: string): Promise<BaseResponseDto<ContactoResponseDto>>;
  desactivarContacto(id: string): Promise<BaseResponseDto<ContactoResponseDto>>;

  // Búsquedas específicas para mantenimiento
  findContactosParaMantenimiento(tipoTrabajo: string): Promise<BaseResponseDto<ContactoResponseDto[]>>;
  findContactosEmergencia(): Promise<BaseResponseDto<ContactoResponseDto[]>>;
  findContactosDisponibles(urgente?: boolean): Promise<BaseResponseDto<ContactoResponseDto[]>>;

  // Búsquedas por información de contacto
  findByEmail(email: string): Promise<BaseResponseDto<ContactoResponseDto>>;
  findByTelefono(telefono: string): Promise<BaseResponseDto<ContactoResponseDto[]>>;
  buscarPorNombre(nombre: string): Promise<BaseResponseDto<ContactoResponseDto[]>>;

  // Validaciones de negocio
  validarCompatibilidadTipos(idTipoContacto: string, idTipoContrato: string): Promise<BaseResponseDto<boolean>>;
  verificarDisponibilidad(id: string): Promise<BaseResponseDto<boolean>>;

  // Estadísticas y reportes
  obtenerEstadisticasContacto(id: string): Promise<BaseResponseDto<any>>;
  obtenerResumenPorTipo(): Promise<BaseResponseDto<any>>;
}

import { Visita } from '../../entities/Visita';
import { CreateVisitaDto, UpdateVisitaDto } from '../../dtos/visita';

/**
 * Interfaz que define los métodos del servicio de visitas
 * Proporciona operaciones CRUD y funcionalidades específicas para gestión de visitas
 */
export interface IVisitaService {
  /**
   * Crea una nueva visita con validaciones de usuario y propiedad
   * @param createVisitaDto - Datos para crear la visita
   * @returns Promise<Visita> - La visita creada con sus relaciones
   */
  create(createVisitaDto: CreateVisitaDto): Promise<Visita>;

  /**
   * Obtiene todas las visitas con sus relaciones (usuario autorizador y propiedad)
   * @returns Promise<Visita[]> - Lista de todas las visitas
   */
  findAll(): Promise<Visita[]>;

  /**
   * Busca una visita específica por su ID
   * @param id - ID UUID de la visita
   * @returns Promise<Visita> - La visita encontrada con sus relaciones
   * @throws NotFoundException si la visita no existe
   */
  findOne(id: string): Promise<Visita>;

  /**
   * Actualiza una visita existente con validaciones
   * @param id - ID UUID de la visita a actualizar
   * @param updateVisitaDto - Datos parciales para actualizar
   * @returns Promise<Visita> - La visita actualizada
   * @throws NotFoundException si la visita no existe
   */
  update(id: string, updateVisitaDto: UpdateVisitaDto): Promise<Visita>;

  /**
   * Elimina una visita (soft delete recomendado para auditoría)
   * @param id - ID UUID de la visita a eliminar
   * @returns Promise<void>
   * @throws NotFoundException si la visita no existe
   */
  remove(id: string): Promise<void>;

  /**
   * Busca visitas por estado específico
   * @param estado - Estado de la visita (PROGRAMADA, EN_CURSO, FINALIZADA, CANCELADA)
   * @returns Promise<Visita[]> - Lista de visitas con el estado especificado
   */
  findByEstado(estado: string): Promise<Visita[]>;

  /**
   * Busca todas las visitas programadas para una propiedad específica
   * @param propiedadId - ID UUID de la propiedad
   * @returns Promise<Visita[]> - Lista de visitas para la propiedad
   */
  findByPropiedad(propiedadId: string): Promise<Visita[]>;

  /**
   * Busca visitas en un rango de fechas específico
   * @param fechaInicio - Fecha de inicio del rango
   * @param fechaFin - Fecha de fin del rango
   * @returns Promise<Visita[]> - Lista de visitas en el rango de fechas
   */
  findByFechaRange(fechaInicio: Date, fechaFin: Date): Promise<Visita[]>;

  /**
   * Busca visitas por usuario autorizador
   * @param usuarioId - ID UUID del usuario que autorizó las visitas
   * @returns Promise<Visita[]> - Lista de visitas autorizadas por el usuario
   */
  findByUsuarioAutorizador(usuarioId: string): Promise<Visita[]>;

  /**
   * Marca el ingreso de una visita (actualiza fechaIngreso y estado)
   * @param codigoQr - Código QR único de la visita
   * @returns Promise<Visita> - La visita actualizada con el ingreso registrado
   * @throws NotFoundException si no se encuentra la visita con el código QR
   */
  registrarIngreso(codigoQr: string): Promise<Visita>;

  /**
   * Marca la salida de una visita (actualiza fechaSalida y estado)
   * @param codigoQr - Código QR único de la visita
   * @returns Promise<Visita> - La visita actualizada con la salida registrada
   * @throws NotFoundException si no se encuentra la visita con el código QR
   */
  registrarSalida(codigoQr: string): Promise<Visita>;
}

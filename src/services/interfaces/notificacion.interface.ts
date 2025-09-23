import { CreateNotificacionDto, UpdateNotificacionDto } from '../../dtos';
import { Notificacion } from '../../entities/Notificacion';

export interface INotificacionService {
    create(createNotificacionDto: CreateNotificacionDto): Promise<Notificacion>;
    findAll(): Promise<Notificacion[]>;
    findOne(id: string): Promise<Notificacion>;
    update(id: string, updateNotificacionDto: UpdateNotificacionDto): Promise<Notificacion>;
    remove(id: string): Promise<void>;
    findByUsuario(usuarioId: string): Promise<Notificacion[]>;
    findUnreadByUsuario(usuarioId: string): Promise<Notificacion[]>;
    markAsRead(id: string): Promise<Notificacion>;
    markAllAsReadByUsuario(usuarioId: string): Promise<void>;
}
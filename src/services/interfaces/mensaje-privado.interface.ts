import { MensajePrivado } from '../../entities/MensajePrivado';

export interface IMensajePrivadoService {
  create(createMensajePrivadoDto: any): Promise<MensajePrivado>;
  findAll(): Promise<MensajePrivado[]>;
  findOne(id: string): Promise<MensajePrivado>;
  update(id: string, updateMensajePrivadoDto: any): Promise<MensajePrivado>;
  remove(id: string): Promise<void>;
  findByUsuario(usuarioId: string): Promise<MensajePrivado[]>;
  findConversation(
    emisorId: string,
    receptorId: string,
  ): Promise<MensajePrivado[]>;
  markAsRead(id: string): Promise<MensajePrivado>;
}

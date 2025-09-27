import { MensajePrivado } from '../../entities/MensajePrivado';
import { CreateMensajePrivadoDto } from '../../dtos/mensaje-privado/create-mensaje-privado.dto';
import { UpdateMensajePrivadoDto } from '../../dtos/mensaje-privado/update-mensaje-privado.dto';
import { MensajePrivadoResponseDto } from '../../dtos/mensaje-privado/mensaje-privado-response.dto';

export interface IMensajePrivadoService {
  create(createMensajePrivadoDto: CreateMensajePrivadoDto): Promise<MensajePrivado>;
  findAll(): Promise<MensajePrivado[]>;
  findOne(id: string): Promise<MensajePrivado>;
  update(id: string, updateMensajePrivadoDto: UpdateMensajePrivadoDto): Promise<MensajePrivado>;
  remove(id: string): Promise<void>;
  findByUsuario(usuarioId: string): Promise<MensajePrivado[]>;
  findConversation(
    emisorId: string,
    receptorId: string,
  ): Promise<MensajePrivado[]>;
  markAsRead(id: string): Promise<MensajePrivado>;
  findUnreadByUsuario(usuarioId: string): Promise<MensajePrivado[]>;
  countUnreadByUsuario(usuarioId: string): Promise<number>;
  formatMensajeForResponse(mensaje: MensajePrivado): MensajePrivadoResponseDto;
}

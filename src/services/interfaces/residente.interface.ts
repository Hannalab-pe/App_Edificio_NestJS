import {
  CreateResidenteDto,
  UpdateResidenteDto,
  ResidenteRegisterResponseDto,
} from '../../dtos';
import { Residente } from '../../entities/Residente';

export interface IResidenteService {
  create(createResidenteDto: CreateResidenteDto): Promise<Residente>;
  register(
    createResidenteDto: CreateResidenteDto,
  ): Promise<ResidenteRegisterResponseDto>;
  findAll(): Promise<Residente[]>;
  findOne(id: string): Promise<Residente>;
  update(
    id: string,
    updateResidenteDto: UpdateResidenteDto,
  ): Promise<Residente>;
  remove(id: string): Promise<void>;
  findByPropiedad(propiedadId: string): Promise<Residente[]>;
  findByNumeroDocumento(numeroDocumento: string): Promise<Residente>;
  findByCorreo(correo: string): Promise<Residente>;
}

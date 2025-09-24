import { CreateDocumentoIdentidadDto } from '../../dtos';
import { DocumentoIdentidad } from '../../entities/DocumentoIdentidad';

export interface IDocumentoIdentidadService {
  create(
    createDocumentoIdentidadDto: CreateDocumentoIdentidadDto,
  ): Promise<DocumentoIdentidad>;
  findAll(): Promise<DocumentoIdentidad[]>;
  findOne(id: string): Promise<DocumentoIdentidad>;
  update(
    id: string,
    updateDocumentoIdentidadDto: any,
  ): Promise<DocumentoIdentidad>;
  remove(id: string): Promise<void>;
  findByTipo(tipo: string): Promise<DocumentoIdentidad[]>;
  findByNumero(numero: string): Promise<DocumentoIdentidad>;
}

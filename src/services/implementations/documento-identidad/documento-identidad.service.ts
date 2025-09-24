import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IDocumentoIdentidadService } from '../../interfaces/documento-identidad.interface';
import { DocumentoIdentidad } from '../../../entities/DocumentoIdentidad';
import { CreateDocumentoIdentidadDto } from '../../../dtos/documento-identidad/create-documento-identidad.dto';

@Injectable()
export class DocumentoIdentidadService implements IDocumentoIdentidadService {
  constructor(
    @InjectRepository(DocumentoIdentidad)
    private readonly documentoIdentidadRepository: Repository<DocumentoIdentidad>,
  ) {}

  async create(
    createDocumentoIdentidadDto: CreateDocumentoIdentidadDto,
  ): Promise<DocumentoIdentidad> {
    // Verificar si ya existe un documento con el mismo número
    const existingDoc = await this.documentoIdentidadRepository.findOne({
      where: { numero: createDocumentoIdentidadDto.numero },
    });

    if (existingDoc) {
      throw new BadRequestException('Ya existe un documento con este número');
    }

    const documentoIdentidad = this.documentoIdentidadRepository.create({
      tipoDocumento: createDocumentoIdentidadDto.tipoDocumento,
      numero: createDocumentoIdentidadDto.numero,
    });

    return await this.documentoIdentidadRepository.save(documentoIdentidad);
  }

  async findAll(): Promise<DocumentoIdentidad[]> {
    return await this.documentoIdentidadRepository.find();
  }

  async findOne(id: string): Promise<DocumentoIdentidad> {
    const documentoIdentidad = await this.documentoIdentidadRepository.findOne({
      where: { idDocumentoIdentidad: id },
    });

    if (!documentoIdentidad) {
      throw new BadRequestException(
        `Documento de identidad con ID ${id} no encontrado`,
      );
    }

    return documentoIdentidad;
  }

  async update(
    id: string,
    updateDocumentoIdentidadDto: any,
  ): Promise<DocumentoIdentidad> {
    await this.findOne(id);
    await this.documentoIdentidadRepository.update(
      id,
      updateDocumentoIdentidadDto,
    );
    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.documentoIdentidadRepository.delete(id);
  }

  async findByTipo(tipo: string): Promise<DocumentoIdentidad[]> {
    return await this.documentoIdentidadRepository.find({
      where: { tipoDocumento: tipo },
    });
  }

  async findByNumero(numero: string): Promise<DocumentoIdentidad> {
    const documentoIdentidad = await this.documentoIdentidadRepository.findOne({
      where: { numero: parseInt(numero) },
    });

    if (!documentoIdentidad) {
      throw new BadRequestException(
        `Documento de identidad con número ${numero} no encontrado`,
      );
    }

    return documentoIdentidad;
  }
}

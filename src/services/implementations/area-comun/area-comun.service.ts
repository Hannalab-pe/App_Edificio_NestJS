import { Injectable } from '@nestjs/common';
import { CreateAreaComunDto, UpdateAreaComunDto } from 'src/dtos';
import { AreaComun } from 'src/entities/AreaComun';
import { IAreaComunService } from 'src/services/interfaces';

@Injectable()
export class AreaComunService implements IAreaComunService {
    create(createAreaComunDto: CreateAreaComunDto): Promise<AreaComun> {
        throw new Error('Method not implemented.');
    }
    findAll(): Promise<AreaComun[]> {
        throw new Error('Method not implemented.');
    }
    findOne(id: string): Promise<AreaComun> {
        throw new Error('Method not implemented.');
    }
    update(id: string, updateAreaComunDto: UpdateAreaComunDto): Promise<AreaComun> {
        throw new Error('Method not implemented.');
    }
    remove(id: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
    findByEstado(estado: string): Promise<AreaComun[]> {
        throw new Error('Method not implemented.');
    }
    findAvailable(): Promise<AreaComun[]> {
        throw new Error('Method not implemented.');
    }
}

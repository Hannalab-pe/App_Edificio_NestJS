import { Injectable, Inject } from '@nestjs/common';
import { IRolService } from '../../services/interfaces/rol.interface';

@Injectable()
export class RolesSeeder {
  constructor(
    @Inject('IRolService')
    private readonly rolService: IRolService,
  ) {}

  /**
   * Ejecutar el seeder de roles
   * Crea roles por defecto si no existen
   */
  async run(): Promise<void> {
    console.log('🌱 Ejecutando seeder de roles...');

    try {
      await this.rolService.createDefaultRoles();
      console.log('✅ Seeder de roles completado');
    } catch (error) {
      console.error('❌ Error en seeder de roles:', error.message);
      throw error;
    }
  }
}
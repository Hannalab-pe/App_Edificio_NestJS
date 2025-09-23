import { Injectable } from '@nestjs/common';
import { RolesSeeder } from './roles.seeder';

@Injectable()
export class DatabaseSeeder {
  constructor(
    private readonly rolesSeeder: RolesSeeder,
  ) {}

  /**
   * Ejecutar todos los seeders en orden
   */
  async run(): Promise<void> {
    console.log('🚀 Iniciando seeders de la base de datos...');

    try {
      // Ejecutar seeder de roles (debe ir primero)
      await this.rolesSeeder.run();

      // Aquí puedes agregar más seeders en el futuro
      // await this.usuariosSeeder.run();
      // await this.propiedadesSeeder.run();

      console.log('🎉 Todos los seeders completados exitosamente');
    } catch (error) {
      console.error('💥 Error ejecutando seeders:', error.message);
      throw error;
    }
  }
}
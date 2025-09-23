import { Module } from '@nestjs/common';
import { ServicesModule } from '../services/services.module';
import { RolesSeeder } from './seeders/roles.seeder';
import { DatabaseSeeder } from './seeders/database.seeder';

@Module({
  imports: [ServicesModule],
  providers: [RolesSeeder, DatabaseSeeder],
  exports: [DatabaseSeeder],
})
export class DatabaseModule {}
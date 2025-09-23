import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolService } from '../../services/implementations/rol/rol.service';
import { RolController } from '../../controllers/rol/rol.controller';
import { Rol } from '../../entities/Rol';

@Module({
  imports: [TypeOrmModule.forFeature([Rol])],
  providers: [
    {
      provide: 'IRolService',
      useClass: RolService,
    },
    RolService,
  ],
  controllers: [RolController],
  exports: ['IRolService', RolService],
})
export class RolModule {}
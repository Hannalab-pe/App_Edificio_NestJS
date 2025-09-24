import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VotacionService } from '../../services/implementations/votacion/votacion.service';
import { VotacionController } from '../../controllers/votacion/votacion.controller';
import { Votacion } from '../../entities/Votacion';
import { JuntaPropietarios } from '../../entities/JuntaPropietarios';
import { OpcionVoto } from '../../entities/OpcionVoto';
import { Usuario } from '../../entities/Usuario';

@Module({
  imports: [TypeOrmModule.forFeature([Votacion, JuntaPropietarios, OpcionVoto, Usuario])],
  providers: [
    {
      provide: 'IVotacionService',
      useClass: VotacionService,
    },
    VotacionService,
  ],
  controllers: [VotacionController],
  exports: ['IVotacionService', VotacionService],
})
export class VotacionModule {}
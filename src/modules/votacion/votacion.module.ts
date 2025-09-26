import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VotacionService } from '../../services/implementations/votacion/votacion.service';
import { OpcionVotoService } from '../../services/implementations/opcion-voto/opcion-voto.service';
import { VotacionController } from '../../controllers/votacion/votacion.controller';
import { OpcionVotoController } from '../../controllers/opcion-voto/opcion-voto.controller';
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
    {
      provide: 'IOpcionVotoService',
      useClass: OpcionVotoService,
    },
    VotacionService,
    OpcionVotoService,
  ],
  controllers: [VotacionController, OpcionVotoController],
  exports: ['IVotacionService', 'IOpcionVotoService', VotacionService, OpcionVotoService],
})
export class VotacionModule {}
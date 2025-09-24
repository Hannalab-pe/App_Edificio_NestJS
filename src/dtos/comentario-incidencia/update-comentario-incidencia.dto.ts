import { PartialType } from '@nestjs/swagger';
import { CreateComentarioIncidenciaDto } from './create-comentario-incidencia.dto';

export class UpdateComentarioIncidenciaDto extends PartialType(
  CreateComentarioIncidenciaDto,
) {}

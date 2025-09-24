import { PartialType } from '@nestjs/swagger';
import { CreateTipoIncidenciaDto } from './create-tipo-incidencia.dto';

export class UpdateTipoIncidenciaDto extends PartialType(
  CreateTipoIncidenciaDto,
) {}

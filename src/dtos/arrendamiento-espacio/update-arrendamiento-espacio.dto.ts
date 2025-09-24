import { PartialType } from '@nestjs/swagger';
import { CreateArrendamientoEspacioDto } from './create-arrendamiento-espacio.dto';

export class UpdateArrendamientoEspacioDto extends PartialType(
  CreateArrendamientoEspacioDto,
) {}

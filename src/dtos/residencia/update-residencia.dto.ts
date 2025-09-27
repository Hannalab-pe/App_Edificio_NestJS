import { PartialType } from '@nestjs/swagger';
import { CreateResidenciaDto } from './create-residencia.dto';

export class UpdateResidenciaDto extends PartialType(CreateResidenciaDto) {}
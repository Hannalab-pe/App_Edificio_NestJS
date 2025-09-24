import { PartialType } from '@nestjs/swagger';
import { CreateArrendatarioDto } from './create-arrendatario.dto';

export class UpdateArrendatarioDto extends PartialType(CreateArrendatarioDto) {}

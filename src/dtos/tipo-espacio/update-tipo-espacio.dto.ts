import { PartialType } from '@nestjs/swagger';
import { CreateTipoEspacioDto } from './create-tipo-espacio.dto';

export class UpdateTipoEspacioDto extends PartialType(CreateTipoEspacioDto) { }
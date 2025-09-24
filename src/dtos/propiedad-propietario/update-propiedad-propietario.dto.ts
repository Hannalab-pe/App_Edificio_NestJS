import { PartialType } from '@nestjs/swagger';
import { CreatePropiedadPropietarioDto } from './create-propiedad-propietario.dto';

export class UpdatePropiedadPropietarioDto extends PartialType(CreatePropiedadPropietarioDto) {}
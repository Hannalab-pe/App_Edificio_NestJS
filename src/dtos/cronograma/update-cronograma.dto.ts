import { PartialType } from '@nestjs/swagger';
import { CreateCronogramaDto } from './create-cronograma.dto';

export class UpdateCronogramaDto extends PartialType(CreateCronogramaDto) {}
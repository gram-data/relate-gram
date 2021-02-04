import { PartialType } from '@nestjs/mapped-types';
import { CreateGramDto } from './create-gram.dto';

export class UpdateGramDto extends PartialType(CreateGramDto) {}

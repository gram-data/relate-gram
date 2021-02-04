import { Injectable } from '@nestjs/common';
import { CreateGramDto } from './dto/create-gram.dto';
import { UpdateGramDto } from './dto/update-gram.dto';

@Injectable()
export class GramService {
  create(createGramDto: CreateGramDto) {
    return `create ${createGramDto.src}`;
  }

  findAll() {
    return `all grams`;
  }

  findOne(id: number) {
    return `find gram #${id}`;
  }

  update(id: number, updateGramDto: UpdateGramDto) {
    return `update gram #${id}: ${updateGramDto.src}`;
  }

  remove(id: number) {
    return `remove gram #${id}`;
  }
}

import { Module } from '@nestjs/common';
import { GramService } from './gram.service';
import { GramController } from './gram.controller';

@Module({
  controllers: [GramController],
  providers: [GramService],
})
export class GramModule {}

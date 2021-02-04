import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GramModule } from '@relate/gram';

@Module({
  imports: [GramModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Test, TestingModule } from '@nestjs/testing';
import { GramService } from './gram.service';

describe('GramService', () => {
  let service: GramService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GramService],
    }).compile();

    service = module.get<GramService>(GramService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

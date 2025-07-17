import { Test, TestingModule } from '@nestjs/testing';
import { BarionService } from './barion.service';

describe('BarionService', () => {
  let service: BarionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BarionService],
    }).compile();

    service = module.get<BarionService>(BarionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

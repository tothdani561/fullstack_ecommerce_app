import { Test, TestingModule } from '@nestjs/testing';
import { BarionController } from './barion.controller';
import { BarionService } from './barion.service';

describe('BarionController', () => {
  let controller: BarionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BarionController],
      providers: [BarionService],
    }).compile();

    controller = module.get<BarionController>(BarionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

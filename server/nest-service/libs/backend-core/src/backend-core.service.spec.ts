import { Test, TestingModule } from '@nestjs/testing';
import { BackendCoreService } from './momo.service';

describe('BackendCoreService', () => {
  let service: BackendCoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BackendCoreService],
    }).compile();

    service = module.get<BackendCoreService>(BackendCoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseConnectService } from './database-connect.service';

describe('DatabaseConnectService', () => {
  let service: DatabaseConnectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatabaseConnectService],
    }).compile();

    service = module.get<DatabaseConnectService>(DatabaseConnectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

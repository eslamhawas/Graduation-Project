import { Test, TestingModule } from '@nestjs/testing';
import { OrdersModuleService } from './orders-module.service';

describe('OrdersModuleService', () => {
  let service: OrdersModuleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdersModuleService],
    }).compile();

    service = module.get<OrdersModuleService>(OrdersModuleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

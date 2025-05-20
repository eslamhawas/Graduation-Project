import { Test, TestingModule } from '@nestjs/testing';
import { OrdersModuleController } from './orders-module.controller';
import { OrdersModuleService } from './orders-module.service';

describe('OrdersModuleController', () => {
  let controller: OrdersModuleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersModuleController],
      providers: [OrdersModuleService],
    }).compile();

    controller = module.get<OrdersModuleController>(OrdersModuleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

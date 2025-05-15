import { Body, Controller, Param, Patch } from '@nestjs/common';
import { OrderItemsEntity } from './entities/order-item.entity';
import { MomoController } from '@app/backend-core/momo.controller';
import { OrderItemsService } from './order-items.service';

@Controller('order-items')
export class OrderItemsController extends MomoController<OrderItemsEntity> {
  constructor(private readonly orderItemsService: OrderItemsService) {
    super(orderItemsService);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: OrderItemsEntity,
  ) {
    if (updateOrderDto?.status) {
      return await super.updateOneBase(id, updateOrderDto);
    }
  }
}

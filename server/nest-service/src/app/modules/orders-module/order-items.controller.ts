import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Request,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { OrderItemsEntity } from './entities/order-item.entity';
import { MomoController } from '@app/backend-core/momo.controller';
import { OrderItemsService } from './order-items.service';
import { DeepPartial } from 'typeorm';
import { AuthGuard } from '@nestjs/passport';

@Controller('order-items')
export class OrderItemsController extends MomoController<OrderItemsEntity> {
  constructor(private readonly orderItemsService: OrderItemsService) {
    super(orderItemsService);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: DeepPartial<OrderItemsEntity>,
  ) {
    if (updateOrderDto?.status) {
      return await super.updateOneBase(id, updateOrderDto);
    }
  }

  @Get('/for-provider')
  @UseGuards(AuthGuard('jwt'))
  async getProviderOrderItemsBase(@Request() req) {
    if (!req?.user) {
      throw new UnauthorizedException(`USER OBJECT WAS NOT FOUND!`);
    }

    // GET ALL ORDER-ITEMS FOR PROVIDER BY ITS TOKEN
    return await this.orderItemsService.getMany({
      where: {
        provider: { id: req?.user?.userId },
      },
    });
  }
}

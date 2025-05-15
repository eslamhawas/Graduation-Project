import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { OrdersModuleService } from './orders-module.service';
import { CreateOrdersModuleDto } from './dto/create-orders-module.dto';
import { UpdateOrdersModuleDto } from './dto/update-orders-module.dto';
import { MomoController } from '@app/backend-core/momo.controller';
import { OrdersEntity } from './entities/orders-module.entity';
import { GetManyOptions } from '@app/interfaces/get-many-options.interface';
import { CartService } from '@modules/cart-module/cart.service';

@Controller('orders')
export class OrdersModuleController extends MomoController<OrdersEntity> {
  constructor(
    public readonly service: OrdersModuleService,
    public readonly cartService: CartService,
  ) {
    super(service);
  }

  @Post()
  create(@Body() createOrdersModuleDto: CreateOrdersModuleDto) {
    return super.createOneBase(createOrdersModuleDto);
  }

  @Get()
  findAll(@Query() params: GetManyOptions) {
    return super.getManyBase(params);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return super.getOneBase(id);
  }

  @Get('carts/:id')
  findOneCart(@Param('id') id: string) {
    return this.cartService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrdersModuleDto: UpdateOrdersModuleDto,
  ) {
    return super.updateOneBase(id, updateOrdersModuleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return super.deleteOneBase(id);
  }
}

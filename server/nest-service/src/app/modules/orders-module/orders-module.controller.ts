import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { OrdersModuleService } from './orders-module.service';
import { CreateOrdersModuleDto } from './dto/create-orders-module.dto';
import { UpdateOrdersModuleDto } from './dto/update-orders-module.dto';
import { MomoController } from '@app/backend-core/momo.controller';
import { OrdersEntity } from './entities/orders-module.entity';
import { GetManyOptions } from '@app/interfaces/get-many-options.interface';
import { AuthGuard } from '@nestjs/passport';

@Controller('orders')
export class OrdersModuleController extends MomoController<OrdersEntity> {
  constructor(public readonly service: OrdersModuleService) {
    super(service);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(
    @Body() createOrdersModuleDto: CreateOrdersModuleDto,
    @Request() req,
  ) {
    if (!req?.user) {
      throw new UnauthorizedException(`USER OBJECT WAS NOT FOUND!`);
    }
    return await this.service.createOne({
      ...createOrdersModuleDto,
      user: { id: req?.user?.id } as any,
    });
  }

  @Get()
  findAll(@Query() params: GetManyOptions) {
    return super.getManyBase(params);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return super.getOneBase(id);
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

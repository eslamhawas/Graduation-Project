import { PartialType } from '@nestjs/swagger';
import { CreateOrdersModuleDto } from './create-orders-module.dto';

export class UpdateOrdersModuleDto extends PartialType(CreateOrdersModuleDto) {}

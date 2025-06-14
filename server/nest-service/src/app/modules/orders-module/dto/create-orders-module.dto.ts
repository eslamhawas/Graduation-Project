import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,

  IsObject,
  IsOptional,

} from 'class-validator';
import { OrderStatus } from '../enums/order-status.enum';
import { UserEntity } from '@app/backend-core/entities/user.entity';
import { OrderItemsEntity } from '@modules/orders-module/entities/order-item.entity';

export class CreateOrdersModuleDto {

  @IsBoolean()
  @IsOptional()
  isFulfilled: boolean;

  @IsOptional()
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsNotEmpty()
  @IsArray()
  orderItems: OrderItemsEntity[];

  @IsNotEmpty()
  @IsObject()
  user: UserEntity;


  /**
 * OLD FLOW WITH
 * 1 ) ORDER PROMOTION
 * 2 ) TAKE subAmount key from frontend
 */

  // @IsOptional()
  // @IsNumber()
  // @ApiProperty({ type: Number, required: false })
  // subAmount: number;

  // @IsOptional()
  // @IsNumber()
  // @ApiProperty({ type: Number, required: false })
  // totalAmount: number;

  // @IsOptional()
  // @IsBoolean()
  // isPromoted: boolean;

  // @IsOptional()
  // @IsNumber()
  // promoPercentage: number;

  // @IsNumber()
  // @IsOptional()
  // oldPrice?: number;
}

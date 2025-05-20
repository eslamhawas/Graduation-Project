import { CartEntity } from '@modules/cart-module/entities/cart.entity';
import { ProductEntity } from '@modules/products-module/entities/product.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { OrderStatus } from '../enums/order-status.enum';
import { UserEntity } from '@app/backend-core/entities/user.entity';
import { OrderItemsEntity } from '@modules/orders-module/entities/order-item.entity';

export class CreateOrdersModuleDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty({ type: Number, required: false })
  subAmount: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ type: Number, required: false })
  totalAmount: number;

  // @IsArray()
  // @IsOptional()
  // products: ProductEntity[];

  @IsBoolean()
  @IsOptional()
  isFulfilled: boolean;

  // // @IsArray()
  // @IsOptional()
  // cart: CartEntity;

  @IsOptional()
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsNotEmpty()
  @IsArray()
  orderItems: OrderItemsEntity[];

  @IsNotEmpty()
  @IsObject()
  user: UserEntity;

  @IsOptional()
  @IsBoolean()
  isPromoted: boolean;

  @IsOptional()
  @IsNumber()
  promoPercentage: number;

  @IsNumber()
  @IsOptional()
  oldPrice?: number;
}

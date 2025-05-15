import { CoreEntity } from '@app/backend-core/entities/core.entity';
import { CartEntity } from '@modules/cart-module/entities/cart.entity';
import { ProductEntity } from '@modules/products-module/entities/product.entity';
import { IsNumber, IsOptional } from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { OrderStatus } from '../enums/order-status.enum';
import { UserEntity } from '@app/backend-core/entities/user.entity';
import { OrderItemsEntity } from '@modules/orders-module/entities/order-item.entity';
import { TransactionEntity } from '@modules/transaction-module/entities/transaction.entity';

@Entity('orders')
export class OrdersEntity extends CoreEntity {
  @Column('int', { nullable: true })
  @IsNumber()
  @IsOptional()
  subAmount: number;

  @Column('int', { nullable: true })
  @IsNumber()
  @IsOptional()
  totalAmount: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.WAITING,
  })
  status: OrderStatus;

  @OneToMany(() => OrderItemsEntity, (oi) => oi.order)
  orderItems: OrderItemsEntity[];

  @ManyToOne(() => UserEntity, (u) => u.orders)
  user: UserEntity;

  @OneToMany(() => TransactionEntity, (t) => t.provider, { cascade: true })
  transactions: TransactionEntity[];

  @Column('boolean', { nullable: true })
  isPromoted: boolean;

  @Column('float', { nullable: true })
  promoPercentage: number;

  @Column('float', { nullable: true })
  @IsNumber()
  @IsOptional()
  oldPrice?: number;
}

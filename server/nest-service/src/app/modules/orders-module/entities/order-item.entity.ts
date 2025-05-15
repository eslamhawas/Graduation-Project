import { CoreEntity } from '@app/backend-core/entities/core.entity';
import { IsOptional } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { UserEntity } from '@app/backend-core/entities/user.entity';
import { ProductEntity } from '@modules/products-module/entities/product.entity';
import { OrdersEntity } from '@modules/orders-module/entities/orders-module.entity';
import { TransactionEntity } from '@modules/transaction-module/entities/transaction.entity';
import { STATUS } from '@app/backend-core/enums/status.enum';

@Entity('order-items')
export class OrderItemsEntity extends CoreEntity {
  @IsOptional()
  @Column({
    type: 'enum',
    enum: STATUS,
    default: STATUS.PENDING,
  })
  status: STATUS;

  @ManyToOne(() => OrdersEntity, (o) => o.orderItems)
  order: OrdersEntity;

  @IsOptional()
  @Column('int')
  quantity: number;

  @ManyToOne(() => UserEntity, (u) => u.provideCarts)
  provider: UserEntity;

  @ManyToOne(() => ProductEntity, (p) => p.orderItems)
  product: ProductEntity;

  @IsOptional()
  @Column('float')
  itemPrice: number;

  // @OneToOne(() => TransactionEntity, (t) => t.orderItem)
  // @JoinColumn()
  // transaction: TransactionEntity;
}

import { CoreEntity } from '@app/backend-core/entities/core.entity';
import { UserEntity } from '@app/backend-core/entities/user.entity';
import { STATUS } from '@app/backend-core/enums/status.enum';
import { OrderItemsEntity } from '@modules/orders-module/entities/order-item.entity';
import { OrdersEntity } from '@modules/orders-module/entities/orders-module.entity';
import { ProductEntity } from '@modules/products-module/entities/product.entity';
import { IsOptional } from 'class-validator';
import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';

@Entity('transactions')
export class TransactionEntity extends CoreEntity {
  @IsOptional()
  @Column('int')
  quantity: number;

  @IsOptional()
  @Column('float')
  itemPrice: number;

  @ManyToOne(() => UserEntity, (p) => p.transactions)
  provider: UserEntity;

  @ManyToOne(() => ProductEntity, (p) => p.transactions)
  product: ProductEntity;

  @ManyToOne(() => OrdersEntity, (o) => o.transactions)
  order: OrdersEntity;

  @Column({
    type: 'enum',
    enum: STATUS,
    default: STATUS.PENDING,
  })
  status: STATUS;

  // @OneToOne(()=> OrderItemsEntity , (oi) => oi.transaction)
  // orderItem : OrderItemsEntity
}

import { CartItemEntity } from '@app/backend-core/entities/cart-item.entity';
import { CoreEntity } from '@app/backend-core/entities/core.entity';
import { ProductsProvidersEntity } from '@app/backend-core/entities/products-providers.entity';
import { STATUS } from '@app/backend-core/enums/status.enum';
import { CategoryEntity } from '@modules/category-module/entities/category.entity';
import { OrderItemsEntity } from '@modules/orders-module/entities/order-item.entity';
import { TransactionEntity } from '@modules/transaction-module/entities/transaction.entity';
import {
  Entity,
  Column,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinTable,
  BeforeInsert,
} from 'typeorm';

@Entity('products')
export class ProductEntity extends CoreEntity {
  @Column('varchar')
  name: string;

  @Column('float')
  price: number;

  @OneToMany(() => CartItemEntity, (cp) => cp.product)
  cartItems: CartItemEntity[];

  @OneToMany(() => ProductsProvidersEntity, (pp) => pp.product, {
    cascade: true,
  })
  productProviders: ProductsProvidersEntity[];

  @ManyToMany(() => CategoryEntity, (category) => category.products)
  @JoinTable({
    name: 'products-categories',
  })
  categories: CategoryEntity[];

  @OneToMany(() => OrderItemsEntity, (oi) => oi.product, { cascade: true })
  orderItems: OrderItemsEntity[];

  @Column({
    type: 'enum',
    enum: STATUS,
    default: STATUS.PENDING,
  })
  status: STATUS;

  @OneToMany(() => TransactionEntity, (t) => t.provider, { cascade: true })
  transactions: TransactionEntity[];

  @Column('varchar', { nullable: true })
  imageUrl: string;

  @Column('varchar', { nullable: true })
  brand: string;
}

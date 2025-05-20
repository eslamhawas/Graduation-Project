import { CartItemEntity } from '@app/backend-core/entities/cart-item.entity';
import { CoreEntity } from '@app/backend-core/entities/core.entity';
import { UserEntity } from '@app/backend-core/entities/user.entity';
import { OrdersEntity } from '@modules/orders-module/entities/orders-module.entity';
import { ProductEntity } from '@modules/products-module/entities/product.entity';
// import { UserEntity } from '@modules/user-module/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';

@Entity('carts')
export class CartEntity extends CoreEntity {
  @ManyToOne(() => UserEntity, (user) => user.carts)
  user: UserEntity;

  @OneToMany(() => CartItemEntity, (cp) => cp.cart, { cascade: true })
  cartItems: CartItemEntity[];

  // @OneToOne(() => OrdersEntity, (order) => order.cart)
  // order: OrdersEntity;

  @Column('float')
  amount: number;
}

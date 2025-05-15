import { CartEntity } from '@modules/cart-module/entities/cart.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CoreEntity } from './core.entity';
import { ProductEntity } from '@modules/products-module/entities/product.entity';
import { UserEntity } from './user.entity';

@Entity('carts-products')
export class CartItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => CartEntity, (cart) => cart.cartItems, {
    onDelete: 'CASCADE',
  })
  cart: CartEntity;

  @ManyToOne(() => ProductEntity, (product) => product.cartItems, {
    onDelete: 'CASCADE',
  })
  product: ProductEntity;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @ManyToOne(() => UserEntity, (provider) => provider.provideCarts)
  provider: UserEntity;
}

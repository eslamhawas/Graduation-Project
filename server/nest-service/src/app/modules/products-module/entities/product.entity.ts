import { CoreEntity } from '@app/backend-core/entities/core.entity';
import { ProductsProvidersEntity } from '@app/backend-core/entities/products-providers.entity';
import { STATUS } from '@app/backend-core/enums/status.enum';
import { BrandEntity } from '@modules/brand-module/entities/brand.entity';
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

  // @Column('float')
  // price: number;

  /**
   *  cascade: true => This enables cascading soft delete on the related product-provider
   *  onDelete: 'CASCADE' => This ensures that the deletion propagates if required
   */
  @OneToMany(() => ProductsProvidersEntity, (pp) => pp.product, {
    cascade: true,
    onDelete: 'CASCADE',
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

  /**
   * BRAND WILL BE SAPARATED TABLE
   * WITH ONE-TO-MANY RELATIONSHIP
   */
  @ManyToOne(() => BrandEntity, (b) => b.products)
  brand: BrandEntity;

  /**
   * PRODUCT BIO
   */
  @Column('varchar', { nullable: true })
  bio: string;
}

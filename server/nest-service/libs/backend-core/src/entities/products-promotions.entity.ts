/**
 * OLD ONE
 */

// import { Column, Entity, ManyToOne } from 'typeorm';
// import { CoreEntity } from './core.entity';
// import { ProductEntity } from '@modules/products-module/entities/product.entity';
// import { ProductsProvidersEntity } from './products-providers.entity';
// @Entity('product-promotions')
// export class ProductPromotionsEntity extends CoreEntity {
//   @Column('float', { nullable: true })
//   percentage: Number;

//   @Column('datetime', { nullable: true })
//   expiryDate: Date;

//   /**
//    * PRODUCT-PROVIDER RELATION
//    * PROMOTION BELONGS TO EXACTLY ONE PRODUCT
//    */
//   @ManyToOne(() => ProductsProvidersEntity, (p) => p.promotions)
//   product: ProductsProvidersEntity;
// }

/**
 * NEW ONE
 */

import {
  Column,
  Entity,
  ManyToOne,
  BeforeInsert,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { CoreEntity } from './core.entity'; // Assuming CoreEntity contains common fields like `id`
import { ProductsProvidersEntity } from './products-providers.entity'; // Assuming ProductsProvidersEntity is imported correctly
import { IsNotEmpty, Min, Max } from 'class-validator';

@Entity('product-promotions')
export class ProductPromotionsEntity extends CoreEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ProductsProvidersEntity, (p) => p.promotions)
  productProvider: ProductsProvidersEntity;

  @Column('decimal', { nullable: true, precision: 5, scale: 2 })
  @Min(0)
  @Max(100)
  promotionPercentage: number;

  @CreateDateColumn()
  createdDate: Date;

  @Column('datetime', { nullable: true })
  expiryDate: Date;

  @Column({ type: 'boolean', default: true })
  active: boolean;
}

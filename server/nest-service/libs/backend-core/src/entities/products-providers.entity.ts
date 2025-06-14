import { ProductEntity } from '@modules/products-module/entities/product.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { IsOptional } from 'class-validator';
import { CoreEntity } from './core.entity';
import { ProductPromotionsEntity } from './products-promotions.entity';

@Entity('products-providers')
export class ProductsProvidersEntity extends CoreEntity {
  @ManyToOne(() => ProductEntity, (prod) => prod.productProviders)
  product: ProductEntity;

  @IsOptional()
  @ManyToOne(() => UserEntity, (provider) => provider.userProducts)
  provider: UserEntity;

  @Column({ type: 'int', default: 1 })
  countInStock: number;

  /**
   * ADD SALE PRICE INSTEAD OF PRICE
   */
  @Column({ type: 'int', default: 1 })
  salePrice: Number;

  /**
   * TWO DYNAMIC KEYS ,
   * FIRST 1 ) CALCULATE SALE PRICE AFTER ADD MEGA CURRENT PROFIT - salePriceAfterProfit
   * SECOND 2 ) CALCULATE SALE PRICE AFTER ADD MEGA CURRENT PROFIT + PROMOTION - salePriceAfterProfitAndPromotion
   */

  salePriceAfterProfit: number;

  salePriceAfterProfitAndPromotion: number;

  /**
   * PROMOTIONS RELATION
   * PRODUCT HAVE MANY PROMOTIONS
   */
  @OneToMany(() => ProductPromotionsEntity, (pp) => pp.productProvider)
  promotions: ProductPromotionsEntity[];
}

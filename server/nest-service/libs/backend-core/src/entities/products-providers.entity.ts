import { ProductEntity } from '@modules/products-module/entities/product.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { IsOptional } from 'class-validator';
import { CoreEntity } from './core.entity';

@Entity('products-providers')
export class ProductsProvidersEntity extends CoreEntity {

  @ManyToOne(() => ProductEntity, (prod) => prod.productProviders)
  product: ProductEntity;

  @IsOptional()
  @ManyToOne(() => UserEntity, (provider) => provider.userProducts)
  provider: UserEntity;

  @Column({ type: 'int', default: 1 })
  countInStock: number;

  @Column('boolean', { nullable: true })
  isPromoted: boolean;

  @Column('datetime', { nullable: true })
  promoExpiryDate: Date;

  @Column('float', { nullable: true })
  promoPercentage: number;
}

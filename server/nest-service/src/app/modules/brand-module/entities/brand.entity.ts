import { CoreEntity } from '@app/backend-core/entities/core.entity';
import { ProductEntity } from '@modules/products-module/entities/product.entity';
import { IsNotEmpty, IsString } from 'class-validator';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity('brands')
export class BrandEntity extends CoreEntity {
  @Column('varchar', { nullable: false })
  @IsNotEmpty()
  @IsString()
  name: string;

  @OneToMany(() => ProductEntity, (p) => p.brand)
  products: ProductEntity[];
}

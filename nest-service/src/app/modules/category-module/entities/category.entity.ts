import { CoreEntity } from '@app/backend-core/entities/core.entity';
import { ProductEntity } from '@modules/products-module/entities/product.entity';
import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';

@Entity('categories')
export class CategoryEntity extends CoreEntity {
  @Column('varchar', { nullable: false })
  name: string;

  @ManyToMany(() => ProductEntity, (prod) => prod.categories)
  products: ProductEntity[];
}

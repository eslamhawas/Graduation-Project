import { CoreEntity } from '@app/backend-core/entities/core.entity';
import { Entity, Column } from 'typeorm';

@Entity('products')
export class ProductEntity extends CoreEntity {
  @Column('varchar')
  name: string;
}

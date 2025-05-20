import { Column, Entity } from 'typeorm';
import { CoreEntity } from './core.entity';

@Entity('profit_margin')
export class ProfitMarginEntity extends CoreEntity {
  @Column('datetime', { nullable: true })
  endDate: Date;

  @Column('float', { nullable: true })
  current: Number;
}

import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('profit-margin')
export class ProfitMarginEntity {
  @Column('datetime', { nullable: true })
  endDate: Date;

  @Column('float', { nullable: true })
  current: Number;

  /**
   * Un extend CoreEntity - Just use id , createdDate
   */

  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdDate: Date;
}

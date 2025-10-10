import { CoreEntity } from '@app/backend-core/entities/core.entity';
import { Column, Entity, OneToMany, BeforeInsert, BeforeUpdate } from 'typeorm';
import { UserTypeEnum } from '../enums/user-type.enum';
import { ProductsProvidersEntity } from './products-providers.entity';
import { OrdersEntity } from '@modules/orders-module/entities/orders-module.entity';
import { OrderItemsEntity } from '@modules/orders-module/entities/order-item.entity';
import { TransactionEntity } from '@modules/transaction-module/entities/transaction.entity';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
  IsDate,
  Length,
} from 'class-validator';
import { UserStatus } from '../enums/user-status.enum';

@Entity('users')
export class UserEntity extends CoreEntity {
  @Column('varchar', { length: 50, unique: true })
  @IsNotEmpty()
  username: string;

  @Column('varchar', { nullable: false, length: 100 })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Column('varchar', { nullable: true, length: 255 })
  @IsNotEmpty()
  passwordHash: string;

  @Column('varchar', { nullable: true, length: 255 })
  passwordSalt: string;

  @Column('varchar', { length: 100, nullable: false })
  @IsNotEmpty()
  @Length(2, 100)
  fullName: string;

  @Column('varchar', { nullable: true, length: 20 })
  @IsOptional()
  phoneNumber: string;

  // @Column('json', { nullable: true })
  // roles: string[];

  @Column('varchar', { nullable: true, length: 255 })
  profileImageUrl: string;

  @Column('varchar', { nullable: true, length: 500 })
  bio: string;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserTypeEnum;

  @Column('bit', { default: true })
  isEmailVerified: boolean;

  @Column('bit', { default: true })
  isPhoneVerified: boolean;

  @Column('bit', { default: false })
  twoFactorEnabled: boolean;

  @Column('date', { nullable: false })
  @IsNotEmpty()
  birthday: Date;

  @Column('datetime', { nullable: true })
  lastLogin: Date;

  @Column('datetime', { nullable: true })
  lastPasswordChange: Date;

  @Column('datetime', { nullable: true })
  lastStatusChange: Date;

  @OneToMany(() => ProductsProvidersEntity, (pp) => pp.provider, {
    cascade: true,
  })
  userProducts: ProductsProvidersEntity[];

  @OneToMany(() => OrderItemsEntity, (oi) => oi.provider, { cascade: true })
  order: OrderItemsEntity[];

  @OneToMany(() => OrdersEntity, (o) => o.user, { cascade: true })
  orders: OrdersEntity[];

  @OneToMany(() => TransactionEntity, (t) => t.provider, { cascade: true })
  transactions: TransactionEntity[];
}

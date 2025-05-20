import { AuthModule } from './auth/auth.module';
import { BrandModule } from './brand-module/brand.module';
import { CategoryModule } from './category-module/category.module';
import { OrdersModule } from './orders-module/orders-module.module';
import { ProductsModule } from './products-module/products.module';
import { TransactionModule } from './transaction-module/transaction.module';

export const features = [
  ProductsModule,
  OrdersModule,
  CategoryModule,
  AuthModule,
  TransactionModule,
  BrandModule,
];

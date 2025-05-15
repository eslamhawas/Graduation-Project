import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart-module/cart.module';
import { CategoryModule } from './category-module/category.module';
import { OrdersModule } from './orders-module/orders-module.module';
import { ProductsModule } from './products-module/products.module';
import { TransactionModule } from './transaction-module/transaction.module';

export const features = [
  ProductsModule,
  OrdersModule,
  CartModule,
  CategoryModule,
  AuthModule,
  TransactionModule
];

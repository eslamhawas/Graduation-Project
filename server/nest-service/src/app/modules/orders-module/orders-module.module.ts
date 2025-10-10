import { Module } from '@nestjs/common';
import { OrdersModuleService } from './orders-module.service';
import { OrdersModuleController } from './orders-module.controller';
import { OrdersEntity } from './entities/orders-module.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from '@modules/products-module/entities/product.entity';
import { EmailsModule } from '@app/emails';
import { ProductsModule } from '@modules/products-module/products.module';
import { OrderItemsService } from '@modules/orders-module/order-items.service';
import { OrderItemsEntity } from '@modules/orders-module/entities/order-item.entity';
import { OrderItemsController } from './order-items.controller';
import { TransactionModule } from '@modules/transaction-module/transaction.module';
import { ProfitMarginEntity } from '@app/backend-core/entities/profit-margin.entity';
import { ProductPromotionsEntity } from '@app/backend-core/entities/products-promotions.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrdersEntity,
      OrderItemsEntity,
      ProfitMarginEntity,
      ProductPromotionsEntity,
    ]),
    EmailsModule,
    ProductsModule,
    TransactionModule,
  ],
  controllers: [OrdersModuleController, OrderItemsController],
  providers: [OrdersModuleService, OrderItemsService],
})
export class OrdersModule {}

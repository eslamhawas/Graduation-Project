import { CartItemEntity } from '@app/backend-core/entities/cart-item.entity';
import { ProductsProvidersEntity } from '@app/backend-core/entities/products-providers.entity';
import { UserEntity } from '@app/backend-core/entities/user.entity';
import { CartEntity } from '@modules/cart-module/entities/cart.entity';
import { CategoryEntity } from '@modules/category-module/entities/category.entity';
import { OrderItemsEntity } from '@modules/orders-module/entities/order-item.entity';
import { OrdersEntity } from '@modules/orders-module/entities/orders-module.entity';
import { ProductEntity } from '@modules/products-module/entities/product.entity';
import { TransactionEntity } from '@modules/transaction-module/entities/transaction.entity';
// import { UserEntity } from '@modules/user-module/entities/user.entity';

export const appConfigurations: any = () => ({
  database: {
    type: process.env.DATABASE_TYPE,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME,
    autoLoadEntities: true, // Move to migration
    synchronize: true, // Move to migration
    entities: [
      ProductEntity,
      OrdersEntity,
      OrderItemsEntity,
      CartEntity,
      UserEntity,
      CartItemEntity,
      ProductsProvidersEntity,
      CategoryEntity,
      TransactionEntity,
    ],
  },
  app: {
    port: process.env.PORT,
  },
  email: {
    service: process.env.MAIL_SERVICE,
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  imagesIntegration: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    cloudApiKey: process.env.CLOUDINARY_API_KEY,
    cloudApiSecret: process.env.CLOUDINARY_API_SECRET,
  },
});

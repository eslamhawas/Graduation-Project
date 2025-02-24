import { ProductEntity } from "@modules/products-module/entities/product.entity";

export const appConfigurations: any = () => ({
  database: {
    type: process.env.DATABASE_TYPE,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME,
    autoLoadEntities: true, // Move to migration
    synchronize: true,  // Move to migration
    entities:[
      ProductEntity
    ]
  },
  app: {
    port: process.env.PORT,
  },
});

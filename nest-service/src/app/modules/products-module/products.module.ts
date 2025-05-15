import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductEntity } from './entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsProvidersEntity } from '@app/backend-core/entities/products-providers.entity';
import { ProductsProvidersService } from '@modules/products-module/products-providers.service';
import { CloudinaryService } from '@libs/cloudinary-service/cloudinay.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity, ProductsProvidersEntity]),
    /**
     * MULTER FOR UPLOAD IMAGES
     */
    MulterModule.register({
      dest: '../../../uploads',
    }),
  ],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsProvidersService, CloudinaryService],
  exports: [ProductsService, ProductsProvidersService],
})
export class ProductsModule {}

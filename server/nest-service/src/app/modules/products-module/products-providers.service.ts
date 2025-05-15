import { MomoService } from '@app/backend-core';
import { ProductsProvidersEntity } from '@app/backend-core/entities/products-providers.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from './entities/product.entity';

export class ProductsProvidersService extends MomoService<ProductsProvidersEntity> {
  constructor(
    @InjectRepository(ProductsProvidersEntity)
    repo: Repository<ProductsProvidersEntity>,
  ) {
    super(repo);
  }

  async updateProductProviders(id, dto): Promise<void> {
    const oldProductsProviders = (
      await this.getMany({ where: { product: { id } } })
    ).data;
    for (const opu of oldProductsProviders) {
      await this.deleteOne({ where: { id: opu?.id } });
    }

    // CREATE NEW ONES
    for (const opu of dto.productProviders) {
      await this.createOne(opu);
    }
  }
}

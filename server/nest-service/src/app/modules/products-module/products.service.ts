import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from './entities/product.entity';
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MomoService } from '@app/backend-core';
import { ProductsProvidersService } from './products-providers.service';
import { UserTypeEnum } from '@app/backend-core/enums/user-type.enum';
import { STATUS } from '@app/backend-core/enums/status.enum';
import { PaginationObjectInterface } from '@app/interfaces/pagination-object.interface';
import { UserEntity } from '@app/backend-core/entities/user.entity';

@Injectable()
export class ProductsService extends MomoService<ProductEntity> {
  constructor(
    @InjectRepository(ProductEntity) repo: Repository<ProductEntity>,
    @Inject(forwardRef(() => ProductsProvidersService))
    private productProvidersService: ProductsProvidersService,
  ) {
    super(repo);
    this.relations = [
      'productProviders',
      'productProviders.provider',
      'productProviders.product',
      'categories',
      'brand',
      'productProviders.promotions',
    ];
    /**
     * ENABLE SEARCH
     */
    this.searchableFields = ['name'];
  }

  async afterCreateEvent(product: ProductEntity): Promise<void> {
    /**
     * WILL BE UPDATED AFTER AUTHORIZATION
     * LINE 35 => CONDITION BASED ON req.user.roles.includes(UserTypeEnum.ADMIN)
     */
  }

  async updateOne(id, dto: UpdateProductDto): Promise<ProductEntity> {
    if (dto?.productProviders) {
      await this.productProvidersService.updateProductProviders(id, dto);
      return await this.getOne({ where: { id } });
    }
    return await super.updateOne(id, dto);
  }

  async getMany(
    options?: Record<string, any>,
  ): Promise<PaginationObjectInterface<ProductEntity>> {
    if (options?.status) {
      options.where = { ...options.where, status: options?.status };
    }
    if (options?.categoryId) {
      options.where = {
        ...options.where,
        categories: [{ id: +options?.categoryId }],
      };
    }
    if (options?.brandId) {
      options.where = { ...options.where, brand: { id: options?.brandId } };
    }
    return await super.getMany(options);
  }

  async createOne(dto: DeepPartial<ProductEntity>): Promise<ProductEntity> {
    // if (dto?.brand) {
    //   dto.brand = dto.brand.toLowerCase();
    // }
    return super.createOne(dto);
  }

  /**
   * GET PRODUCTS AFTER PROFIT
   */
  async getProductsAfterProfit(
    products: PaginationObjectInterface<ProductEntity>,
  ) {
    if (!products?.data || products?.data?.length === 0) {
      throw new NotFoundException(`PRODUCTS NOT FOUND!`);
    }

    await Promise.all(
      products.data.map(async (prod) => {
        const { productProviders } = prod;
        if (!productProviders || productProviders?.length === 0) {
          throw new NotFoundException(`PRODUCT-PROVIDERS NOT FOUND!`);
        }

        /**
         * CALL PRODUCTS-PROVIDERS SERVICE THAT RETURN UPDATED PRODUCT-PROVIDER RECORD
         */
        await Promise.all(
          productProviders?.map(async (prodProv) => {
            prodProv =
              await this.productProvidersService.getProductProviderAfterAddProfit(
                prodProv,
              );
          }),
        );
      }),
    );
  }

  /** */
  async handlePromotionOnProductProvider(
    products: PaginationObjectInterface<ProductEntity>,
  ) {
    if (!products?.data || products?.data?.length === 0) {
      throw new NotFoundException(`PRODUCTS NOT FOUND!`);
    }

    // LOOP ON ALL PRODUCTS
    // EXTRACT PRODUCT-PROVIDERS ARRAY
    // LOOP ON EACH PROD-PROV
    // GET PROMOTION WHERE ( PROD-PROV ID && EXPIRY DATE < new Date() )
    // IF EXIST => APPLY ITS PERCENTAGE ON salePriceAfterProfitAndPromotion KEY

    await Promise.all(
      products.data.map(async (prod) => {
        const { productProviders } = prod;
        if (!productProviders || productProviders?.length === 0) {
          throw new NotFoundException(`PRODUCT-PROVIDERS NOT FOUND!`);
        }

        /**
         * CALL PRODUCTS-PROVIDERS SERVICE THAT RETURN UPDATED PRODUCT-PROVIDER RECORD
         */
        await Promise.all(
          productProviders?.map(async (prodProv) => {
            prodProv =
              await this.productProvidersService.updateSalePriceAfterProfitAndPromotion(
                prodProv,
              );
          }),
        );
      }),
    );
  }

  /**
   * GET MANY FOR PRODUCT PROVIDER
   */
  async getManyForProvider(options: Record<string, any>) {
    return await super.getMany(options);
  }

  /**
   * After delete product => Delete related product-providers
   */
  async afterDeleteEvent(dto: any): Promise<void> {
    return await this.deleteRelatedProductProviders(dto);
  }

  async deleteRelatedProductProviders(item) {
    console.log({ item });

    const { productProviders } = item;
    await Promise.all(
      productProviders.map(async (prodProv) => {
        await this.productProvidersService.deleteOne({
          where: { id: prodProv?.id },
        });
      }),
    );
  }
}

import { MomoService } from '@app/backend-core';
import { ProductsProvidersEntity } from '@app/backend-core/entities/products-providers.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, MoreThan, Not, Repository } from 'typeorm';
import { ProfitMarginEntity } from '@app/backend-core/entities/profit-margin.entity';
import {
  BadRequestException,
  forwardRef,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { ProductPromotionsEntity } from '@app/backend-core/entities/products-promotions.entity';
import { ProductsService } from './products.service';

export class ProductsProvidersService extends MomoService<ProductsProvidersEntity> {
  constructor(
    @InjectRepository(ProductsProvidersEntity)
    repo: Repository<ProductsProvidersEntity>,
    @InjectRepository(ProfitMarginEntity)
    public profitMarginRepo: Repository<ProfitMarginEntity>,
    @InjectRepository(ProductPromotionsEntity)
    public productPromotionsRepo: Repository<ProductPromotionsEntity>,
    /**
     * DELETE TARGET PRODUCT AFTER productProviders length is 0
     */
    @Inject(forwardRef(() => ProductsService))
    private productsService: ProductsService,
  ) {
    super(repo);
    this.relations = [
      'product',
      'provider',
      /**
       * For afterDeleteEvent & deleteTargetProduct functions
       * => Handling !product?.productProviders case
       */
      'product.productProviders',
      /**
       * BRAND && CATEGORY
       */
      'product.brand',
      'product.categories',
    ];
  }

  async updateProductProviders(id, dto): Promise<void> {
    // const oldProductsProviders = (
    //   await this.getMany({ where: { product: { id } } })
    // ).data;
    // for (const opu of oldProductsProviders) {
    //   await this.deleteOne({ where: { id: opu?.id } });
    // }

    // CREATE NEW ONES
    for (const opu of dto.productProviders) {
      await this.createOne(opu);
    }
  }

  /**
   * GET PRODUCT PROVIDER AFTER ADD PROFIT
   */
  async getProductProviderAfterAddProfit(
    prodProv: ProductsProvidersEntity,
  ): Promise<ProductsProvidersEntity> {
    // GET CURRENT PROFIT
    const profit = await this.profitMarginRepo.findOne({
      where: { endDate: IsNull() },
    });

    if (!profit) {
      throw new NotFoundException(`PROFIT NOT FOUND!`);
    }

    const { current } = profit;

    // CALCULATE salePriceAfterProfit
    prodProv.salePriceAfterProfit =
      +prodProv.salePrice + +prodProv.salePrice * (+current / 100);

    // RETURN UPDATED PRODUCT-PROVIDER

    return prodProv;
  }

  /**
   * GET PROMOTION AND APPLY CHANGES
   */
  async updateSalePriceAfterProfitAndPromotion(
    prodProv: ProductsProvidersEntity,
  ): Promise<ProductsProvidersEntity> {
    // GET CURRENT PROMOTION IF EXIST
    const promo = await this.productPromotionsRepo.findOne({
      where: {
        productProvider: { id: prodProv?.id },
        expiryDate: MoreThan(new Date()),
      },
    });

    if (!promo) {
      console.log(
        `THERE IS NO VALID PROMOTIONS ON PRODUCT-PROVIDER WITH ID : `,
        prodProv?.id,
      );
      return prodProv;
    }

    const { promotionPercentage } = promo;

    prodProv.salePriceAfterProfitAndPromotion =
      +prodProv.salePriceAfterProfit -
      +prodProv.salePriceAfterProfit * (+promotionPercentage / 100);

    // toFixed(2)
    prodProv.salePriceAfterProfitAndPromotion =
      +prodProv.salePriceAfterProfitAndPromotion.toFixed(2);

    return prodProv;
  }

  /**
   * FIND ALTERNATIVES
   */
  async getAlternatives(productId: number, originalProviderId: number) {
    // GET ALL ALTERNATIVES WITHOUT ORIGINAL PROVIDER

    const { data } = await this.getMany({
      where: {
        product: { id: productId },
        provider: { id: Not(originalProviderId) }, // Exclude the original provider
      },
    });

    // HEALTH CHECK
    if (!data) {
      throw new BadRequestException(
        `THERE IS NO ALTERNATIVES OF THIS PROVIDER ${originalProviderId} FOR THIS PRODUCT ${productId}`,
      );
    }

    // 1 ) GET WITH DYNAMIC PROFIT
    await Promise.all(
      data.map(async (prodProv) => {
        // 2 ) GET PRODUCT-PROVIDER AFTER ADD PROFIT
        await this.getProductProviderAfterAddProfit(prodProv);

        // 3 ) GET PRODUCT-PROVIDER AFTER PROMOTION IF EXIST
        await this.updateSalePriceAfterProfitAndPromotion(prodProv);
      }),
    );

    // RETURN ALTERNATIVES
    return data;
  }

  /**
   * Delete Product if productProvidersArray.length === 0
   */
  async afterDeleteEvent(dto: any): Promise<void> {
    const { product } = dto;
    if (!product?.productProviders || product?.productProviders.length === 0) {
      await this.deleteTargetProduct(product?.id);
    }
  }

  async deleteTargetProduct(prodId) {
    await this.productsService.deleteOne({ where: { id: prodId } });
  }
}

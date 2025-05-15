import { Injectable } from '@nestjs/common';
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

@Injectable()
export class ProductsService extends MomoService<ProductEntity> {
  constructor(
    @InjectRepository(ProductEntity) repo: Repository<ProductEntity>,
    private productProvidersService: ProductsProvidersService,
  ) {
    super(repo);
    this.relations = [
      'productProviders',
      'productProviders.provider',
      'categories',
    ];
  }

  async afterCreateEvent(product: ProductEntity): Promise<void> {
    const existProduct = await this.getOne({ where: { id: product?.id } });
    if (
      existProduct &&
      existProduct?.productProviders[0]?.provider?.roles.includes(
        UserTypeEnum.ADMIN,
      )
    ) {
      await this.updateOne(existProduct?.id, { status: STATUS.ACCEPTED });
    }
  }

  async updateOne(id, dto: UpdateProductDto): Promise<ProductEntity> {
    if (dto?.productProviders) {
      this.productProvidersService.updateProductProviders(id, dto);
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
    if (options?.brand) {
      options.where = { ...options.where, brand: options?.brand.toLowerCase() };
    }
    return await super.getMany(options);
  }

  async createOne(dto: DeepPartial<ProductEntity>): Promise<ProductEntity> {
    if (dto?.brand) {
      dto.brand = dto.brand.toLowerCase();
    }
    return super.createOne(dto);
  }
}

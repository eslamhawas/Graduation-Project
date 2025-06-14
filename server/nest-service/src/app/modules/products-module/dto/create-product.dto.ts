import { ProductsProvidersEntity } from '@app/backend-core/entities/products-providers.entity';
import { UserEntity } from '@app/backend-core/entities/user.entity';
import { STATUS } from '@app/backend-core/enums/status.enum';
import { BrandEntity } from '@modules/brand-module/entities/brand.entity';
import { CategoryEntity } from '@modules/category-module/entities/category.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, required: false })
  name: string;

  @IsNotEmpty()
  @IsNumber()
  countInStock: number;

  @IsOptional()
  @IsNotEmpty()
  productProviders: ProductsProvidersEntity[];

  @IsNotEmpty()
  @IsArray()
  categories: CategoryEntity[];

  // @IsNotEmpty()
  // @IsNumber()
  // price: number;

  @IsOptional()
  @IsEnum(STATUS)
  status?: STATUS;

  @IsOptional()
  @IsString()
  imageUrl: string;

  @IsOptional()
  @Type(() => BrandEntity)
  // @ValidateNested()
  brand: BrandEntity;

  /**
   * ADD PRODUCT BIO
   */
  @IsOptional()
  @IsString()
  bio: string;

  /**
   * User-Role 
   * if req.user.roles.includes('ADMIN') => Set Product Status to 'ACTIVE'
   */
}

import { ProductsProvidersEntity } from '@app/backend-core/entities/products-providers.entity';
import { UserEntity } from '@app/backend-core/entities/user.entity';
import { STATUS } from '@app/backend-core/enums/status.enum';
import { CategoryEntity } from '@modules/category-module/entities/category.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
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

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsEnum(STATUS)
  status?: STATUS;

  @IsOptional()
  @IsString()
  imageUrl: string;

  @IsOptional()
  @IsString()
  brand: string;
}

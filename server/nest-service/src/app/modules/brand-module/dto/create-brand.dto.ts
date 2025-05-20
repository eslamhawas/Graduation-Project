import { DeepPartial } from 'typeorm';
import { BrandEntity } from '../entities/brand.entity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { PartialType } from '@nestjs/swagger';
export class CreateBrandDto extends PartialType(BrandEntity) {}

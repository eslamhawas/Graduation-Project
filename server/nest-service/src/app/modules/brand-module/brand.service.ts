import { Injectable } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { MomoService } from '@app/backend-core';
import { BrandEntity } from './entities/brand.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BrandService extends MomoService<BrandEntity> {
  constructor(@InjectRepository(BrandEntity) repo: Repository<BrandEntity>) {
    super(repo);
  }
}

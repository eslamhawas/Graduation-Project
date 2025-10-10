import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { MomoController } from '@app/backend-core/momo.controller';
import { BrandEntity } from './entities/brand.entity';
import { GetManyOptions } from '@app/interfaces/get-many-options.interface';
import { CreateBrandDto } from './dto/create-brand.dto';

@Controller('brand')
export class BrandController extends MomoController<BrandEntity> {
  constructor(private readonly brandService: BrandService) {
    super(brandService);
  }

  @Post()
  create(@Body() createBrandDto: CreateBrandDto) {
    return super.createOneBase(createBrandDto);
  }

  @Get()
  findAll(@Query() params: GetManyOptions) {
    return super.getManyBase(params);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.brandService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
  //   return this.brandService.update(+id, updateBrandDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.brandService.remove(+id);
  // }
}

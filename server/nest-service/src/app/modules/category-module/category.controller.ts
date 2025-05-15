import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { MomoController } from '@app/backend-core/momo.controller';
import { CategoryEntity } from './entities/category.entity';

@Controller('category')
export class CategoryController extends MomoController<CategoryEntity> {
  constructor(private readonly categoryService: CategoryService) {
    super(categoryService);
  }

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return super.createOneBase(createCategoryDto);
  }

  @Get()
  findAll() {
    return super.getManyBase();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return super.getOneBase(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return super.updateOneBase(id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return super.deleteOneBase(id);
  }
}

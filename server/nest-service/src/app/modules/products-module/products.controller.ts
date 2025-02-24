import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { MomoController } from '@app/backend-core/momo.controller';
import { ProductEntity } from './entities/product.entity';
import { PaginationObjectInterface } from '@app/interfaces/pagination-object.interface';
import { GetManyOptions } from '@app/interfaces/get-many-options.interface';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('products')
export class ProductsController extends MomoController<ProductEntity> {
  constructor(public productsService: ProductsService) {
    super(productsService);
  }

  @Post()
  @ApiOperation({ summary: 'create new product' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Operation success🔥',
  })
  create(@Body() createProductDto: CreateProductDto) {
    return super.createOneBase(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'get paginated products' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Operation success🔥',
  })
  public findAll(
    @Query()
    params: GetManyOptions = {},
  ): Promise<PaginationObjectInterface<ProductEntity>> {
    return super.getManyBase(params);
  }

  @Get(':id')
  @ApiOperation({ summary: 'get one product by id' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'update one product' })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return super.updateOneBase(id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'delete one product' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}

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
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { MomoController } from '@app/backend-core/momo.controller';
import { ProductEntity } from './entities/product.entity';
import { PaginationObjectInterface } from '@app/interfaces/pagination-object.interface';
import { GetManyOptions } from '@app/interfaces/get-many-options.interface';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../../../../libs/cloudinary-service/cloudinay.service';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';

@Controller('products')
export class ProductsController extends MomoController<ProductEntity> {
  constructor(
    public productsService: ProductsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {
    super(productsService);
  }

  @Post()
  @ApiOperation({ summary: 'create new product' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Operation success🔥',
  })
  async create(@Body() createProductDto: CreateProductDto) {
    return await super.createOneBase(createProductDto);
  }

  @Get()
  // @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'get paginated products' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Operation success🔥',
  })
  public findAll(
    @Query()
    params: GetManyOptions,
  ): Promise<PaginationObjectInterface<ProductEntity>> {
    return super.getManyBase(params);
  }

  @Get(':id')
  @ApiOperation({ summary: 'get one product by id' })
  findOne(@Param('id') id: string) {
    return super.getOneBase(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'update one product' })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    /**
     * WITH IMAGE FLOW
     */
    let result: UploadApiResponse | UploadApiErrorResponse | undefined;
    if (file) {
      try {
        result = await this.cloudinaryService.uploadImage(file.path);
      } catch (error) {
        console.error(`ERROR INSERT IMAGE INTO CLOUDINARY FOLDER : `, error);
      }
      return await super.updateOneBase(id, {
        imageUrl: result?.secure_url,
      });
    }
    /**
     * WITHOUT IMAGE FLOW
     */
    return super.updateOneBase(id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'delete one product' })
  remove(@Param('id') id: string) {
    return super.deleteOneBase(id);
  }
}

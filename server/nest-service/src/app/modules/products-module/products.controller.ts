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
  Request,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
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
import { ProductsProvidersService } from './products-providers.service';
import { DeepPartial } from 'typeorm';
import { ProductsProvidersEntity } from '@app/backend-core/entities/products-providers.entity';
import { UserTypeEnum } from '@app/backend-core/enums/user-type.enum';
import { AuthGuard } from '@nestjs/passport';
import { STATUS } from '@app/backend-core/enums/status.enum';

@Controller('products')
export class ProductsController extends MomoController<ProductEntity> {
  constructor(
    public productsService: ProductsService,
    private readonly cloudinaryService: CloudinaryService,
    /**
     * FOR UPDATING PRODUCT PROVIDER DETAILS
     */
    private productProvidersService: ProductsProvidersService,
  ) {
    super(productsService);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'create new product' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Operation success🔥',
  })
  async create(@Body() createProductDto: CreateProductDto, @Request() req) {
    /**
     *
     */
    if (!req?.user) {
      throw new UnauthorizedException(`USER OBJECT WAS NOT FOUND!`);
    }
    // Default to PENDING if status is not provided
    if (!createProductDto.status) {
      createProductDto.status = STATUS.PENDING; // Set to PENDING if not provided
    }
    if (req?.user?.roles.includes(UserTypeEnum.ADMIN)) {
      createProductDto.status = STATUS.ACCEPTED;
    }
    return await super.createOneBase(createProductDto);
  }

  @Get()
  // @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'get paginated products' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Operation success🔥',
  })
  public async findAll(
    @Query()
    params: GetManyOptions,
  ): Promise<PaginationObjectInterface<ProductEntity>> {
    // 1 ) GET ALL PRODUCTS
    const products: PaginationObjectInterface<ProductEntity> =
      await super.getManyBase(params);

    // 2 ) GET PRODUCTS AFTER ADD PROFIT
    await this.productsService.getProductsAfterProfit(products);

    // 3 ) GET PRODUCTS AFTER PROMOTION IF EXIST

    await this.productsService.handlePromotionOnProductProvider(products);

    return products;
  }

  @Get(':id')
  @ApiOperation({ summary: 'get one product by id' })
  async findOne(@Param('id') id: string) {
    const product = await super.getOneBase(id);

    /**
     * GET AFTER-PROFIT AND AFTER-PROFIT-AND-PROMO WHEN GET ONE PRODUCT
     */

    const { productProviders } = product;
    if (!productProviders || productProviders?.length === 0) {
      throw new NotFoundException(`PRODUCT-PROVIDERS NOT FOUND!`);
    }

    /**
     * PROFIT
     */
    await Promise.all(
      productProviders?.map(async (prodProv) => {
        prodProv =
          await this.productProvidersService.getProductProviderAfterAddProfit(
            prodProv,
          );
      }),
    );

    /**
     * PROMOTION
     */
    await Promise.all(
      productProviders?.map(async (prodProv) => {
        prodProv =
          await this.productProvidersService.updateSalePriceAfterProfitAndPromotion(
            prodProv,
          );
      }),
    );

    return product;
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'update one product' })
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
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

      /**
       * WILL BE UPDATED AFTER AUTHORIZATION
       * UN COMMENT THIS IF CONDITION
       */
      // if (req?.user?.roles?.includes(UserTypeEnum.ADMIN)) {
      //   throw new UnauthorizedException();
      // }
      return await super.updateOneBase(id, updateProductDto);
    } catch (error) {
      return error;
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'delete one product' })
  remove(@Param('id') id: string) {
    return super.deleteOneBase(id);
  }

  /**
   * UPDATE PRODUCT-PROVIDER ( countInStock , price )
   */
  @Patch(':id/product-providers/update')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Update product provider details' })
  async updateProductProviders(
    @Param('id') id: string,
    /**
     * REQ INSTANCE FOR EXTRACT USER OBJECT
     */
    @Request() req,
    @Body()
    dto: Omit<DeepPartial<ProductsProvidersEntity>, 'product' | 'provider'>,
  ) {
    if (!req?.user) {
      throw new UnauthorizedException(`USER OBJECT WAS NOT FOUND!`);
    }
    // GET PRODUCT-PROVIDER RECORD WHERE( PROVIDER-ID = req?.user?.userId && PRODUCT-ID = id)
    const options = {
      provider: { id: req?.user?.userId },
      product: { id },
    };
    const prodProv = await this.productProvidersService.getOne({
      where: options,
    });
    if (!prodProv?.id) {
      throw new BadRequestException(
        `THERE IS NO PRODUCT-PROVIDER RECORD FOR THIS PRODUCT AND PROVIDER`,
      );
    }
    return this.productProvidersService.updateOne(prodProv?.id, dto);
  }

  /**
   * GET ALL PROVIDER-PRODUCTS
   */
  @Get('/all-products/for-provider')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'get paginated products for specific provider' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Operation success🔥',
  })
  public async findAllForProvider(
    /**
     * REQ INSTANCE FOR EXTRACT USER OBJECT
     */
    @Request() req,
  ): Promise<PaginationObjectInterface<ProductEntity>> {
    if (!req?.user) {
      throw new UnauthorizedException(`USER OBJECT WAS NOT FOUND!`);
    }
    return await this.productsService.getManyForProvider({
      where: { productProviders: [{ provider: { id: req?.user?.userId } }] },
    });
  }

  @Get(`/all-products/for-admin`)
  async getAllProductsForAdmin(
    @Query()
    params: GetManyOptions,
  ): Promise<PaginationObjectInterface<ProductsProvidersEntity>> {
    const productProviders = await this.productProvidersService.getMany(params);
    if (productProviders?.data) {
      await Promise.all(
        productProviders?.data?.map(async (prodProv) => {
          prodProv =
            await this.productProvidersService.getProductProviderAfterAddProfit(
              prodProv,
            );
        }),
      );
      await Promise.all(
        productProviders?.data?.map(async (prodProv) => {
          prodProv =
            await this.productProvidersService.updateSalePriceAfterProfitAndPromotion(
              prodProv,
            );
        }),
      );
    }

    return productProviders;
  }

  /**
   * Delete product provider record
   */
  @Delete(':id/product-providers/delete')
  @ApiOperation({ summary: 'delete one product' })
  async deleteProdProv(
    @Param('id') id: string,
    /**
     * REQ INSTANCE FOR EXTRACT USER OBJECT
     */
    @Request() req,
  ) {
    // GET PRODUCT-PROVIDER RECORD WHERE( PROVIDER-ID = req?.user?.userId && PRODUCT-ID = id)
    const options = {
      provider: { id: req?.user?.userId },
      product: { id },
    };
    const prodProv = await this.productProvidersService.getOne({
      where: options,
    });
    if (!prodProv?.id) {
      throw new BadRequestException(
        `THERE IS NO PRODUCT-PROVIDER RECORD FOR THIS PRODUCT AND PROVIDER`,
      );
    }
    await this.productProvidersService.deleteOne({
      where: { id: prodProv?.id },
    });
  }
}

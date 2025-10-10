import { MomoService } from '@app/backend-core';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, MoreThan, Repository } from 'typeorm';
import { OrderItemsEntity } from './entities/order-item.entity';
import { ProductsProvidersService } from '../products-module/products-providers.service';
import { TransactionService } from '@modules/transaction-module/transaction.service';
import { OrdersModuleService } from './orders-module.service';
import { OrdersEntity } from './entities/orders-module.entity';
import {
  BadRequestException,
  forwardRef,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { STATUS } from '@app/backend-core/enums/status.enum';
import { EmailsService } from '@app/emails';
import { IEmail } from '@app/backend-core/interfaces/mail-interfaces.interface';
import { OrderStatus } from './enums/order-status.enum';
import { ProfitMarginEntity } from '@app/backend-core/entities/profit-margin.entity';
import { ProductPromotionsEntity } from '@app/backend-core/entities/products-promotions.entity';

export class OrderItemsService extends MomoService<OrderItemsEntity> {
  constructor(
    @InjectRepository(OrderItemsEntity) repo: Repository<OrderItemsEntity>,
    private readonly productsProvidersService: ProductsProvidersService,
    private readonly transactionService: TransactionService,
    @Inject(forwardRef(() => OrdersModuleService))
    private readonly orderService: OrdersModuleService,
    private readonly emailsService: EmailsService,
    /**
     * Profit repo for current profit percentage
     */
    @InjectRepository(ProfitMarginEntity)
    public profitMarginRepo: Repository<ProfitMarginEntity>,
    /**
     * Promotion repo for promo if exist
     */
    @InjectRepository(ProductPromotionsEntity)
    public productPromotionsRepo: Repository<ProductPromotionsEntity>,
  ) {
    super(repo);
    this.relations = ['provider', 'product', 'order'];
  }

  async createOrderItems(orderId, orderItems) {
    for (const item of orderItems) {
      /**
       * 1 ) Calc itemSalePrice for provider transaction
       */
      const itemSalePrice = await this.returnItemSalePrice(
        item?.product?.id,
        item?.provider?.id,
      );

      /**
       * 2 ) Calc itemSalePriceAfterProfitAndPromoIfExist for MEGA
       */
      const itemSalePriceAfterProfitAndPromoIfExist =
        await this.CalcItemSalePriceAfterProfitAndPromoIfExist(
          itemSalePrice,
          item,
        );

      await super.createOne({
        order: { id: orderId },
        itemSalePrice,
        itemSalePriceAfterProfitAndPromoIfExist,
        ...item,
      });
    }
  }

  async updateOne(id, dto): Promise<OrderItemsEntity> {
    // add logic of decrease contInStock
    const orderItem = await super.getOne({ where: { id } });
    const productWithSpecificProvider =
      await this.productsProvidersService.getOne({
        where: {
          provider: { id: orderItem?.provider?.id },
          product: { id: orderItem?.product?.id },
        },
      });

    const newStock =
      productWithSpecificProvider?.countInStock - orderItem?.quantity;

    // console.log(`ORDER ITEM NUM`, orderItem?.provider?.id);
    // console.log(`ORDER ITEM NUM`, orderItem?.product?.id);

    await this.productsProvidersService.updateOne(
      productWithSpecificProvider?.id,
      { countInStock: newStock },
    );

    // update transaction for this orderItem to be {isAccepted = true}
    const order: OrdersEntity = await this.orderService.getOne({
      where: { orderItems: [{ id }] },
    });
    const trnsactionOptions = {
      order: { id: order?.id },
      provider: { id: orderItem?.provider?.id },
      product: { id: orderItem?.product?.id },
    };
    const transaction = await this.transactionService.getOne({
      where: trnsactionOptions,
    });
    await this.transactionService.updateOne(transaction?.id, {
      status: STATUS.ACCEPTED,
    });

    // update isApproved key for orderItem
    return await super.updateOne(id, dto);
  }

  async afterUpdateEvent(dto: OrderItemsEntity): Promise<void> {
    // console.log(`LAST ORDER ITEM UPDATED IS `, dto);

    const order = await this.orderService.getOne({
      where: { id: dto?.order?.id },
    });

    // console.log(order);

    const { orderItems } = order;

    // console.log(orderItems);

    for (const item of orderItems) {
      if (item?.status === STATUS.PENDING) {
        return;
      }
    }

    // update order status

    await this.orderService.updateOne(order?.id, {
      status: OrderStatus.INPROGRESS,
    });

    // sending email to user
    const msg: IEmail = {
      to: order?.user?.email,
      subject: `MEGA: Your Order INPROGRESS and`,
      text: `Your order ${order?.id} had been INPROGRESS at ${order?.updatedDate}`,
    };

    await this.emailsService.sendRawEmail(msg);
  }

  /**
   * Get product-provider details
   * To Be able to set itemSalePrice && itemSalePriceAfterProfitAndPromoIfExist
   */
  async returnItemSalePrice(productId, providerId) {
    const productProvider = await this.getProductProviderRecord(
      productId,
      providerId,
    );

    if (!productProvider) {
      throw new BadRequestException(
        `There is No product-provider with this data`,
      );
    }

    return productProvider.salePrice;
  }

  /**
   * Get product provider record
   */
  async getProductProviderRecord(productId, providerId) {
    const getOneOptions = {
      where: { product: { id: productId }, provider: { id: providerId } },
    };
    return this.productsProvidersService.getOne(getOneOptions);
  }

  /**
   * Get current profit-Precentage
   */
  async getCurrentProfitPercentage() {
    const profit = await this.profitMarginRepo.findOne({
      where: { endDate: IsNull() },
    });

    if (!profit) {
      throw new NotFoundException(`PROFIT NOT FOUND!`);
    }

    const { current } = profit;

    return current;
  }

  /**
   * Get promo if Exist
   */
  async getPromoIfExist(prodProvId) {
    const promo = await this.productPromotionsRepo.findOne({
      where: {
        productProvider: { id: prodProvId },
        expiryDate: MoreThan(new Date()),
      },
    });

    return promo;
  }

  /**
   * Calc itemSalePriceAfterProfitAndPromoIfExist
   */
  async CalcItemSalePriceAfterProfitAndPromoIfExist(itemSalePrice, item) {
    let itemSalePriceAfterProfitAndPromoIfExist = 0;
    const profit = await this.getCurrentProfitPercentage();

    const itemSalePriceAfterProfit =
      +itemSalePrice + +itemSalePrice * (+profit / 100);

    const productProvider = await this.getProductProviderRecord(
      item?.product?.id,
      item?.provider?.id,
    );
    const promo = await this.getPromoIfExist(productProvider?.id);

    if (!promo?.id) {
      itemSalePriceAfterProfitAndPromoIfExist = itemSalePriceAfterProfit;
    } else {
      const { promotionPercentage } = promo;
      itemSalePriceAfterProfitAndPromoIfExist =
        +itemSalePriceAfterProfit -
        +itemSalePriceAfterProfit * +(promotionPercentage / 100);
    }

    return itemSalePriceAfterProfitAndPromoIfExist;
  }
}

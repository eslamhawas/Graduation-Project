import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { MomoService } from '@app/backend-core';
import { OrdersEntity } from './entities/orders-module.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailsService } from '@app/emails';
import { IEmail } from '@app/backend-core/interfaces/mail-interfaces.interface';
import { UpdateOrdersModuleDto } from './dto/update-orders-module.dto';
import { OrderStatus } from './enums/order-status.enum';
import { ProductsService } from '@modules/products-module/products.service';
import { ProductsProvidersService } from '@modules/products-module/products-providers.service';
import { CreateOrdersModuleDto } from './dto/create-orders-module.dto';
import { OrderItemsService } from '@modules/orders-module/order-items.service';
import { PaginationObjectInterface } from '@app/interfaces/pagination-object.interface';
import { TransactionService } from '../transaction-module/transaction.service';
import { TransactionEntity } from '@modules/transaction-module/entities/transaction.entity';
import { calculateFullAmout } from '@libs/utils/calculate-order-full-amount.util';
import { calculateSubAmout } from '@libs/utils/calculate-order-sub-amount.util';

@Injectable()
export class OrdersModuleService extends MomoService<OrdersEntity> {
  constructor(
    @InjectRepository(OrdersEntity) repo: Repository<OrdersEntity>,
    @Inject(forwardRef(() => OrderItemsService))
    private orderItemsService: OrderItemsService,
    private readonly emailsService: EmailsService,
    private readonly productService: ProductsService,
    private productProvidersService: ProductsProvidersService,
    private readonly transactionService: TransactionService,
  ) {
    super(repo);
    this.relations = [
      'orderItems',
      'orderItems.product',
      'orderItems.provider',
      'user',
      'transactions',
    ];
  }

  // async afterUpdateEvent(dto: any): Promise<void> {
  //   if (dto?.cart?.user?.name) {
  //     const {
  //       cart: { user },
  //     } = dto;
  //     const mailBody: IEmail = {
  //       to: user?.email,
  //       subject: `Updated Order !`,
  //       text: `OrderId ${dto?.id} of user ${user?.name} is Fulfilled at ${dto?.updatedDate}`,
  //     };
  //     await this.emailsService.sendRawEmail(mailBody);
  //   } else {
  // console.log(
  //       `there is no user object inside this reponse , cant send email`,
  //     );
  //   }
  // }

  async updateOne(id, dto: UpdateOrdersModuleDto): Promise<OrdersEntity> {
    if (dto?.status === OrderStatus.WAITING) {
      return await this.handleWaitingStatus(id, dto);
    }
    return await super.updateOne(id, dto);
  }

  async handleWaitingStatus(id, dto) {
    // Update status to WAITING
    await super.updateOne(id, dto);

    // Send mail to providers

    const order = await super.getOne({ where: { id } });
    const { orderItems } = order;

    for (const item of orderItems) {
      const msg: IEmail = {
        to: item?.provider?.email,
        subject: `MEGA : Fulfill order`,
        text: `Please fulfill this order ${order?.id}`,
      };
      await this.emailsService.sendRawEmail(msg);
    }

    return order;
  }

  async createOne(dto: CreateOrdersModuleDto): Promise<OrdersEntity | any> {
    /**
     * CHECK AVAILABILTY LOGIC
     */

    const { unAvailableItems, alternativesProviders } =
      await this.checkAvailability(dto?.orderItems);

    // WHERE ( unAvailableItems.length > 0 )
    if (unAvailableItems && unAvailableItems.length > 0) {
      return {
        status: 'fail',
        message: 'Some items are not available in the requested quantity.',
        unAvailableItems,
        alternativesProviders,
      };
    }

    /**
     * ORIGINAL CREATING FLOW
     */

    // 1) CALC SUB-AMOUNT
    const subAmount = await this.calclateSubAmountForOrder(dto?.orderItems);

    // 2) totalAmount => FOR FUTURE TAX
    const totalAmount = subAmount;

    // register new order without its orderItems
    const order: OrdersEntity = await super.createOne({
      ...dto,
      orderItems: [],
      subAmount,
      totalAmount,
    });

    // create order's orderItems
    await this.orderItemsService.createOrderItems(order?.id, dto?.orderItems);

    // create transcations
    const afterOrderItemsCreated: OrdersEntity = await super.getOne({
      where: { id: order?.id },
    });
    const { orderItems } = afterOrderItemsCreated;

    await Promise.all(
      orderItems.map(async (item) => {
        const { id, createdDate, updatedDate, deletedDate, ...safeFileds } =
          item;
        await this.transactionService.createOne({
          ...safeFileds,
          order: { id: order?.id },
        });
      }),
    );

    // retrieve full order data
    const fullOrder = await super.getOne({
      where: { id: order?.id },
    });
    console.log({ fullOrder });

    return fullOrder;
    // return super.createOne(dto);
  }

  async getMany(
    options: Record<string, any> = {},
  ): Promise<PaginationObjectInterface<OrdersEntity>> {
    if (options?.providerId) {
      options.where = {
        orderItems: [{ provider: { id: options?.providerId } }],
      };
    }
    return await super.getMany(options);
  }

  /**
   * CHECK AVAILABIITY
   * @param orderItems
   * @returns { unAvailableItems, alternativesProviders }
   */
  async checkAvailability(orderItems: CreateOrdersModuleDto['orderItems']) {
    // 1 ) DECLARE TWO ARRAYS FOR ( UNAVAILABILITY && ALTERNATIVES PROVIDERS )
    const unAvailableItems: any = [];
    const alternativesProviders: any = [];

    // 2 ) LOOP ON ORDER-ITEMS AND CHECL AVAILABILITY
    for (const item of orderItems) {
      // 3 ) EXTRACT PRODUCT && PROVIDER && REQUESTED-QUANTITY
      const productId = item?.product?.id;
      const providerId = item?.provider?.id;
      const requestedQuantity = item?.quantity;

      // 4 ) CHECK PRODUCT AVAILABILTY
      const { countInStock } = await this.productProvidersService.getOne({
        where: {
          product: { id: productId },
          provider: { id: providerId },
        },
      });

      // HEALTH CHECK
      if (!countInStock) {
        throw new BadRequestException(
          `THERE IS NO STOCK ITEMS FOR PROVIDER ${providerId} ON PRODUCT ${productId}`,
        );
      }

      if (countInStock < requestedQuantity) {
        // 5 ) IF REQUESTED-QTY > COUNT-IN-STOCK => PUSH IN UN-AVAILABLE-ITEMS
        unAvailableItems.push({
          productId,
          providerId,
          requestedQuantity,
          availableStock: countInStock,
        });

        // 6 ) GET ALTERNATIVE PROVIDER
        const alternative = await this.productProvidersService.getAlternatives(
          productId,
          providerId,
        );

        // 7 ) IF THERE IS ALTERNATIVE - PUSH ON ALTERNATIVE ARRAY
        if (alternative && alternative.length > 0) {
          alternativesProviders.push({
            productId,
            unavailableProvider: providerId,
            alternativesProviders: alternative,
          });
        }
      }
    }

    // 8 ) RETURN ANOTHER RESPONSE
    return { unAvailableItems, alternativesProviders };
  }

  async calclateSubAmountForOrder(
    orderItems: CreateOrdersModuleDto['orderItems'],
  ) {
    let subAmount = 0.0;

    for (const item of orderItems) {
      subAmount += +item?.itemSalePriceAfterProfitAndPromoIfExist;
    }

    return subAmount;
  }
}

/**
 * OLD FLOW WITH
 * 1 ) ORDER PROMOTION
 * 2 ) TAKE subAmount key from frontend
 */

// // calculate subAmount if order { isPromoted = true }
// let oldPrice: OrdersEntity['oldPrice'];
// let subAmount: OrdersEntity['subAmount'] = dto?.subAmount;
// if (dto?.isPromoted) {
//   oldPrice = subAmount;
//   subAmount = calculateSubAmout(dto?.subAmount, dto?.promoPercentage);
// }

// // calculate totalAmount from subAmount
// const totalAmount: OrdersEntity['totalAmount'] =
//   calculateFullAmout(subAmount);

import { forwardRef, Inject, Injectable } from '@nestjs/common';
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
  //     // console.log(
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

  async createOne(dto: CreateOrdersModuleDto): Promise<OrdersEntity> {
    if (dto?.orderItems) {
      // calculate subAmount if order { isPromoted = true }
      let oldPrice: OrdersEntity['oldPrice'];
      let subAmount: OrdersEntity['subAmount'] = dto?.subAmount;
      if (dto?.isPromoted) {
        oldPrice = subAmount;
        subAmount = calculateSubAmout(dto?.subAmount, dto?.promoPercentage);
      }

      // calculate totalAmount from subAmount
      const totalAmount: OrdersEntity['totalAmount'] =
        calculateFullAmout(subAmount);

      // register new order without its orderItems
      const order: OrdersEntity = await super.createOne({
        ...dto,
        orderItems: [],
        oldPrice,
        subAmount,
        totalAmount,
      });

      // create order's orderItems
      await this.orderItemsService.createOrderItems(order?.id, dto?.orderItems);

      // create transcation
      const afterOrderItemsCreated: OrdersEntity = await super.getOne({
        where: { id: order?.id },
      });
      const { orderItems } = afterOrderItemsCreated;

      for (const item of orderItems) {
        const { id, createdDate, updatedDate, deletedDate, ...safeFileds } =
          item;
        await this.transactionService.createOne({
          ...safeFileds,
          order: { id: order?.id },
        });
      }

      // retrieve full order data
      return await super.getOne({
        where: { id: order?.id },
      });
    }
    return super.createOne(dto);
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

  async afterCreateEvent(orderData: OrdersEntity): Promise<void> {
    //
  }
}

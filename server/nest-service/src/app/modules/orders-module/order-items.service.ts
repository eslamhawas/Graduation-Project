import { MomoService } from '@app/backend-core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItemsEntity } from './entities/order-item.entity';
import { ProductsProvidersService } from '../products-module/products-providers.service';
import { TransactionService } from '@modules/transaction-module/transaction.service';
import { OrdersModuleService } from './orders-module.service';
import { OrdersEntity } from './entities/orders-module.entity';
import { forwardRef, Inject } from '@nestjs/common';
import { STATUS } from '@app/backend-core/enums/status.enum';
import { EmailsService } from '@app/emails';
import { IEmail } from '@app/backend-core/interfaces/mail-interfaces.interface';
import { OrderStatus } from './enums/order-status.enum';

export class OrderItemsService extends MomoService<OrderItemsEntity> {
  constructor(
    @InjectRepository(OrderItemsEntity) repo: Repository<OrderItemsEntity>,
    private readonly productsProvidersService: ProductsProvidersService,
    private readonly transactionService: TransactionService,
    @Inject(forwardRef(() => OrdersModuleService))
    private readonly orderService: OrdersModuleService,
    private readonly emailsService: EmailsService,
  ) {
    super(repo);
    this.relations = ['provider', 'product', 'order'];
  }

  async createOrderItems(orderId, orderItems) {
    for (const item of orderItems) {
      await super.createOne({ order: { id: orderId }, ...item });
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
}

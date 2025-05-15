import { Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { MomoService } from '@app/backend-core';
import { CartEntity } from './entities/cart.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CartService extends MomoService<CartEntity> {
  constructor(@InjectRepository(CartEntity) repo: Repository<CartEntity>) {
    super(repo);
    this.relations = ['user','cartItems','cartItems.product','cartItems.product.productProviders' , 'cartItems.provider'];
  }
  // create(createCartDto: CreateCartDto) {
  //   return 'This action adds a new cart';
  // }

  // findAll() {
  //   return `This action returns all cart`;
  // }

  findOne(id: number): Promise<CartEntity> {
    return super.getOne({ where: { id } });
  }

  // update(id: number, updateCartDto: UpdateCartDto) {
  //   return `This action updates a #${id} cart`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} cart`;
  // }
}

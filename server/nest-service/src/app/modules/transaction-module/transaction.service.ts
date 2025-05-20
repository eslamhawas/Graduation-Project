import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { MomoService } from '@app/backend-core';
import { TransactionEntity } from './entities/transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationObjectInterface } from '@app/interfaces/pagination-object.interface';
import { GetManyOptions } from '@app/interfaces/get-many-options.interface';

@Injectable()
export class TransactionService extends MomoService<TransactionEntity> {
  constructor(
    @InjectRepository(TransactionEntity) repo: Repository<TransactionEntity>,
  ) {
    super(repo);
  }

  async getMany(
    options?: Record<string, any>,
  ): Promise<PaginationObjectInterface<TransactionEntity>> {
    if (options?.status) {
      options.where = { status: options?.status };
    }
    return await super.getMany(options);
  }
}

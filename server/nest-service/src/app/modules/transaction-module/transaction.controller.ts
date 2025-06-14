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
import { TransactionService } from './transaction.service';
import { MomoController } from '@app/backend-core/momo.controller';
import { TransactionEntity } from './entities/transaction.entity';
import { GetManyOptions } from '@app/interfaces/get-many-options.interface';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('transactions')
export class TransactionController extends MomoController<TransactionEntity> {
  constructor(public readonly service: TransactionService) {
    super(service);
  }

  // @Post()
  // create(@Body() createTransactionDto: CreateTransactionDto) {
  //   return this.transactionService.create(createTransactionDto);
  // }

  @Get()
  @ApiOperation({ summary: 'get paginated transactions' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Operation success🔥',
  })
  async findAll(@Query() params: GetManyOptions = {}) {
    return await super.getManyBase(params);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await super.getOneBase(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto) {
  //   return this.transactionService.update(+id, updateTransactionDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.transactionService.remove(+id);
  // }
}

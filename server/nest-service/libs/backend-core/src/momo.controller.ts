import { PaginationObjectInterface } from '@app/interfaces/pagination-object.interface';
import { CoreEntity } from './entities/core.entity';
import { MomoService } from './momo.service';
import { DeepPartial } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { GetManyOptions } from '@app/interfaces/get-many-options.interface';

export class MomoController<T extends CoreEntity> {
  constructor(public service: MomoService<T>) {}

  public getManyBase(
    options: GetManyOptions = {},
  ): Promise<PaginationObjectInterface<T>> {
    return this.service.getMany(options);
  }

    getOneBase(id: string): Promise<T> {
      return this.service.getOne({ where: { id } });
    }

  createOneBase(dto: DeepPartial<T>, ...args): Promise<T> {
    return this.service.createOne(dto);
  }

  updateOneBase(
    id: string,
    dto: QueryDeepPartialEntity<T>,
    ...args
  ): Promise<T> {
    return this.service.updateOne(id, dto);
  }

  deleteOneBase(id: string): Promise<void | T> {
    return this.service.deleteOne({ where: { id: +id } });
  }

  // exportAsXLS(options = {}) {
  //   return this.service.exportAsXLS(options);
  // }
}

import { DeepPartial, ILike, Repository } from 'typeorm';
import { CoreEntity } from './entities/core.entity';
import { PaginationObjectInterface } from '@app/interfaces/pagination-object.interface';
import {
  BadRequestException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { Sort } from '@app/interfaces/get-many-options.interface';

export class MomoService<T extends CoreEntity> {
  relations: string[] = [];
  uniques: string[] = [];
  selection: Record<string, any> = {};
  searchableFields: string[] = [];
  exportedFields: string[] = [];

  constructor(public readonly repo: Repository<T>) {}

  async getMany(
    options: Record<string, any> = {},
  ): Promise<PaginationObjectInterface<T>> {
    const take = options?.['take'] || 10;
    const page = options?.['page'] || 1;
    const order = options?.['order'] || 'createdDate';
    const sort = options?.['sort'] || Sort.DESC ;
    const skip = (page - 1) * take;
    options['relations'] = this.relations;
    options['take'] = take;
    options['skip'] = skip;
    options['order'] = { [order]: sort };
    if (options['search']) {
      const oldWhere = options['where'] || {};
      options['where'] = this.searchableFields.map((field) => {
        return {
          ...oldWhere,
          [`${field}`]: ILike(`%${options['search']}%`),
        };
      });
    }
    delete options['search'];
    const data = await this.repo.findAndCount(options);
    return this.paginateResponse(data, page, take);
  }

  //   async getAll(options: Record<string, any> = {}): Promise<T[]> {
  //     const order = options?.['order'] || 'createdDate';
  //     const sort = options?.['sort'] || 'DESC';
  //     options['relations'] = this.relations;
  //     options['order'] = { [order]: sort };
  //     if (options['search']) {
  //       const oldWhere = options['where'] || {};
  //       options['where'] = this.searchableFields.map((field) => {
  //         return {
  //           ...oldWhere,
  //           [`${field}`]: ILike(`%${options['search']}%`),
  //         };
  //       });
  //     }
  //     delete options['search'];
  //     return this.repo.find(options);
  //   }

  //   async exportAsXLS(options: Record<string, any> = {}) {
  //     const data = await this.getAll(options);
  //     const exportdData = this.exportedFields.length
  //       ? this.prepareExportedData(data)
  //       : data;
  //     const workbook = utils.book_new();
  //     const worksheet = utils.json_to_sheet(exportdData);
  //     utils.book_append_sheet(workbook, worksheet);
  //     return write(workbook, { type: 'buffer', bookType: 'xlsx' });
  //   }

  //   prepareExportedData(data: T[]) {
  //     return data.map((record) => {
  //       return this.exportedFields.reduce((final, key) => {
  //         final[key] = record[key];
  //         return final;
  //       }, {});
  //     });
  //   }

  private paginateResponse(data, page, limit): PaginationObjectInterface<T> {
    const [result, total] = data;
    const lastPage = Math.ceil(total / limit);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const prevPage = page - 1 < 1 ? null : page - 1;
    return {
      data: [...result],
      statusCode: HttpStatus.OK,
      count: total,
      currentPage: page,
      lastPage: lastPage,
      nextPage: nextPage,
      prevPage: prevPage,
    };
  }

  async getOne(options = {}): Promise<T> {
    options['relations'] = this.relations;
    let item = await this.repo.findOne({ ...options, withDeleted: false });
    if (!item?.id) {
      throw new NotFoundException();
    }
    item = await this.refactorItemBeforeFetch(item);
    return item;
  }

  private async refactorItemBeforeFetch(item: T): Promise<T> {
    return item;
  }

  //   getOneOrFail(options = {}): Promise<T> {
  //     options['relations'] = this.relations;
  //     return this.repo.findOneOrFail(options);
  //   }

  protected preCreate?(dto?: DeepPartial<T>): Promise<void | Error>;

  async createOne(dto: DeepPartial<T>): Promise<T> {
    this.uniques.length && (await this.checkUniques(dto));
    dto = await this.refactorItemBeforeCreate(dto);
    this.preCreate && (await this.preCreate?.(dto));
    const createdItem = (await this.repo.save(dto)) as T;
    await this.afterCreateEvent(createdItem);
    return createdItem;
  }

  private async refactorItemBeforeCreate(item): Promise<DeepPartial<T>> {
    return item;
  }

  async afterCreateEvent(item): Promise<void> {
    // console.log(JSON.stringify(item));
  }

  private async checkUniques(dto: DeepPartial<T>, id?: number) {
    const _EXISTS = {};
    await Promise.all(
      this.uniques.map(async (unique: any) => {
        const foundItem = await this.repo.findOne({
          where: {
            [unique]: dto[unique],
          },
        });
        if (
          (foundItem?.id && !id) ||
          (id && Number(foundItem?.id) !== Number(id))
        ) {
          _EXISTS[unique] = `should be unique`;
        } else {
          return;
        }
      }),
    );
    if (Object.keys(_EXISTS).length) {
      throw new BadRequestException({ errors: _EXISTS }, 'validation_error');
    } else {
      return;
    }
  }

  async updateOne(id, dto: QueryDeepPartialEntity<T>): Promise<T> {
    this.uniques.length && (await this.checkUniques(dto as any, id));
    const refactoredDto = await this.refactorDtoBeforeUpdate(dto as any);
    await this.repo.update(id, refactoredDto as any);
    return this.getOne({ where: { id } });
  }

  private async refactorDtoBeforeUpdate(dto: T): Promise<T> {
    return dto;
  }

  //   async afterDeleteEvent(dto: T): Promise<void> {
  //     console.log('AFTER_DELETE', dto);
  //   }

  //   async deleteOne(options: FindOneOptions<CoreEntity>): Promise<any> {
  //     const item = await this.repo.findOne({ ...options, withDeleted: false });
  //     if (item) {
  //       await this.repo.softDelete(item.id);
  //       await this.afterDeleteEvent(item);
  //       return {
  //         message: 'Deleted',
  //         statusCode: HttpStatus.OK,
  //       };
  //     } else {
  //       throw new NotFoundException();
  //     }
  //   }
}

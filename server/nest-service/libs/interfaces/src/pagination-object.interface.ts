// import { ApiProperty } from '@nestjs/swagger';

export class PaginationObjectInterface<T> {
  // @ApiProperty({ type: Number })
  statusCode: number;
  // @ApiProperty({ isArray: true })
  data: T[];
  // @ApiProperty({ type: Number })
  count: number;
  // @ApiProperty({ type: Number })
  currentPage: number;
  // @ApiProperty({ type: Number })
  nextPage: number;
  // @ApiProperty({ type: Number })
  prevPage: number;
  // @ApiProperty({ type: Number })
  lastPage: number;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';
// import { ApiProperty } from '@nestjs/swagger';

export enum Sort {
  DESC = 'DESC',
  ASC = 'ASC',
}

export class GetManyOptions {
  @IsOptional()
  @ApiProperty({ type: Number, required: false })
  @IsNumberString()
  take?: number;

  @IsOptional()
  @ApiProperty({ type: Number, required: false })
  @IsNumberString()
  page?: number;

  // @IsOptional()
  // @IsNumberString()
  // projectId?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, default: 'createdDate', required: false })
  order?: string;

  @IsOptional()
  @IsEnum(Sort)
  @ApiProperty({ enum: Sort, default: Sort.DESC, required: false })
  sort?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, required: false })
  search?: string;
}

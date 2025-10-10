import { STATUS } from '@app/backend-core/enums/status.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
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

  @IsOptional()
  @IsNumberString()
  providerId?: number;

  @IsOptional()
  @IsEnum(STATUS)
  status?: STATUS;

  @IsOptional()
  @IsNumberString()
  categoryId?: string;

  @IsOptional()
  @IsNumberString()
  brandId?: string;

  /**
   * vendorId for felteration in tansaction resource
   */
  @IsOptional()
  @IsNumberString()
  vendorId?: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, required: false })
  name: string;
}

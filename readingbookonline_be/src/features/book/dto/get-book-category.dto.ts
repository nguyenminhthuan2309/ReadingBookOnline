import { PaginationRequestDto } from '@shared/dto/common/pagnination/pagination-request.dto';
import { PaginationResponseDto } from '@shared/dto/common/pagnination/pagination-response.dto';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class GetBookCategoryDto {
  @IsOptional()
  @Expose()
  @IsNumber()
  id?: number;

  @IsOptional()
  @Expose()
  @IsString()
  name?: string;

  @IsOptional()
  @Expose()
  @IsNumber()
  totalBooks?: number;
}

export class GetBookCategoryRequestDto extends PaginationRequestDto {}

export class GetBookCateogryResponseDto extends PaginationResponseDto<GetBookCategoryDto> {}

import { PaginationRequestDto } from '@shared/dto/common/pagnination/pagination-request.dto';
import { PaginationResponseDto } from '@shared/dto/common/pagnination/pagination-response.dto';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GetBookCategoryDto {
  @IsNotEmpty()
  @Expose()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsNumber()
  totalBooks: number;
}

export class GetBookCategoryRequestDto extends PaginationRequestDto {}

export class GetBookCateogryResponseDto extends PaginationResponseDto<GetBookCategoryDto> {}

import { GetBookDto } from './get-book.dto';
import {
  ArrayNotEmpty,
  IsArray,
  IsNumber,
  IsOptional,
  IsEnum,
  IsString,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { PaginationRequestDto } from '@shared/dto/common/pagnination/pagination-request.dto';
import { PaginationResponseDto } from '@shared/dto/common/pagnination/pagination-response.dto';

export enum SortByOptions {
  VIEWS = 'views',
  UPDATED_AT = 'updatedAt',
  LATEST_CHAPTER = 'latestChapter',
}

export enum SortTypeOptions {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class GetBookRequestDto extends PaginationRequestDto {
  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  userId?: number;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    type: Number,
    description: 'Lọc sách theo trạng thái',
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  statusId?: number;

  @ApiPropertyOptional({
    type: [Number],
    description: 'Lọc sách theo danh mục',
  })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @Transform(
    ({ value }) => (Array.isArray(value) ? value.map(Number) : [Number(value)]),
    { toClassOnly: true },
  )
  categoryId?: number[];

  @ApiPropertyOptional({
    type: String,
    enum: SortByOptions,
    enumName: 'SortByOptions',
    description: 'Sắp xếp theo trường nào',
  })
  @IsOptional()
  @IsEnum(SortByOptions)
  sortBy?: SortByOptions;

  @ApiPropertyOptional({
    type: String,
    enum: SortTypeOptions,
    enumName: 'SortTypeOptions',
    description: 'Kiểu sắp xếp',
  })
  @IsOptional()
  @IsEnum(SortTypeOptions)
  @Transform(
    ({ value }) =>
      value?.toUpperCase() === 'ASC' || value?.toUpperCase() === 'DESC'
        ? value.toUpperCase()
        : 'DESC',
    { toClassOnly: true },
  )
  sortType?: SortTypeOptions;
}

export class GetBookResponseDto extends PaginationResponseDto<GetBookDto> {}

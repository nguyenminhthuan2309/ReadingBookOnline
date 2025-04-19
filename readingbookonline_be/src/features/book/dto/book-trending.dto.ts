import { IsInt, Min, IsOptional, IsArray, IsNotEmpty } from 'class-validator';
import { Expose, Transform, Type } from 'class-transformer';
import { GetBookTypeDto } from './book-type.dto';
import { GetAccessStatusDto } from './get-book-access-status.dto';
import { GetProgressStatusDto } from './get-book-progess-status.dto';
import { AuthorDto } from './get-author.dto';
import { GetBookCategoryDto } from './get-book-category.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetTrendingBooksDto {
  @ApiPropertyOptional({
    example: 1,
    minimum: 1,
    description: 'Page number (default: 1)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    example: 10,
    minimum: 1,
    description: 'Items per page (default: 10)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}

export class BookTrendingResponseDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  cover: string;

  @Expose()
  ageRating: number;

  @Expose()
  views: number;

  @Expose()
  followsCount: number;

  @Expose()
  @Type(() => GetBookTypeDto)
  bookType: GetBookTypeDto;

  @Expose()
  @Type(() => GetAccessStatusDto)
  accessStatus: GetAccessStatusDto;

  @Expose()
  @Type(() => GetProgressStatusDto)
  progressStatus: GetProgressStatusDto;

  @Expose()
  @Type(() => AuthorDto)
  author: AuthorDto;

  @IsNotEmpty()
  @Expose()
  @Transform(
    ({ obj }) =>
      obj.bookCategoryRelations?.map((relation: any) => ({
        id: relation.category?.id,
        name: relation.category?.name,
      })) || [],
  )
  @Type(() => GetBookCategoryDto)
  @IsArray()
  categories: GetBookCategoryDto[];
}

import { Expose, Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { GetBookChapterDto } from './get-book-chapter.dto';
import { GetBookCategoryDto } from './get-book-category.dto';
import { AuthorDto } from './get-author.dto';
import { BookReview } from './get-book-review.dto';
import { GetProgressStatusDto } from './get-book-progess-status.dto';
import { GetAccessStatusDto } from './get-book-access-status.dto';
import { GetBookTypeDto } from './book-type.dto';

export class GetBookDto {
  @IsNotEmpty()
  @IsNumber()
  @Expose()
  id: number;

  @IsNotEmpty()
  @IsString()
  @Expose()
  title: string;

  @IsOptional()
  @IsString()
  @Expose()
  description?: string;

  @IsOptional()
  @IsString()
  @Expose()
  cover?: string;

  @IsOptional()
  @IsNumber()
  @Expose()
  views?: number;

  @IsNotEmpty()
  @Expose()
  @Type(() => GetBookTypeDto)
  bookType: GetBookTypeDto;

  @IsNotEmpty()
  @Expose()
  @Type(() => GetAccessStatusDto)
  accessStatus: GetAccessStatusDto;

  @IsNotEmpty()
  @Expose()
  @Type(() => GetProgressStatusDto)
  progressStatus: GetProgressStatusDto;

  @IsNotEmpty()
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

  @IsOptional()
  @Expose()
  @Type(() => GetBookChapterDto)
  chapters?: GetBookChapterDto[];

  @IsOptional()
  @Expose()
  @Type(() => BookReview)
  reviews?: BookReview[];

  @IsNotEmpty()
  @Expose()
  createdAt: Date;
}

export class GetBookDetail extends GetBookDto {
  @IsNotEmpty()
  @IsNumber()
  @Expose()
  rating: number;
}

import { Expose, Type } from 'class-transformer';
import { GetProgressStatusDto } from './get-book-progess-status.dto';
import { GetAccessStatusDto } from './get-book-access-status.dto';
import { GetBookCategoryDto } from './get-book-category.dto';
import { AuthorDto } from './get-author.dto';

export class GetBookDto {
  @Expose() id: number;
  @Expose() title: string;
  @Expose() description: string;
  @Expose() cover: string;
  @Expose() ageRating: number;
  @Expose() views: number;
  @Expose() createdAt: Date;
  @Expose() updatedAt: Date;

  @Expose()
  @Type(() => AuthorDto)
  author: AuthorDto;

  @Expose()
  @Type(() => GetAccessStatusDto)
  accessStatus: GetAccessStatusDto;

  @Expose()
  @Type(() => GetProgressStatusDto)
  progressStatus: GetProgressStatusDto;

  @Expose()
  @Type(() => GetBookCategoryDto)
  bookCategoryRelations: GetBookCategoryDto[];
}

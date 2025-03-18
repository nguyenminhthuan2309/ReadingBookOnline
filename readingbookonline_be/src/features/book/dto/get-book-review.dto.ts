import { Expose, Type } from 'class-transformer';
import { AuthorDto } from './get-author.dto';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class BookReview {
  @IsNotEmpty()
  @Expose()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @Expose()
  @Type(() => AuthorDto)
  user: AuthorDto;

  @IsNotEmpty()
  @Expose()
  @IsNumber()
  rating: number;

  @Expose()
  @IsOptional()
  @IsString()
  comment?: string;

  @IsNotEmpty()
  @Expose()
  createdAt: Date;
}

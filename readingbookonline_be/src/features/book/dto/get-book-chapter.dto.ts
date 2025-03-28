import { Expose, Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { GetBookDto } from './get-book.dto';

export class GetBookChapterDto {
  @IsNotEmpty()
  @Expose()
  @IsNumber()
  id: number;

  @Expose()
  @Type(() => GetBookDto)
  book: GetBookDto;

  @IsNotEmpty()
  @Expose()
  @IsString()
  title: string;

  @IsNotEmpty()
  @Expose()
  @IsNumber()
  chapter: string;

  @IsNotEmpty()
  @Expose()
  @IsString()
  content: string;

  @Expose()
  @IsOptional()
  @IsString()
  cover?: string;

  @IsNotEmpty()
  @Expose()
  @IsBoolean()
  isLocked: boolean;

  @IsNotEmpty()
  @Expose()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @Expose()
  createdAt: Date;
}

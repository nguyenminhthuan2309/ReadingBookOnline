import { Expose } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class GetBookChapterDto {
  @IsNotEmpty()
  @Expose()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @Expose()
  @IsString()
  title: string;

  @IsNotEmpty()
  @Expose()
  @IsNumber()
  chapter: string;

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

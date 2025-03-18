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
}

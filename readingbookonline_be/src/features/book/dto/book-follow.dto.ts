import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { GetBookDto } from './get-book.dto';

export class BookFollowDto {
  @ApiProperty({ example: 1, description: 'ID của sách' })
  @IsNotEmpty()
  @IsNumber()
  bookId: number;
}

export class BookFollowResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ example: 'Cập nhật: chương này siêu hay!' })
  @Expose()
  comment: string;

  @ApiProperty({ type: GetBookDto })
  @Expose()
  @Type(() => GetBookDto)
  @IsNotEmpty()
  book: GetBookDto;

  @ApiProperty({ example: '2025-03-21T17:32:33.692Z' })
  @Expose()
  createdAt: Date;
}

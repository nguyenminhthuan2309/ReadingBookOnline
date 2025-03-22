import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { GetBookDto } from './get-book.dto';
import { Expose, Type } from 'class-transformer';
import { GetBookChapterDto } from './get-book-chapter.dto';

export class CreateBookReadingHistoryDto {
  @ApiProperty({ example: 1, description: 'ID của sách mà user đang đọc' })
  @IsNotEmpty()
  @IsNumber()
  bookId: number;

  @ApiProperty({ example: 3, description: 'ID của chapter mà user đang đọc' })
  @IsNotEmpty()
  @IsNumber()
  chapterId: number;
}

export class BookReadingHistoryResponseDto {
  @ApiProperty({ example: 1, description: 'ID của lịch sử đọc sách' })
  @Expose()
  id: number;

  @ApiProperty({ description: 'Thông tin sách', type: GetBookDto })
  @Expose()
  @Type(() => GetBookDto)
  book: GetBookDto;

  @ApiProperty({
    description: 'Thông tin chapter mà user đã đọc',
    type: GetBookChapterDto,
  })
  @Expose()
  @Type(() => GetBookChapterDto)
  chapter: GetBookChapterDto;

  @ApiProperty({
    example: '2025-03-21T17:32:33.692Z',
    description: 'Thời điểm lịch sử được tạo',
  })
  @Expose()
  createdAt: Date;
}

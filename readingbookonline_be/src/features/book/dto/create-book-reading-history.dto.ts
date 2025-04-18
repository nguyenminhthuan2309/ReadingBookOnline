import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { GetBookDto } from './get-book.dto';
import { Expose, Type } from 'class-transformer';
import { GetBookChapterDto } from './get-book-chapter.dto';
import { AuthorDto } from './get-author.dto';

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

export class BookMiniResponseDto {
  @ApiProperty({ example: 3, description: 'ID của chapter' })
  @Expose()
  id: number;

  @ApiProperty({ example: 'tiều đề chapter', description: 'Tiều đề chapter' })
  @Expose()
  title: string;
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
  @Type(() => BookMiniResponseDto)
  chapter: BookMiniResponseDto;

  @ApiProperty({
    example: '2025-03-21T17:32:33.692Z',
    description: 'Thời điểm lịch sử được tạo',
  })
  @Expose()
  createdAt: Date;
}

export class ChapterReadDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  lastReadAt: Date;

  @Expose()
  isLocked: boolean;
}

export class BookReadingSummaryDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  cover: string;

  @Expose()
  @Type(() => ChapterReadDto)
  chaptersRead: ChapterReadDto[];
}

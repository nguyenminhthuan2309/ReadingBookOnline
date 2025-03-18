import { Controller, Get, Param, Query } from '@nestjs/common';
import { BookService } from './book.service';
import { ApiOperation } from '@nestjs/swagger';
import {
  GetBookRequestDto,
  GetBookResponseDto,
} from './dto/get-book-request.dto';
import {
  GetBookCategoryRequestDto,
  GetBookCateogryResponseDto,
} from './dto/get-book-category.dto';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @ApiOperation({ summary: 'Lấy danh sách sách' })
  @Get()
  async getAllBooks(
    @Query() params: GetBookRequestDto,
  ): Promise<GetBookResponseDto> {
    return await this.bookService.getAllBooks(params);
  }

  @ApiOperation({ summary: 'Lấy danh mục' })
  @Get('category')
  async getBookCategory(
    @Query() params: GetBookCategoryRequestDto,
  ): Promise<GetBookCateogryResponseDto> {
    return await this.bookService.getBookCategory(params);
  }

  @ApiOperation({ summary: 'Lấy chi tiết sách' })
  @Get(':id')
  async getDetailBook(
    @Param('id') bookId: number,
  ): Promise<GetBookResponseDto> {
    return await this.bookService.getBookDetail(bookId);
  }
}

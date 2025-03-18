import { Controller, Get, Query } from '@nestjs/common';
import { BookService } from './book.service';
import { ApiTags } from '@nestjs/swagger';
import {
  GetBookRequestDto,
  GetBookResponseDto,
} from './dto/get-book-request.dto';

@ApiTags('book')
@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  async getAllBooks(
    @Query() params: GetBookRequestDto,
  ): Promise<GetBookResponseDto> {
    return await this.bookService.getAllBooks(params);
  }
}
